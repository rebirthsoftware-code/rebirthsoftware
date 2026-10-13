"use client";

import { useState } from "react";
import {
  formatTl,
  ISLETME,
  ODEME_ETIKETI,
  type OdemeYontemi,
  parseTl,
  type Satis,
  type SatisKalemi,
  type SatisVerisi,
  sepetAraToplam,
  sepeteEkle,
  satisTamamla,
  urunBul,
  urunEkle,
} from "@/lib/satis";
import { Icon } from "@/components/Icon";
import { BarkodGiris } from "./BarkodGiris";
import { girdiCls, UrunFormu } from "./UrunFormu";

export type EkranProps = {
  veri: SatisVerisi;
  kaydet: (yeni: SatisVerisi) => void;
  bildir: (metin: string, tur?: "ok" | "hata") => void;
};

export function SatisEkrani({ veri, kaydet, bildir }: EkranProps) {
  const [sepet, setSepet] = useState<SatisKalemi[]>([]);
  const [odeme, setOdeme] = useState<OdemeYontemi>("nakit");
  const [indirimGirdi, setIndirimGirdi] = useState("");
  const [bilinmeyen, setBilinmeyen] = useState<string | null>(null);
  const [sonSatis, setSonSatis] = useState<Satis | null>(null);
  const [arama, setArama] = useState("");

  const araToplam = sepetAraToplam(sepet);
  const indirim = Math.min(parseTl(indirimGirdi) ?? 0, araToplam);
  const toplam = araToplam - indirim;

  // Sepetteki ürünlerin güncel stok bilgisi (stok ekranından değişmiş olabilir)
  const stokOf = (urunId: string) => veri.urunler.find((u) => u.id === urunId)?.stok ?? 0;

  function barkodOkundu(barkod: string) {
    const urun = urunBul(veri, barkod);
    if (!urun) {
      setBilinmeyen(barkod);
      return;
    }
    const sonuc = sepeteEkle(sepet, urun);
    if (sonuc.hata) {
      bildir(sonuc.hata, "hata");
      return;
    }
    setSepet(sonuc.sepet);
    setSonSatis(null);
  }

  function adetDegistir(kalem: SatisKalemi, fark: number) {
    const urun = veri.urunler.find((u) => u.id === kalem.urunId);
    if (!urun) {
      setSepet(sepet.filter((k) => k.urunId !== kalem.urunId));
      return;
    }
    const sonuc = sepeteEkle(sepet, urun, fark);
    if (sonuc.hata) bildir(sonuc.hata, "hata");
    else setSepet(sonuc.sepet);
  }

  function tamamla() {
    const sonuc = satisTamamla(veri, sepet, odeme, indirim);
    if (sonuc.hata || !sonuc.satis) {
      bildir(sonuc.hata ?? "Satış tamamlanamadı.", "hata");
      return;
    }
    kaydet(sonuc.veri);
    setSonSatis(sonuc.satis);
    setSepet([]);
    setIndirimGirdi("");
    bildir(`Satış tamamlandı: ${formatTl(sonuc.satis.toplam)} (${sonuc.satis.fisNo})`, "ok");
  }

  const aramaSonuc = arama.trim()
    ? veri.urunler
        .filter((u) => {
          const q = arama.toLocaleLowerCase("tr");
          return (
            u.ad.toLocaleLowerCase("tr").includes(q) ||
            u.barkod.includes(q) ||
            (u.kategori ?? "").toLocaleLowerCase("tr").includes(q)
          );
        })
        .slice(0, 8)
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Sol: okuma + sepet */}
      <div className="lg:col-span-7">
        <div className="card p-5 sm:p-6">
          <BarkodGiris onOkundu={barkodOkundu} />

          <div className="mt-4">
            <label htmlFor="satis-arama" className="mb-1.5 block text-xs font-medium tracking-wide text-muted uppercase">
              Barkodsuz ekle: ada göre ara
            </label>
            <input
              id="satis-arama"
              value={arama}
              onChange={(e) => setArama(e.target.value)}
              placeholder="Ürün adı, kategori veya barkod parçası"
              autoComplete="off"
              className={girdiCls}
            />
            {aramaSonuc.length > 0 ? (
              <ul className="mt-2 divide-y divide-line rounded-xl border border-line">
                {aramaSonuc.map((u) => (
                  <li key={u.id}>
                    <button
                      type="button"
                      onClick={() => {
                        barkodOkundu(u.barkod);
                        setArama("");
                      }}
                      disabled={u.stok === 0}
                      className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-ink/[0.04] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span>
                        <span className="font-medium text-ink">{u.ad}</span>
                        <span className="ml-2 font-mono text-xs text-faint">{u.barkod}</span>
                      </span>
                      <span className="shrink-0 tabular-nums text-muted">
                        {formatTl(u.fiyat)} · stok {u.stok}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        {bilinmeyen ? (
          <div className="card mt-5 border-flame/40 p-5 sm:p-6">
            <h3 className="text-base font-semibold text-ink">
              Bu barkod kayıtlı değil:{" "}
              <span className="font-mono text-flame">{bilinmeyen}</span>
            </h3>
            <p className="mt-1 text-sm text-muted">
              Ürünü şimdi tanımlayın; kaydedilince sepete eklenir.
            </p>
            <div className="mt-5">
              <UrunFormu
                key={bilinmeyen}
                idOneki="hizli-urun"
                baslangic={{ barkod: bilinmeyen, stok: 1 }}
                mevcutBarkodlar={new Set(veri.urunler.map((u) => u.barkod))}
                kaydetMetni="Kaydet ve sepete ekle"
                onIptal={() => setBilinmeyen(null)}
                onKaydet={(girdi) => {
                  const sonuc = urunEkle(veri, girdi);
                  if (sonuc.hata || !sonuc.urun) return sonuc.hata ?? "Kaydedilemedi.";
                  kaydet(sonuc.veri);
                  const s = sepeteEkle(sepet, sonuc.urun);
                  if (!s.hata) setSepet(s.sepet);
                  setBilinmeyen(null);
                  bildir(`"${sonuc.urun.ad}" kaydedildi.`, "ok");
                  return null;
                }}
              />
            </div>
          </div>
        ) : null}

        <div className="card mt-5 overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <h3 className="text-sm font-semibold text-ink">
              Sepet{" "}
              <span className="ml-1 text-xs font-normal text-muted">
                {sepet.reduce((t, k) => t + k.adet, 0)} ürün
              </span>
            </h3>
            {sepet.length > 0 ? (
              <button
                type="button"
                onClick={() => setSepet([])}
                className="text-xs text-muted underline-offset-4 hover:text-ink hover:underline"
              >
                Sepeti boşalt
              </button>
            ) : null}
          </div>

          {sepet.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted">
              Sepet boş. Barkod okutun ya da ada göre arayıp ekleyin.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-sepet>
                <thead>
                  <tr className="text-left text-xs tracking-wide text-muted uppercase">
                    <th className="px-5 py-2.5 font-medium">Ürün</th>
                    <th className="px-3 py-2.5 text-right font-medium">Birim</th>
                    <th className="px-3 py-2.5 text-center font-medium">Adet</th>
                    <th className="px-3 py-2.5 text-right font-medium">Tutar</th>
                    <th className="px-3 py-2.5"><span className="sr-only">Kaldır</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {sepet.map((k) => (
                    <tr key={k.urunId} data-sepet-satir={k.barkod}>
                      <td className="px-5 py-3">
                        <div className="font-medium text-ink">{k.ad}</div>
                        <div className="font-mono text-xs text-faint">{k.barkod}</div>
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-muted">
                        {formatTl(k.birimFiyat)}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => adetDegistir(k, -1)}
                            aria-label={`${k.ad} adedini azalt`}
                            className="h-7 w-7 rounded-md border border-line text-ink transition hover:border-ink"
                          >
                            −
                          </button>
                          <span className="w-8 text-center tabular-nums" data-adet>
                            {k.adet}
                          </span>
                          <button
                            type="button"
                            onClick={() => adetDegistir(k, 1)}
                            disabled={k.adet >= stokOf(k.urunId)}
                            aria-label={`${k.ad} adedini artır`}
                            className="h-7 w-7 rounded-md border border-line text-ink transition hover:border-ink disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right font-medium tabular-nums text-ink">
                        {formatTl(k.birimFiyat * k.adet)}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSepet(sepet.filter((x) => x.urunId !== k.urunId))}
                          aria-label={`${k.ad} ürününü sepetten kaldır`}
                          className="rounded-md p-1 text-faint transition hover:text-flame"
                        >
                          <Icon name="close" className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Sağ: ödeme */}
      <aside className="lg:col-span-5">
        <div className="card p-5 sm:p-6 lg:sticky lg:top-28">
          <h3 className="text-sm font-semibold text-ink">Ödeme</h3>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted">
              <dt>Ara toplam</dt>
              <dd className="tabular-nums">{formatTl(araToplam)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 text-muted">
              <dt>
                <label htmlFor="indirim">İndirim (₺)</label>
              </dt>
              <dd>
                <input
                  id="indirim"
                  value={indirimGirdi}
                  onChange={(e) => setIndirimGirdi(e.target.value)}
                  inputMode="decimal"
                  placeholder="0,00"
                  className="w-28 rounded-lg border border-line px-3 py-1.5 text-right text-sm tabular-nums outline-none focus:border-flame/70"
                />
              </dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-lg font-semibold text-ink">
              <dt>Toplam</dt>
              <dd className="tabular-nums" data-toplam>
                {formatTl(toplam)}
              </dd>
            </div>
          </dl>

          <fieldset className="mt-5">
            <legend className="mb-2 text-xs font-medium tracking-wide text-muted uppercase">
              Ödeme yöntemi
            </legend>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(ODEME_ETIKETI) as OdemeYontemi[]).map((y) => (
                <label
                  key={y}
                  className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                    odeme === y
                      ? "border-ink bg-ink text-paper"
                      : "border-line text-ink hover:border-ink"
                  }`}
                >
                  <input
                    type="radio"
                    name="odeme"
                    value={y}
                    checked={odeme === y}
                    onChange={() => setOdeme(y)}
                    className="sr-only"
                  />
                  {ODEME_ETIKETI[y]}
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="button"
            onClick={tamamla}
            disabled={sepet.length === 0}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-flame px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-flame-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            Satışı tamamla
            <Icon name="arrow" className="h-4 w-4" />
          </button>
          <p className="mt-3 text-xs text-faint">
            Tamamlanınca stoklar düşer ve satış raporlara işlenir.
          </p>

          {sonSatis ? <Fis satis={sonSatis} /> : null}
        </div>
      </aside>
    </div>
  );
}

function Fis({ satis }: { satis: Satis }) {
  const tarih = new Date(satis.tarih).toLocaleString("tr-TR", {
    dateStyle: "short",
    timeStyle: "short",
  });

  function yazdir() {
    const satirlar = satis.kalemler
      .map(
        (k) =>
          `<tr><td>${k.ad}</td><td style="text-align:center">${k.adet}</td><td style="text-align:right">${formatTl(
            k.birimFiyat * k.adet
          )}</td></tr>`
      )
      .join("");
    const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>${ISLETME.ad} — Fiş ${satis.fisNo}</title>
<style>body{font:13px/1.4 ui-monospace,monospace;max-width:320px;margin:16px auto;padding:0 8px}table{width:100%;border-collapse:collapse}td{padding:3px 0}hr{border:0;border-top:1px dashed #000;margin:8px 0}.r{text-align:right}</style></head>
<body><strong>${ISLETME.ad}</strong><br>SATIŞ FİŞİ<br>No: ${satis.fisNo}<br>${tarih}<hr><table>${satirlar}</table><hr>
<table><tr><td>Ara toplam</td><td class="r">${formatTl(satis.araToplam)}</td></tr>
${satis.indirim ? `<tr><td>İndirim</td><td class="r">−${formatTl(satis.indirim)}</td></tr>` : ""}
<tr><td><strong>TOPLAM</strong></td><td class="r"><strong>${formatTl(satis.toplam)}</strong></td></tr>
<tr><td>Ödeme</td><td class="r">${ODEME_ETIKETI[satis.odeme]}</td></tr></table><hr>Teşekkür ederiz.
<script>window.onload=function(){window.print()}</script></body></html>`;
    const w = window.open("", "_blank", "width=420,height=640");
    if (!w) return;
    w.document.write(html);
    w.document.close();
  }

  return (
    <div className="mt-6 rounded-xl border border-dashed border-line-strong p-4" data-son-fis>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-muted uppercase">Son fiş</span>
        <span className="font-mono text-xs text-faint">{satis.fisNo}</span>
      </div>
      <ul className="mt-3 space-y-1 text-sm">
        {satis.kalemler.map((k) => (
          <li key={k.urunId} className="flex justify-between gap-3">
            <span className="text-ink-soft">
              {k.ad} <span className="text-faint">× {k.adet}</span>
            </span>
            <span className="tabular-nums text-ink">{formatTl(k.birimFiyat * k.adet)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex justify-between border-t border-line pt-2 text-sm font-semibold text-ink">
        <span>{ODEME_ETIKETI[satis.odeme]}</span>
        <span className="tabular-nums">{formatTl(satis.toplam)}</span>
      </div>
      <button
        type="button"
        onClick={yazdir}
        className="mt-3 w-full rounded-xl border border-line-strong py-2 text-xs font-semibold text-ink transition hover:border-ink"
      >
        Fişi yazdır
      </button>
    </div>
  );
}
