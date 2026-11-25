import { notFound } from "next/navigation";
import { SayfaBasligi } from "@/components/ui";
import { oku } from "@/lib/icerik";
import { ProjeFormu } from "../ProjeFormu";

export const metadata = { title: "Projeyi düzenle" };

export default async function ProjeDuzenle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const proje = (await oku("projeler")).find((p) => p.slug === slug);
  if (!proje) notFound();
  return (
    <>
      <SayfaBasligi baslik={proje.title} aciklama={`Sitede: /projeler/${proje.slug}`} />
      <ProjeFormu proje={proje} />
    </>
  );
}
