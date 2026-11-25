import { SayfaBasligi } from "@/components/ui";
import { oku } from "@/lib/icerik";
import { SiteFormu } from "./SiteFormu";

export const metadata = { title: "Site bilgileri" };

export default async function SiteBilgileriSayfasi() {
  const bilgi = await oku("site");
  return (
    <>
      <SayfaBasligi
        baslik="Site bilgileri"
        aciklama="Telefon, WhatsApp, e-posta, sosyal medya ve ana sayfadaki rakamlar. Tüm site tek kaynaktan beslenir."
      />
      <SiteFormu bilgi={bilgi} />
    </>
  );
}
