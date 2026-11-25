import "server-only";
import { depo, type Dosya } from "./depo";
import {
  BARINDIRMALAR,
  HIZMET_IKONLARI,
  type Hatalar,
  type Hizmet,
  type MusteriSitesi,
  PROJE_TURLERI,
  type Proje,
  SLUG_DESENI,
  type SiteBilgi,
  YAZI_KATEGORILERI,
  type Yazi,
  govdeyiAyristir,
  metin,
  satirlar,
  slugla,
} from "./tipler";

export * from "./tipler";

/**
 * İçerik okuma/yazma ve form doğrulama (yalnızca sunucu).
 * Değerler burada doğrulandığı için sitede çalışma zamanı denetimi gerekmez.
 */

export const DOSYALAR = {
  projeler: "content/projeler.json",
  yazilar: "content/yazilar.json",
  hizmetler: "content/hizmetler.json",
  site: "content/site.json",
  musteriSiteleri: "content/musteri-siteleri.json",
} as const;

type Koleksiyonlar = {
  projeler: Proje[];
  yazilar: Yazi[];
  hizmetler: Hizmet[];
  site: SiteBilgi;
  musteriSiteleri: MusteriSitesi[];
};

const VARSAYILAN: Koleksiyonlar = {
  projeler: [],
  yazilar: [],
  hizmetler: [],
  site: {
    phone: "", phoneHref: "", whatsapp: "", email: "", city: "", country: "Türkiye", address: "",
    social: { linkedin: "", github: "", instagram: "" },
    stats: [],
  },
  musteriSiteleri: [],
};

export async function oku<K extends keyof Koleksiyonlar>(anahtar: K): Promise<Koleksiyonlar[K]> {
  const ham = await depo().oku(DOSYALAR[anahtar]);
  if (!ham) return VARSAYILAN[anahtar];
  try {
    return JSON.parse(ham) as Koleksiyonlar[K];
  } catch {
    throw new Error(`${DOSYALAR[anahtar]} bozuk JSON içeriyor; depoda elle düzeltin.`);
  }
}

export function jsonDosyasi<K extends keyof Koleksiyonlar>(anahtar: K, veri: Koleksiyonlar[K]): Dosya {
  return { yol: DOSYALAR[anahtar], icerik: JSON.stringify(veri, null, 2) + "\n" };
}

export async function kaydet<K extends keyof Koleksiyonlar>(
  anahtar: K,
  veri: Koleksiyonlar[K],
  mesaj: string,
  ekDosyalar: Dosya[] = []
) {
  await depo().yaz([jsonDosyasi(anahtar, veri), ...ekDosyalar], mesaj);
}

/* ---------------- Doğrulama ---------------- */

export function projeDogrula(fd: FormData, mevcutSluglar: string[], eskiSlug?: string): { deger?: Proje; hatalar: Hatalar } {
  const h: Hatalar = {};
  const title = metin(fd, "title");
  let slug = metin(fd, "slug") || slugla(title);
  if (!SLUG_DESENI.test(slug)) h.slug = "Adres yalnızca küçük harf, rakam ve tire içerebilir.";
  if (slug !== eskiSlug && mevcutSluglar.includes(slug)) h.slug = "Bu adres başka bir projede kullanılıyor.";
  if (title.length < 2) h.title = "Proje adı gerekli.";
  const client = metin(fd, "client");
  if (!client) h.client = "Müşteri adı gerekli.";
  const year = metin(fd, "year");
  if (!/^\d{4}$/.test(year)) h.year = "Yıl 4 haneli olmalı (ör. 2026).";
  const type = metin(fd, "type") as Proje["type"];
  if (!PROJE_TURLERI.includes(type)) h.type = "Geçerli bir tür seçin.";
  const summary = metin(fd, "summary");
  if (summary.length < 10) h.summary = "Tek cümlelik özet gerekli.";
  const url = metin(fd, "url");
  if (url && !/^https?:\/\//.test(url)) h.url = "Adres https:// ile başlamalı.";
  const result = satirlar(metin(fd, "result"));
  const stack = satirlar(metin(fd, "stack"));
  if (Object.keys(h).length) return { hatalar: h };
  slug = slug || "proje";
  const deger: Proje = {
    slug,
    title,
    client,
    sector: metin(fd, "sector"),
    year,
    type,
    summary,
    challenge: metin(fd, "challenge"),
    solution: metin(fd, "solution"),
    result,
    stack,
    ...(url ? { url } : {}),
    ...(metin(fd, "image") ? { image: metin(fd, "image") } : {}),
    ...(fd.get("featured") === "on" ? { featured: true } : {}),
  };
  return { deger, hatalar: {} };
}

export function yaziDogrula(fd: FormData, mevcutSluglar: string[], eskiSlug?: string): { deger?: Yazi; hatalar: Hatalar } {
  const h: Hatalar = {};
  const title = metin(fd, "title");
  const slug = metin(fd, "slug") || slugla(title);
  if (!SLUG_DESENI.test(slug)) h.slug = "Adres yalnızca küçük harf, rakam ve tire içerebilir.";
  if (slug !== eskiSlug && mevcutSluglar.includes(slug)) h.slug = "Bu adres başka bir yazıda kullanılıyor.";
  if (title.length < 5) h.title = "Başlık gerekli.";
  const excerpt = metin(fd, "excerpt");
  if (excerpt.length < 10) h.excerpt = "Özet gerekli (listede ve paylaşımda görünür).";
  const date = metin(fd, "date");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) h.date = "Tarih gerekli.";
  const category = metin(fd, "category") as Yazi["category"];
  if (!YAZI_KATEGORILERI.includes(category)) h.category = "Geçerli bir kategori seçin.";
  const body = govdeyiAyristir(metin(fd, "body"));
  if (body.length === 0) h.body = "Yazının gövdesi boş olamaz.";
  const readingMinutes = Math.max(1, Math.round(metin(fd, "body").split(/\s+/).length / 200));
  if (Object.keys(h).length) return { hatalar: h };
  return { deger: { slug, title, excerpt, date, readingMinutes, category, body }, hatalar: {} };
}

export function hizmetDogrula(fd: FormData, mevcutSluglar: string[], eskiSlug?: string): { deger?: Hizmet; hatalar: Hatalar } {
  const h: Hatalar = {};
  const title = metin(fd, "title");
  const slug = metin(fd, "slug") || slugla(title);
  if (!SLUG_DESENI.test(slug)) h.slug = "Adres yalnızca küçük harf, rakam ve tire içerebilir.";
  if (slug !== eskiSlug && mevcutSluglar.includes(slug)) h.slug = "Bu adres başka bir hizmette kullanılıyor.";
  if (title.length < 3) h.title = "Hizmet adı gerekli.";
  const short = metin(fd, "short");
  if (short.length < 10) h.short = "Kısa açıklama gerekli (kartlarda görünür).";
  const description = metin(fd, "description");
  if (description.length < 20) h.description = "Açıklama gerekli (hizmet sayfasında görünür).";
  const icon = metin(fd, "icon");
  if (!(HIZMET_IKONLARI as readonly string[]).includes(icon)) h.icon = "Bir simge seçin.";
  const features = satirlar(metin(fd, "features"));
  if (features.length === 0) h.features = "En az bir özellik yazın.";
  const sorular = satirlar(metin(fd, "faq_q"));
  const cevaplar = satirlar(metin(fd, "faq_a"));
  if (sorular.length !== cevaplar.length) h.faq_a = "Her soruya karşılık bir cevap satırı olmalı.";
  if (Object.keys(h).length) return { hatalar: h };
  return {
    deger: {
      slug, title, short, description, icon, features,
      deliverables: satirlar(metin(fd, "deliverables")),
      faq: sorular.map((q, i) => ({ q, a: cevaplar[i] })),
    },
    hatalar: {},
  };
}

export function siteDogrula(fd: FormData): { deger?: SiteBilgi; hatalar: Hatalar } {
  const h: Hatalar = {};
  const phone = metin(fd, "phone");
  const rakamlar = phone.replace(/\D/g, "");
  if (rakamlar.length < 10) h.phone = "Telefon numarası eksik görünüyor.";
  const whatsapp = metin(fd, "whatsapp").replace(/\D/g, "");
  if (whatsapp && whatsapp.length < 11) h.whatsapp = "Ülke koduyla, boşluksuz yazın: 905XXXXXXXXX";
  const email = metin(fd, "email");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) h.email = "Geçerli bir e-posta girin.";
  const etiketler = satirlar(metin(fd, "stats_label"));
  const degerler = satirlar(metin(fd, "stats_value"));
  if (etiketler.length !== degerler.length) h.stats_value = "Her istatistik için bir değer ve bir etiket satırı olmalı.";
  if (Object.keys(h).length) return { hatalar: h };
  const ulusal = rakamlar.startsWith("90") ? rakamlar.slice(2) : rakamlar.replace(/^0/, "");
  return {
    deger: {
      phone,
      phoneHref: `tel:+90${ulusal}`,
      whatsapp: whatsapp || `90${ulusal}`,
      email,
      city: metin(fd, "city"),
      country: metin(fd, "country") || "Türkiye",
      address: metin(fd, "address"),
      social: {
        linkedin: metin(fd, "linkedin"),
        github: metin(fd, "github"),
        instagram: metin(fd, "instagram"),
      },
      stats: degerler.map((value, i) => ({ value, label: etiketler[i] })),
    },
    hatalar: {},
  };
}

export function musteriSitesiDogrula(fd: FormData, mevcutIdler: string[], eskiId?: string): { deger?: MusteriSitesi; hatalar: Hatalar } {
  const h: Hatalar = {};
  const ad = metin(fd, "ad");
  if (ad.length < 2) h.ad = "Site adı gerekli.";
  const adres = metin(fd, "adres");
  if (!/^https?:\/\/[^\s]+$/.test(adres)) h.adres = "Adres https:// ile başlamalı.";
  const barindirma = metin(fd, "barindirma") as MusteriSitesi["barindirma"];
  if (!BARINDIRMALAR.includes(barindirma)) h.barindirma = "Barındırma seçin.";
  const yenilemeTarihi = metin(fd, "yenilemeTarihi");
  if (yenilemeTarihi && !/^\d{4}-\d{2}-\d{2}$/.test(yenilemeTarihi)) h.yenilemeTarihi = "Tarih biçimi: YYYY-AA-GG";
  const id = eskiId ?? (() => {
    const taban = slugla(ad) || "site";
    let aday = taban;
    for (let i = 2; mevcutIdler.includes(aday); i++) aday = `${taban}-${i}`;
    return aday;
  })();
  if (Object.keys(h).length) return { hatalar: h };
  return {
    deger: {
      id, ad, musteri: metin(fd, "musteri"), adres, barindirma, yenilemeTarihi,
      notlar: metin(fd, "notlar"),
      aktif: fd.get("aktif") !== "off",
    },
    hatalar: {},
  };
}
