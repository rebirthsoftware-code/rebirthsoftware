import Link from "next/link";
import { CikisDugmesi } from "@/components/CikisDugmesi";
import { Gezinme } from "@/components/Gezinme";
import { depo } from "@/lib/depo";
import { oturumGerekli } from "@/lib/oturum";

export const dynamic = "force-dynamic";

/**
 * Korunan alan: oturum yoksa girişe yönlendirir. Sol kenar çubuğu (geniş
 * ekran) ya da alt sekme çubuğu (telefon) ile sayfa gövdesi.
 */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await oturumGerekli();

  let bekleyen = 0;
  try {
    bekleyen = (await depo().teklifler()).filter((t) => t.durum === "yeni").length;
  } catch {
    /* depo erişilemezse rozet gösterilmez; sayfa kendi hatasını gösterir */
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-[1400px]">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line bg-paper-2/60 px-4 py-6 lg:flex">
        <Link href="/" className="px-3">
          <span className="label text-muted">Rebirth Software</span>
          <span className="mt-1 block text-lg font-bold tracking-tight text-ink">Yönetim</span>
        </Link>
        <div className="mt-8 flex-1">
          <Gezinme bekleyenTeklif={bekleyen} />
        </div>
        <div className="px-1 text-xs text-faint">
          <p className="mb-2 truncate" title={depo().aciklama}>
            Depo: {depo().ad === "github" ? "GitHub" : "yerel klasör"}
          </p>
          <CikisDugmesi />
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-white/95 px-4 backdrop-blur lg:hidden">
          <Link href="/" className="text-base font-bold tracking-tight text-ink">
            Rebirth Yönetim
          </Link>
          <CikisDugmesi />
        </header>
        <main id="icerik" className="px-4 pb-28 pt-6 sm:px-8 lg:pb-12 lg:pt-10">
          {children}
        </main>
        <div className="lg:hidden">
          <Gezinme bekleyenTeklif={bekleyen} />
        </div>
      </div>
    </div>
  );
}
