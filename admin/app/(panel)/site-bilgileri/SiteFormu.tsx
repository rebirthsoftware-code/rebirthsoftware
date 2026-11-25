"use client";

import { useActionState } from "react";
import { KaydetDugmesi } from "@/components/KaydetDugmesi";
import { Alan, Uyari } from "@/components/ui";
import type { SiteBilgi } from "@/lib/tipler";
import { siteKaydet, type FormDurumu } from "../eylemler";

export function SiteFormu({ bilgi }: { bilgi: SiteBilgi }) {
  const [durum, gonder] = useActionState<FormDurumu, FormData>(siteKaydet, {});
  const h = durum.hatalar ?? {};
  const g = (ad: string) => (h[ad] ? ("true" as const) : undefined);

  return (
    <form action={gonder} className="space-y-6">
      <div className="card space-y-5 p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-ink">İletişim</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Alan etiket="Telefon" ad="phone" hata={h.phone} ipucu="Sitede göründüğü gibi, ör. 0538 212 03 17">
            <input id="phone" name="phone" defaultValue={bilgi.phone} className="girdi" aria-invalid={g("phone")} />
          </Alan>
          <Alan etiket="WhatsApp numarası" ad="whatsapp" hata={h.whatsapp} ipucu="Ülke koduyla, boşluksuz. Boşsa telefondan türetilir.">
            <input id="whatsapp" name="whatsapp" defaultValue={bilgi.whatsapp} className="girdi" aria-invalid={g("whatsapp")} />
          </Alan>
          <Alan etiket="E-posta" ad="email" hata={h.email}>
            <input id="email" name="email" type="email" defaultValue={bilgi.email} className="girdi" aria-invalid={g("email")} />
          </Alan>
          <Alan etiket="Şehir" ad="city" hata={h.city}>
            <input id="city" name="city" defaultValue={bilgi.city} className="girdi" />
          </Alan>
          <Alan etiket="Ülke" ad="country" hata={h.country}>
            <input id="country" name="country" defaultValue={bilgi.country} className="girdi" />
          </Alan>
          <Alan etiket="Adres satırı" ad="address" hata={h.address}>
            <input id="address" name="address" defaultValue={bilgi.address} className="girdi" />
          </Alan>
        </div>
      </div>

      <div className="card space-y-5 p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-ink">Sosyal medya</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <Alan etiket="LinkedIn" ad="linkedin"><input id="linkedin" name="linkedin" type="url" defaultValue={bilgi.social.linkedin} className="girdi" /></Alan>
          <Alan etiket="GitHub" ad="github"><input id="github" name="github" type="url" defaultValue={bilgi.social.github} className="girdi" /></Alan>
          <Alan etiket="Instagram" ad="instagram"><input id="instagram" name="instagram" type="url" defaultValue={bilgi.social.instagram} className="girdi" /></Alan>
        </div>
      </div>

      <div className="card space-y-5 p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-ink">Ana sayfadaki rakamlar</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Alan etiket="Değerler" ad="stats_value" hata={h.stats_value} ipucu="Her satır bir değer, ör. 8">
            <textarea id="stats_value" name="stats_value" defaultValue={bilgi.stats.map((s) => s.value).join("\n")} className="girdi" rows={4} aria-invalid={g("stats_value")} />
          </Alan>
          <Alan etiket="Etiketler" ad="stats_label" hata={h.stats_label} ipucu="Aynı sırayla, ör. Yayındaki referans">
            <textarea id="stats_label" name="stats_label" defaultValue={bilgi.stats.map((s) => s.label).join("\n")} className="girdi" rows={4} />
          </Alan>
        </div>
      </div>

      {durum.genel ? <Uyari tur="hata">{durum.genel}</Uyari> : null}
      {durum.ok ? <Uyari tur="ok">{durum.ok}</Uyari> : null}
      <KaydetDugmesi>Kaydet</KaydetDugmesi>
    </form>
  );
}
