/**
 * Site içeriğinin tipleri, sabitleri ve saf yardımcıları.
 *
 * Bu dosya hem sunucu hem istemci bileşenlerinden içe aktarılır; bu yüzden
 * dosya sistemi ya da depo erişimi içermez (onlar lib/icerik.ts'te).
 * Tipler sitenin lib/projects.ts, lib/posts.ts, lib/services.ts ve
 * lib/site.ts dosyalarındaki tiplerle birebir aynıdır.
 */

export const PROJE_TURLERI = ["Kurumsal Web Sitesi", "Kişiye Özel Yazılım", "Web Tasarım"] as const;
export const YAZI_KATEGORILERI = ["Web Tasarım", "SEO", "Yazılım", "İşletme"] as const;
export const HIZMET_IKONLARI = [
  "building", "code", "palette", "shield", "chart", "server", "globe", "rocket",
  "layers", "wrench", "lock", "bolt", "search", "users", "sparkle", "clock",
] as const;
export const BARINDIRMALAR = ["Vercel", "GitHub Pages", "Diğer"] as const;

export type Proje = {
  slug: string;
  title: string;
  client: string;
  sector: string;
  year: string;
  type: (typeof PROJE_TURLERI)[number];
  summary: string;
  challenge: string;
  solution: string;
  result: string[];
  stack: string[];
  url?: string;
  image?: string;
  gradient?: [string, string];
  featured?: boolean;
};

export type YaziBlogu = { h?: string; p?: string; list?: string[] };

export type Yazi = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingMinutes: number;
  category: (typeof YAZI_KATEGORILERI)[number];
  body: YaziBlogu[];
};

export type Hizmet = {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: string;
  features: string[];
  deliverables: string[];
  faq: { q: string; a: string }[];
};

export type SiteBilgi = {
  phone: string;
  phoneHref: string;
  whatsapp: string;
  email: string;
  city: string;
  country: string;
  address: string;
  social: { linkedin: string; github: string; instagram: string };
  stats: { value: string; label: string }[];
};

export type MusteriSitesi = {
  id: string;
  ad: string;
  musteri: string;
  adres: string;
  barindirma: (typeof BARINDIRMALAR)[number];
  yenilemeTarihi: string;
  notlar: string;
  aktif: boolean;
};

/* ---------------- Yardımcılar ---------------- */

/** "Av. Tuğçe Ayağ Esin" → "av-tugce-ayag-esin" */
export function slugla(metin: string) {
  const harf: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", İ: "i", Ç: "c", Ğ: "g", Ö: "o", Ş: "s", Ü: "u", I: "i",
  };
  return metin
    .replace(/[çğıöşüİÇĞÖŞÜI]/g, (h) => harf[h] ?? h)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const SLUG_DESENI = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Satır satır girilen listeyi diziye çevirir; boş satırlar atılır. */
export const satirlar = (metin: string) =>
  metin.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);

export const metin = (fd: FormData, ad: string) => String(fd.get(ad) ?? "").trim();

export type Hatalar = Record<string, string>;

/** Yazı gövdesi: formdaki sade metni bloklara çevirir.
 *  "## Başlık" → alt başlık, "- madde" satırları → liste, diğer paragraflar → p. */
export function govdeyiAyristir(metin: string): YaziBlogu[] {
  const bloklar: YaziBlogu[] = [];
  const paragraflar = metin.replace(/\r/g, "").split(/\n{2,}/);
  let bekleyenBaslik: string | undefined;
  for (const parca of paragraflar) {
    const s = parca.trim();
    if (!s) continue;
    if (/^##\s+/.test(s) && !s.includes("\n")) {
      bekleyenBaslik = s.replace(/^##\s+/, "");
      continue;
    }
    const satirlarD = s.split("\n");
    if (satirlarD.every((l) => /^[-*•]\s+/.test(l))) {
      bloklar.push({ ...(bekleyenBaslik ? { h: bekleyenBaslik } : {}), list: satirlarD.map((l) => l.replace(/^[-*•]\s+/, "")) });
    } else {
      bloklar.push({ ...(bekleyenBaslik ? { h: bekleyenBaslik } : {}), p: satirlarD.join(" ") });
    }
    bekleyenBaslik = undefined;
  }
  if (bekleyenBaslik) bloklar.push({ h: bekleyenBaslik, p: "" });
  return bloklar;
}

/** Blokları formda düzenlenecek sade metne çevirir (govdeyiAyristir'in tersi). */
export function govdeyiMetneCevir(bloklar: YaziBlogu[]) {
  return bloklar
    .map((b) => {
      const parcalar: string[] = [];
      if (b.h) parcalar.push(`## ${b.h}`);
      if (b.list?.length) parcalar.push(b.list.map((m) => `- ${m}`).join("\n"));
      else if (b.p) parcalar.push(b.p);
      return parcalar.join("\n\n");
    })
    .join("\n\n");
}
