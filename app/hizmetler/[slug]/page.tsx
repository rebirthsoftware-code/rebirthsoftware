import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { CtaSection } from "@/components/CtaSection";
import { Faq } from "@/components/Faq";
import { Icon } from "@/components/Icon";
import { Button, CheckItem, Container } from "@/components/ui";
import { getService, services } from "@/lib/services";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Hizmet bulunamadı" };
  return {
    title: service.title,
    description: service.short,
    alternates: { canonical: `/hizmetler/${service.slug}` },
    openGraph: { title: service.title, description: service.short },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  const jsonLd = {
 "@context": "https://schema.org",
 "@type": "Service",
    name: service.title,
    description: service.short,
    provider: { "@type": "Organization", name: site.name, url: site.url },
    areaServed: "TR",
  };

  return (
    <>
      <PageHero eyebrow="Hizmet" title={service.title} description={service.short}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={`/teklif-al?hizmet=${service.slug}`}>
            Bu hizmet için teklif al
            <Icon name="arrow" className="h-4 w-4" />
          </Button>
          <Button href="/projeler" variant="outline">
            İlgili projeleri gör
          </Button>
        </div>
      </PageHero>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="prose-tr text-base leading-relaxed text-carbon-200">
                {service.description}
              </p>

              <h2 className="mt-10 text-xl font-semibold text-white">
                Neler dahil?
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {service.features.map((f) => (
                  <CheckItem key={f}>{f}</CheckItem>
                ))}
              </ul>

              <h2 className="mt-10 text-xl font-semibold text-white">
                Teslim ettiklerimiz
              </h2>
              <ul className="mt-5 space-y-3">
                {service.deliverables.map((d) => (
                  <CheckItem key={d}>{d}</CheckItem>
                ))}
              </ul>

              {service.faq.length > 0 ? (
                <>
                  <h2 className="mt-12 text-xl font-semibold text-white">
                    Sık sorulanlar
                  </h2>
                  <div className="mt-5">
                    <Faq items={service.faq} />
                  </div>
                </>
              ) : null}
            </div>

            <aside className="lg:col-span-5">
              <div className="card sticky top-24 p-6">
                <h3 className="text-base font-semibold text-white">
                  Fiyat ve süre öğrenin
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-carbon-400">
                  15 dakikalık kısa bir görüşme, ihtiyacınızı netleştirmeye
                  yetiyor. Görüşme sonrası kalem kalem, sabit fiyatlı teklifi
                  yazılı olarak gönderiyoruz.
                </p>
                <div className="mt-5 flex flex-col gap-2.5">
                  <Button href={`/teklif-al?hizmet=${service.slug}`}>
                    Ücretsiz teklif al
                  </Button>
                  <a
                    href={site.phoneHref}
                    className="flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
                  >
                    <Icon name="phone" className="h-4 w-4 text-flame-500" />
                    {site.phone}
                  </a>
                </div>

                <div className="mt-7 border-t border-white/10 pt-5">
                  <h4 className="text-xs font-semibold tracking-wide text-carbon-400 uppercase">
                    Diğer hizmetler
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {others.map((o) => (
                      <li key={o.slug}>
                        <Link
                          href={`/hizmetler/${o.slug}`}
                          className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm text-carbon-300 transition hover:bg-white/5 hover:text-white"
                        >
                          {o.title}
                          <Icon name="arrow" className="h-4 w-4 shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <CtaSection />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
