"use client";

import { useFormStatus } from "react-dom";
import { Buton } from "./ui";

/** Sunucu eylemi sürerken kendini kilitleyen gönder düğmesi. */
export function KaydetDugmesi({
  children = "Kaydet",
  bekleme = "Kaydediliyor…",
  tur,
}: {
  children?: React.ReactNode;
  bekleme?: string;
  tur?: "birincil" | "ikincil" | "tehlike" | "sade";
}) {
  const { pending } = useFormStatus();
  return (
    <Buton type="submit" tur={tur} disabled={pending} aria-busy={pending}>
      {pending ? bekleme : children}
    </Buton>
  );
}
