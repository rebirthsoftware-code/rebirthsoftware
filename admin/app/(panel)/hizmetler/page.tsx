import Link from "next/link";
import { Icon } from "@/components/Icon";
import { SilFormu } from "@/components/SilFormu";
import { SonucMesaji } from "@/components/SonucMesaji";
import { BaglantiButonu, SayfaBasligi } from "@/components/ui";
import { oku } from "@/lib/icerik";
import { hizmetSil } from "../eylemler";

export const metadata = { title: "Hizmetler" };

export default async function HizmetlerSayfasi({ searchParams }: { searchParams: Promise<{ kaydedildi?: string; silindi?: string }> }) {
  const hizmetler = await oku("hizmetler");
  return (
    <>
      <SayfaBasligi
        baslik="Hizmetler"
        aciklama="Buradaki her hizmet ana sayfada, hizmetler sayfasında, menüde, teklif formundaki seçim listesinde ve site haritasında görünür."
        eylem={<BaglantiButonu href="/hizmetler/yeni"><Icon name="plus" className="h-4 w-4" /> Yeni hizmet</BaglantiButonu>}
      />
      <SonucMesaji searchParams={searchParams} />
      <ul className="grid gap-3 sm:grid-cols-2" data-hizmet-listesi>
        {hizmetler.map((h) => (
          <li key={h.slug} data-hizmet={h.slug} className="card flex items-start gap-4 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-flame-tint text-flame">
              <Icon name={h.icon} className="h-5 w-5" />
            </span>
            <Link href={`/hizmetler/${h.slug}`} className="min-w-0 flex-1">
              <span className="block font-semibold text-ink">{h.title}</span>
              <span className="mt-0.5 line-clamp-2 block text-sm text-muted">{h.short}</span>
            </Link>
            <SilFormu eylem={hizmetSil} gizli={{ slug: h.slug }} onay={`"${h.title}" hizmeti siteden kaldırılacak. Emin misiniz?`} etiket="" />
          </li>
        ))}
      </ul>
    </>
  );
}
