import { SayfaBasligi } from "@/components/ui";
import { MusteriFormu } from "../MusteriFormu";

export const metadata = { title: "Yeni müşteri sitesi" };

export default function YeniMusteriSitesi() {
  return (
    <>
      <SayfaBasligi baslik="Yeni müşteri sitesi" />
      <MusteriFormu />
    </>
  );
}
