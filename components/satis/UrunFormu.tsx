"use client";

import { useState } from "react";
import { barkodGecerliMi, parseTl, temizleBarkod, type Urun, uretBarkod } from "@/lib/satis";

export type UrunGirdisi = Omit<Urun, "id" | "olusturma">;

export const girdiCls =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-faint transition outline-none focus:border-flame/70 focus:ring-2 focus:ring-flame/20";

export function Alan({
  label,
  error,
  children,
  htmlFor,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium tracking-wide text-muted uppercase">
        {label}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

const kurusToGirdi = (k?: number) =>
  k === undefined ? "" : (k / 100).toFixed(2).replace(".", ",");

/**
 * Ürün ekleme / düzenleme formu.
 * Hem stok ekranında hem de satış sırasında "bilinmeyen barkod" için kullanılır.
 */
export function UrunFormu({
  baslangic,
  mevcutBarkodlar,
  onKaydet,
  onIptal,
  kaydetMetni = "Kaydet",
  idOneki = "urun",
}: {
  baslangic?: Partial<UrunGirdisi>;
  mevcutBarkodlar: Set<string>;
  /** Hata metni dönerse form onu gösterir */
  onKaydet: (girdi: UrunGirdisi) => string | null | undefined;
  onIptal?: () => void;
  kaydetMetni?: string;
  idOneki?: string;
}) {
  const [barkod, setBarkod] = useState(baslangic?.barkod ?? "");
  const [ad, setAd] = useState(baslangic?.ad ?? "");
  const [fiyat, setFiyat] = useState(kurusToGirdi(baslangic?.fiyat));
  const [alis, setAlis] = useState(kurusToGirdi(baslangic?.alisFiyati));
  const [stok, setStok] = useState(String(baslangic?.stok ?? 0));
  const [kritik, setKritik] = useState(String(baslangic?.kritikStok ?? 3));
  const [kategori, setKategori] = useState(baslangic?.kategori ?? "");
  const [hatalar, setHatalar] = useState<Record<string, string>>({});
  const [genelHata, setGenelHata] = useState<string | null>(null);

  function gonder(e: React.FormEvent) {
    e.preventDefault();
    const h: Record<string, string> = {};
    const b = temizleBarkod(barkod);
    if (!b) h.barkod = "Barkod gerekli. Yoksa 'Üret' ile oluşturabilirsiniz.";
    else if (!barkodGecerliMi(b)) h.barkod = "Barkod geçersiz (kontrol hanesi tutmuyor).";
    if (ad.trim().length < 2) h.ad = "Ürün adı en az 2 karakter olmalı.";
    const f = parseTl(fiyat);
    if (f === null) h.fiyat = "Geçerli bir fiyat girin, örn. 12,50";
    const a = alis.trim() ? parseTl(alis) : undefined;
    if (alis.trim() && a === null) h.alis = "Geçerli bir tutar girin.";
    const s = Number(stok);
    if (!Number.isInteger(s) || s < 0) h.stok = "Stok 0 veya pozitif tam sayı olmalı.";
    const k = Number(kritik);
    if (!Number.isInteger(k) || k < 0) h.kritik = "Kritik seviye 0 veya pozitif tam sayı olmalı.";

    setHatalar(h);
    setGenelHata(null);
    if (Object.keys(h).length > 0) return;

    const sonuc = onKaydet({
      barkod: b,
      ad: ad.trim(),
      fiyat: f!,
      alisFiyati: a ?? undefined,
      stok: s,
      kritikStok: k,
      kategori: kategori.trim() || undefined,
    });
    if (sonuc) setGenelHata(sonuc);
  }

  return (
    <form onSubmit={gonder} noValidate className="grid gap-4 sm:grid-cols-2">
      <Alan label="Barkod *" error={hatalar.barkod} htmlFor={`${idOneki}-barkod`}>
        <div className="flex gap-2">
          <input
            id={`${idOneki}-barkod`}
            value={barkod}
            onChange={(e) => setBarkod(e.target.value)}
            inputMode="numeric"
            autoComplete="off"
            placeholder="8690000000000"
            className={`${girdiCls} font-mono`}
          />
          <button
            type="button"
            onClick={() => setBarkod(uretBarkod(mevcutBarkodlar))}
            className="shrink-0 rounded-xl border border-line-strong px-3 text-xs font-semibold text-ink transition hover:border-ink"
            title="Barkodu olmayan ürün için mağaza içi EAN-13 üret"
          >
            Üret
          </button>
        </div>
      </Alan>
      <Alan label="Ürün adı *" error={hatalar.ad} htmlFor={`${idOneki}-ad`}>
        <input
          id={`${idOneki}-ad`}
          value={ad}
          onChange={(e) => setAd(e.target.value)}
          autoComplete="off"
          placeholder="Örn. Türk Kahvesi 100 g"
          className={girdiCls}
        />
      </Alan>
      <Alan label="Satış fiyatı (₺) *" error={hatalar.fiyat} htmlFor={`${idOneki}-fiyat`}>
        <input
          id={`${idOneki}-fiyat`}
          value={fiyat}
          onChange={(e) => setFiyat(e.target.value)}
          inputMode="decimal"
          placeholder="12,50"
          className={girdiCls}
        />
      </Alan>
      <Alan label="Alış fiyatı (₺)" error={hatalar.alis} htmlFor={`${idOneki}-alis`}>
        <input
          id={`${idOneki}-alis`}
          value={alis}
          onChange={(e) => setAlis(e.target.value)}
          inputMode="decimal"
          placeholder="İsteğe bağlı"
          className={girdiCls}
        />
      </Alan>
      <Alan label="Stok adedi *" error={hatalar.stok} htmlFor={`${idOneki}-stok`}>
        <input
          id={`${idOneki}-stok`}
          type="number"
          min={0}
          step={1}
          value={stok}
          onChange={(e) => setStok(e.target.value)}
          className={girdiCls}
        />
      </Alan>
      <Alan label="Kritik stok seviyesi" error={hatalar.kritik} htmlFor={`${idOneki}-kritik`}>
        <input
          id={`${idOneki}-kritik`}
          type="number"
          min={0}
          step={1}
          value={kritik}
          onChange={(e) => setKritik(e.target.value)}
          className={girdiCls}
        />
      </Alan>
      <Alan label="Kategori" htmlFor={`${idOneki}-kategori`}>
        <input
          id={`${idOneki}-kategori`}
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          autoComplete="off"
          placeholder="Örn. Gıda"
          className={girdiCls}
        />
      </Alan>

      <div className="flex items-end gap-2 sm:justify-end">
        {onIptal ? (
          <button
            type="button"
            onClick={onIptal}
            className="rounded-xl border border-line-strong px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-ink"
          >
            Vazgeç
          </button>
        ) : null}
        <button
          type="submit"
          className="rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-flame"
        >
          {kaydetMetni}
        </button>
      </div>

      {genelHata ? (
        <p role="alert" className="sm:col-span-2 rounded-lg border border-rose-500/25 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-700">
          {genelHata}
        </p>
      ) : null}
    </form>
  );
}
