"use server";

import { redirect } from "next/navigation";
import { oturumAc, oturumKapat, parolaDogru, parolaTanimli } from "@/lib/oturum";

export type GirisDurumu = { hata?: string };

export async function girisYap(_onceki: GirisDurumu, fd: FormData): Promise<GirisDurumu> {
  if (!parolaTanimli()) {
    return { hata: "ADMIN_PAROLA ortam değişkeni tanımlı değil. Vercel → Settings → Environment Variables bölümünden ekleyin." };
  }
  const parola = String(fd.get("parola") ?? "");
  // Kaba kuvvete karşı küçük bir gecikme; tek kullanıcılı panelde yeterli.
  await new Promise((r) => setTimeout(r, 400));
  if (!parolaDogru(parola)) return { hata: "Parola yanlış." };
  await oturumAc();
  redirect("/");
}

export async function cikisYap() {
  await oturumKapat();
  redirect("/giris");
}
