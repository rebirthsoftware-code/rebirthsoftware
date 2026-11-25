import { SayfaBasligi } from "@/components/ui";
import { ProjeFormu } from "../ProjeFormu";

export const metadata = { title: "Yeni proje" };

export default function YeniProje() {
  return (
    <>
      <SayfaBasligi baslik="Yeni proje" aciklama="Sorun → çözüm → sonuç kurgusu sitede proje sayfasını oluşturur." />
      <ProjeFormu />
    </>
  );
}
