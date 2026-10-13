"use client";

import { useEffect, useState } from "react";
import type { SatisVerisi } from "@/lib/satis";
import { useSatisVerisi, veriYaz } from "@/lib/satis-depo";
import { Icon } from "@/components/Icon";
import { RaporEkrani } from "./RaporEkrani";
import { SatisEkrani } from "./SatisEkrani";
import { StokEkrani } from "./StokEkrani";

type Sekme = "satis" | "stok" | "rapor";

const SEKMELER: { id: Sekme; etiket: string; aciklama: string }[] = [
  { id: "satis", etiket: "Satış", aciklama: "Barkod okut, sepeti tamamla" },
  { id: "stok", etiket: "Stok", aciklama: "Ürünler, stok girişi, yedek" },
  { id: "rapor", etiket: "Raporlar", aciklama: "Günlük ciro ve geçmiş" },
];

type Bildirim = { metin: string; tur: "ok" | "hata"; id: number };

/**
 * Barkodlu satış sisteminin kabuğu: sekmeler, bildirimler ve veri bağlantısı.
 * POS'tan bağımsızdır; tüm veri `lib/satis-depo.ts` üzerinden tarayıcıda tutulur.
 */
export function SatisSistemi() {
  const { veri, hazir } = useSatisVerisi();
  const [sekme, setSekme] = useState<Sekme>("satis");
  const [bildirim, setBildirim] = useState<Bildirim | null>(null);

  useEffect(() => {
    if (!bildirim) return;
    const t = window.setTimeout(() => setBildirim(null), bildirim.tur === "hata" ? 5000 : 3500);
    return () => window.clearTimeout(t);
  }, [bildirim]);

  const bildir = (metin: string, tur: "ok" | "hata" = "ok") =>
    setBildirim({ metin, tur, id: Date.now() });

  const kaydet = (yeni: SatisVerisi) => {
    const hata = veriYaz(yeni);
    if (hata) bildir(hata, "hata");
  };

  const kritikSayisi = veri.urunler.filter((u) => u.stok <= u.kritikStok).length;

  return (
    <div>
      {/* Sekmeler */}
      <div role="tablist" aria-label="Satış sistemi bölümleri" className="flex gap-1 overflow-x-auto border-b border-line">
        {SEKMELER.map((s) => {
          const aktif = sekme === s.id;
          return (
            <button
              key={s.id}
              role="tab"
              type="button"
              id={`sekme-${s.id}`}
              aria-selected={aktif}
              aria-controls={`panel-${s.id}`}
              onClick={() => setSekme(s.id)}
              className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                aktif
                  ? "border-flame text-ink"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {s.etiket}
              {s.id === "stok" && kritikSayisi > 0 ? (
                <span
                  className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800"
                  title={`${kritikSayisi} ürün kritik stokta`}
                >
                  {kritikSayisi}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Bildirim */}
      <div aria-live="polite" className="min-h-14 pt-4">
        {bildirim ? (
          <div
            key={bildirim.id}
            data-bildirim={bildirim.tur}
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
              bildirim.tur === "ok"
                ? "border-emerald-500/30 bg-emerald-50 text-emerald-900"
                : "border-rose-500/30 bg-rose-50 text-rose-900"
            }`}
          >
            <Icon name={bildirim.tur === "ok" ? "check" : "close"} className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="flex-1">{bildirim.metin}</span>
            <button
              type="button"
              onClick={() => setBildirim(null)}
              aria-label="Bildirimi kapat"
              className="text-current/60 hover:text-current"
            >
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>

      {/* Paneller */}
      {!hazir ? (
        <div className="card h-96 animate-pulse" aria-busy="true" aria-label="Yükleniyor" />
      ) : (
        SEKMELER.map((s) => (
          <div
            key={s.id}
            role="tabpanel"
            id={`panel-${s.id}`}
            aria-labelledby={`sekme-${s.id}`}
            hidden={sekme !== s.id}
          >
            {/* Paneller gizlenir ama kaldırılmaz: sekme değişince sepet kaybolmasın. */}
            {s.id === "satis" ? (
              <SatisEkrani veri={veri} kaydet={kaydet} bildir={bildir} />
            ) : s.id === "stok" ? (
              <StokEkrani veri={veri} kaydet={kaydet} bildir={bildir} />
            ) : (
              <RaporEkrani veri={veri} kaydet={kaydet} bildir={bildir} />
            )}
          </div>
        ))
      )}
    </div>
  );
}
