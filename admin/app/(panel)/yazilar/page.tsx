import Link from "next/link";
import { Icon } from "@/components/Icon";
import { SilFormu } from "@/components/SilFormu";
import { SonucMesaji } from "@/components/SonucMesaji";
import { BaglantiButonu, BosDurum, Rozet, SayfaBasligi } from "@/components/ui";
import { oku } from "@/lib/icerik";
import { tarihTr } from "@/lib/teklif";
import { yaziSil } from "../eylemler";

export const metadata = { title: "Yazılar" };

export default async function YazilarSayfasi({ searchParams }: { searchParams: Promise<{ kaydedildi?: string; silindi?: string }> }) {
  const yazilar = [...(await oku("yazilar"))].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <>
      <SayfaBasligi
        baslik="Blog yazıları"
        aciklama="Düzenli içerik, arama motorlarından gelen ziyaretçiyi artırır. Yayınlanan yazı listeye, RSS'e ve site haritasına otomatik eklenir."
        eylem={<BaglantiButonu href="/yazilar/yeni"><Icon name="plus" className="h-4 w-4" /> Yeni yazı</BaglantiButonu>}
      />
      <SonucMesaji searchParams={searchParams} />
      {yazilar.length === 0 ? (
        <BosDurum baslik="Henüz yazı yok" eylem={<BaglantiButonu href="/yazilar/yeni">İlk yazıyı ekle</BaglantiButonu>} />
      ) : (
        <ul className="card divide-y divide-line" data-yazi-listesi>
          {yazilar.map((y) => (
            <li key={y.slug} data-yazi={y.slug} className="flex items-center gap-3 px-4 py-3 sm:px-5">
              <Link href={`/yazilar/${y.slug}`} className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="truncate font-semibold text-ink">{y.title}</span>
                  <Rozet>{y.category}</Rozet>
                </span>
                <span className="block truncate text-xs text-muted">
                  {tarihTr(`${y.date}T00:00:00Z`, false)} · {y.readingMinutes} dk okuma
                </span>
              </Link>
              <SilFormu eylem={yaziSil} gizli={{ slug: y.slug }} onay={`"${y.title}" yazısı silinecek. Emin misiniz?`} etiket="" />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
