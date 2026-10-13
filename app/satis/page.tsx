import type { Metadata } from "next";
import { SatisSistemi } from "@/components/satis/SatisSistemi";
import { Container } from "@/components/ui";
import { ISLETME } from "@/lib/satis";

export const metadata: Metadata = {
  title: { absolute: `${ISLETME.ad} | ${ISLETME.altBaslik}` },
  description:
    "Barkod okutarak satış yapın, stokları takip edin, günlük ciroyu görün. Tarayıcıda çalışır, kurulum gerektirmez.",
  // İç kullanım aracı: arama motorlarında listelenmesin.
  robots: { index: false, follow: false },
  alternates: { canonical: "/satis" },
};

/**
 * Barkodlu, stoklu satış sistemi.
 *
 * POS'tan ve kurumsal siteden ayrı, kendi başına çalışan bir sayfa: site
 * başlığı ve alt bilgisi burada yoktur (bkz. components/SiteChrome.tsx).
 * Tüm mantık istemci tarafında; veriler tarayıcının localStorage alanında
 * tutulur. Vercel'de de GitHub Pages'in statik sürümünde de aynı çalışır.
 */
export default function SatisPage() {
  return (
    <>
      <header className="border-b border-line bg-white">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <h1 className="flex items-baseline gap-3">
              <span className="text-xl font-bold tracking-tight text-ink">{ISLETME.ad}</span>
              <span className="label text-muted">{ISLETME.altBaslik}</span>
            </h1>
            <span className="hidden text-xs text-faint sm:inline">
              Veriler bu tarayıcıda saklanır · Stok sekmesinden yedek alın
            </span>
          </div>
        </Container>
      </header>

      <section className="py-6 sm:py-8">
        <Container>
          <SatisSistemi />
        </Container>
      </section>
    </>
  );
}
