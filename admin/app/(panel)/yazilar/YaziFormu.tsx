"use client";

import { useActionState } from "react";
import { KaydetDugmesi } from "@/components/KaydetDugmesi";
import { Alan, Uyari } from "@/components/ui";
import type { Yazi } from "@/lib/tipler";
import { YAZI_KATEGORILERI } from "@/lib/tipler";
import { yaziKaydet, type FormDurumu } from "../eylemler";

export function YaziFormu({ yazi, govdeMetni }: { yazi?: Yazi; govdeMetni?: string }) {
  const eylem = yaziKaydet.bind(null, yazi?.slug ?? null);
  const [durum, gonder] = useActionState<FormDurumu, FormData>(eylem, {});
  const h = durum.hatalar ?? {};
  const g = (ad: string) => (h[ad] ? ("true" as const) : undefined);

  return (
    <form action={gonder} className="space-y-6">
      <div className="card space-y-5 p-5 sm:p-6">
        <Alan etiket="Başlık" ad="title" hata={h.title}>
          <input id="title" name="title" defaultValue={yazi?.title} className="girdi" aria-invalid={g("title")} />
        </Alan>
        <Alan etiket="Özet" ad="excerpt" hata={h.excerpt} ipucu="Listede ve sosyal medya paylaşımında görünen tek cümle">
          <textarea id="excerpt" name="excerpt" defaultValue={yazi?.excerpt} className="girdi" rows={2} aria-invalid={g("excerpt")} />
        </Alan>
        <div className="grid gap-5 sm:grid-cols-3">
          <Alan etiket="Tarih" ad="date" hata={h.date}>
            <input id="date" name="date" type="date" defaultValue={yazi?.date ?? new Date().toISOString().slice(0, 10)} className="girdi" aria-invalid={g("date")} />
          </Alan>
          <Alan etiket="Kategori" ad="category" hata={h.category}>
            <select id="category" name="category" defaultValue={yazi?.category ?? YAZI_KATEGORILERI[0]} className="girdi">
              {YAZI_KATEGORILERI.map((k) => <option key={k}>{k}</option>)}
            </select>
          </Alan>
          <Alan etiket="Adres (slug)" ad="slug" hata={h.slug} ipucu="Boşsa başlıktan üretilir">
            <input id="slug" name="slug" defaultValue={yazi?.slug} className="girdi font-mono text-sm" aria-invalid={g("slug")} />
          </Alan>
        </div>
      </div>

      <div className="card space-y-3 p-5 sm:p-6">
        <Alan
          etiket="Yazı"
          ad="body"
          hata={h.body}
          ipucu={
            <>
              Paragrafları boş satırla ayırın. Alt başlık için satır başına <code>## </code>, liste için <code>- </code> yazın. Okuma süresi otomatik hesaplanır.
            </>
          }
        >
          <textarea id="body" name="body" defaultValue={govdeMetni} className="girdi font-mono text-sm leading-relaxed" rows={22} aria-invalid={g("body")} />
        </Alan>
      </div>

      {durum.genel ? <Uyari tur="hata">{durum.genel}</Uyari> : null}
      <KaydetDugmesi>{yazi ? "Değişiklikleri kaydet" : "Yazıyı yayınla"}</KaydetDugmesi>
    </form>
  );
}
