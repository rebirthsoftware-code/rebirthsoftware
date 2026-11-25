"use client";

import { useActionState, useEffect, useRef } from "react";
import { KaydetDugmesi } from "@/components/KaydetDugmesi";
import { Alan, Uyari } from "@/components/ui";
import { teklifNotEkle, type FormDurumu } from "../../eylemler";

export function NotFormu({ numara }: { numara: number }) {
  const [durum, eylem] = useActionState<FormDurumu, FormData>(teklifNotEkle, {});
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (durum.ok) ref.current?.reset();
  }, [durum]);
  return (
    <form ref={ref} action={eylem} className="space-y-3">
      <input type="hidden" name="numara" value={numara} />
      <Alan etiket="Yeni not" ad="not" hata={durum.hatalar?.not}>
        <textarea id="not" name="not" className="girdi" rows={3} placeholder="Örn. Telefonla görüşüldü, 45.000 ₺ teklif verildi; cuma dönüş yapacak." />
      </Alan>
      {durum.genel ? <Uyari tur="hata">{durum.genel}</Uyari> : null}
      <KaydetDugmesi tur="ikincil" bekleme="Ekleniyor…">Not ekle</KaydetDugmesi>
    </form>
  );
}
