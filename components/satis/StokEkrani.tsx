"use client";

import { useRef, useState } from "react";
import {
  formatTl,
  kritikUrunler,
  ornekUrunler,
  stokAyarla,
  stokDegeri,
  stokGirisi,
  type Urun,
  urunBul,
  urunEkle,
  urunGuncelle,
  urunSil,
  veriDogrula,
} from "@/lib/satis";
import { veriSifirla } from "@/lib/satis-depo";
import { BarkodGiris } from "./BarkodGiris";
import { girdiCls, UrunFormu } from "./UrunFormu";
import type { EkranProps } from "./SatisEkrani";

type Mod = { tur: "liste" } | { tur: "yeni"; barkod?: string } | { tur: "duzenle"; urun: Urun };

export function StokEkrani({ veri, kaydet, bildir }: EkranProps) {
  const [mod, setMod] = useState<Mod>({ tur: "liste" });
  const [arama, setArama] = useState("");
  const [sadeceKritik, setSadeceKritik] = useState(false);
  const [girisAdet, setGirisAdet] = useState("1");
  /** Satır içi stok düzeltme: hangi ürün, girilen değer */
  const [duzelt, setDuzelt] = useState<{ id: string; deger: string } | null>(null);
  const dosyaRef = useRef<HTMLInputElement>(null);

  const mevcutBarkodlar = new Set(veri.urunler.map((u) => u.barkod));
  const kritik = kritikUrunler(veri);

  const q = arama.trim().toLocaleLowerCase("tr");
  const liste = veri.urunler
    .filter((u) => !sadeceKritik || u.stok <= u.kritikStok)
    .filter(
      (u) =>
        !q ||
        u.ad.toLocaleLowerCase("tr").includes(q) ||
        u.barkod.includes(q) ||
        (u.kategori ?? "").toLocaleLowerCase("tr").includes(q)
    )
    .sort((a, b) => a.ad.localeCompare(b.ad, "tr"));

  function duzeltmeKaydet() {
    if (!duzelt) return;
    const n = Number(duzelt.deger);
    if (!Number.isInteger(n) || n < 0) {
      bildir("Stok 0 veya pozitif tam sayı olmalı.", "hata");
      return;
    }
    const urun = veri.urunler.find((u) => u.id === duzelt.id);
    kaydet(stokAyarla(veri, duzelt.id, n));
    setDuzelt(null);
    if (urun) bildir(`"${urun.ad}" stoğu ${urun.stok} → ${n} olarak düzeltildi.`, "ok");
  }

  /** Stok girişi: barkod okutulunca mevcut ürüne adet ekler, yoksa yeni ürün formu açar. */
  function girisOkundu(barkod: string) {
    const adet = Math.max(1, parseInt(girisAdet, 10) || 1);
    const urun = urunBul(veri, barkod);
    if (!urun) {
      setMod({ tur: "yeni", barkod });
      bildir("Bu barkod kayıtlı değil; ürünü tanımlayın.", "hata");
      return;
    }
    kaydet(stokGirisi(veri, urun.id, adet));
    bildir(`"${urun.ad}" stoğuna +${adet} eklendi (yeni stok: ${urun.stok + adet}).`, "ok");
  }

  function disaAktar() {
    const blob = new Blob([JSON.stringify(veri, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `satis-yedek-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function iceAktar(dosya: File) {
    try {
      const yeni = veriDogrula(JSON.parse(await dosya.text()));
      if (!yeni) {
        bildir("Dosya tanınmadı. Bu sistemden dışa aktarılmış bir JSON yedeği seçin.", "hata");
        return;
      }
      if (
        veri.urunler.length > 0 &&
        !window.confirm("Mevcut ürün ve satış kayıtlarının üzerine yazılacak. Devam edilsin mi?")
      )
        return;
      kaydet(yeni);
      bildir(`${yeni.urunler.length} ürün ve ${yeni.satislar.length} satış yüklendi.`, "ok");
    } catch {
      bildir("Dosya okunamadı.", "hata");
    }
  }

  function ornekYukle() {
    let v = veri;
    let eklenen = 0;
    for (const o of ornekUrunler()) {
      const s = urunEkle(v, o);
      if (s.urun) {
        v = s.veri;
        eklenen++;
      }
    }
    kaydet(v);
    bildir(eklenen ? `${eklenen} örnek ürün eklendi.` : "Örnek ürünler zaten ekli.", eklenen ? "ok" : "hata");
  }

  return (
    <div className="space-y-5">
      {/* Özet kutuları */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Ozet etiket="Ürün çeşidi" deger={String(veri.urunler.length)} />
        <Ozet etiket="Toplam stok adedi" deger={String(veri.urunler.reduce((t, u) => t + u.stok, 0))} />
        <Ozet etiket="Stok değeri (alış)" deger={formatTl(stokDegeri(veri))} />
      </div>

      {kritik.length > 0 ? (
        <div
          role="status"
          className="rounded-xl border border-amber-500/40 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          <strong>{kritik.length} ürün</strong> kritik stok seviyesinde veya altında:{" "}
          {kritik
            .slice(0, 4)
            .map((u) => `${u.ad} (${u.stok})`)
            .join(", ")}
          {kritik.length > 4 ? "…" : ""}
        </div>
      ) : null}

      {/* Stok girişi */}
      <div className="card p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-ink">Hızlı stok girişi</h3>
        <p className="mt-1 text-xs text-muted">
          Gelen malı okutun; her okutmada aşağıdaki adet kadar stok eklenir. Kayıtlı olmayan barkod için ürün formu açılır.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_120px] sm:items-end">
          <BarkodGiris
            id="stok-giris-barkod"
            etiket="Barkod okut"
            otomatikOdak={false}
            onOkundu={girisOkundu}
          />
          <div>
            <label htmlFor="stok-giris-adet" className="mb-2 block text-xs font-medium tracking-wide text-muted uppercase">
              Adet / okutma
            </label>
            <input
              id="stok-giris-adet"
              type="number"
              min={1}
              step={1}
              value={girisAdet}
              onChange={(e) => setGirisAdet(e.target.value)}
              className={`${girdiCls} py-3`}
            />
          </div>
        </div>
      </div>

      {/* Form */}
      {mod.tur !== "liste" ? (
        <div className="card border-flame/40 p-5 sm:p-6">
          <h3 className="text-base font-semibold text-ink">
            {mod.tur === "yeni" ? "Yeni ürün" : `Düzenle: ${mod.urun.ad}`}
          </h3>
          <div className="mt-5">
            <UrunFormu
              key={mod.tur === "duzenle" ? mod.urun.id : `yeni-${mod.barkod ?? ""}`}
              idOneki="stok-urun"
              baslangic={mod.tur === "duzenle" ? mod.urun : { barkod: mod.barkod }}
              mevcutBarkodlar={mevcutBarkodlar}
              onIptal={() => setMod({ tur: "liste" })}
              onKaydet={(girdi) => {
                const sonuc =
                  mod.tur === "duzenle"
                    ? urunGuncelle(veri, mod.urun.id, girdi)
                    : urunEkle(veri, girdi);
                if (sonuc.hata) return sonuc.hata;
                kaydet(sonuc.veri);
                setMod({ tur: "liste" });
                bildir(mod.tur === "duzenle" ? "Ürün güncellendi." : `"${girdi.ad}" eklendi.`, "ok");
                return null;
              }}
            />
          </div>
        </div>
      ) : null}

      {/* Liste */}
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-3">
          <h3 className="text-sm font-semibold text-ink">
            Ürünler{" "}
            <span className="ml-1 text-xs font-normal text-muted">
              stok sayısına tıklayıp sayım sonucunu girebilirsiniz
            </span>
          </h3>
          <input
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            placeholder="Ara: ad, barkod, kategori"
            aria-label="Ürün ara"
            className="min-w-0 flex-1 rounded-lg border border-line px-3 py-1.5 text-sm outline-none focus:border-flame/70 sm:max-w-xs"
          />
          <label className="flex items-center gap-2 text-xs text-muted">
            <input
              type="checkbox"
              checked={sadeceKritik}
              onChange={(e) => setSadeceKritik(e.target.checked)}
              className="h-4 w-4 accent-flame"
            />
            Sadece kritik
          </label>
          <button
            type="button"
            onClick={() => setMod({ tur: "yeni" })}
            className="ml-auto rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-paper transition hover:bg-flame"
          >
            + Yeni ürün
          </button>
        </div>

        {liste.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-muted">
            {veri.urunler.length === 0 ? (
              <>
                Henüz ürün yok.{" "}
                <button
                  type="button"
                  onClick={ornekYukle}
                  className="font-semibold text-flame underline-offset-4 hover:underline"
                >
                  Örnek ürünleri yükle
                </button>{" "}
                ya da yukarıdan yeni ürün ekleyin.
              </>
            ) : (
              "Aramayla eşleşen ürün yok."
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-urun-tablosu>
              <thead>
                <tr className="text-left text-xs tracking-wide text-muted uppercase">
                  <th className="px-5 py-2.5 font-medium">Ürün</th>
                  <th className="px-3 py-2.5 font-medium">Barkod</th>
                  <th className="px-3 py-2.5 text-right font-medium">Fiyat</th>
                  <th className="px-3 py-2.5 text-right font-medium">Stok</th>
                  <th className="px-3 py-2.5"><span className="sr-only">İşlemler</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {liste.map((u) => {
                  const kritikMi = u.stok <= u.kritikStok;
                  return (
                    <tr key={u.id} data-urun={u.barkod}>
                      <td className="px-5 py-3">
                        <div className="font-medium text-ink">{u.ad}</div>
                        {u.kategori ? <div className="text-xs text-faint">{u.kategori}</div> : null}
                      </td>
                      <td className="px-3 py-3 font-mono text-xs text-muted">{u.barkod}</td>
                      <td className="px-3 py-3 text-right tabular-nums text-ink">{formatTl(u.fiyat)}</td>
                      <td className="px-3 py-3 text-right">
                        {duzelt?.id === u.id ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              duzeltmeKaydet();
                            }}
                            className="inline-flex items-center gap-1"
                          >
                            <input
                              type="number"
                              min={0}
                              step={1}
                              value={duzelt.deger}
                              onChange={(e) => setDuzelt({ id: u.id, deger: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === "Escape") setDuzelt(null);
                              }}
                              aria-label={`${u.ad} yeni stok adedi`}
                              data-stok-duzelt
                              autoFocus
                              className="w-20 rounded-md border border-flame/70 px-2 py-1 text-right text-sm tabular-nums outline-none focus:ring-2 focus:ring-flame/20"
                            />
                            <button
                              type="submit"
                              className="rounded-md bg-ink px-2 py-1 text-xs font-semibold text-paper transition hover:bg-flame"
                            >
                              Kaydet
                            </button>
                            <button
                              type="button"
                              onClick={() => setDuzelt(null)}
                              aria-label="Düzeltmeyi iptal et"
                              className="rounded-md border border-line px-2 py-1 text-xs text-muted transition hover:border-ink"
                            >
                              ✕
                            </button>
                          </form>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDuzelt({ id: u.id, deger: String(u.stok) })}
                            title="Stoğu düzelt (sayım sonucu gir)"
                            aria-label={`${u.ad} stoğunu düzelt, şu an ${u.stok}`}
                            className={`inline-block min-w-10 rounded-md px-2 py-0.5 text-center text-xs font-semibold tabular-nums transition hover:ring-2 hover:ring-flame/40 ${
                              u.stok === 0
                                ? "bg-rose-100 text-rose-700"
                                : kritikMi
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-ink/[0.06] text-ink"
                            }`}
                          >
                            <span data-stok>{u.stok}</span>
                          </button>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => kaydet(stokGirisi(veri, u.id, 1))}
                          aria-label={`${u.ad} stoğuna 1 ekle`}
                          className="rounded-md border border-line px-2 py-1 text-xs text-ink transition hover:border-ink"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          onClick={() => setDuzelt({ id: u.id, deger: String(u.stok) })}
                          className="ml-1 rounded-md border border-line px-2 py-1 text-xs text-ink transition hover:border-ink"
                        >
                          Stok düzelt
                        </button>
                        <button
                          type="button"
                          onClick={() => setMod({ tur: "duzenle", urun: u })}
                          className="ml-1 rounded-md border border-line px-2 py-1 text-xs text-ink transition hover:border-ink"
                        >
                          Düzenle
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`"${u.ad}" silinsin mi? Geçmiş satışlar etkilenmez.`)) {
                              kaydet(urunSil(veri, u.id));
                              bildir("Ürün silindi.", "ok");
                            }
                          }}
                          className="ml-1 rounded-md border border-line px-2 py-1 text-xs text-muted transition hover:border-flame hover:text-flame"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Yedekleme */}
      <div className="card p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-ink">Yedekleme</h3>
        <p className="mt-1 text-xs text-muted">
          Veriler yalnızca bu tarayıcıda saklanır. Düzenli olarak yedek alın; başka bir cihaza taşımak için yedeği içe aktarın.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={disaAktar}
            className="rounded-xl border border-line-strong px-4 py-2 text-sm font-semibold text-ink transition hover:border-ink"
          >
            Yedeği indir (JSON)
          </button>
          <button
            type="button"
            onClick={() => dosyaRef.current?.click()}
            className="rounded-xl border border-line-strong px-4 py-2 text-sm font-semibold text-ink transition hover:border-ink"
          >
            Yedek yükle
          </button>
          <input
            ref={dosyaRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            aria-label="Yedek dosyası seç"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void iceAktar(f);
              e.target.value = "";
            }}
          />
          {veri.urunler.length === 0 ? (
            <button
              type="button"
              onClick={ornekYukle}
              className="rounded-xl border border-line-strong px-4 py-2 text-sm font-semibold text-ink transition hover:border-ink"
            >
              Örnek ürünleri yükle
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Tüm ürünler ve satış kayıtları silinecek. Bu işlem geri alınamaz. Emin misiniz?")) {
                veriSifirla();
                setMod({ tur: "liste" });
                bildir("Tüm veriler silindi.", "ok");
              }
            }}
            className="ml-auto rounded-xl px-4 py-2 text-sm text-muted transition hover:text-flame"
          >
            Tümünü sıfırla
          </button>
        </div>
      </div>
    </div>
  );
}

function Ozet({ etiket, deger }: { etiket: string; deger: string }) {
  return (
    <div className="card px-5 py-4">
      <div className="text-xs font-medium tracking-wide text-muted uppercase">{etiket}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight text-ink tabular-nums">{deger}</div>
    </div>
  );
}
