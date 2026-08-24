export type Project = {
  slug: string;
  title: string;
  client: string;
  sector: string;
  year: string;
  type: "Kurumsal Web Sitesi" | "Kişiye Özel Yazılım" | "Web Tasarım";
  summary: string;
  challenge: string;
  solution: string;
  result: string[];
  stack: string[];
  url?: string;
  /** Görsel: /public/projeler klasörüne ekle, örn "/projeler/ornek.jpg" */
  image?: string;
  /** İsteğe bağlı: görsel yokken kart arka planına degrade uygular.
   *  Boş bırakılırsa nötr koyu bir yer tutucu kullanılır (önerilen). */
  gradient?: [string, string];
  featured?: boolean;
};

/**
 * ⚠️ ÖRNEK VERİDİR.
 * Buradaki kayıtları kendi gerçek referanslarınla değiştir.
 * Her proje için ekran görüntüsünü /public/projeler/ içine koyup
 * `image` alanına yolunu yaz. Görsel yoksa degrade arka plan kullanılır.
 */
export const projects: Project[] = [
  {
    slug: "atlas-muhendislik",
    title: "Atlas Mühendislik Kurumsal Sitesi",
    client: "Atlas Mühendislik",
    sector: "Endüstriyel üretim",
    year: "2025",
    type: "Kurumsal Web Sitesi",
    summary:
      "Ürün kataloğu ağır olan bir mühendislik firması için çok dilli kurumsal site.",
    challenge:
      "Firmanın 200'ün üzerinde ürünü tek bir PDF kataloğunda duruyordu; yurt dışından gelen talepler telefonla takip ediliyor, hangi ürünün ilgi gördüğü ölçülemiyordu.",
    solution:
      "Ürünleri kategorilere ayıran filtrelenebilir bir katalog yapısı kurduk. Her ürün sayfasına doğrudan teklif formu ekledik, formlar hem e-postaya hem panele düşecek şekilde kurgulandı. Site Türkçe ve İngilizce olarak yayına alındı.",
    result: [
      "Teklif formu üzerinden gelen talep sayısı ilk 3 ayda 4 katına çıktı",
      "Mobil PageSpeed skoru 62'den 97'ye yükseldi",
      "İngilizce sayfalar üzerinden ilk yurt dışı siparişi alındı",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    featured: true,
  },
  {
    slug: "meridyen-hukuk",
    title: "Meridyen Hukuk Bürosu",
    client: "Meridyen Hukuk",
    sector: "Hukuk",
    year: "2025",
    type: "Kurumsal Web Sitesi",
    summary:
      "Güven veren, sade ve içerik odaklı bir hukuk bürosu web sitesi.",
    challenge:
      "Büronun dijitalde hiçbir görünürlüğü yoktu; potansiyel müvekkiller yalnızca tavsiye yoluyla ulaşıyordu.",
    solution:
      "Uzmanlık alanlarını anlatan sayfalar ve düzenli yayınlanabilen bir makale bölümü kurduk. Teknik SEO altyapısıyla şehir + uzmanlık alanı aramalarında görünürlük hedeflendi.",
    result: [
      "Yayından 5 ay sonra organik aramadan ayda 900+ ziyaretçi",
      "Randevu formu üzerinden düzenli ilk görüşme talepleri",
    ],
    stack: ["Next.js", "MDX Blog", "Tailwind CSS"],
    featured: true,
  },
  {
    slug: "servis-takip-paneli",
    title: "Teknik Servis Takip Paneli",
    client: "Beyaz eşya teknik servisi",
    sector: "Servis & bakım",
    year: "2024",
    type: "Kişiye Özel Yazılım",
    summary:
      "Servis kaydından teslimata kadar tüm süreci tek panelden yöneten özel yazılım.",
    challenge:
      "Servis kayıtları deftere ve WhatsApp mesajlarına dağılmıştı. Hangi cihazın hangi teknisyende olduğu, parça maliyetinin ne olduğu takip edilemiyordu.",
    solution:
      "Cihaz kabulünden teslimata kadar her adımı durum akışına bağlayan bir panel geliştirdik. Teknisyen yetkileri ayrıldı, müşteriye otomatik SMS bilgilendirmesi ve aylık ciro/parça raporu eklendi.",
    result: [
      "Kayıp servis kaydı sıfıra indi",
      "Ortalama teslim süresi 6 günden 3,5 güne düştü",
      "Aylık raporlama işi 2 günden 5 dakikaya indi",
    ],
    stack: ["Next.js", "PostgreSQL", "Prisma", "Rol bazlı yetkilendirme"],
    featured: true,
  },
  {
    slug: "nova-klinik-randevu",
    title: "Nova Klinik Randevu Sistemi",
    client: "Nova Klinik",
    sector: "Sağlık",
    year: "2024",
    type: "Kişiye Özel Yazılım",
    summary:
      "Online randevu alma ve doktor takvimi yönetimi için web tabanlı sistem.",
    challenge:
      "Randevular telefonla alınıyor, yoğun saatlerde aramalar cevapsız kalıyordu. Doktor takvimleri çakışıyordu.",
    solution:
      "Hastanın uygun saatleri görüp kendi randevusunu oluşturabildiği bir sistem kurduk. Doktor bazlı takvim, izin günleri ve otomatik hatırlatma e-postası eklendi.",
    result: [
      "Randevuların %60'ı artık online alınıyor",
      "Gelmeyen hasta oranı hatırlatmalarla belirgin şekilde azaldı",
    ],
    stack: ["Next.js", "PostgreSQL", "E-posta bildirimleri"],
  },
  {
    slug: "kuzey-insaat",
    title: "Kuzey İnşaat Proje Vitrini",
    client: "Kuzey İnşaat",
    sector: "İnşaat & gayrimenkul",
    year: "2024",
    type: "Kurumsal Web Sitesi",
    summary:
      "Tamamlanan ve devam eden projeleri görsel ağırlıklı sunan kurumsal site.",
    challenge:
      "Firma projelerini yalnızca sosyal medyada paylaşıyordu; kurumsal bir vitrin ve satış öncesi bilgi kaynağı yoktu.",
    solution:
      "Her proje için galeri, kat planı ve konum bilgisi içeren detay sayfaları oluşturduk. Ziyaretçinin ilgilendiği projeden doğrudan iletişime geçebildiği bir akış kurgulandı.",
    result: [
      "Satış ekibine gelen taleplerin kaynağı ilk kez ölçülebilir hale geldi",
      "Proje sayfaları üzerinden düzenli iletişim formu girişi",
    ],
    stack: ["Next.js", "Tailwind CSS", "Görsel optimizasyonu"],
  },
  {
    slug: "form-tasarim-yenileme",
    title: "Form Reklam Ajansı Arayüz Yenileme",
    client: "Form Reklam",
    sector: "Reklam & tanıtım",
    year: "2023",
    type: "Web Tasarım",
    summary:
      "Mevcut sitenin altyapısı korunarak baştan sona arayüz yenilemesi.",
    challenge:
      "Site içeriği yeterliydi ancak tasarım dili eskimişti ve mobilde okunmuyordu.",
    solution:
      "İçerik yapısını koruyup tipografi, renk ve bileşen sistemini yeniden kurduk. Mobil öncelikli bir düzene geçildi.",
    result: [
      "Mobil hemen çıkma oranı belirgin şekilde geriledi",
      "Sayfada kalma süresi arttı",
    ],
    stack: ["UI/UX", "Tasarım sistemi", "Responsive düzen"],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
export const projectTypes = Array.from(new Set(projects.map((p) => p.type)));
