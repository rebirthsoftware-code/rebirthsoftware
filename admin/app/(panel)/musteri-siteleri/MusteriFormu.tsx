"use client";

import { useActionState } from "react";
import { KaydetDugmesi } from "@/components/KaydetDugmesi";
import { Alan, Uyari } from "@/components/ui";
import type { MusteriSitesi } from "@/lib/tipler";
import { BARINDIRMALAR } from "@/lib/tipler";
import { musteriSitesiKaydet, type FormDurumu } from "../eylemler";

export function MusteriFormu({ site }: { site?: MusteriSitesi }) {
  const eylem = musteriSitesiKaydet.bind(null, site?.id ?? null);
  const [durum, gonder] = useActionState<FormDurumu, FormData>(eylem, {});
  const h = durum.hatalar ?? {};
  const g = (ad: string) => (h[ad] ? ("true" as const) : undefined);

  return (
    <form action={gonder} className="space-y-6">
      <div className="card space-y-5 p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Alan etiket="Site adı" ad="ad" hata={h.ad}>
            <input id="ad" name="ad" defaultValue={site?.ad} className="girdi" aria-invalid={g("ad")} />
          </Alan>
          <Alan etiket="Müşteri" ad="musteri" hata={h.musteri}>
            <input id="musteri" name="musteri" defaultValue={site?.musteri} className="girdi" />
          </Alan>
          <Alan etiket="Adres" ad="adres" hata={h.adres}>
            <input id="adres" name="adres" type="url" defaultValue={site?.adres} className="girdi" aria-invalid={g("adres")} placeholder="https://" />
          </Alan>
          <Alan etiket="Barındırma" ad="barindirma" hata={h.barindirma}>
            <select id="barindirma" name="barindirma" defaultValue={site?.barindirma ?? "Vercel"} className="girdi">
              {BARINDIRMALAR.map((b) => <option key={b}>{b}</option>)}
            </select>
          </Alan>
          <Alan etiket="Yenileme tarihi" ad="yenilemeTarihi" hata={h.yenilemeTarihi} ipucu="Alan adı / barındırma yenileme günü. 45 gün kala özette uyarı çıkar.">
            <input id="yenilemeTarihi" name="yenilemeTarihi" type="date" defaultValue={site?.yenilemeTarihi} className="girdi" aria-invalid={g("yenilemeTarihi")} />
          </Alan>
          <div className="flex items-end pb-2">
            <label className="inline-flex items-center gap-2.5 text-sm font-medium text-ink">
              <input type="hidden" name="aktif" value="off" />
              <input type="checkbox" name="aktif" value="on" defaultChecked={site?.aktif ?? true} className="h-4 w-4 accent-flame" />
              Aktif (bakım sözleşmesi sürüyor)
            </label>
          </div>
        </div>
        <Alan etiket="Notlar" ad="notlar" hata={h.notlar} ipucu="Erişim bilgisi yazmayın; yalnızca hatırlatma ve bağlam.">
          <textarea id="notlar" name="notlar" defaultValue={site?.notlar} className="girdi" rows={4} />
        </Alan>
      </div>
      {durum.genel ? <Uyari tur="hata">{durum.genel}</Uyari> : null}
      <KaydetDugmesi>{site ? "Değişiklikleri kaydet" : "Siteyi ekle"}</KaydetDugmesi>
    </form>
  );
}
