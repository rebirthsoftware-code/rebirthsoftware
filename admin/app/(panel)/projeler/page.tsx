import Link from "next/link";
import { Icon } from "@/components/Icon";
import { SilFormu } from "@/components/SilFormu";
import { SonucMesaji } from "@/components/SonucMesaji";
import { BaglantiButonu, BosDurum, Rozet, SayfaBasligi } from "@/components/ui";
import { oku } from "@/lib/icerik";
import { projeSil, projeSirala } from "../eylemler";

export const metadata = { title: "Projeler" };

export default async function ProjelerSayfasi({ searchParams }: { searchParams: Promise<{ kaydedildi?: string; silindi?: string }> }) {
  const projeler = await oku("projeler");
  return (
    <>
      <SayfaBasligi
        baslik="Referans projeler"
        aciklama="Sitenin Projeler sayfasında ve ana sayfa vitrininde görünen işler. Sıra, sitedeki sırayla aynıdır."
        eylem={<BaglantiButonu href="/projeler/yeni"><Icon name="plus" className="h-4 w-4" /> Yeni proje</BaglantiButonu>}
      />
      <SonucMesaji searchParams={searchParams} />
      {projeler.length === 0 ? (
        <BosDurum baslik="Henüz proje yok" eylem={<BaglantiButonu href="/projeler/yeni">İlk projeyi ekle</BaglantiButonu>} />
      ) : (
        <ul className="card divide-y divide-line" data-proje-listesi>
          {projeler.map((p, i) => (
            <li key={p.slug} data-proje={p.slug} className="flex items-center gap-3 px-4 py-3 sm:px-5">
              <div className="flex flex-col">
                <form action={projeSirala}>
                  <input type="hidden" name="slug" value={p.slug} />
                  <input type="hidden" name="yon" value="yukari" />
                  <button type="submit" disabled={i === 0} aria-label={`${p.title} yukarı taşı`} className="rounded p-1 text-faint hover:text-ink disabled:opacity-30">
                    <Icon name="arrowDown" className="h-3.5 w-3.5 rotate-180" />
                  </button>
                </form>
                <form action={projeSirala}>
                  <input type="hidden" name="slug" value={p.slug} />
                  <input type="hidden" name="yon" value="asagi" />
                  <button type="submit" disabled={i === projeler.length - 1} aria-label={`${p.title} aşağı taşı`} className="rounded p-1 text-faint hover:text-ink disabled:opacity-30">
                    <Icon name="arrowDown" className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
              <Link href={`/projeler/${p.slug}`} className="flex min-w-0 flex-1 items-center gap-4">
                <span className="hidden h-12 w-20 shrink-0 overflow-hidden rounded-md bg-paper-2 sm:block">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`${process.env.NEXT_PUBLIC_SITE_URL ?? "https://rebirthsoftware-code.github.io/rebirthsoftware"}${p.image.replace(/\.webp$/, "-640.webp")}`} alt="" className="h-full w-full object-cover object-top" loading="lazy" />
                  ) : null}
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-semibold text-ink">{p.title}</span>
                    {p.featured ? <Rozet ton="vurgu">Vitrin</Rozet> : null}
                  </span>
                  <span className="block truncate text-xs text-muted">{p.client} · {p.sector} · {p.year}</span>
                </span>
              </Link>
              <SilFormu eylem={projeSil} gizli={{ slug: p.slug }} onay={`"${p.title}" projesi siteden kaldırılacak. Emin misiniz?`} etiket="" />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
