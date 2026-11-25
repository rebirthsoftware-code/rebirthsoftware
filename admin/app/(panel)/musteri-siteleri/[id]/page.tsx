import { notFound } from "next/navigation";
import { SayfaBasligi } from "@/components/ui";
import { oku } from "@/lib/icerik";
import { MusteriFormu } from "../MusteriFormu";

export const metadata = { title: "Müşteri sitesi" };

export default async function MusteriSitesiDuzenle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const site = (await oku("musteriSiteleri")).find((m) => m.id === id);
  if (!site) notFound();
  return (
    <>
      <SayfaBasligi baslik={site.ad} aciklama={site.adres} />
      <MusteriFormu site={site} />
    </>
  );
}
