# Rebirth Software — Kurumsal Web Sitesi + Yönetim Paneli

Bu depoda iki ayrı uygulama var:

| Klasör | Ne | Nerede yayınlanır |
|--------|----|-------------------|
| `/` (kök) | Kurumsal tanıtım sitesi; telefona "ana ekrana ekle" ile uygulama gibi kurulabilir | GitHub Pages (`rebirthsoftware-code.github.io/rebirthsoftware`) veya Vercel |
| `admin/` | **Yönetim paneli**: site içeriği, teklif talepleri, müşteri siteleri (bkz. bölüm 8) | Vercel, ayrı proje, ayrı adres (ör. `yonetim.rebirthsoftware.com`) |

Site içeriği (projeler, yazılar, hizmetler, iletişim) `content/*.json`
dosyalarında durur; panel bu dosyaları GitHub üzerinden düzenler, site
otomatik yeniden yayınlanır.

**Teknolojiler:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Vercel
**Kalite:** ESLint · TypeScript kontrolü · Playwright (sayfa, erişilebilirlik, form, bağlantı testleri)

---

## 1. Hızlı başlangıç

```bash
npm install
cp .env.example .env.local   # değerleri kendinize göre düzenleyin
npm run dev                  # http://localhost:3000
```

Yayına almadan önce her şeyi tek komutla kontrol edin:

```bash
npm run check     # lint + tip kontrolü + derleme + testler
```

Tek tek çalıştırmak isterseniz:

```bash
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run build      # üretim derlemesi
npm run test       # Playwright testleri (derleme yapılmış olmalı)
npm run gorsel     # proje görsellerinin küçük varyantlarını ve logoyu üretir
```

### Testler ne kontrol ediyor?

| Test | Kapsam |
|------|--------|
| Sayfa testleri | 14 rota 200 dönüyor mu, tek `<h1>` var mı, konsol hatası var mı |
| Erişilebilirlik | axe ile ana sayfa ve teklif formunda ciddi WCAG ihlali var mı |
| Mobil menü | Açılıyor mu, Esc kapatıyor mu, odak düğmeye dönüyor mu |
| Teklif formu | Hatalı gönderimde alan bazlı doğrulama çalışıyor mu |
| Bağlantılar | Ana sayfadaki iç bağlantılardan kırık olan var mı |
| Proje görselleri | Görseller yükleniyor mu (alt dizinli yayında da) |
| SEO | sitemap.xml, robots.txt ve feed.xml yayında mı |

Testler alt dizinde yayınlanan sürüm için de çalıştırılabilir:

```bash
BASE_URL=http://localhost:4300 BASE_PATH=/rebirthsoftware npm run test
```

GitHub'da her push'ta `.github/workflows/ci.yml` bu kontrollerin tamamını
çalıştırır; test başarısız olursa rapor Actions çıktısına yüklenir.

---

## 2. Vercel'e yayınlama

1. Bu repoyu GitHub'a gönderin (zaten gönderildi).
2. [vercel.com](https://vercel.com) → **Add New → Project** → repoyu seçin.
3. Vercel, Next.js projesini otomatik tanır; ayar değiştirmenize gerek yok.
4. **Environment Variables** bölümüne `.env.example` içindeki değişkenleri ekleyin.
5. **Deploy** deyin. Birkaç dakikada `proje-adi.vercel.app` adresinde yayında olur.
6. Kendi alan adınız için: Vercel → Project → **Settings → Domains** → alan adınızı
   ekleyin ve alan adı sağlayıcınızda gösterilen DNS kayıtlarını girin.
   SSL sertifikası otomatik oluşur.

> Alan adını bağladıktan sonra `NEXT_PUBLIC_SITE_URL` değişkenini gerçek
> adresinizle güncelleyip yeniden deploy edin (sitemap ve SEO etiketleri
> bu değeri kullanıyor).

---

## 2b. GitHub Pages ile hızlı önizleme (Vercel'e geçmeden)

Repoda hazır bir GitHub Actions iş akışı var
(`.github/workflows/github-pages.yml`). Kurulumu tek seferlik:

1. GitHub → repo → **Settings → Pages**
2. **Source** = `GitHub Actions` seçin.
3. Varsayılan dala yapılan her push'ta site otomatik derlenip yayınlanır.

Adres: `https://rebirthsoftware-code.github.io/rebirthsoftware/`

> **Dikkat — varsayılan dal:** Depo boş oluşturulup ilk olarak
> `claude/website-review-fztdup` dalı gönderildiği için GitHub varsayılan dalı
> bu yaptı. GitHub Pages ortamı **yalnızca varsayılan daldan** yayına izin
> verir; bu yüzden `main`'e yapılan push'ların yayın adımı sessizce
> reddedilir. İş akışı şimdilik iki dalı da dinliyor.
> İş akışı bu yüzden **yalnızca varsayılan dalı** dinliyor. İki dal birden
> dinlenirse, aynı anda gelen iki push'ta `concurrency` kuralı yayını yapacak
> işi iptal edip ortam kısıtına takılanı bırakabiliyor.
>
> Kalıcı çözüm: **Settings → General → Default branch** üzerinden varsayılan
> dalı `main` yapın, sonra iş akışındaki `branches:` satırını `[main]` yapın.

İş akışının durumunu repo sayfasındaki **Actions** sekmesinden izleyebilirsiniz.
İlk yayın 1-2 dakika sürer.

> **GitHub Pages'in sınırı:** yalnızca statik dosya sunar, sunucu kodu
> çalıştıramaz. Bu yüzden derleme sırasında `app/api` klasörü çıkarılır ve
> **teklif formu e-posta göndermez** — bunun yerine doldurulan bilgileri hazır
> bir WhatsApp mesajına çevirip yönlendirir. Vercel'de form tam haliyle çalışır.
> Yani GitHub Pages'i tasarımı ve akışı görmek için, Vercel'i asıl yayın için
> kullanın.

Aynı statik sürümü kendi bilgisayarınızda da üretebilirsiniz:

```bash
rm -rf app/api        # sadece deneme için, geri almayı unutmayın
npm run build:static  # çıktı: out/
```

---

## 3. Yayına almadan önce mutlaka yapılacaklar

| # | Yapılacak | Dosya |
|---|-----------|-------|
| 1 | Telefon, WhatsApp, e-posta, adres ve sosyal medya adreslerini yazın | `content/site.json` (ya da panel → Site bilgileri) |
| 2 | Referans projeleri güncel tutun | `content/projeler.json` (ya da panel → Projeler) |
| 3 | İstatistikleri (proje sayısı, deneyim yılı) gerçek rakamlarla güncelleyin | `content/site.json` → `stats` |
| 4 | Hizmet açıklamalarını kendi anlatımınıza göre düzenleyin | `content/hizmetler.json` (ya da panel → Hizmetler) |
| 5 | KVKK metnine şirket unvanı / adres bilgilerinizi ekleyin | `app/kvkk/page.tsx` |
| 6 | Teklif taleplerinin panele düşmesi için `NEXT_PUBLIC_TEKLIF_API` tanımlayın | bölüm 8 |

---

## 4. İçerik nasıl güncellenir?

> En kolay yol **yönetim paneli** (bölüm 8). Aşağıdaki dosyaları elle
> düzenlemek de mümkündür; panel ve dosyalar aynı veriyi kullanır.

### İletişim bilgileri
`content/site.json` — telefon, WhatsApp numarası, e-posta, şehir, sosyal medya,
ana sayfadaki rakamlar. Tüm site bu tek dosyadan beslenir (`lib/site.ts` okur).

### Yeni referans projesi ekleme
`content/projeler.json` dizisine yeni bir nesne ekleyin (panelde: Projeler → Yeni proje):

```ts
{
  slug: "musteri-adi",              // URL: /projeler/musteri-adi
  title: "Müşteri Adı Kurumsal Sitesi",
  client: "Müşteri Adı",
  sector: "Sektör",
  year: "2026",
  type: "Kurumsal Web Sitesi",      // veya "Kişiye Özel Yazılım" / "Web Tasarım"
  summary: "Tek cümlelik özet.",
  challenge: "Müşterinin sorunu neydi?",
  solution: "Ne yaptınız?",
  result: ["Ölçülebilir sonuç 1", "Sonuç 2"],
  stack: ["Next.js", "PostgreSQL"],
  url: "https://musterisitesi.com",         // opsiyonel
  image: "/projeler/musteri-adi.jpg",       // opsiyonel, public/projeler/ içine koyun
  // gradient: ["#0ea5e9", "#4338ca"],      // isteğe bağlı; boş bırakın
  featured: true,                            // ana sayfada gösterilsin mi
}
```

Ekran görüntülerini `public/projeler/` klasörüne koyun (1600×1000, WebP önerilir).
Görsel yolunu her zaman `/projeler/...` şeklinde yazın; `lib/asset.ts` alt dizinli
yayında (GitHub Pages) önekini otomatik ekler.

Görseli koyduktan sonra **`npm run gorsel`** çalıştırın: tam boy dosyadan 640 ve
1200 piksellik varyantları üretir. Kartlar bunları `srcset` ile sunduğu için
ziyaretçi 1,6 megapiksellik dosyayı boşuna indirip çözmez. Aynı komut logo
varlıklarını da `assets/logo-kaynak.png` dosyasından yeniden üretir.
Görsel eklenmezse kart, müşteri adının baş harflerini gösteren nötr bir yer
tutucu kullanır — `gradient` alanını yalnızca özellikle renkli bir arka plan
istiyorsanız doldurun.

### Hizmet ekleme / çıkarma
`content/hizmetler.json`. Buraya eklediğiniz her hizmet otomatik olarak
ana sayfada, hizmetler sayfasında, alt menüde, teklif formundaki seçim
listesinde ve site haritasında görünür.

### Süreç, avantajlar ve SSS
`lib/process.ts` — çalışma adımları, "neden biz" maddeleri, teknoloji listesi,
sektörler ve genel sık sorulan sorular.

### Blog yazısı ekleme
`content/yazilar.json` dizisine yeni bir nesne ekleyin (panelde: Yazılar → Yeni yazı); liste sayfası, detay
sayfası, ana sayfadaki blog bölümü, site haritası ve RSS otomatik güncellenir.

```ts
{
  slug: "yazi-adresi",
  title: "Yazı başlığı",
  excerpt: "Listede ve paylaşımda görünen tek cümlelik özet.",
  date: "2026-09-01",          // YYYY-MM-DD
  readingMinutes: 5,
  category: "SEO",              // Web Tasarım | SEO | Yazılım | İşletme
  body: [
    { p: "Giriş paragrafı." },
    { h: "Alt başlık", p: "Paragraf." },
    { h: "Liste başlığı", list: ["Madde 1", "Madde 2"] },
  ],
}
```

---

## 5. Teklif formu nasıl çalışıyor?

Üç olasılık var; form hangisinin geçerli olduğunu kendisi anlar:

1. **`NEXT_PUBLIC_TEKLIF_API` tanımlıysa** (önerilen) → talep yönetim paneline
   gider, **Teklifler** listesinde görünür, GitHub Pages'te de çalışır. Bölüm 8.
2. Tanımlı değilse ve site Vercel'deyse → `POST /api/teklif`
   (`app/api/teklif/route.ts`), aşağıdaki gibi e-posta gönderir.
3. Tanımlı değilse ve site GitHub Pages'teyse → doldurulan bilgiler hazır bir
   WhatsApp mesajına çevrilir.

Vercel'deki `/api/teklif` için:

- `RESEND_API_KEY` **tanımlıysa** → talep e-posta olarak `CONTACT_TO_EMAIL`
  adresine gönderilir; yanıtla dediğinizde doğrudan müşteriye gider (reply-to).
- `RESEND_API_KEY` **tanımlı değilse** → form yine çalışır ve kullanıcıya
  başarı mesajı gösterir, ancak talep yalnızca Vercel sunucu günlüklerine
  yazılır. **Canlıda mutlaka anahtarı tanımlayın**, aksi hâlde gelen talepleri
  kaçırırsınız.

Formda ayrıca gizli bir bot tuzağı (honeypot) alanı ve sunucu tarafı doğrulama
bulunur.

---

## 6. Sayfa yapısı

```
/                       Ana sayfa
/hizmetler              Hizmet listesi
/hizmetler/[slug]       Hizmet detay sayfaları (SEO için ayrı sayfa)
/projeler               Referanslar
/projeler/[slug]        Proje detay (sorun → çözüm → sonuç)
/surec                  Nasıl çalışıyoruz
/hakkimizda             Hakkımızda
/blog                   Blog listesi
/blog/[slug]            Yazı detayı
/sss                    Sık sorulan sorular
/teklif-al              Teklif formu  ← ana dönüşüm sayfası
/iletisim               İletişim + form
/kvkk, /gizlilik        Yasal metinler
/sitemap.xml, /robots.txt   Otomatik üretilir
/manifest.webmanifest   Telefona kurulum (PWA) bildirimi
/feed.xml               RSS akışı (yazılardan otomatik)
```

## 7. SEO için kurulanlar

- Her sayfada özel `title` / `description` ve canonical adres
- Open Graph görseli otomatik üretilir (`app/opengraph-image.tsx`)
- `schema.org` yapılandırılmış veri: ProfessionalService, Service, FAQPage,
  BlogPosting ve detay sayfalarında BreadcrumbList
- RSS akışı ve blog modülü (düzenli içerik = organik trafik)
- Otomatik `sitemap.xml` ve `robots.txt`
- Tamamı statik üretilen (SSG) hızlı sayfalar
- Site telefona "ana ekrana ekle" ile uygulama gibi kurulabilir (`app/manifest.ts`,
  ikonlar `npm run gorsel` ile üretilir)

Yayına aldıktan sonra:
[Google Search Console](https://search.google.com/search-console)'a alan adınızı
ekleyip `sitemap.xml` adresini gönderin.

---

## 8. Yönetim paneli (`admin/`)

Siteden **ayrı** bir uygulama: kendi adresi, kendi Vercel projesi, tek
parolayla giriş. Telefona "ana ekrana ekle" ile kurulur; telefonda alt sekme
çubuğu, bilgisayarda sol menüyle çalışır.

| Bölüm | Ne yapar |
|-------|----------|
| Özet | Bekleyen teklif sayısı, içerik sayıları, son yayın durumu, yaklaşan yenilemeler |
| Teklifler | Siteden gelen talepler; yanıtlandı işaretleme, not ekleme, e-posta / WhatsApp kısayolu |
| Projeler | Referans ekle / düzenle / sil / sırala; ekran görüntüsü yükle (640 ve 1200 px varyantları otomatik üretilir) |
| Yazılar | Blog yazısı yaz; sade metin (`## başlık`, `- madde`) sitenin blok biçimine çevrilir |
| Hizmetler | Hizmet metinleri, özellikler, SSS, simge |
| Müşteri siteleri | Yaptığınız sitelerin listesi, yenileme tarihleri (45 gün kala uyarı), erişilebilirlik kontrolü |
| Site bilgileri | Telefon, WhatsApp, e-posta, sosyal medya, ana sayfadaki rakamlar |

**Veri nerede?** Panelin kendi veritabanı yoktur. Her kayıt, sitenin GitHub
deposundaki `content/*.json` dosyasına **tek commit** olarak yazılır; GitHub
Pages iş akışı siteyi 1-2 dakikada yeniden yayınlar. Teklif talepleri aynı
depoda `teklif` etiketli **issue** olarak tutulur (GitHub bildirimi de gelir).
Böylece ek hizmet, ek maliyet ve yedekleme derdi yoktur; her değişikliğin
geçmişi git'tedir.

### Kurulum (bir kez)

1. **GitHub token:** GitHub → Settings → Developer settings → Fine-grained
   tokens → *Generate new token*. Yalnızca bu depo; izinler: **Contents: Read
   and write**, **Issues: Read and write**, **Actions: Read**. Token'ı kopyalayın.
2. **Vercel projesi:** Vercel → Add New → Project → bu repo → **Root Directory:
   `admin`**. Environment Variables bölümüne `admin/.env.example` içindekileri
   girin; en azından:
   - `ADMIN_PAROLA` — panel giriş parolası (uzun olsun)
   - `GITHUB_TOKEN`, `GITHUB_REPO=rebirthsoftware-code/rebirthsoftware`,
     `GITHUB_BRANCH` — sitenin yayınlandığı dal (şu an `claude/website-review-fztdup`;
     varsayılan dalı `main` yaparsanız burayı da değiştirin)
   - `SITE_ORIGINS` — sitenin adresleri, virgülle (`https://rebirthsoftware-code.github.io,https://www.rebirthsoftware.com`)
   - `NEXT_PUBLIC_PANEL_URL` — panelin adresi
3. **Alan adı:** Vercel → Settings → Domains → ör. `yonetim.rebirthsoftware.com`.
4. **Siteyi panele bağlayın:** `.github/workflows/github-pages.yml` içindeki
   derleme adımına `NEXT_PUBLIC_TEKLIF_API: https://yonetim.rebirthsoftware.com/api/teklif`
   ortam değişkenini ekleyin (Vercel'de yayınlıyorsanız Vercel → Env Vars).
   Bundan sonra teklif formu panele düşer.
5. **Telefona kurun:** paneli Android Chrome'da açıp *Ana ekrana ekle*,
   iPhone Safari'de *Paylaş → Ana Ekrana Ekle*.

### Geliştirme

```bash
cd admin
cp .env.example .env.local      # ADMIN_PAROLA yazın; GITHUB_TOKEN boş kalabilir
npm install
npm run dev                     # http://localhost:3100
```

`GITHUB_TOKEN` boşken panel **yerel modda** çalışır: `../content` klasörünü
doğrudan okur/yazar, teklifler `admin/.yerel/teklifler.json` dosyasına düşer.
Kök dizinde `npm run dev` ile siteyi de açarsanız panelde yaptığınız
değişiklik sitede anında görünür. Testler (`npm test`) de bu modda, geçici
bir kopya üzerinde koşar; GitHub'a dokunmaz.

**Dosyalar (`admin/`)**

```
app/giris                     Parola ile giriş (imzalı çerez, 30 gün)
app/(panel)/…                 Korunan sayfalar; eylemler.ts tüm yazma işlemleri
app/api/teklif/route.ts       Sitenin formunun gönderdiği uç (CORS, hız sınırı, bot tuzağı)
lib/depo.ts                   GitHub (Git Data API, tek commit) ya da yerel dosya deposu
lib/icerik.ts, lib/tipler.ts  İçerik tipleri, doğrulama, slug ve yazı gövdesi dönüşümü
lib/gorsel.ts                 Proje görseli → webp 1600/1200/640
tests/panel.spec.ts           Giriş, formlar, teklif ucu, PWA, telefon düzeni
```

