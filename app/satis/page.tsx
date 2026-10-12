import type { Metadata } from "next";
import { SatisSistemi } from "@/components/satis/SatisSistemi";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Barkodlu Satış ve Stok Sistemi",
  description:
    "Barkod okutarak satış yapın, stokları takip edin, günlük ciroyu görün. Tarayıcıda çalışır, kurulum gerektirmez.",
  // İç kullanım aracı: arama motorlarında listelenmesin.
  robots: { index: false, follow: false },
  alternates: { canonical: "/satis" },
};

/**
 * Barkodlu, stoklu satış sistemi.
 *
 * POS'tan ayrı, kendi başına çalışan bir sayfa. Tüm mantık istemci
 * tarafında; veriler tarayıcının localStorage alanında tutulur. Bu sayede
 * hem Vercel'de hem GitHub Pages'in statik sürümünde aynı şekilde çalışır.
 */
export default function SatisPage() {
  return (
    <section className="pt-28 pb-16 sm:pt-32 sm:pb-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
          <div>
            <span className="label flex items-center gap-3 text-muted">
              <span className="h-px w-8 bg-flame" />
              Satış sistemi
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Barkodlu satış ve stok takibi
            </h1>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted">
            USB/Bluetooth barkod okuyucu, kamera veya klavyeyle çalışır. Veriler bu
            tarayıcıda saklanır; Stok sekmesinden yedek alabilirsiniz.
          </p>
        </div>

        <div className="mt-6">
          <SatisSistemi />
        </div>
      </Container>
    </section>
  );
}
