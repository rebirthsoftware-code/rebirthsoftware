import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Rozet } from "@/components/ui";
import { depo } from "@/lib/depo";
import { oku } from "@/lib/icerik";
import { tarihTr, teklifAyristir } from "@/lib/teklif";

export const metadata = { title: "Özet" };

export default async function OzetSayfasi() {
  const [projeler, yazilar, hizmetler, musteriler, teklifler, yayin] = await Promise.all([
    oku("projeler"),
    oku("yazilar"),
    oku("hizmetler"),
    oku("musteriSiteleri"),
    depo().teklifler().catch(() => []),
    depo().yayinDurumu(),
  ]);
  const bekleyen = teklifler.filter((t) => t.durum === "yeni");
  const bugun = new Date();
  const yaklasan = musteriler.filter((m) => {
    if (!m.yenilemeTarihi) return false;
    const fark = (new Date(m.yenilemeTarihi).getTime() - bugun.getTime()) / 86_400_000;
    return fark <= 45;
  });

  const kartlar = [
    { href: "/teklifler", etiket: "Bekleyen teklif", deger: bekleyen.length, ikon: "inbox", vurgu: bekleyen.length > 0 },
    { href: "/projeler", etiket: "Referans proje", deger: projeler.length, ikon: "folder" },
    { href: "/yazilar", etiket: "Blog yazısı", deger: yazilar.length, ikon: "pen" },
    { href: "/hizmetler", etiket: "Hizmet", deger: hizmetler.length, ikon: "layers" },
    { href: "/musteri-siteleri", etiket: "Müşteri sitesi", deger: musteriler.filter((m) => m.aktif).length, ikon: "globe" },
  ];

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="label text-muted">{tarihTr(bugun.toISOString(), false)}</span>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Özet</h1>
        </div>
        <YayinRozeti yayin={yayin} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {kartlar.map((k) => (
          <Link key={k.href} href={k.href} className={`card p-4 transition hover:border-line-strong ${k.vurgu ? "ring-2 ring-flame/30" : ""}`}>
            <Icon name={k.ikon} className={`h-5 w-5 ${k.vurgu ? "text-flame" : "text-muted"}`} />
            <div className="mt-3 text-3xl font-bold tabular-nums tracking-tight text-ink">{k.deger}</div>
            <div className="mt-0.5 text-xs font-medium text-muted">{k.etiket}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <section className="card min-w-0 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-ink">Son teklif talepleri</h2>
            <Link href="/teklifler" className="text-xs font-semibold text-flame">Tümü</Link>
          </div>
          {teklifler.length === 0 ? (
            <p className="mt-4 text-sm text-muted">
              Henüz talep yok. Sitenin teklif formu bu panele bağlandığında talepler burada listelenir.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {teklifler.slice(0, 5).map((t) => {
                const v = teklifAyristir(t.govde);
                return (
                  <li key={t.numara}>
                    <Link href={`/teklifler/${t.numara}`} className="flex items-center justify-between gap-3 py-3 text-sm">
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-ink">{v?.name ?? t.baslik}</span>
                        <span className="block truncate text-xs text-muted">{v?.service || v?.company || tarihTr(t.tarih)}</span>
                      </span>
                      <Rozet ton={t.durum === "yeni" ? "vurgu" : "iyi"}>{t.durum === "yeni" ? "Yeni" : "Yanıtlandı"}</Rozet>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="card min-w-0 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-ink">Yaklaşan yenilemeler</h2>
            <Link href="/musteri-siteleri" className="text-xs font-semibold text-flame">Tümü</Link>
          </div>
          {yaklasan.length === 0 ? (
            <p className="mt-4 text-sm text-muted">
              Önümüzdeki 45 gün içinde yenilenecek alan adı / barındırma yok. Tarihleri müşteri siteleri sayfasından girebilirsiniz.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {yaklasan.map((m) => {
                const gecti = new Date(m.yenilemeTarihi) < bugun;
                return (
                  <li key={m.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-ink">{m.ad}</span>
                      <span className="block truncate text-xs text-muted">{m.adres.replace(/^https?:\/\//, "")}</span>
                    </span>
                    <Rozet ton={gecti ? "kotu" : "uyari"}>{gecti ? "Geçti" : tarihTr(m.yenilemeTarihi, false)}</Rozet>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

function YayinRozeti({ yayin }: { yayin: Awaited<ReturnType<ReturnType<typeof depo>["yayinDurumu"]>> }) {
  if (yayin.durum === "bilinmiyor") return null;
  const ton = yayin.durum === "basarili" ? "iyi" : yayin.durum === "calisiyor" ? "uyari" : "kotu";
  const metin = yayin.durum === "basarili" ? "Site yayında" : yayin.durum === "calisiyor" ? "Site yayınlanıyor…" : "Son yayın başarısız";
  const ic = (
    <Rozet ton={ton}>
      <Icon name={yayin.durum === "calisiyor" ? "refresh" : yayin.durum === "basarili" ? "check" : "close"} className="h-3 w-3" />
      {metin}
      {yayin.tarih ? <span className="font-normal opacity-70"> · {tarihTr(yayin.tarih)}</span> : null}
    </Rozet>
  );
  return yayin.url ? <a href={yayin.url} target="_blank" rel="noopener noreferrer">{ic}</a> : ic;
}
