import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gizlilik ve Çerez Politikası",
  description:
 "Web sitemizde toplanan bilgiler, çerez kullanımı ve gizlilik uygulamalarımız.",
  alternates: { canonical: "/gizlilik" },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Yasal"
      title="Gizlilik ve Çerez Politikası"
      updated="24.08.2026"
      intro={`${site.name} olarak ziyaretçilerimizin gizliliğine önem veriyoruz. Bu sayfada hangi bilgileri, neden topladığımızı açıklıyoruz.`}
      sections={[
        {
          heading: "Toplanan bilgiler",
          body: [
 "Siteyi yalnızca gezerken kimlik bilgilerinizi toplamayız. İletişim veya teklif formunu doldurduğunuzda ad, e-posta, telefon ve mesaj içeriğiniz tarafımıza iletilir.",
          ],
        },
        {
          heading: "Çerezler",
          body: [
 "Sitenin çalışması için zorunlu çerezler kullanılır. Ayrıca ziyaretçi sayısı ve hangi sayfaların ilgi gördüğünü anlamak amacıyla anonim ölçüm çerezleri kullanılabilir. Bu ölçümler kişileri tanımlamak için kullanılmaz.",
 "Tarayıcı ayarlarınızdan çerezleri engelleyebilir veya silebilirsiniz; bu durumda sitenin bazı bölümleri beklendiği gibi çalışmayabilir.",
          ],
        },
        {
          heading: "Üçüncü taraf hizmetler",
          body: [
 "Site, barındırma altyapısı olarak Vercel üzerinde yayınlanmaktadır. Form gönderimleri e-posta servis sağlayıcısı üzerinden iletilir. Bu sağlayıcılar kendi gizlilik politikalarına tabidir.",
          ],
        },
        {
          heading: "Veri güvenliği",
          body: [
 "Site HTTPS üzerinden yayınlanır ve iletilen veriler şifrelenir. Form verilerine yalnızca talebinizi değerlendiren yetkili kişiler erişebilir.",
          ],
        },
        {
          heading: "İletişim",
          body: [
            `Gizlilikle ilgili sorularınız için ${site.email} adresinden bize ulaşabilirsiniz.`,
          ],
        },
      ]}
    />
  );
}
