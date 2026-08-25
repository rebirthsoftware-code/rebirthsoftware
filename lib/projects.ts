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
    slug: "tugce-ayag-esin-hukuk",
    title: "Av. Tuğçe Ayağ Esin Hukuk Bürosu",
    client: "Av. Tuğçe Ayağ Esin",
    sector: "Hukuk & arabuluculuk",
    year: "2026",
    type: "Kurumsal Web Sitesi",
    url: "https://www.tugceayagesin.com",
    image: "/projeler/tugce-ayag-esin.webp",
    featured: true,
    summary:
      "Karabük'te ceza, aile, ticaret ve gayrimenkul hukuku alanlarında çalışan bir hukuk bürosu için güven veren kurumsal site.",
    challenge:
      "Büroya ulaşan potansiyel müvekkiller yalnızca tavsiye yoluyla geliyordu. Uzmanlık alanlarının kapsamı dijitalde görünmediği için gelen talepler büronun çalışmadığı konuları da kapsıyor, ön eleme telefonda yapılıyordu.",
    solution:
      "Mesleğin ciddiyetine uygun, koyu zemin üzerine altın vurgulu bir görsel dil kurduk. On üçün üzerindeki uzmanlık alanı ayrı ayrı anlatıldı; hukuki konuları sade dille açıklayan bir makaleler bölümü eklendi. Randevu ve WhatsApp çağrıları sayfanın her noktasından erişilebilir tutuldu.",
    result: [
      "Uzmanlık alanları site üzerinden açıkça görülüyor; gelen talepler doğru konularda yoğunlaşıyor",
      "Makaleler bölümü, arama motorlarından gelen ziyaretçiler için giriş noktası oluşturuyor",
      "Randevu talebi ve WhatsApp her bölümden tek adımda ulaşılabilir",
    ],
    stack: ["Statik site", "Scroll animasyonları (AOS)", "Randevu formu", "WhatsApp"],
  },
  {
    slug: "alicilar-sigorta",
    title: "Alıcılar Sigorta",
    client: "Alıcılar Sigorta",
    sector: "Sigorta acenteliği",
    year: "2026",
    type: "Kurumsal Web Sitesi",
    url: "https://alicilarsigorta.com",
    image: "/projeler/alicilar-sigorta.webp",
    featured: true,
    summary:
      "Karabük merkezli SEGEM lisanslı sigorta acentesi için ürünleri anlatan ve teklif talebi toplayan kurumsal site.",
    challenge:
      "Acente trafik, kasko, sağlık, konut ve DASK gibi birbirinden farklı ürünler sunuyordu; ancak müşteri hangi ürünün neyi kapsadığını ancak telefonda öğrenebiliyordu. Teklif talepleri de tek tek telefonla alınıyordu.",
    solution:
      "Her sigorta ürünü için kapsamı anlatan ayrı bir kart ve detay yapısı kurduk. Ziyaretçi ürünü seçip doğrudan teklif formuna geçebiliyor. Sektör haberleri bölümü ve SEGEM lisansı gibi güven unsurları öne çıkarıldı.",
    result: [
      "Yedi sigorta ürünü kapsamlarıyla birlikte site üzerinden inceleniyor",
      "Teklif talepleri form üzerinden, ürün bilgisiyle birlikte geliyor",
      "Lisans ve kurumsal bilgiler görünür olduğu için ilk temasta güven sorusu azalıyor",
    ],
    stack: ["Next.js", "React", "Ürün kataloğu", "Teklif formu"],
  },
  {
    slug: "alicilar-beton",
    title: "Alıcılar Beton",
    client: "Alıcılar Grup",
    sector: "İnşaat & endüstri",
    year: "2026",
    type: "Kurumsal Web Sitesi",
    url: "https://www.alicilarbeton.com",
    image: "/projeler/alicilar-beton.webp",
    summary:
      "Hazır betondan madenciliğe, hafriyattan ağır tonajlı lojistiğe uzanan bir sanayi grubu için kurumsal tanıtım sitesi.",
    challenge:
      "Grup, 1930'lara uzanan geçmişine ve birbirinden farklı yedi faaliyet alanına rağmen dijitalde tek parça bir kimlikle temsil edilmiyordu. Kurumsal müşteriler ve ihale muhatapları için referans niteliğinde bir kaynak yoktu.",
    solution:
      "Sanayinin ağırlığını yansıtan koyu lacivert–kırmızı bir kimlik kurduk. Faaliyet alanları tek tek anlatıldı; galeri ve duyurular bölümleri eklendi. Kaydırmaya bağlı animasyonlar ve yumuşak kaydırma ile sayfa, kurumsal ölçeğe yakışan bir akışta ilerliyor.",
    result: [
      "Yedi faaliyet alanı tek çatı altında, kurumsal bir dille anlatılıyor",
      "Teklif çağrısı ve iki iletişim hattı ilk ekranda görünüyor",
      "Galeri ve duyurular, ihale ve kurumsal görüşmelerde referans olarak kullanılabiliyor",
    ],
    stack: ["GSAP + ScrollTrigger", "Lenis yumuşak kaydırma", "Galeri", "Duyurular"],
  },
  {
    slug: "tat-pastanesi",
    title: "Tat Pastanesi",
    client: "Tat Pastanesi",
    sector: "Pastane & dondurma",
    year: "2026",
    type: "Kurumsal Web Sitesi",
    url: "http://www.tatpastanesi.com",
    image: "/projeler/tat-pastanesi.webp",
    summary:
      "Ankara'da 2001'den beri üç şubesiyle hizmet veren pastane ve dondurmacı için ürün odaklı tanıtım sitesi.",
    challenge:
      "İşletmenin ürünleri yalnızca vitrinde ve sosyal medyada görünüyordu. Batıkent, Bağlıca ve Çakırlar şubelerinin bilgileri dağınıktı; yeni müşteri gelmeden önce ne bulacağını bilmiyordu.",
    solution:
      "Ürün fotoğraflarını merkeze alan, videolu bir açılışla başlayan bir akış kurduk. Dondurma, yaş pasta ve geleneksel tatlılar ayrı ayrı tanıtıldı; işletmenin hikâyesi, şube bilgileri ve Google değerlendirmeleri tek sayfada toplandı.",
    result: [
      "Ürün grupları görselleriyle birlikte site üzerinden inceleniyor",
      "Üç şubenin bilgileri tek adreste toplandı",
      "Google yorumları siteye taşındığı için ilk izlenim müşteri deneyimiyle destekleniyor",
    ],
    stack: ["Next.js", "React", "Video hero", "Şube bilgileri"],
  },
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
