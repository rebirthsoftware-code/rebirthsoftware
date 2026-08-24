export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: string;
  features: string[];
  deliverables: string[];
  faq: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    slug: "kurumsal-web-sitesi",
    title: "Kurumsal Web Sitesi",
    short:
      "Şirketinizi doğru anlatan, hızlı açılan ve Google'da bulunan kurumsal siteler.",
    description:
      "Hazır tema kurulumu yapmıyoruz. Kurumunuzun sektörünü, hedef kitlesini ve rakiplerini inceleyip; içerik yapısını, sayfa akışını ve tasarımı size özel kurguluyoruz. Sonuç: mobilde kusursuz çalışan, saniyeler içinde açılan ve arama motorlarında rakiplerinizin önüne geçen bir kurumsal site.",
    icon: "building",
    features: [
      "Size özel tasarım (hazır tema yok)",
      "Mobil, tablet ve masaüstünde kusursuz görünüm",
      "Teknik SEO altyapısı ve hız optimizasyonu",
      "Kolay kullanılan yönetim paneli",
      "Çok dilli yapı (TR / EN / DE)",
      "Google Analytics ve Search Console kurulumu",
    ],
    deliverables: [
      "Kurumsal tanıtım sayfaları (Hakkımızda, Hizmetler, Referanslar, İletişim)",
      "Blog / haber modülü",
      "İletişim ve teklif formları, harita entegrasyonu",
      "KVKK metinleri ve çerez yönetimi",
    ],
    faq: [
      {
        q: "Kurumsal web sitesi ne kadar sürede teslim edilir?",
        a: "İçerikleriniz hazırsa tipik bir kurumsal site 2-4 hafta içinde yayına alınır. Kapsam büyüdükçe süre proje planında netleştirilir.",
      },
      {
        q: "İçerikleri ve görselleri siz mi hazırlıyorsunuz?",
        a: "Metin taslaklarını ve sayfa kurgusunu birlikte çıkarıyoruz. Görsel/fotoğraf tarafında elinizdeki materyalleri düzenliyor, eksikse stok görsel yönlendirmesi yapıyoruz.",
      },
      {
        q: "Siteyi daha sonra kendim güncelleyebilir miyim?",
        a: "Evet. Teslimde yönetim paneli eğitimi veriyoruz; yazı, görsel ve sayfa içeriklerini teknik bilgi gerektirmeden güncelleyebilirsiniz.",
      },
    ],
  },
  {
    slug: "kisiye-ozel-yazilim",
    title: "Kişiye Özel Yazılım",
    short:
      "İşinizin akışına göre sıfırdan yazılan web tabanlı yazılımlar ve paneller.",
    description:
      "Hazır programlar çoğu zaman işinizin %70'ini karşılar, kalan %30 için siz programa uyum sağlamak zorunda kalırsınız. Biz tersini yapıyoruz: süreçlerinizi dinliyor, sadece size ait iş akışını yazılıma çeviriyoruz. Stok takibinden teklif yönetimine, randevu sisteminden raporlamaya kadar ihtiyacınız neyse onu geliştiriyoruz.",
    icon: "code",
    features: [
      "Süreç analizi ve iş akışı çıkarımı",
      "Kullanıcı rolleri ve yetkilendirme",
      "Raporlama ve dışa aktarma (Excel / PDF)",
      "Mevcut sistemlerinizle entegrasyon (API)",
      "Güvenli altyapı ve otomatik yedekleme",
      "Ölçeklenebilir, büyümeye açık mimari",
    ],
    deliverables: [
      "Analiz dokümanı ve ekran akış planı",
      "Web tabanlı yönetim paneli",
      "Kullanıcı el kitabı ve eğitim oturumu",
      "Kaynak kodun size devri",
    ],
    faq: [
      {
        q: "Özel yazılım pahalı değil mi?",
        a: "Kapsamı ihtiyaca göre bölüyoruz. Önce işinizi gerçekten hızlandıracak çekirdek modülü yayına alıyor, sonrasında adım adım geliştiriyoruz. Böylece bütçe tek seferde değil, kazanç sağladıkça ilerliyor.",
      },
      {
        q: "Yazılımın kaynak kodu bende mi olacak?",
        a: "Evet. Proje tesliminde kaynak kod ve tüm dokümantasyon size devredilir; başka bir ekiple devam etme özgürlüğünüz olur.",
      },
    ],
  },
  {
    slug: "web-tasarim",
    title: "Web Tasarım & Arayüz (UI/UX)",
    short:
      "Marka kimliğinize uygun, ziyaretçiyi müşteriye çeviren arayüz tasarımı.",
    description:
      "Güzel görünen her site satmıyor. Tasarıma ziyaretçinin gözüyle başlıyoruz: hangi bilgiyi ilk saniyede görmeli, nereye tıklamalı, nerede tereddüt ediyor? Arayüzü bu sorulara göre kurguluyor, ardından markanızın rengine ve diline uygun şekilde giydiriyoruz.",
    icon: "palette",
    features: [
      "Kullanıcı akışı ve wireframe çalışması",
      "Marka kimliğine uygun görsel dil",
      "Dönüşüm odaklı sayfa kurgusu",
      "Erişilebilirlik (WCAG) gözetimi",
      "Tasarım sistemi ve bileşen kütüphanesi",
      "Mevcut sitenin arayüz yenilemesi",
    ],
    deliverables: [
      "Wireframe ve tasarım dosyaları",
      "Responsive ekran tasarımları",
      "Tıklanabilir prototip",
      "Renk, tipografi ve bileşen rehberi",
    ],
    faq: [
      {
        q: "Sadece tasarım hizmeti alabilir miyim?",
        a: "Alabilirsiniz. Tasarımı teslim edip kendi ekibinizin kodlamasını sağlayabilir ya da kodlama tarafını da bize bırakabilirsiniz.",
      },
    ],
  },
  {
    slug: "bakim-destek",
    title: "Bakım, Güncelleme & Destek",
    short:
      "Yayına aldığımız iş bitmiş sayılmaz; site ayakta ve güncel kalmalı.",
    description:
      "Yayına alınan bir site zamanla yavaşlar, güvenlik güncellemeleri gecikir, içerikler eskir. Aylık bakım paketiyle sitenizin yedeğini alıyor, güvenlik ve performans güncellemelerini yapıyor, ihtiyaç duyduğunuz içerik değişikliklerini biz üstleniyoruz.",
    icon: "shield",
    features: [
      "Düzenli yedekleme ve geri yükleme",
      "Güvenlik ve altyapı güncellemeleri",
      "Hız / PageSpeed izleme",
      "Kesinti izleme ve uyarı sistemi",
      "Aylık içerik güncelleme desteği",
      "SSL, alan adı ve hosting yönetimi",
    ],
    deliverables: [
      "Aylık durum raporu",
      "Öncelikli destek kanalı (WhatsApp / e-posta)",
      "Yedeklerin ayrı ortamda saklanması",
    ],
    faq: [
      {
        q: "Sitemi siz yapmadınız, yine de bakımını üstlenir misiniz?",
        a: "Evet. Önce ücretsiz bir teknik inceleme yapıp mevcut sitenin durumunu raporluyoruz, ardından uygun bakım planını öneriyoruz.",
      },
    ],
  },
  {
    slug: "seo-hiz-optimizasyonu",
    title: "SEO & Hız Optimizasyonu",
    short:
      "Teknik SEO ve performans iyileştirmesiyle Google'da görünürlük kazanın.",
    description:
      "Site hızının doğrudan sıralamaya ve satın alma kararına etkisi var. Mevcut sitenizi teknik açıdan tarıyor; sayfa hızı, mobil uyum, başlık yapısı, site haritası, yapılandırılmış veri ve dahili link kurgusunu iyileştiriyoruz. Reklam bütçesi harcamadan organik trafiğinizi artırmayı hedefliyoruz.",
    icon: "chart",
    features: [
      "Teknik SEO denetimi ve yol haritası",
      "Core Web Vitals iyileştirmesi",
      "Sayfa başlıkları, meta ve schema.org düzenlemesi",
      "Site haritası ve robots yapılandırması",
      "Anahtar kelime ve rakip analizi",
      "Search Console hata takibi",
    ],
    deliverables: [
      "Detaylı denetim raporu",
      "Öncelik sıralı aksiyon listesi",
      "Uygulama sonrası öncesi/sonrası karşılaştırma",
    ],
    faq: [
      {
        q: "SEO çalışmasının sonucu ne zaman görülür?",
        a: "Teknik iyileştirmelerin etkisi genellikle 4-8 hafta içinde ölçülmeye başlar. Rekabetin yüksek olduğu kelimelerde süre uzayabilir; bu yüzden gerçekçi bir yol haritası paylaşıyoruz.",
      },
    ],
  },
  {
    slug: "alan-adi-hosting",
    title: "Alan Adı, Hosting & Kurumsal E-Posta",
    short:
      "Teknik işleri siz düşünmeyin: alan adı, sunucu ve e-posta kurulumu bizde.",
    description:
      "Alan adı alımından SSL sertifikasına, hızlı hosting seçiminden şirket uzantılı kurumsal e-posta hesaplarının kurulumuna kadar teknik altyapıyı biz yönetiyoruz. Siz işinize odaklanın.",
    icon: "server",
    features: [
      "Alan adı alımı ve yönlendirme (DNS)",
      "Yüksek hızlı hosting / Vercel dağıtımı",
      "Ücretsiz SSL sertifikası",
      "Şirket uzantılı kurumsal e-posta",
      "E-posta istemcisi kurulum desteği",
      "Taşıma (migration) işlemleri",
    ],
    deliverables: [
      "Kurulu ve çalışır altyapı",
      "Erişim bilgilerinin güvenli devri",
      "Yenileme takvimi hatırlatması",
    ],
    faq: [
      {
        q: "Mevcut sitemi başka firmadan size taşıyabilir miyim?",
        a: "Evet. Alan adı, e-posta ve site içeriğinin taşınmasını kesintisiz şekilde biz yürütüyoruz.",
      },
    ],
  },
];

export const getService = (slug: string) =>
  services.find((s) => s.slug === slug);
