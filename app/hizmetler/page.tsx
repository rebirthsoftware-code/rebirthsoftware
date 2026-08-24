import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ServiceCard } from "@/components/ServiceCard";
import { CtaSection } from "@/components/CtaSection";
import { Container } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Hizmetler",
  description:
 "Kurumsal web sitesi, kişiye özel yazılım, web tasarım, SEO ve hız optimizasyonu, bakım ve destek hizmetleri.",
  alternates: { canonical: "/hizmetler" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Hizmetler"
        title="İşinizi dijitalde ayakta tutan hizmetler"
        description="Kurumsal siteden özel yazılıma, teknik altyapıdan teslim sonrası desteğe kadar; ihtiyacınız olan işi tek muhatapla halledin."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>

          <div className="card mt-10 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-carbon-300">
                <Icon name="globe" className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-base font-semibold text-white">
                  Yapmadığımız işler
                </h2>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-carbon-400">
                  Sosyal medya yönetimi ve e-ticaret sistemleri hizmet
                  listemizde yok. İyi bildiğimiz alanda kalmayı, her işi
                  yapıyor görünmeye tercih ediyoruz. Bu ihtiyaçlarınız varsa
                  doğru kişilere yönlendirebiliriz.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
