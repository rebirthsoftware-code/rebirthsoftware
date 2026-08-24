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
  /** Görsel: /public/projeler klasörüne ekle, örn "/projeler/ornek.webp" */
  image?: string;
  /** İsteğe bağlı: görsel yokken kart arka planına degrade uygular.
   *  Boş bırakılırsa nötr koyu bir yer tutucu kullanılır (önerilen). */
  gradient?: [string, string];
  featured?: boolean;
};

/**
 * Gerçek referans projeler.
 *
 * NOT — `result` alanı: buradaki maddeler siteye bakılarak yazılmış,
 * doğrulanabilir çıktılardır. Elinizde gerçek ölçüm varsa (ziyaretçi artışı,
 * randevu sayısı, PageSpeed skoru) bunları o rakamlarla değiştirin —
 * ölçülebilir sonuç, özellik listesinden çok daha ikna edicidir.
 */
export const projects: Project[] = [
  {
    slug: "endamsince-1979",
    title: "Endamsince 1979 Kurumsal Sitesi",
    client: "Endamsince Erkek Kuaför",
    sector: "Erkek kuaför & bakım",
    year: "2026",
    type: "Kurumsal Web Sitesi",
    url: "https://endamsince1979.com",
    image: "/projeler/endamsince-1979.webp",
    featured: true,
    summary:
      "1979'dan beri Zonguldak'ta hizmet veren, üç farklı konseptte şubesi olan köklü bir erkek kuaförü için kurumsal tanıtım ve randevu sitesi.",
    challenge:
      "45 yıllık bir markanın dijitalde hiçbir karşılığı yoktu. Plus, Urban ve Junior olmak üzere üç ayrı konseptteki şube tek bir çatı altında anlatılamıyor; hizmet içerikleri, fiyatlar ve randevu talepleri tamamen telefon üzerinden yürütülüyordu.",
    solution:
      "Markanın kıdemini ve butik duruşunu öne çıkaran koyu, editoryal bir tasarım dili kurduk. Hizmet ve fiyat listesi, galeri, ürünler ve ekip bölümlerini tek akışta topladık; üç şube kendi kimliğiyle tanıtılırken ziyaretçi her bölümden tek adımda randevu talebine geçebiliyor. Site Next.js ile sıfırdan kodlandı ve telefona uygulama gibi eklenebilmesi için PWA olarak yapılandırıldı.",
    result: [
      "Üç şube, hizmet listesi ve güncel fiyatlarıyla tek adreste toplandı",
      "Randevu talebi her bölümden tek tıkla ulaşılabilir hale geldi",
      "Ekip, galeri ve ürünler bölümleriyle marka dijitalde ilk kez eksiksiz temsil ediliyor",
    ],
    stack: ["Next.js", "React", "PWA", "Randevu akışı"],
  },
  {
    slug: "yusuferoglu-hair-art-vip",
    title: "Yusuferoğlu Hair Art VIP",
    client: "Yusuferoğlu Hair Art VIP",
    sector: "Premium erkek kuaför",
    year: "2026",
    type: "Kurumsal Web Sitesi",
    url: "https://yusuferogluhairartvip.com",
    image: "/projeler/yusuferoglu-hair-art-vip.webp",
    featured: true,
    summary:
      "Karabük'te premium segmentte çalışan bir erkek kuaförü için, VIP konumlandırmasını görsel dile taşıyan kurumsal site.",
    challenge:
      "İşletme premium bir hizmet veriyordu ancak dijitalde bunu anlatan bir yüzü yoktu. Fiyat aralığı ve hizmet kapsamı görünmediği için gelen talepler nitelik olarak dağınıktı.",
    solution:
      "Siyah–altın kontrastı üzerine kurulu, markanın VIP konumlandırmasını ilk saniyede aktaran bir tasarım hazırladık. Hizmetler fiyatlarıyla birlikte açıkça listelendi; galeri, ürünler ve ekip bölümleri eklendi. Randevu çağrısı sayfanın her noktasından erişilebilir konumda tutuldu.",
    result: [
      "Hizmet kapsamı ve fiyatlar site üzerinden şeffaf şekilde görünüyor",
      "Premium konumlandırma görsel dile taşındı; gelen talepler doğru segmentten geliyor",
      "Galeri ve ekip bölümleriyle işletme, ziyaretçiye gelmeden önce güven veriyor",
    ],
    stack: ["Next.js", "React", "PWA", "Randevu akışı"],
  },
  {
    slug: "pastalia-bostanli",
    title: "Pastalia Bostanlı",
    client: "Pastalia",
    sector: "Restoran & yeme-içme",
    year: "2026",
    type: "Kurumsal Web Sitesi",
    url: "https://pastaliabostanli.com",
    image: "/projeler/pastalia-bostanli.webp",
    featured: true,
    summary:
      "İzmir Bostanlı'daki İtalyan sokak lezzetleri mekânı için görsel ağırlıklı, menü odaklı tanıtım sitesi.",
    challenge:
      "Mekânın menüsü yalnızca sosyal medyada ve masadaki basılı listede vardı. Gelmeden önce ne yediğini görmek isteyen ziyaretçi için tek kaynak yoktu; konum ve iletişim bilgileri de dağınıktı.",
    solution:
      "Yemek fotoğraflarını merkeze alan, açılışta mekânı tanıtan görsel bir akış kurduk. Menü kategorilere ayrılarak site üzerinden gezilebilir hale getirildi; işletmenin hikâyesi, konumu ve iletişim kanalları tek sayfada toplandı. Site Astro ile kodlandığı için görsel yoğunluğuna rağmen hızlı açılıyor.",
    result: [
      "Menünün tamamı, kategorileriyle birlikte site üzerinden görülebiliyor",
      "Konum, telefon ve sosyal medya tek noktada toplandı",
      "Görsel ağırlıklı bir sayfa olmasına rağmen statik üretimle hızlı açılıyor",
    ],
    stack: ["Astro", "Statik üretim", "Görsel optimizasyonu", "Google Maps"],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
export const projectTypes = Array.from(new Set(projects.map((p) => p.type)));
