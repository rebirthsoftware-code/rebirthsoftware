export const processSteps = [
  {
    step: "01",
    icon: "search",
    title: "Keşif ve analiz",
    duration: "Aynı gün görüşme",
    text: "Kısa bir görüşmeyle işinizi, hedef kitlenizi ve beklentinizi dinliyoruz. Rakiplerinize bakıyor, sitenin hangi işi yapması gerektiğini netleştiriyoruz. Görüşmeyi aynı gün yapıyoruz; teklif en geç 1 iş günü içinde elinizde oluyor.",
    output: "Kapsam özeti, sayfa listesi ve net bir fiyat teklifi",
  },
  {
    step: "02",
    icon: "palette",
    title: "Tasarım",
    duration: "1. gün",
    text: "Sayfa akışını ve görsel tasarımı ilk gün çıkarıyoruz. Onayınızı almadan kodlamaya geçmiyoruz; revizyonlar bu aşamada, aynı gün içinde yapılır.",
    output: "Onaylı tasarım dosyaları ve tıklanabilir önizleme",
  },
  {
    step: "03",
    icon: "code",
    title: "Geliştirme",
    duration: "1. - 2. gün",
    text: "Tasarımı hazır tema kullanmadan sıfırdan kodluyoruz. Mobil uyum, hız ve teknik SEO en baştan kuruluyor. İlerlemeyi canlı test bağlantısından saat saat takip ediyorsunuz.",
    output: "Test ortamında çalışan, incelemeye hazır site",
  },
  {
    step: "04",
    icon: "rocket",
    title: "Yayın ve destek",
    duration: "2. gün",
    text: "Alan adı, SSL ve hosting kurulumunu yapıp siteyi yayına alıyoruz. Yönetim paneli eğitimini veriyor, sonrasında bakım ve destekle yanınızda kalıyoruz.",
    output: "Yayındaki site, panel eğitimi ve destek hattı",
  },
] as const;

export const advantages = [
  {
    icon: "layers",
    title: "Hazır tema değil, size özel kod",
    text: "Şablon kurulumu yapmıyoruz. Her proje sıfırdan yazılır; gereksiz eklenti yükü olmadığı için site hem hızlı hem güvenli çalışır.",
  },
  {
    icon: "bolt",
    title: "2 günde teslim",
    text: "Kurumsal siteyi iki günde yayına alıyoruz. Hız sadece takvimde değil sitede de geçerli: projeleri PageSpeed skorunu ölçerek teslim ediyoruz.",
  },
  {
    icon: "users",
    title: "Muhatabınız tek kişi",
    text: "Aracı yok. Projeyi kim yapıyorsa onunla konuşuyorsunuz; talepler kaybolmuyor, dönüşler hızlı oluyor.",
  },
  {
    icon: "lock",
    title: "Kod ve hesaplar sizin",
    text: "Alan adı, hosting ve kaynak kodu size ait olur. Bize bağlı kalmak zorunda değilsiniz — kalıyorsanız memnun olduğunuz içindir.",
  },
  {
    icon: "search",
    title: "İlk günden SEO",
    text: "Site haritası, başlık yapısı, yapılandırılmış veri ve hız ayarları sonradan eklenen bir hizmet değil, teslimin parçası.",
  },
  {
    icon: "wrench",
    title: "Teslimden sonra da yanınızda",
    text: "Yayına aldık, bitti demiyoruz. Güncelleme, içerik değişikliği ve teknik destek için ulaşabileceğiniz bir hattınız oluyor.",
  },
] as const;

export const techStack = [
  { name: "Next.js", note: "Modern React altyapısı" },
  { name: "TypeScript", note: "Hatasız ve bakımı kolay kod" },
  { name: "Tailwind CSS", note: "Tutarlı arayüz sistemi" },
  { name: "PostgreSQL", note: "Güvenilir veritabanı" },
  { name: "Node.js", note: "Sunucu tarafı geliştirme" },
  { name: "Vercel", note: "Küresel, hızlı yayın altyapısı" },
] as const;

export const generalFaq = [
  {
    q: "Bir web sitesi ne kadara mal olur?",
    a: "Fiyat, sayfa sayısı ve ihtiyaç duyulan özelliklere göre değişir. Tanıtım odaklı kurumsal bir site ile yönetim paneli içeren özel bir yazılımın maliyeti aynı olmaz. Görüşme sonrası kalem kalem, sabit fiyatlı bir teklif gönderiyoruz — süreç içinde sürpriz ek ücret çıkmaz.",
  },
  {
    q: "Ne kadar sürede teslim ediyorsunuz?",
    a: "Kurumsal web sitelerini 2 günde teslim ediyoruz: ilk gün tasarım ve geliştirme, ikinci gün son düzenlemeler ve yayın. Bu sürenin tutması için içeriklerin (metin, logo, görsel) başlangıçta hazır olması gerekir; eksik içerik varsa süre bekleme kadar uzar. Kapsamı çok geniş özel yazılım projelerinde takvim proje planında ayrıca netleştirilir.",
  },
  {
    q: "Alan adı ve hosting işlerini de siz mi hallediyorsunuz?",
    a: "Evet. Alan adı alımı, hosting/Vercel kurulumu, SSL sertifikası ve kurumsal e-posta hesaplarının açılması dahil tüm teknik kurulumu biz yapıyoruz. Hesaplar sizin adınıza açılır.",
  },
  {
    q: "Siteyi teslim ettikten sonra içerikleri kendim güncelleyebilir miyim?",
    a: "Evet. Yazı, görsel ve sayfa içeriklerini teknik bilgi gerektirmeden güncelleyebileceğiniz bir panel teslim ediyoruz ve kullanımını gösteriyoruz.",
  },
  {
    q: "Ödeme nasıl yapılıyor?",
    a: "Genellikle proje başlangıcında peşinat, tasarım onayında ara ödeme ve yayın öncesi bakiye şeklinde üç aşamalı ilerliyoruz. Detaylar sözleşmede net olarak yazılır.",
  },
  {
    q: "Mevcut sitem var, sıfırdan mı yapmak gerekiyor?",
    a: "Her zaman değil. Önce mevcut sitenizi teknik olarak inceliyoruz; bazen arayüz yenilemesi ve hız/SEO iyileştirmesi yeterli oluyor. Sıfırdan yapmak gerçekten gerekiyorsa bunu nedenleriyle anlatıyoruz.",
  },
  {
    q: "Sosyal medya yönetimi veya e-ticaret sitesi yapıyor musunuz?",
    a: "Hayır. Odağımız kurumsal web siteleri ve kişiye özel web yazılımları. İyi bildiğimiz işi yapmayı, her işi yapıyor görünmeye tercih ediyoruz.",
  },
] as const;

export const sectors = [
  "Mühendislik",
  "Hukuk",
  "Sağlık",
  "İnşaat & Gayrimenkul",
  "Teknik servis",
  "Eğitim",
  "Danışmanlık",
  "Üretim",
  "Turizm",
  "Muhasebe",
] as const;
