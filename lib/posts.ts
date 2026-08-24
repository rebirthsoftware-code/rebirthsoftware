export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // YYYY-MM-DD
  readingMinutes: number;
  category: "Web Tasarım" | "SEO" | "Yazılım" | "İşletme";
  /** Paragraf ve alt başlıklardan oluşan gövde */
  body: ({ h?: string; p?: string; list?: string[] })[];
};

/**
 * Blog yazıları. Yeni yazı eklemek için diziye bir nesne ekleyin;
 * liste, detay sayfası, site haritası ve RSS otomatik güncellenir.
 */
export const posts: Post[] = [
  {
    slug: "kurumsal-web-sitesi-fiyatlari-2026",
    title: "Kurumsal web sitesi fiyatları neye göre değişir?",
    excerpt:
      "Aynı işi iki firma neden çok farklı fiyatlandırır? Teklifin içinde gerçekte ne olduğunu kalem kalem açıklıyoruz.",
    date: "2026-08-10",
    readingMinutes: 6,
    category: "İşletme",
    body: [
      {
        p: "Web sitesi teklifi alan hemen herkes aynı şaşkınlığı yaşar: aynı işi anlattığınız iki firmadan biri 15.000 TL, diğeri 90.000 TL der. İkisi de yalan söylemiyor olabilir — çünkü teklifin içindeki iş aynı değildir.",
      },
      {
        h: "Fiyatı belirleyen dört kalem",
        list: [
          "Tasarım: hazır tema kurulumu mu, sıfırdan tasarım mı?",
          "Sayfa ve modül sayısı: 5 sayfalık tanıtım mı, 40 sayfalık katalog mu?",
          "Yönetim paneli: içerikleri kendiniz güncelleyecek misiniz?",
          "Teslim sonrası: bakım, güncelleme ve destek dahil mi?",
        ],
      },
      {
        h: "Ucuz teklifin gizli maliyeti",
        p: "Hazır tema kurulumları başlangıçta ucuzdur. Fatura sonradan gelir: sayfa yavaş açılır, mobilde bozulur, eklenti güncellemeleri siteyi kırar ve bir noktada 'baştan yapalım' noktasına gelinir. İki yılda ödediğiniz toplam, en baştan doğru yapılmış bir sitenin maliyetini geçer.",
      },
      {
        h: "Teklifte aramanız gereken maddeler",
        list: [
          "Sabit fiyat mı, saatlik mi? Kapsam dışı işler nasıl fiyatlanıyor?",
          "Kaç revizyon hakkınız var, hangi aşamada?",
          "Alan adı ve hosting kimin adına kayıtlı olacak?",
          "Kaynak kod size devrediliyor mu?",
          "Teslim sonrası ilk ay düzeltmeleri ücretsiz mi?",
        ],
      },
      {
        p: "Doğru soru 'en ucuz kim?' değil, 'bu para karşılığında iki yıl sonra elimde ne olacak?' sorusudur.",
      },
    ],
  },
  {
    slug: "site-hizi-neden-onemli",
    title: "Site hızı sadece teknik bir detay değil, doğrudan satış meselesi",
    excerpt:
      "Açılması bir saniye uzayan sayfa ziyaretçi kaybettirir. Hızın Google sıralamasına ve dönüşüme etkisini ölçülebilir şekilde anlatıyoruz.",
    date: "2026-07-22",
    readingMinutes: 5,
    category: "SEO",
    body: [
      {
        p: "Ziyaretçi sitenize girdiğinde ilk kararını saniyeler içinde verir. Sayfa geç açılıyorsa içeriğin ne kadar iyi olduğunun bir önemi kalmaz — kimse görmez.",
      },
      {
        h: "Google hızı doğrudan ölçüyor",
        p: "Core Web Vitals adı verilen üç ölçüt (en büyük içeriğin yüklenme süresi, etkileşime hazır olma ve düzen kayması) arama sıralamasında sinyal olarak kullanılıyor. Rakibinizle içerik kalitesi başa başsa, hız farkı sıralamayı belirler.",
      },
      {
        h: "Siteyi yavaşlatan tipik nedenler",
        list: [
          "Optimize edilmemiş, sayfa boyutunu kat kat büyüten görseller",
          "Aynı işi yapan üst üste binmiş eklentiler",
          "Her sayfada yüklenen ama sadece bir sayfada kullanılan kütüphaneler",
          "Yavaş veya uzak sunucu",
          "Yazı tiplerinin geç yüklenmesi ve metnin gecikmeli görünmesi",
        ],
      },
      {
        h: "Nereden başlamalı?",
        p: "Önce ölçün. PageSpeed Insights ücretsizdir ve size somut bir liste verir. Görsel optimizasyonu ve gereksiz kod temizliği çoğu sitede tek başına belirgin fark yaratır; altyapı değişikliği çoğu zaman son adımdır.",
      },
    ],
  },
  {
    slug: "hazir-tema-mi-ozel-kod-mu",
    title: "Hazır tema mı, sıfırdan kodlanan site mi?",
    excerpt:
      "İkisinin de doğru olduğu durumlar var. Hangisinin size uyduğunu bütçe, süre ve büyüme planınıza göre nasıl seçersiniz?",
    date: "2026-06-30",
    readingMinutes: 7,
    category: "Web Tasarım",
    body: [
      {
        p: "Bu soruya 'her zaman özel kod' diye cevap veren yazılımcıya da, 'hazır tema yeter' diyen satışçıya da temkinli yaklaşın. Doğru cevap projeye göre değişir.",
      },
      {
        h: "Hazır tema ne zaman mantıklı?",
        list: [
          "Bütçe çok kısıtlı ve hemen yayında olmanız gerekiyorsa",
          "Site tek seferlik bir tanıtım amacı taşıyorsa",
          "İçerik yapınız standart bir kalıba gerçekten uyuyorsa",
        ],
      },
      {
        h: "Sıfırdan kodlamak ne zaman kazandırır?",
        list: [
          "Sitenin hızı ve arama sıralaması işiniz için kritikse",
          "Standart kalıba sığmayan bir içerik veya süreç yapınız varsa",
          "Site zamanla büyüyecek, yeni modüller eklenecekse",
          "Marka görünümünüzün ayırt edici olması gerekiyorsa",
        ],
      },
      {
        h: "Asıl fark: iki yıl sonrası",
        p: "Hazır temada her eklenti güncellemesi bir risktir; bir gün bir güncelleme siteyi bozar ve düzeltecek kişi bulmakta zorlanırsınız. Sıfırdan yazılmış bir sitede yalnızca ihtiyacınız olan kod bulunur, dolayısıyla bakımı öngörülebilirdir.",
      },
      {
        p: "Karar verirken şu soruyu sorun: bu site iki yıl sonra da güncellenebilir olacak mı, yoksa baştan mı yapılacak?",
      },
    ],
  },
  {
    slug: "kisiye-ozel-yazilim-ne-zaman-gerekir",
    title: "Hazır program yetmediğinde: kişiye özel yazılım ne zaman gerekir?",
    excerpt:
      "Excel'e ve WhatsApp'a sığmayan süreçler için özel yazılımın gerçekten kazandırdığı noktalar ve nereden başlanması gerektiği.",
    date: "2026-05-18",
    readingMinutes: 6,
    category: "Yazılım",
    body: [
      {
        p: "Çoğu işletme özel yazılıma, bir sabah 'artık böyle olmuyor' diyerek karar verir. Genellikle o noktada süreç zaten Excel dosyaları, WhatsApp grupları ve bir deftere dağılmış durumdadır.",
      },
      {
        h: "Bu belirtiler varsa vakit gelmiştir",
        list: [
          "Aynı bilgiyi iki farklı yere elle giriyorsanız",
          "'Bu iş kimde?' sorusunun cevabını aramak dakikalar sürüyorsa",
          "Aylık raporu hazırlamak günler alıyorsa",
          "Hata yapıldığında bunu ancak müşteri şikayet edince fark ediyorsanız",
          "Hazır programın %30'unu kullanıp kalanına para ödüyorsanız",
        ],
      },
      {
        h: "Her şeyi birden yaptırmayın",
        p: "En sık yapılan hata, ilk aşamada devasa bir kapsam belirlemektir. Önce işinizi gerçekten yavaşlatan tek süreci yazılıma taşıyın, kullanın, sonra genişletin. Böylece hem bütçe kazanç sağladıkça ilerler hem de gerçekten ihtiyaç duyduğunuz özellikler ortaya çıkar.",
      },
      {
        h: "Sormanız gereken üç soru",
        list: [
          "Kaynak kod ve veriler bana devredilecek mi?",
          "Yarın başka bir ekiple devam edebilir miyim?",
          "Yedekleme ve güvenlik nasıl yönetiliyor?",
        ],
      },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const sortedPosts = [...posts].sort((a, b) =>
  b.date.localeCompare(a.date)
);

export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
