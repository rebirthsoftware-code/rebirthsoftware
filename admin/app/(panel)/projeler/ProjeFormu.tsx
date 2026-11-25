"use client";

import { useActionState } from "react";
import { KaydetDugmesi } from "@/components/KaydetDugmesi";
import { Alan, Uyari } from "@/components/ui";
import type { Proje } from "@/lib/tipler";
import { PROJE_TURLERI } from "@/lib/tipler";
import { projeKaydet, type FormDurumu } from "../eylemler";

export function ProjeFormu({ proje }: { proje?: Proje }) {
  const eylem = projeKaydet.bind(null, proje?.slug ?? null);
  const [durum, gonder] = useActionState<FormDurumu, FormData>(eylem, {});
  const h = durum.hatalar ?? {};
  const g = (ad: string) => (h[ad] ? ("true" as const) : undefined);

  return (
    <form action={gonder} className="space-y-6" encType="multipart/form-data">
      <div className="card space-y-5 p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-ink">Temel bilgiler</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Alan etiket="Proje adı" ad="title" hata={h.title}>
            <input id="title" name="title" defaultValue={proje?.title} className="girdi" aria-invalid={g("title")} placeholder="Örn. Pastalia Bostanlı" />
          </Alan>
          <Alan etiket="Müşteri" ad="client" hata={h.client}>
            <input id="client" name="client" defaultValue={proje?.client} className="girdi" aria-invalid={g("client")} />
          </Alan>
          <Alan etiket="Sektör" ad="sector" hata={h.sector}>
            <input id="sector" name="sector" defaultValue={proje?.sector} className="girdi" placeholder="Örn. Pastane & kafe" />
          </Alan>
          <Alan etiket="Yıl" ad="year" hata={h.year}>
            <input id="year" name="year" inputMode="numeric" defaultValue={proje?.year ?? String(new Date().getFullYear())} className="girdi" aria-invalid={g("year")} />
          </Alan>
          <Alan etiket="Tür" ad="type" hata={h.type}>
            <select id="type" name="type" defaultValue={proje?.type ?? PROJE_TURLERI[0]} className="girdi">
              {PROJE_TURLERI.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Alan>
          <Alan etiket="Site adresi" ad="url" hata={h.url} ipucu="Boş bırakılabilir">
            <input id="url" name="url" type="url" defaultValue={proje?.url} className="girdi" aria-invalid={g("url")} placeholder="https://" />
          </Alan>
          <Alan etiket="Adres (slug)" ad="slug" hata={h.slug} ipucu={`Sitede /projeler/… olarak görünür. Boşsa addan üretilir.`}>
            <input id="slug" name="slug" defaultValue={proje?.slug} className="girdi font-mono text-sm" aria-invalid={g("slug")} />
          </Alan>
          <div className="flex items-end pb-2">
            <label className="inline-flex items-center gap-2.5 text-sm font-medium text-ink">
              <input type="checkbox" name="featured" defaultChecked={proje?.featured} className="h-4 w-4 accent-flame" />
              Ana sayfadaki vitrinde göster
            </label>
          </div>
        </div>
      </div>

      <div className="card space-y-5 p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-ink">Anlatım</h2>
        <Alan etiket="Tek cümlelik özet" ad="summary" hata={h.summary}>
          <textarea id="summary" name="summary" defaultValue={proje?.summary} className="girdi" rows={2} aria-invalid={g("summary")} />
        </Alan>
        <Alan etiket="Müşterinin sorunu neydi?" ad="challenge" hata={h.challenge}>
          <textarea id="challenge" name="challenge" defaultValue={proje?.challenge} className="girdi" rows={4} />
        </Alan>
        <Alan etiket="Ne yaptınız?" ad="solution" hata={h.solution}>
          <textarea id="solution" name="solution" defaultValue={proje?.solution} className="girdi" rows={4} />
        </Alan>
        <div className="grid gap-5 sm:grid-cols-2">
          <Alan etiket="Sonuçlar" ad="result" hata={h.result} ipucu="Her satır bir madde">
            <textarea id="result" name="result" defaultValue={proje?.result.join("\n")} className="girdi" rows={4} />
          </Alan>
          <Alan etiket="Kullanılan teknolojiler" ad="stack" hata={h.stack} ipucu="Her satır bir etiket">
            <textarea id="stack" name="stack" defaultValue={proje?.stack.join("\n")} className="girdi" rows={4} />
          </Alan>
        </div>
      </div>

      <div className="card space-y-4 p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-ink">Ekran görüntüsü</h2>
        {proje?.image ? (
          <p className="text-sm text-muted">
            Mevcut görsel: <code className="rounded bg-paper-2 px-1.5 py-0.5 text-xs">{proje.image}</code>. Yeni dosya seçerseniz değişir.
          </p>
        ) : null}
        <input type="hidden" name="image" defaultValue={proje?.image ?? ""} />
        <Alan etiket="Görsel dosyası" ad="gorsel" hata={h.gorsel} ipucu="PNG, JPG veya WebP; en az 640 px genişlik, önerilen 1600×1000. Küçük boyutlar otomatik üretilir.">
          <input id="gorsel" name="gorsel" type="file" accept="image/png,image/jpeg,image/webp" className="girdi file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-3 file:py-1 file:text-xs file:font-semibold file:text-paper" />
        </Alan>
      </div>

      {durum.genel ? <Uyari tur="hata">{durum.genel}</Uyari> : null}
      <div className="flex items-center gap-3">
        <KaydetDugmesi>{proje ? "Değişiklikleri kaydet" : "Projeyi ekle"}</KaydetDugmesi>
        <span className="text-xs text-faint">Kaydedince site 1-2 dakika içinde güncellenir.</span>
      </div>
    </form>
  );
}
