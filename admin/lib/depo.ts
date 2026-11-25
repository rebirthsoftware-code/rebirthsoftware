import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * İçerik deposu.
 *
 * Panel, site içeriğini (content/*.json) ve proje görsellerini doğrudan
 * sitenin GitHub deposuna yazar; her kayıt bir commit olur, GitHub Pages
 * iş akışı siteyi yeniden yayınlar. Teklif talepleri aynı depoda "teklif"
 * etiketli issue olarak tutulur — böylece ayrı veritabanı gerekmez ve her
 * talep e-posta bildirimiyle de gelir.
 *
 * GITHUB_TOKEN tanımlı değilse (geliştirme, testler) aynı arayüz yerel
 * dosya sistemiyle çalışır: ../content klasörü ve admin/.yerel/teklifler.json.
 */

export type Dosya = { yol: string; icerik: string | Buffer };

export type TeklifDurumu = "yeni" | "yanitlandi";

export type Teklif = {
  numara: number;
  baslik: string;
  govde: string;
  durum: TeklifDurumu;
  tarih: string;
  kapanis?: string;
  url?: string;
  notlar?: { tarih: string; metin: string }[];
};

export type YayinDurumu = {
  durum: "bilinmiyor" | "calisiyor" | "basarili" | "basarisiz";
  baslik?: string;
  tarih?: string;
  url?: string;
};

export interface Depo {
  ad: "github" | "yerel";
  aciklama: string;
  oku(yol: string): Promise<string | null>;
  yaz(dosyalar: Dosya[], mesaj: string): Promise<void>;
  teklifler(): Promise<Teklif[]>;
  teklif(numara: number): Promise<Teklif | null>;
  teklifOlustur(baslik: string, govde: string): Promise<number>;
  teklifDurum(numara: number, durum: TeklifDurumu): Promise<void>;
  teklifNot(numara: number, metin: string): Promise<void>;
  yayinDurumu(): Promise<YayinDurumu>;
}

/* ---------------- GitHub ---------------- */

const TEKLIF_ETIKETI = "teklif";

class GithubDepo implements Depo {
  ad = "github" as const;
  aciklama: string;
  private etiketHazir = false;

  constructor(
    private token: string,
    private repo: string,
    private dal: string
  ) {
    this.aciklama = `GitHub · ${repo} · ${dal}`;
  }

  private async api<T>(yol: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(`https://api.github.com/repos/${this.repo}${yol}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
      cache: "no-store",
    });
    if (res.status === 404) throw new BulunamadiHatasi(yol);
    if (!res.ok) {
      const metin = await res.text().catch(() => "");
      throw new Error(`GitHub ${res.status} (${yol}): ${metin.slice(0, 300)}`);
    }
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  }

  async oku(yol: string) {
    try {
      const d = await this.api<{ content: string; encoding: string }>(
        `/contents/${yol}?ref=${encodeURIComponent(this.dal)}`
      );
      return Buffer.from(d.content, "base64").toString("utf8");
    } catch (e) {
      if (e instanceof BulunamadiHatasi) return null;
      throw e;
    }
  }

  /** Birden fazla dosyayı tek commit'te yazar (Git Data API). */
  async yaz(dosyalar: Dosya[], mesaj: string) {
    const ref = await this.api<{ object: { sha: string } }>(`/git/ref/heads/${this.dal}`);
    const ustSha = ref.object.sha;
    const ust = await this.api<{ tree: { sha: string } }>(`/git/commits/${ustSha}`);

    const agac = [];
    for (const d of dosyalar) {
      const blob = await this.api<{ sha: string }>(`/git/blobs`, {
        method: "POST",
        body: JSON.stringify({
          content: Buffer.isBuffer(d.icerik)
            ? d.icerik.toString("base64")
            : Buffer.from(d.icerik, "utf8").toString("base64"),
          encoding: "base64",
        }),
      });
      agac.push({ path: d.yol, mode: "100644", type: "blob", sha: blob.sha });
    }

    const yeniAgac = await this.api<{ sha: string }>(`/git/trees`, {
      method: "POST",
      body: JSON.stringify({ base_tree: ust.tree.sha, tree: agac }),
    });
    const commit = await this.api<{ sha: string }>(`/git/commits`, {
      method: "POST",
      body: JSON.stringify({ message: mesaj, tree: yeniAgac.sha, parents: [ustSha] }),
    });
    await this.api(`/git/refs/heads/${this.dal}`, {
      method: "PATCH",
      body: JSON.stringify({ sha: commit.sha }),
    });
  }

  private async etiketiHazirla() {
    if (this.etiketHazir) return;
    try {
      await this.api(`/labels/${TEKLIF_ETIKETI}`);
    } catch (e) {
      if (!(e instanceof BulunamadiHatasi)) throw e;
      await this.api(`/labels`, {
        method: "POST",
        body: JSON.stringify({
          name: TEKLIF_ETIKETI,
          color: "dd3311",
          description: "Siteden gelen teklif talebi",
        }),
      });
    }
    this.etiketHazir = true;
  }

  private donustur(i: GithubIssue): Teklif {
    return {
      numara: i.number,
      baslik: i.title,
      govde: i.body ?? "",
      durum: i.state === "open" ? "yeni" : "yanitlandi",
      tarih: i.created_at,
      kapanis: i.closed_at ?? undefined,
      url: i.html_url,
    };
  }

  async teklifler() {
    const liste = await this.api<GithubIssue[]>(
      `/issues?labels=${TEKLIF_ETIKETI}&state=all&per_page=100&sort=created&direction=desc`
    );
    return liste.filter((i) => !i.pull_request).map((i) => this.donustur(i));
  }

  async teklif(numara: number) {
    try {
      const i = await this.api<GithubIssue>(`/issues/${numara}`);
      if (!i.labels.some((l) => l.name === TEKLIF_ETIKETI)) return null;
      const yorumlar = await this.api<{ body: string; created_at: string }[]>(
        `/issues/${numara}/comments?per_page=100`
      );
      return {
        ...this.donustur(i),
        notlar: yorumlar.map((y) => ({ tarih: y.created_at, metin: y.body })),
      };
    } catch (e) {
      if (e instanceof BulunamadiHatasi) return null;
      throw e;
    }
  }

  async teklifOlustur(baslik: string, govde: string) {
    await this.etiketiHazirla();
    const i = await this.api<{ number: number }>(`/issues`, {
      method: "POST",
      body: JSON.stringify({ title: baslik, body: govde, labels: [TEKLIF_ETIKETI] }),
    });
    return i.number;
  }

  async teklifDurum(numara: number, durum: TeklifDurumu) {
    await this.api(`/issues/${numara}`, {
      method: "PATCH",
      body: JSON.stringify(
        durum === "yanitlandi" ? { state: "closed", state_reason: "completed" } : { state: "open" }
      ),
    });
  }

  async teklifNot(numara: number, metin: string) {
    await this.api(`/issues/${numara}/comments`, {
      method: "POST",
      body: JSON.stringify({ body: metin }),
    });
  }

  async yayinDurumu(): Promise<YayinDurumu> {
    try {
      const r = await this.api<{
        workflow_runs: {
          status: string;
          conclusion: string | null;
          display_title: string;
          updated_at: string;
          html_url: string;
        }[];
      }>(
        `/actions/workflows/github-pages.yml/runs?branch=${encodeURIComponent(this.dal)}&per_page=1`
      );
      const k = r.workflow_runs[0];
      if (!k) return { durum: "bilinmiyor" };
      return {
        durum:
          k.status !== "completed"
            ? "calisiyor"
            : k.conclusion === "success"
              ? "basarili"
              : "basarisiz",
        baslik: k.display_title,
        tarih: k.updated_at,
        url: k.html_url,
      };
    } catch {
      return { durum: "bilinmiyor" };
    }
  }
}

type GithubIssue = {
  number: number;
  title: string;
  body: string | null;
  state: "open" | "closed";
  created_at: string;
  closed_at: string | null;
  html_url: string;
  labels: { name: string }[];
  pull_request?: unknown;
};

class BulunamadiHatasi extends Error {
  constructor(yol: string) {
    super(`Bulunamadı: ${yol}`);
  }
}

/* ---------------- Yerel dosya sistemi ---------------- */

class YerelDepo implements Depo {
  ad = "yerel" as const;
  aciklama: string;
  private teklifDosyasi: string;

  constructor(private kok: string) {
    this.aciklama = `Yerel klasör · ${kok}`;
    this.teklifDosyasi = path.join(process.cwd(), ".yerel", "teklifler.json");
  }

  private tamYol(yol: string) {
    const tam = path.resolve(this.kok, yol);
    if (!tam.startsWith(path.resolve(this.kok))) throw new Error("Geçersiz yol");
    return tam;
  }

  async oku(yol: string) {
    try {
      return await readFile(this.tamYol(yol), "utf8");
    } catch {
      return null;
    }
  }

  async yaz(dosyalar: Dosya[]) {
    for (const d of dosyalar) {
      const tam = this.tamYol(d.yol);
      await mkdir(path.dirname(tam), { recursive: true });
      await writeFile(tam, d.icerik);
    }
  }

  private async teklifleriOku(): Promise<Teklif[]> {
    try {
      return JSON.parse(await readFile(this.teklifDosyasi, "utf8")) as Teklif[];
    } catch {
      return [];
    }
  }

  private async teklifleriYaz(liste: Teklif[]) {
    await mkdir(path.dirname(this.teklifDosyasi), { recursive: true });
    await writeFile(this.teklifDosyasi, JSON.stringify(liste, null, 2));
  }

  async teklifler() {
    return (await this.teklifleriOku()).sort((a, b) => b.numara - a.numara);
  }

  async teklif(numara: number) {
    return (await this.teklifleriOku()).find((t) => t.numara === numara) ?? null;
  }

  async teklifOlustur(baslik: string, govde: string) {
    const liste = await this.teklifleriOku();
    const numara = liste.reduce((m, t) => Math.max(m, t.numara), 0) + 1;
    liste.push({ numara, baslik, govde, durum: "yeni", tarih: new Date().toISOString(), notlar: [] });
    await this.teklifleriYaz(liste);
    return numara;
  }

  async teklifDurum(numara: number, durum: TeklifDurumu) {
    const liste = await this.teklifleriOku();
    const t = liste.find((x) => x.numara === numara);
    if (!t) return;
    t.durum = durum;
    t.kapanis = durum === "yanitlandi" ? new Date().toISOString() : undefined;
    await this.teklifleriYaz(liste);
  }

  async teklifNot(numara: number, metin: string) {
    const liste = await this.teklifleriOku();
    const t = liste.find((x) => x.numara === numara);
    if (!t) return;
    (t.notlar ??= []).push({ tarih: new Date().toISOString(), metin });
    await this.teklifleriYaz(liste);
  }

  async yayinDurumu(): Promise<YayinDurumu> {
    return { durum: "bilinmiyor" };
  }
}

/* ---------------- Seçim ---------------- */

let tekil: Depo | null = null;

export function depo(): Depo {
  if (tekil) return tekil;
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (token && repo) {
    tekil = new GithubDepo(token, repo, process.env.GITHUB_BRANCH || "main");
  } else {
    tekil = new YerelDepo(process.env.ICERIK_KOKU ?? path.join(process.cwd(), ".."));
  }
  return tekil;
}
