import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
 "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.",
  alternates: { canonical: "/kvkk" },
  robots: { index: false, follow: true },
};

export default function KvkkPage() {
  return (
    <LegalPage
      eyebrow="Yasal"
      title="KVKK Aydınlatma Metni"
      updated="24.08.2026"
      intro={`6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, ${site.name} tarafından işlenen kişisel verilerinize ilişkin bilgilendirmedir.`}
      sections={[
        {
          heading: "1. Veri sorumlusu",
          body: [
            `Kişisel verileriniz, veri sorumlusu sıfatıyla ${site.name} tarafından aşağıda açıklanan kapsamda işlenmektedir. İletişim: ${site.email} / ${site.phone}`,
          ],
        },
        {
          heading: "2. İşlenen kişisel veriler",
          body: [
 "Web sitemizdeki iletişim ve teklif formlarını doldurmanız hâlinde aşağıdaki veriler işlenir:",
          ],
          list: [
 "Kimlik bilgisi: ad, soyad",
 "İletişim bilgisi: e-posta adresi, telefon numarası",
 "Müşteri işlem bilgisi: firma adı, talep konusu, bütçe aralığı, mesaj içeriği",
 "İşlem güvenliği bilgisi: IP adresi ve tarayıcı kayıtları (sunucu günlükleri)",
          ],
        },
        {
          heading: "3. İşleme amaçları",
          body: [
 "Kişisel verileriniz; talebinizin değerlendirilmesi, size teklif sunulması, sözleşme süreçlerinin yürütülmesi, iletişim faaliyetlerinin gerçekleştirilmesi ve hukuki yükümlülüklerin yerine getirilmesi amaçlarıyla işlenir.",
          ],
        },
        {
          heading: "4. Hukuki sebep",
          body: [
 "Verileriniz KVKK'nın 5. maddesinde yer alan 'bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması', 'veri sorumlusunun meşru menfaati' ve gerekli hâllerde 'açık rıza' hukuki sebeplerine dayanılarak işlenmektedir.",
          ],
        },
        {
          heading: "5. Aktarım",
          body: [
 "Kişisel verileriniz, hizmetin yürütülmesi için kullanılan barındırma (hosting), e-posta ve analiz hizmet sağlayıcılarıyla, yalnızca gerekli olduğu ölçüde paylaşılabilir. Verileriniz pazarlama amacıyla üçüncü kişilere satılmaz veya devredilmez.",
          ],
        },
        {
          heading: "6. Saklama süresi",
          body: [
 "Form aracılığıyla iletilen veriler, talebinizin sonuçlanmasını takiben ilgili mevzuatta öngörülen zamanaşımı süreleri boyunca saklanır; sürenin sonunda silinir, yok edilir veya anonim hâle getirilir.",
          ],
        },
        {
          heading: "7. Haklarınız",
          body: ["KVKK'nın 11. maddesi uyarınca:"],
          list: [
 "Kişisel verinizin işlenip işlenmediğini öğrenme",
 "İşlenmişse buna ilişkin bilgi talep etme",
 "İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme",
 "Eksik veya yanlış işlenmişse düzeltilmesini isteme",
 "Silinmesini veya yok edilmesini isteme",
 "Yapılan işlemlerin aktarıldığı üçüncü kişilere bildirilmesini isteme",
 "Zararınızın giderilmesini talep etme",
          ],
        },
        {
          heading: "8. Başvuru",
          body: [
            `Haklarınıza ilişkin taleplerinizi ${site.email} adresine iletebilirsiniz. Başvurunuz en geç 30 gün içinde sonuçlandırılır.`,
 "Bu metin bilgilendirme amaçlıdır; kurumsal kullanım öncesinde şirket unvanı, adres ve vergi bilgileriyle birlikte hukuk danışmanınıza gözden geçirtmeniz önerilir.",
          ],
        },
      ]}
    />
  );
}
