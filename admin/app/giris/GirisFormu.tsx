"use client";

import { useActionState } from "react";
import { Alan, Uyari } from "@/components/ui";
import { KaydetDugmesi } from "@/components/KaydetDugmesi";
import { girisYap, type GirisDurumu } from "./eylemler";

export function GirisFormu() {
  const [durum, eylem] = useActionState<GirisDurumu, FormData>(girisYap, {});
  return (
    <form action={eylem} className="card space-y-5 p-6">
      <Alan etiket="Parola" ad="parola" hata={durum.hata}>
        <input
          id="parola"
          name="parola"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className="girdi"
          aria-invalid={durum.hata ? "true" : undefined}
        />
      </Alan>
      {durum.hata ? <Uyari tur="hata">{durum.hata}</Uyari> : null}
      <KaydetDugmesi bekleme="Kontrol ediliyor…">Giriş yap</KaydetDugmesi>
    </form>
  );
}
