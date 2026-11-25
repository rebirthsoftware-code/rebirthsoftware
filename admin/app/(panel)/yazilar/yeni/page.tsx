import { SayfaBasligi } from "@/components/ui";
import { YaziFormu } from "../YaziFormu";

export const metadata = { title: "Yeni yazı" };

export default function YeniYazi() {
  return (
    <>
      <SayfaBasligi baslik="Yeni yazı" />
      <YaziFormu />
    </>
  );
}
