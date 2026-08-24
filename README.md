# Rebirth Software — Kurumsal Web Sitesi

Kurumsal web sitesi ve kişiye özel yazılım hizmetleri için hazırlanmış,
Vercel üzerinde çalışan kurumsal tanıtım sitesi.

**Teknolojiler:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Vercel

---

## 1. Hızlı başlangıç

```bash
npm install
cp .env.example .env.local   # değerleri kendinize göre düzenleyin
npm run dev                  # http://localhost:3000
```

Yayına almadan önce derlemeyi kontrol edin:

```bash
npm run build
```

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

## 3. Yayına almadan önce mutlaka yapılacaklar

| # | Yapılacak | Dosya |
|---|-----------|-------|
| 1 | Telefon, WhatsApp, e-posta, adres ve sosyal medya adreslerini yazın | `lib/site.ts` |
| 2 | **Örnek referans projelerini kendi gerçek projelerinizle değiştirin** | `lib/projects.ts` |
| 3 | İstatistikleri (proje sayısı, deneyim yılı) gerçek rakamlarla güncelleyin | `lib/site.ts` → `stats` |
| 4 | Hizmet açıklamalarını kendi anlatımınıza göre düzenleyin | `lib/services.ts` |
| 5 | KVKK metnine şirket unvanı / adres bilgilerinizi ekleyin | `app/kvkk/page.tsx` |
| 6 | Teklif formu e-postası için `RESEND_API_KEY` tanımlayın | Vercel → Env Vars |

> ⚠️ `lib/projects.ts` içindeki projeler **örnek içeriktir**. Siteyi
> yayına almadan önce kendi gerçek işlerinizle değiştirin.

---

## 4. İçerik nasıl güncellenir?

### İletişim bilgileri
`lib/site.ts` — telefon, WhatsApp numarası, e-posta, şehir, sosyal medya.
Tüm site bu tek dosyadan beslenir.

### Yeni referans projesi ekleme
`lib/projects.ts` içindeki diziye yeni bir nesne ekleyin:

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
  gradient: ["#0ea5e9", "#4338ca"],         // görsel yoksa kart arka planı
  featured: true,                            // ana sayfada gösterilsin mi
}
```

Ekran görüntülerini `public/projeler/` klasörüne koyun. Görsel eklenmezse
kart, `gradient` renkleriyle otomatik bir arka plan kullanır.

### Hizmet ekleme / çıkarma
`lib/services.ts`. Buraya eklediğiniz her hizmet otomatik olarak
ana sayfada, hizmetler sayfasında, alt menüde, teklif formundaki seçim
listesinde ve site haritasında görünür.

### Süreç, avantajlar ve SSS
`lib/process.ts` — çalışma adımları, "neden biz" maddeleri, teknoloji listesi
ve genel sık sorulan sorular.

---

## 5. Teklif formu nasıl çalışıyor?

Form `POST /api/teklif` adresine gider (`app/api/teklif/route.ts`).

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
/sss                    Sık sorulan sorular
/teklif-al              Teklif formu  ← ana dönüşüm sayfası
/iletisim               İletişim + form
/kvkk, /gizlilik        Yasal metinler
/sitemap.xml, /robots.txt   Otomatik üretilir
```

## 7. SEO için kurulanlar

- Her sayfada özel `title` / `description` ve canonical adres
- Open Graph görseli otomatik üretilir (`app/opengraph-image.tsx`)
- `schema.org` yapılandırılmış veri: ProfessionalService, Service, FAQPage
- Otomatik `sitemap.xml` ve `robots.txt`
- Tamamı statik üretilen (SSG) hızlı sayfalar

Yayına aldıktan sonra:
[Google Search Console](https://search.google.com/search-console)'a alan adınızı
ekleyip `sitemap.xml` adresini gönderin.
