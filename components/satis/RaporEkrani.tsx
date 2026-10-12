"use client";

import { useState } from "react";
import {
  enCokSatanlar,
  formatTl,
  gunlukOzet,
  ODEME_ETIKETI,
  type OdemeYontemi,
  satisIade,
} from "@/lib/satis";
import type { EkranProps } from "./SatisEkrani";

export function RaporEkrani({ veri, kaydet, bildir }: EkranProps) {
  const [acik, setAcik] = useState<string | null>(null);
  const bugun = gunlukOzet(veri);
  const populer = enCokSatanlar(veri);
  const toplamCiro = veri.satislar.filter((s) => !s.iadeTarihi).reduce((t, s) => t + s.toplam, 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kutu etiket="Bugünkü ciro" deger={formatTl(bugun.ciro)} vurgu />
        <Kutu etiket="Bugünkü fiş" deger={String(bugun.fis)} />
        <Kutu etiket="Bugün satılan adet" deger={String(bugun.adet)} />
        <Kutu etiket="Toplam ciro" deger={formatTl(toplamCiro)} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-ink">Bugün ödeme dağılımı</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {(Object.keys(ODEME_ETIKETI) as OdemeYontemi[]).map((y) => {
              const pay = bugun.ciro ? Math.round((bugun.odeme[y] / bugun.ciro) * 100) : 0;
              return (
                <li key={y}>
                  <div className="flex justify-between">
                    <span className="text-muted">{ODEME_ETIKETI[y]}</span>
                    <span className="tabular-nums text-ink">
                      {formatTl(bugun.odeme[y])} <span className="text-faint">%{pay}</span>
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink/[0.06]">
                    <div className="h-full rounded-full bg-flame" style={{ width: `${pay}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="card p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-ink">En çok satanlar</h3>
          {populer.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Henüz satış yok.</p>
          ) : (
            <ol className="mt-4 space-y-2 text-sm">
              {populer.map((p, i) => (
                <li key={p.ad} className="flex items-center gap-3">
                  <span className="w-5 text-xs tabular-nums text-faint">{i + 1}.</span>
                  <span className="flex-1 text-ink">{p.ad}</span>
                  <span className="tabular-nums text-muted">{p.adet} adet</span>
                  <span className="w-24 text-right tabular-nums text-ink">{formatTl(p.ciro)}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-line px-5 py-3">
          <h3 className="text-sm font-semibold text-ink">
            Satış geçmişi{" "}
            <span className="ml-1 text-xs font-normal text-muted">{veri.satislar.length} kayıt</span>
          </h3>
        </div>
        {veri.satislar.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted">
            Henüz satış yapılmadı. Satış sekmesinden barkod okutarak başlayın.
          </p>
        ) : (
          <ul className="divide-y divide-line" data-satis-listesi>
            {veri.satislar.map((s) => {
              const acikMi = acik === s.id;
              const tarih = new Date(s.tarih).toLocaleString("tr-TR", {
                dateStyle: "short",
                timeStyle: "short",
              });
              return (
                <li key={s.id} data-satis={s.fisNo}>
                  <button
                    type="button"
                    onClick={() => setAcik(acikMi ? null : s.id)}
                    aria-expanded={acikMi}
                    className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 text-left text-sm transition hover:bg-ink/[0.03]"
                  >
                    <span className="font-mono text-xs text-muted">{s.fisNo}</span>
                    <span className="text-muted">{tarih}</span>
                    <span className="text-faint">
                      {s.kalemler.reduce((t, k) => t + k.adet, 0)} ürün · {ODEME_ETIKETI[s.odeme]}
                    </span>
                    {s.iadeTarihi ? (
                      <span className="rounded-md bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700">
                        İade edildi
                      </span>
                    ) : null}
                    <span
                      className={`ml-auto font-semibold tabular-nums ${
                        s.iadeTarihi ? "text-faint line-through" : "text-ink"
                      }`}
                    >
                      {formatTl(s.toplam)}
                    </span>
                  </button>
                  {acikMi ? (
                    <div className="border-t border-line bg-paper-2/60 px-5 py-4 text-sm">
                      <ul className="space-y-1">
                        {s.kalemler.map((k) => (
                          <li key={k.urunId} className="flex justify-between gap-3">
                            <span className="text-ink-soft">
                              {k.ad} <span className="text-faint">× {k.adet}</span>
                            </span>
                            <span className="tabular-nums">{formatTl(k.birimFiyat * k.adet)}</span>
                          </li>
                        ))}
                      </ul>
                      {s.indirim > 0 ? (
                        <p className="mt-2 flex justify-between text-muted">
                          <span>İndirim</span>
                          <span className="tabular-nums">−{formatTl(s.indirim)}</span>
                        </p>
                      ) : null}
                      {!s.iadeTarihi ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              window.confirm(
                                `${s.fisNo} numaralı fiş iade edilsin mi? Ürünler stoğa geri eklenir.`
                              )
                            ) {
                              kaydet(satisIade(veri, s.id));
                              bildir("Satış iade edildi, stoklar geri yüklendi.", "ok");
                            }
                          }}
                          className="mt-3 rounded-lg border border-line-strong px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-flame hover:text-flame"
                        >
                          İade et
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function Kutu({ etiket, deger, vurgu }: { etiket: string; deger: string; vurgu?: boolean }) {
  return (
    <div className={`card px-5 py-4 ${vurgu ? "border-flame/40" : ""}`}>
      <div className="text-xs font-medium tracking-wide text-muted uppercase">{etiket}</div>
      <div
        className={`mt-1 text-2xl font-semibold tracking-tight tabular-nums ${vurgu ? "text-flame" : "text-ink"}`}
        data-rapor={etiket}
      >
        {deger}
      </div>
    </div>
  );
}
