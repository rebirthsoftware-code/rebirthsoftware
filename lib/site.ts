/**
 * Sitenin tek kaynaklı ayar dosyası.
 * Telefon, e-posta, adres ve sosyal medya bilgilerini SADECE burada güncelle.
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

  // --- İLETİŞİM: kendi bilgilerinle değiştir ---
  phone: "+90 555 000 00 00",
  phoneHref: "tel:+905550000000",
  whatsapp: "905550000000", // ülke kodu + numara, boşluksuz
  email: "info@rebirthsoftware.com",
  city: "İstanbul",
  country: "Türkiye",
  address: "İstanbul, Türkiye",

  social: {
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/rebirthsoftware-code",
    instagram: "https://www.instagram.com/",
  },

  stats: [
    { value: "7", label: "Yayındaki referans" }, // TODO: gerçek proje sayınızla güncelleyin
    { value: "6+", label: "Yıllık deneyim" },
    { value: "%98", label: "Ortalama PageSpeed skoru" },
    { value: "2 gün", label: "Kurumsal sitede teslim" },
  ],
} as const;

export const whatsappLink = (message?: string) =>
  `https://wa.me/${site.whatsapp}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;
