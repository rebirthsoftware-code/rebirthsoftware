import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CtaSection } from "@/components/CtaSection";
import { Faq } from "@/components/Faq";
import { Container } from "@/components/ui";
import { generalFaq } from "@/lib/process";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Sık Sorulan Sorular",
  description:
 "Web sitesi fiyatları, teslim süresi, alan adı ve hosting, bakım ve ödeme koşulları hakkında merak edilenler.",
  alternates: { canonical: "/sss" },
};

const all = [
  ...generalFaq,
  ...services.flatMap((s) => s.faq),
] as { q: string; a: string }[];

const jsonLd = {
 "@context": "https://schema.org",
 "@type": "FAQPage",
  mainEntity: all.map((f) => ({
 "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="SSS"
        title="Sık sorulan sorular"
        description="Teklif aşamasında en çok karşılaştığımız soruları ve net cevaplarını bir araya getirdik."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl space-y-10">
            <div>
              <h2 className="mb-4 text-lg font-semibold text-ink">
                Genel sorular
              </h2>
              <Faq items={generalFaq as unknown as { q: string; a: string }[]} />
            </div>

            {services
              .filter((s) => s.faq.length > 0)
              .map((s) => (
                <div key={s.slug}>
                  <h2 className="mb-4 text-lg font-semibold text-ink">
                    {s.title}
                  </h2>
                  <Faq items={s.faq} />
                </div>
              ))}
          </div>
        </Container>
      </section>

      <CtaSection
        title="Cevabını bulamadığınız bir soru mu var?"
        description="Yazın ya da arayın; satış konuşması yapmadan, doğrudan cevap veriyoruz."
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
