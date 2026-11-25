import { notFound } from "next/navigation";
import { SayfaBasligi } from "@/components/ui";
import { govdeyiMetneCevir, oku } from "@/lib/icerik";
import { YaziFormu } from "../YaziFormu";

export const metadata = { title: "Yazıyı düzenle" };

export default async function YaziDuzenle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const yazi = (await oku("yazilar")).find((y) => y.slug === slug);
  if (!yazi) notFound();
  return (
    <>
      <SayfaBasligi baslik={yazi.title} aciklama={`Sitede: /blog/${yazi.slug}`} />
      <YaziFormu yazi={yazi} govdeMetni={govdeyiMetneCevir(yazi.body)} />
    </>
  );
}
