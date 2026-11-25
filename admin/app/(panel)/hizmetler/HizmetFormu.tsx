"use client";

import { useActionState } from "react";
import { Icon } from "@/components/Icon";
import { KaydetDugmesi } from "@/components/KaydetDugmesi";
import { Alan, Uyari } from "@/components/ui";
import type { Hizmet } from "@/lib/tipler";
import { HIZMET_IKONLARI } from "@/lib/tipler";
import { hizmetKaydet, type FormDurumu } from "../eylemler";

export function HizmetFormu({ hizmet }: { hizmet?: Hizmet }) {
  const eylem = hizmetKaydet.bind(null, hizmet?.slug ?? null);
  const [durum, gonder] = useActionState<FormDurumu, FormData>(eylem, {});
  const h = durum.hatalar ?? {};
  const g = (ad: string) => (h[ad] ? ("true" as const) : undefined);

  return (
    <form action={gonder} className="space-y-6">
      <div className="card space-y-5 p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Alan etiket="Hizmet adı" ad="title" hata={h.title}>
            <input id="title" name="title" defaultValue={hizmet?.title} className="girdi" aria-invalid={g("title")} />
          </Alan>
          <Alan etiket="Adres (slug)" ad="slug" hata={h.slug} ipucu="Boşsa addan üretilir">
            <input id="slug" name="slug" defaultValue={hizmet?.slug} className="girdi font-mono text-sm" aria-invalid={g("slug")} />
          </Alan>
        </div>
        <Alan etiket="Kısa açıklama" ad="short" hata={h.short} ipucu="Kartlarda ve menüde görünen tek cümle">
          <textarea id="short" name="short" defaultValue={hizmet?.short} className="girdi" rows={2} aria-invalid={g("short")} />
        </Alan>
        <Alan etiket="Açıklama" ad="description" hata={h.description}>
          <textarea id="description" name="description" defaultValue={hizmet?.description} className="girdi" rows={5} aria-invalid={g("description")} />
        </Alan>
        <fieldset>
          <legend className="mb-2 block text-xs font-semibold tracking-wide text-muted uppercase">Simge</legend>
          <div className="flex flex-wrap gap-2">
            {HIZMET_IKONLARI.map((ikon) => (
              <label key={ikon} className="cursor-pointer">
                <input type="radio" name="icon" value={ikon} defaultChecked={(hizmet?.icon ?? HIZMET_IKONLARI[0]) === ikon} className="peer sr-only" />
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line text-muted transition peer-checked:border-flame peer-checked:bg-flame-tint peer-checked:text-flame peer-focus-visible:outline-2 peer-focus-visible:outline-flame">
                  <Icon name={ikon} className="h-5 w-5" />
                  <span className="sr-only">{ikon}</span>
                </span>
              </label>
            ))}
          </div>
          {h.icon ? <p role="alert" className="mt-1.5 text-xs font-medium text-rose-700">{h.icon}</p> : null}
        </fieldset>
      </div>

      <div className="card space-y-5 p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Alan etiket="Özellikler" ad="features" hata={h.features} ipucu="Her satır bir madde">
            <textarea id="features" name="features" defaultValue={hizmet?.features.join("\n")} className="girdi" rows={7} aria-invalid={g("features")} />
          </Alan>
          <Alan etiket="Teslim edilenler" ad="deliverables" hata={h.deliverables} ipucu="Her satır bir madde">
            <textarea id="deliverables" name="deliverables" defaultValue={hizmet?.deliverables.join("\n")} className="girdi" rows={7} />
          </Alan>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Alan etiket="Sık sorulan sorular" ad="faq_q" hata={h.faq_q} ipucu="Her satır bir soru">
            <textarea id="faq_q" name="faq_q" defaultValue={hizmet?.faq.map((f) => f.q).join("\n")} className="girdi" rows={6} />
          </Alan>
          <Alan etiket="Cevaplar" ad="faq_a" hata={h.faq_a} ipucu="Aynı sırayla, her satır bir cevap">
            <textarea id="faq_a" name="faq_a" defaultValue={hizmet?.faq.map((f) => f.a).join("\n")} className="girdi" rows={6} aria-invalid={g("faq_a")} />
          </Alan>
        </div>
      </div>

      {durum.genel ? <Uyari tur="hata">{durum.genel}</Uyari> : null}
      <KaydetDugmesi>{hizmet ? "Değişiklikleri kaydet" : "Hizmeti ekle"}</KaydetDugmesi>
    </form>
  );
}
