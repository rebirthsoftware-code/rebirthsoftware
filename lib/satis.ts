/**
 * Barkodlu, stoklu satış sistemi — veri katmanı.
 *
 * POS'tan bağımsız, tarayıcıda çalışan küçük bir satış modülü.
 * Veriler yalnızca bu tarayıcının localStorage alanında tutulur;
 * sunucu, veritabanı veya ek paket gerektirmez. Bu sayede modül hem
 * Vercel'de hem de GitHub Pages'in statik sürümünde aynen çalışır.
 *
 * Para birimi kuruş cinsinden tam sayı olarak saklanır (12,50 ₺ → 1250).
 * Ondalık sayı hatası olmaması için toplamlar hep tam sayıyla hesaplanır.
 */

export type Urun = {
  id: string;
  barkod: string;
  ad: string;
  /** Satış fiyatı, kuruş */
  fiyat: number;
  /** Alış fiyatı, kuruş (isteğe bağlı; kâr hesabı için) */
  alisFiyati?: number;
  stok: number;
  /** Bu seviyenin altına düşünce uyarı gösterilir */
  kritikStok: number;
  kategori?: string;
  olusturma: string; // ISO tarih
};

export type SatisKalemi = {
  urunId: string;
  barkod: string;
  ad: string;
  /** Satış anındaki birim fiyat, kuruş */
  birimFiyat: number;
  adet: number;
};

export type OdemeYontemi = "nakit" | "kart" | "havale";

export type Satis = {
  id: string;
  /** Fiş numarası — gün içinde artan, okunması kolay */
  fisNo: string;
  tarih: string; // ISO
  kalemler: SatisKalemi[];
  /** Ara toplam (indirim öncesi), kuruş */
  araToplam: number;
  /** İndirim tutarı, kuruş */
  indirim: number;
  /** Ödenen toplam, kuruş */
  toplam: number;
  odeme: OdemeYontemi;
  /** İade edildiyse tarihi; stok geri yüklenmiştir */
  iadeTarihi?: string;
};

export type SatisVerisi = {
  surum: 1;
  urunler: Urun[];
  satislar: Satis[];
};

export const BOS_VERI: SatisVerisi = { surum: 1, urunler: [], satislar: [] };

/** Sayfa başlığında ve fişte görünen işletme bilgisi. Buradan değiştirin. */
export const ISLETME = {
  ad: "İnci Motors",
  altBaslik: "Satış ve Stok",
} as const;

export const ODEME_ETIKETI: Record<OdemeYontemi, string> = {
  nakit: "Nakit",
  kart: "Kart",
  havale: "Havale / EFT",
};

/* ---------- Para ---------- */

const tlFormat = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  minimumFractionDigits: 2,
});

/** Kuruş → "1.250,00 ₺" */
export const formatTl = (kurus: number) => tlFormat.format(kurus / 100);

/**
 * "12,50" / "12.50" / "1.250,75" gibi girdileri kuruşa çevirir.
 * Geçersizse null döner.
 */
export function parseTl(girdi: string): number | null {
  const temiz = girdi.replace(/\s|₺|TL/gi, "");
  if (!temiz) return null;
  // Hem virgül hem nokta varsa: son gelen ondalık ayracıdır.
  const sonVirgul = temiz.lastIndexOf(",");
  const sonNokta = temiz.lastIndexOf(".");
  let normal: string;
  if (sonVirgul > sonNokta) {
    normal = temiz.replace(/\./g, "").replace(",", ".");
  } else if (sonNokta > sonVirgul) {
    normal = temiz.replace(/,/g, "");
  } else {
    normal = temiz;
  }
  if (!/^\d+(\.\d{1,2})?$/.test(normal)) return null;
  return Math.round(parseFloat(normal) * 100);
}

/* ---------- Barkod ---------- */

/** Barkod girdisini normalize eder: boşluk ve görünmez karakterleri atar. */
export const temizleBarkod = (b: string) => b.replace(/[\s​-‍﻿]/g, "").trim();

/** EAN-13 / EAN-8 / UPC-A kontrol hanesi doğru mu? Diğer formatlar serbest. */
export function barkodGecerliMi(b: string): boolean {
  const s = temizleBarkod(b);
  if (!s) return false;
  if (/^\d{8}$|^\d{12}$|^\d{13}$/.test(s)) return eanKontrolHanesi(s.slice(0, -1)) === Number(s.at(-1));
  return s.length >= 3 && s.length <= 48;
}

/** EAN tipi barkodların (8/12/13 hane) kontrol hanesini hesaplar. */
export function eanKontrolHanesi(govde: string): number {
  // Sağdan sola: ilk hane ×3, sonraki ×1, sırayla.
  let toplam = 0;
  const haneler = govde.split("").reverse();
  haneler.forEach((h, i) => {
    toplam += Number(h) * (i % 2 === 0 ? 3 : 1);
  });
  return (10 - (toplam % 10)) % 10;
}

/**
 * Mağaza içi kullanım için EAN-13 üretir.
 * "20" ön eki GS1'in mağaza içi (in-store) aralığıdır; ticari ürünlerle çakışmaz.
 */
export function uretBarkod(mevcut: Set<string>): string {
  for (let i = 0; i < 100; i++) {
    const govde = "20" + String(Math.floor(Math.random() * 1e10)).padStart(10, "0");
    const aday = govde + eanKontrolHanesi(govde);
    if (!mevcut.has(aday)) return aday;
  }
  // 100 denemede de çakışma olması pratikte imkânsız; yine de güvenli dönüş.
  const govde = "20" + String(Date.now()).slice(-10);
  return govde + eanKontrolHanesi(govde);
}

/* ---------- Kimlik ---------- */

export function yeniId(onek = "u") {
  const rnd =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${onek}_${Date.now().toString(36)}${rnd}`;
}

/* ---------- Saf iş kuralları ---------- */

export const urunBul = (veri: SatisVerisi, barkod: string) => {
  const b = temizleBarkod(barkod);
  return veri.urunler.find((u) => u.barkod === b);
};

export const sepetAraToplam = (kalemler: SatisKalemi[]) =>
  kalemler.reduce((t, k) => t + k.birimFiyat * k.adet, 0);

/**
 * Sepete ürün ekler veya adedini artırır. Stok yetersizse hata metni döner.
 * Sepet stoktan "rezerve" eder: toplam adet stoğu aşamaz.
 */
export function sepeteEkle(
  sepet: SatisKalemi[],
  urun: Urun,
  adet = 1
): { sepet: SatisKalemi[]; hata?: string } {
  const mevcut = sepet.find((k) => k.urunId === urun.id);
  const yeniAdet = (mevcut?.adet ?? 0) + adet;
  if (yeniAdet > urun.stok) {
    return {
      sepet,
      hata:
        urun.stok === 0
          ? `"${urun.ad}" stokta yok.`
          : `"${urun.ad}" için stokta yalnızca ${urun.stok} adet var.`,
    };
  }
  if (yeniAdet <= 0) {
    return { sepet: sepet.filter((k) => k.urunId !== urun.id) };
  }
  if (mevcut) {
    return {
      sepet: sepet.map((k) => (k.urunId === urun.id ? { ...k, adet: yeniAdet } : k)),
    };
  }
  return {
    sepet: [
      ...sepet,
      { urunId: urun.id, barkod: urun.barkod, ad: urun.ad, birimFiyat: urun.fiyat, adet },
    ],
  };
}

/** Gün içinde artan fiş numarası: 20261012-003 */
export function sonrakiFisNo(satislar: Satis[], simdi = new Date()): string {
  const gun = simdi.toISOString().slice(0, 10).replace(/-/g, "");
  const bugunku = satislar.filter((s) => s.fisNo.startsWith(gun)).length;
  return `${gun}-${String(bugunku + 1).padStart(3, "0")}`;
}

/**
 * Satışı tamamlar: stok düşer, satış kaydı eklenir.
 * Stok yetersizse veri değişmez ve hata döner.
 */
export function satisTamamla(
  veri: SatisVerisi,
  sepet: SatisKalemi[],
  odeme: OdemeYontemi,
  indirim = 0,
  simdi = new Date()
): { veri: SatisVerisi; satis?: Satis; hata?: string } {
  if (sepet.length === 0) return { veri, hata: "Sepet boş." };

  for (const k of sepet) {
    const u = veri.urunler.find((x) => x.id === k.urunId);
    if (!u) return { veri, hata: `"${k.ad}" artık ürün listesinde yok.` };
    if (u.stok < k.adet)
      return { veri, hata: `"${u.ad}" için stok yetersiz (kalan: ${u.stok}).` };
  }

  const araToplam = sepetAraToplam(sepet);
  const ind = Math.min(Math.max(0, indirim), araToplam);
  const satis: Satis = {
    id: yeniId("s"),
    fisNo: sonrakiFisNo(veri.satislar, simdi),
    tarih: simdi.toISOString(),
    kalemler: sepet.map((k) => ({ ...k })),
    araToplam,
    indirim: ind,
    toplam: araToplam - ind,
    odeme,
  };

  const dusulecek = new Map(sepet.map((k) => [k.urunId, k.adet]));
  const urunler = veri.urunler.map((u) =>
    dusulecek.has(u.id) ? { ...u, stok: u.stok - dusulecek.get(u.id)! } : u
  );

  return { veri: { ...veri, urunler, satislar: [satis, ...veri.satislar] }, satis };
}

/** Satışı iade eder: stoklar geri yüklenir, kayıt "iade" olarak işaretlenir. */
export function satisIade(veri: SatisVerisi, satisId: string, simdi = new Date()): SatisVerisi {
  const satis = veri.satislar.find((s) => s.id === satisId);
  if (!satis || satis.iadeTarihi) return veri;

  const geri = new Map<string, number>();
  satis.kalemler.forEach((k) => geri.set(k.urunId, (geri.get(k.urunId) ?? 0) + k.adet));

  return {
    ...veri,
    urunler: veri.urunler.map((u) =>
      geri.has(u.id) ? { ...u, stok: u.stok + geri.get(u.id)! } : u
    ),
    satislar: veri.satislar.map((s) =>
      s.id === satisId ? { ...s, iadeTarihi: simdi.toISOString() } : s
    ),
  };
}

export function urunEkle(
  veri: SatisVerisi,
  girdi: Omit<Urun, "id" | "olusturma">
): { veri: SatisVerisi; urun?: Urun; hata?: string } {
  const barkod = temizleBarkod(girdi.barkod);
  if (!barkodGecerliMi(barkod)) return { veri, hata: "Barkod geçersiz (kontrol hanesi tutmuyor)." };
  if (veri.urunler.some((u) => u.barkod === barkod))
    return { veri, hata: "Bu barkod zaten kayıtlı." };
  if (girdi.ad.trim().length < 2) return { veri, hata: "Ürün adı en az 2 karakter olmalı." };
  if (girdi.fiyat < 0 || girdi.stok < 0) return { veri, hata: "Fiyat ve stok negatif olamaz." };

  const urun: Urun = {
    ...girdi,
    barkod,
    ad: girdi.ad.trim(),
    kategori: girdi.kategori?.trim() || undefined,
    id: yeniId("u"),
    olusturma: new Date().toISOString(),
  };
  return { veri: { ...veri, urunler: [urun, ...veri.urunler] }, urun };
}

export function urunGuncelle(
  veri: SatisVerisi,
  id: string,
  degisiklik: Partial<Omit<Urun, "id" | "olusturma">>
): { veri: SatisVerisi; hata?: string } {
  if (degisiklik.barkod !== undefined) {
    const b = temizleBarkod(degisiklik.barkod);
    if (!barkodGecerliMi(b)) return { veri, hata: "Barkod geçersiz." };
    if (veri.urunler.some((u) => u.barkod === b && u.id !== id))
      return { veri, hata: "Bu barkod başka bir üründe kayıtlı." };
    degisiklik = { ...degisiklik, barkod: b };
  }
  if (degisiklik.ad !== undefined && degisiklik.ad.trim().length < 2)
    return { veri, hata: "Ürün adı en az 2 karakter olmalı." };
  if ((degisiklik.fiyat ?? 0) < 0 || (degisiklik.stok ?? 0) < 0)
    return { veri, hata: "Fiyat ve stok negatif olamaz." };

  return {
    veri: {
      ...veri,
      urunler: veri.urunler.map((u) => (u.id === id ? { ...u, ...degisiklik } : u)),
    },
  };
}

export const urunSil = (veri: SatisVerisi, id: string): SatisVerisi => ({
  ...veri,
  urunler: veri.urunler.filter((u) => u.id !== id),
});

/** Stok girişi: mevcut stoğa ekler (negatif değerle düzeltme de yapılabilir). */
export function stokGirisi(veri: SatisVerisi, id: string, adet: number): SatisVerisi {
  return {
    ...veri,
    urunler: veri.urunler.map((u) =>
      u.id === id ? { ...u, stok: Math.max(0, u.stok + adet) } : u
    ),
  };
}

/** Stok düzeltme: sayım sonrası stoğu doğrudan verilen değere eşitler. */
export function stokAyarla(veri: SatisVerisi, id: string, yeniStok: number): SatisVerisi {
  const s = Math.max(0, Math.floor(yeniStok));
  return {
    ...veri,
    urunler: veri.urunler.map((u) => (u.id === id ? { ...u, stok: s } : u)),
  };
}

export const kritikUrunler = (veri: SatisVerisi) =>
  veri.urunler.filter((u) => u.stok <= u.kritikStok);

/* ---------- Raporlar ---------- */

export const ayniGunMu = (iso: string, ref = new Date()) => {
  const d = new Date(iso);
  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth() &&
    d.getDate() === ref.getDate()
  );
};

export function gunlukOzet(veri: SatisVerisi, gun = new Date()) {
  const gecerli = veri.satislar.filter((s) => !s.iadeTarihi && ayniGunMu(s.tarih, gun));
  const ciro = gecerli.reduce((t, s) => t + s.toplam, 0);
  const adet = gecerli.reduce((t, s) => t + s.kalemler.reduce((a, k) => a + k.adet, 0), 0);
  const odeme: Record<OdemeYontemi, number> = { nakit: 0, kart: 0, havale: 0 };
  gecerli.forEach((s) => (odeme[s.odeme] += s.toplam));
  return { fis: gecerli.length, ciro, adet, odeme };
}

export function enCokSatanlar(veri: SatisVerisi, limit = 5) {
  const say = new Map<string, { ad: string; adet: number; ciro: number }>();
  veri.satislar
    .filter((s) => !s.iadeTarihi)
    .forEach((s) =>
      s.kalemler.forEach((k) => {
        const m = say.get(k.urunId) ?? { ad: k.ad, adet: 0, ciro: 0 };
        m.adet += k.adet;
        m.ciro += k.adet * k.birimFiyat;
        say.set(k.urunId, m);
      })
    );
  return [...say.values()].sort((a, b) => b.adet - a.adet).slice(0, limit);
}

/** Stok değeri: alış fiyatı varsa onunla, yoksa satış fiyatıyla. */
export const stokDegeri = (veri: SatisVerisi) =>
  veri.urunler.reduce((t, u) => t + (u.alisFiyati ?? u.fiyat) * u.stok, 0);

/* ---------- Dışa / içe aktarma ---------- */

export function veriDogrula(ham: unknown): SatisVerisi | null {
  if (!ham || typeof ham !== "object") return null;
  const v = ham as Partial<SatisVerisi>;
  if (!Array.isArray(v.urunler) || !Array.isArray(v.satislar)) return null;
  const urunlerOk = v.urunler.every(
    (u) =>
      u &&
      typeof u.id === "string" &&
      typeof u.barkod === "string" &&
      typeof u.ad === "string" &&
      typeof u.fiyat === "number" &&
      typeof u.stok === "number"
  );
  if (!urunlerOk) return null;
  return {
    surum: 1,
    urunler: v.urunler.map((u) => ({
      ...u,
      kritikStok: typeof u.kritikStok === "number" ? u.kritikStok : 0,
      olusturma: typeof u.olusturma === "string" ? u.olusturma : new Date(0).toISOString(),
    })),
    satislar: v.satislar,
  };
}

/* ---------- Örnek veri ---------- */

export function ornekUrunler(): Omit<Urun, "id" | "olusturma">[] {
  return [
    { barkod: "8690504012344", ad: "Türk Kahvesi 100 g", fiyat: 8500, alisFiyati: 6200, stok: 24, kritikStok: 5, kategori: "Gıda" },
    { barkod: "8691234567890", ad: "Zeytinyağı 1 L", fiyat: 42000, alisFiyati: 33000, stok: 12, kritikStok: 4, kategori: "Gıda" },
    { barkod: "8697891234564", ad: "Seramik Kupa", fiyat: 19900, alisFiyati: 9000, stok: 3, kritikStok: 5, kategori: "Ev" },
    { barkod: "4006381333931", ad: "Tükenmez Kalem (mavi)", fiyat: 2500, alisFiyati: 1100, stok: 80, kritikStok: 20, kategori: "Kırtasiye" },
    { barkod: "5901234123457", ad: "Defter A5 Çizgili", fiyat: 6900, alisFiyati: 3800, stok: 0, kritikStok: 10, kategori: "Kırtasiye" },
  ];
}
