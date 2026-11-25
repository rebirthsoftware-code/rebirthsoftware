import Link from "next/link";
import { BosDurum, Rozet, SayfaBasligi, Uyari } from "@/components/ui";
import { depo, type Teklif } from "@/lib/depo";
import { tarihTr, teklifAyristir } from "@/lib/teklif";

export const metadata = { title: "Teklifler" };

export default async function TekliflerSayfasi({
  searchParams,
}: {
  searchParams: Promise<{ durum?: string }>;
}) {
  const { durum } = await searchParams;
  let teklifler: Teklif[];
  let hata: string | null = null;
  try {
    teklifler = await depo().teklifler();
  } catch (e) {
    teklifler = [];
    hata = e instanceof Error ? e.message : "Talepler okunamadı.";
  }
  const suzgec = durum === "yanitlandi" ? "yanitlandi" : durum === "yeni" ? "yeni" : null;
  const liste = suzgec ? teklifler.filter((t) => t.durum === suzgec) : teklifler;
  const bekleyen = teklifler.filter((t) => t.durum === "yeni").length;

  return (
    <>
      <SayfaBasligi
        baslik="Teklif talepleri"
        aciklama="Sitedeki teklif formundan gelen başvurular. Yanıtladıklarınızı işaretleyin; not ekleyerek görüşme geçmişini tutun."
      />
      {hata ? <div className="mb-5"><Uyari tur="hata">{hata}</Uyari></div> : null}

      <div className="mb-4 flex gap-2 text-sm">
        {[
          { v: "", e: `Tümü (${teklifler.length})` },
          { v: "yeni", e: `Yeni (${bekleyen})` },
          { v: "yanitlandi", e: `Yanıtlandı (${teklifler.length - bekleyen})` },
        ].map((s) => (
          <Link
            key={s.v}
            href={s.v ? `/teklifler?durum=${s.v}` : "/teklifler"}
            className={`rounded-full px-3.5 py-1.5 font-semibold transition ${
              (suzgec ?? "") === s.v ? "bg-ink text-paper" : "bg-paper-2 text-muted hover:text-ink"
            }`}
          >
            {s.e}
          </Link>
        ))}
      </div>

      {liste.length === 0 ? (
        <BosDurum
          baslik={suzgec ? "Bu durumda talep yok" : "Henüz teklif talebi yok"}
          aciklama="Sitenin NEXT_PUBLIC_TEKLIF_API değişkeni bu panelin /api/teklif adresine ayarlandığında formdan gelen her talep burada görünür."
        />
      ) : (
        <ul className="card divide-y divide-line" data-teklif-listesi>
          {liste.map((t) => {
            const v = teklifAyristir(t.govde);
            return (
              <li key={t.numara}>
                <Link href={`/teklifler/${t.numara}`} className="flex items-start gap-4 px-4 py-4 transition hover:bg-paper-2/60 sm:px-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-ink">{v?.name ?? t.baslik}</span>
                      {v?.company ? <span className="text-sm text-muted">· {v.company}</span> : null}
                      <Rozet ton={t.durum === "yeni" ? "vurgu" : "iyi"}>{t.durum === "yeni" ? "Yeni" : "Yanıtlandı"}</Rozet>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{v?.message ?? t.govde}</p>
                    <p className="mt-1.5 text-xs text-faint">
                      {tarihTr(t.tarih)}
                      {v?.service ? ` · ${v.service}` : ""}
                      {v?.budget ? ` · ${v.budget}` : ""}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
