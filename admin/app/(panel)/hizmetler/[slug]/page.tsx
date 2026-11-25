import { notFound } from "next/navigation";
import { SayfaBasligi } from "@/components/ui";
import { oku } from "@/lib/icerik";
import { HizmetFormu } from "../HizmetFormu";

export const metadata = { title: "Hizmeti düzenle" };

export default async function HizmetDuzenle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hizmet = (await oku("hizmetler")).find((h) => h.slug === slug);
  if (!hizmet) notFound();
  return (
    <>
      <SayfaBasligi baslik={hizmet.title} aciklama={`Sitede: /hizmetler/${hizmet.slug}`} />
      <HizmetFormu hizmet={hizmet} />
    </>
  );
}
