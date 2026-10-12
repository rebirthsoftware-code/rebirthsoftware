"use client";

/**
 * Satış verisinin tarayıcı deposu.
 *
 * useSyncExternalStore ile çalışır: sunucu tarafında boş veri verilir,
 * tarayıcıda hidrasyon bittikten sonra localStorage'daki veri yüklenir.
 * Böylece "sunucu ile istemci HTML'i uyuşmuyor" hatası oluşmaz.
 *
 * Aynı tarayıcıda açık iki sekme `storage` olayıyla birbirini günceller.
 */

import { useSyncExternalStore } from "react";
import { BOS_VERI, type SatisVerisi, veriDogrula } from "./satis";

export const DEPO_ANAHTARI = "rebirth.satis.v1";

let onbellek: SatisVerisi | null = null;
const dinleyiciler = new Set<() => void>();

function oku(): SatisVerisi {
  if (onbellek) return onbellek;
  try {
    const ham = localStorage.getItem(DEPO_ANAHTARI);
    onbellek = ham ? (veriDogrula(JSON.parse(ham)) ?? BOS_VERI) : BOS_VERI;
  } catch {
    onbellek = BOS_VERI;
  }
  return onbellek;
}

function yayinla() {
  dinleyiciler.forEach((d) => d());
}

function abone(d: () => void) {
  dinleyiciler.add(d);
  const storageDinle = (e: StorageEvent) => {
    if (e.key === DEPO_ANAHTARI) {
      onbellek = null;
      yayinla();
    }
  };
  window.addEventListener("storage", storageDinle);
  return () => {
    dinleyiciler.delete(d);
    window.removeEventListener("storage", storageDinle);
  };
}

/** Veriyi değiştirir ve kalıcı yazar. Hata dönerse (kota dolu vb.) metin verir. */
export function veriYaz(yeni: SatisVerisi): string | null {
  onbellek = yeni;
  let hata: string | null = null;
  try {
    localStorage.setItem(DEPO_ANAHTARI, JSON.stringify(yeni));
  } catch {
    hata = "Veri kaydedilemedi: tarayıcı depolama alanı dolu veya kapalı olabilir.";
  }
  yayinla();
  return hata;
}

export function veriSifirla() {
  try {
    localStorage.removeItem(DEPO_ANAHTARI);
  } catch {
    /* yoksay */
  }
  onbellek = BOS_VERI;
  yayinla();
}

/**
 * Bileşenlerde kullanılacak kanca.
 * `hazir` false iken henüz tarayıcı verisi yüklenmemiştir (ilk hidrasyon).
 */
export function useSatisVerisi(): { veri: SatisVerisi; hazir: boolean } {
  const veri = useSyncExternalStore(abone, oku, () => BOS_VERI);
  const hazir = useSyncExternalStore(
    abone,
    () => true,
    () => false
  );
  return { veri, hazir };
}
