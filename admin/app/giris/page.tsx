import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { oturumVar } from "@/lib/oturum";
import { GirisFormu } from "./GirisFormu";

export const metadata: Metadata = { title: "Giriş" };

export default async function GirisSayfasi() {
  if (await oturumVar()) redirect("/");
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="label text-muted">Rebirth Software</span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">Yönetim paneli</h1>
          <p className="mt-2 text-sm text-muted">Site içeriği, teklif talepleri ve müşteri siteleri.</p>
        </div>
        <GirisFormu />
      </div>
    </main>
  );
}
