import Link from "next/link";
import { Icon } from "@/components/Icon";
import { SilFormu } from "@/components/SilFormu";
import { SonucMesaji } from "@/components/SonucMesaji";
import { BaglantiButonu, BosDurum, Rozet, SayfaBasligi } from "@/components/ui";
import { oku, type MusteriSitesi } from "@/lib/icerik";
import { tarihTr } from "@/lib/teklif";
import { musteriSitesiSil } from "../eylemler";

export const metadata = { title: "Müşteri siteleri" };

type Kontrol = { durum: "acik" | "kapali" | "bilinmiyor"; ms?: number; kod?: number };

/** Siteye kısa bir istek atar; 6 saniyede yanıt yoksa "erişilemiyor" sayılır. */
async function kontrolEt(adres: string): Promise<Kontrol> {
  const baslangic = Date.now();
  try {
    const res = await fetch(adres, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(6000),
      cache: "no-store",
      headers: { "User-Agent": "RebirthYonetim/1.0 (site kontrolü)" },
    });
    return { durum: res.ok ? "acik" : "kapali", ms: Date.now() - baslangic, kod: res.status };
  } catch {
    return { durum: "kapali", ms: Date.now() - baslangic };
  }
}

export default async function MusteriSiteleriSayfasi({
  searchParams,
}: {
  searchParams: Promise<{ kaydedildi?: string; silindi?: string; kontrol?: string }>;
}) {
  const p = await searchParams;
  const siteler = await oku("musteriSiteleri");
  const kontrolAcik = p.kontrol === "1";
  const kontroller = new Map<string, Kontrol>();
  if (kontrolAcik) {
    const sonuclar = await Promise.all(siteler.filter((s) => s.aktif).map(async (s) => [s.id, await kontrolEt(s.adres)] as const));
    for (const [id, k] of sonuclar) kontroller.set(id, k);
  }
  const bugun = new Date();

  return (
    <>
      <SayfaBasligi
        baslik="Müşteri siteleri"
        aciklama="Yaptığınız sitelerin listesi: adres, barındırma, yenileme tarihi ve erişilebilirlik. Yenileme 45 gün kala özet sayfasında uyarı çıkar."
        eylem={
          <>
            <BaglantiButonu href={kontrolAcik ? "/musteri-siteleri" : "/musteri-siteleri?kontrol=1"} tur="ikincil">
              <Icon name="refresh" className="h-4 w-4" /> {kontrolAcik ? "Kontrolü kapat" : "Erişilebilirliği kontrol et"}
            </BaglantiButonu>
            <BaglantiButonu href="/musteri-siteleri/yeni"><Icon name="plus" className="h-4 w-4" /> Yeni site</BaglantiButonu>
          </>
        }
      />
      <SonucMesaji searchParams={searchParams} />
      {siteler.length === 0 ? (
        <BosDurum baslik="Henüz müşteri sitesi yok" eylem={<BaglantiButonu href="/musteri-siteleri/yeni">İlk siteyi ekle</BaglantiButonu>} />
      ) : (
        <ul className="card divide-y divide-line" data-musteri-listesi>
          {siteler.map((s) => (
            <Satir key={s.id} s={s} kontrol={kontroller.get(s.id)} bugun={bugun} />
          ))}
        </ul>
      )}
    </>
  );
}

function Satir({ s, kontrol, bugun }: { s: MusteriSitesi; kontrol?: Kontrol; bugun: Date }) {
  const gunKaldi = s.yenilemeTarihi ? Math.ceil((new Date(s.yenilemeTarihi).getTime() - bugun.getTime()) / 86_400_000) : null;
  return (
    <li data-musteri={s.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
      <Link href={`/musteri-siteleri/${s.id}`} className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="truncate font-semibold text-ink">{s.ad}</span>
          {!s.aktif ? <Rozet>Pasif</Rozet> : null}
          {kontrol ? (
            <Rozet ton={kontrol.durum === "acik" ? "iyi" : "kotu"}>
              {kontrol.durum === "acik" ? `Açık · ${kontrol.ms} ms` : `Erişilemiyor${kontrol.kod ? ` · ${kontrol.kod}` : ""}`}
            </Rozet>
          ) : null}
          {gunKaldi !== null ? (
            <Rozet ton={gunKaldi < 0 ? "kotu" : gunKaldi <= 45 ? "uyari" : "notr"}>
              {gunKaldi < 0 ? "Yenileme geçti" : `Yenileme: ${tarihTr(s.yenilemeTarihi, false)}`}
            </Rozet>
          ) : null}
        </span>
        <span className="block truncate text-xs text-muted">
          {s.adres.replace(/^https?:\/\//, "")} · {s.barindirma}
          {s.musteri ? ` · ${s.musteri}` : ""}
        </span>
      </Link>
      <a href={s.adres} target="_blank" rel="noopener noreferrer" aria-label={`${s.ad} sitesini aç`} className="rounded-full p-2 text-muted hover:text-ink">
        <Icon name="arrowUpRight" className="h-4 w-4" />
      </a>
      <SilFormu eylem={musteriSitesiSil} gizli={{ id: s.id }} onay={`"${s.ad}" listeden kaldırılacak. Emin misiniz?`} etiket="" />
    </li>
  );
}
