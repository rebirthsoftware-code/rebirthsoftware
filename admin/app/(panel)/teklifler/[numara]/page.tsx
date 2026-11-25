import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { KaydetDugmesi } from "@/components/KaydetDugmesi";
import { Rozet } from "@/components/ui";
import { depo } from "@/lib/depo";
import { tarihTr, teklifAyristir } from "@/lib/teklif";
import { teklifDurumDegistir } from "../../eylemler";
import { NotFormu } from "./NotFormu";

export const metadata = { title: "Teklif talebi" };

export default async function TeklifSayfasi({ params }: { params: Promise<{ numara: string }> }) {
  const { numara } = await params;
  const n = Number(numara);
  if (!Number.isInteger(n)) notFound();
  const t = await depo().teklif(n);
  if (!t) notFound();
  const v = teklifAyristir(t.govde);
  const telefon = v?.phone?.replace(/\D/g, "");
  const wa = telefon ? `https://wa.me/${telefon.startsWith("0") ? "9" + telefon : telefon.startsWith("90") ? telefon : "90" + telefon}` : null;

  const alanlar: [string, string | undefined][] = [
    ["Firma", v?.company],
    ["E-posta", v?.email],
    ["Telefon", v?.phone],
    ["Hizmet", v?.service],
    ["Bütçe", v?.budget],
    ["Kaynak", v?.kaynak],
  ];

  return (
    <>
      <Link href="/teklifler" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
        <Icon name="arrow" className="h-4 w-4 rotate-180" /> Teklifler
      </Link>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-ink">{v?.name ?? t.baslik}</h1>
            <Rozet ton={t.durum === "yeni" ? "vurgu" : "iyi"}>{t.durum === "yeni" ? "Yeni" : "Yanıtlandı"}</Rozet>
          </div>
          <p className="mt-1 text-sm text-muted">
            #{t.numara} · {tarihTr(t.tarih)}
            {t.kapanis ? ` · yanıtlandı ${tarihTr(t.kapanis)}` : ""}
          </p>
        </div>
        <form action={teklifDurumDegistir}>
          <input type="hidden" name="numara" value={t.numara} />
          <input type="hidden" name="durum" value={t.durum === "yeni" ? "yanitlandi" : "yeni"} />
          <KaydetDugmesi tur={t.durum === "yeni" ? "birincil" : "ikincil"} bekleme="Güncelleniyor…">
            <Icon name={t.durum === "yeni" ? "check" : "refresh"} className="h-4 w-4" />
            {t.durum === "yeni" ? "Yanıtlandı olarak işaretle" : "Yeniden aç"}
          </KaydetDugmesi>
        </form>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="min-w-0 space-y-5 lg:col-span-2">
          <section className="card p-5">
            <h2 className="text-sm font-semibold text-ink">Mesaj</h2>
            <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-ink-soft">{v?.message ?? t.govde}</p>
          </section>
          <section className="card p-5">
            <h2 className="text-sm font-semibold text-ink">Notlar</h2>
            {t.notlar?.length ? (
              <ul className="mt-3 space-y-3">
                {t.notlar.map((n, i) => (
                  <li key={i} className="rounded-xl bg-paper-2 px-4 py-3 text-sm">
                    <p className="whitespace-pre-wrap text-ink-soft">{n.metin}</p>
                    <p className="mt-1.5 text-xs text-faint">{tarihTr(n.tarih)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted">Henüz not yok. Görüşme özetini, verdiğiniz fiyatı buraya yazın.</p>
            )}
            <div className="mt-4">
              <NotFormu numara={t.numara} />
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="card p-5">
            <h2 className="text-sm font-semibold text-ink">İletişim</h2>
            <dl className="mt-3 space-y-2.5 text-sm">
              {alanlar.filter(([, d]) => d).map(([e, d]) => (
                <div key={e}>
                  <dt className="text-xs font-semibold tracking-wide text-muted uppercase">{e}</dt>
                  <dd className="mt-0.5 break-words text-ink">{d}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex flex-col gap-2">
              {v?.email ? (
                <a href={`mailto:${v.email}?subject=${encodeURIComponent("Teklif talebiniz hakkında")}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm font-semibold text-ink hover:border-ink">
                  <Icon name="mail" className="h-4 w-4" /> E-posta yaz
                </a>
              ) : null}
              {wa ? (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper hover:bg-flame">
                  <Icon name="whatsapp" className="h-4 w-4" /> WhatsApp&apos;tan yaz
                </a>
              ) : null}
              {t.url ? (
                <a href={t.url} target="_blank" rel="noopener noreferrer" className="text-center text-xs font-semibold text-muted hover:text-ink">
                  GitHub&apos;da aç
                </a>
              ) : null}
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
