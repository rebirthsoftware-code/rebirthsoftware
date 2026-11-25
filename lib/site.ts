import siteJson from "@/content/site.json";

/**
 * Sitenin tek kaynaklı ayar dosyası.
 *
 * Telefon, e-posta, adres, sosyal medya ve istatistikler artık
 * `content/site.json` dosyasında durur ve yönetim panelinden düzenlenebilir.
 * Buradaki alanlar (ad, URL, başlık, açıklama, slogan, kuruluş yılı) ise
 * kodla birlikte yaşar; SADECE burada güncelle.
 */
export const site = {
  name: "Rebirth Software",
  shortName: "Rebirth",
  // Vercel'de NEXT_PUBLIC_SITE_URL ortam değişkenini kendi alan adınla ayarla.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rebirthsoftware.com",
  title: "Rebirth Software | Kurumsal Web Sitesi ve Kişiye Özel Yazılım",
  description:
    "Kurumsal web siteleri ve kişiye özel web yazılımları geliştiriyoruz. Hazır tema değil, sıfırdan kodlanan, hızlı ve SEO uyumlu projeler.",
  slogan: "Fikrinizi çalışan bir yazılıma dönüştürüyoruz.",
  founded: 2019,

  // --- İLETİŞİM, SOSYAL MEDYA ve İSTATİSTİKLER: content/site.json ---
  // phone, phoneHref, whatsapp (ülke kodu + numara, boşluksuz), email,
  // city, country, address, social { linkedin, github, instagram },
  // stats [{ value, label }]
  ...siteJson,
} as const;

export const whatsappLink = (message?: string) =>
  `https://wa.me/${site.whatsapp}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;
