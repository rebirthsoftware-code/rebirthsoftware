import { SayfaBasligi } from "@/components/ui";
import { HizmetFormu } from "../HizmetFormu";

export const metadata = { title: "Yeni hizmet" };

export default function YeniHizmet() {
  return (
    <>
      <SayfaBasligi baslik="Yeni hizmet" />
      <HizmetFormu />
    </>
  );
}
