import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Faq } from "@/components/Faq";
import { CtaSection } from "@/components/CtaSection";
import { ProjectRow, ServiceRow } from "@/components/rows";
import {
  Counter,
  Marquee,
  Reveal,
  RevealLines,
  RotatingBadge,
} from "@/components/motion";
import { ArrowLink, Button, Container, Eyebrow } from "@/components/ui";
import { services } from "@/lib/services";
import { projects } from "@/lib/projects";
import { advantages, generalFaq, processSteps } from "@/lib/process";
import { site, whatsappLink } from "@/lib/site";

const faqJsonLd = {
 "@context": "https://schema.org",
 "@type": "FAQPage",
  mainEntity: generalFaq.map((f) => ({
 "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function HomePage() {
  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="noise relative flex min-h-svh flex-col justify-end overflow-hidden pt-32 pb-10">
        <div
          aria-hidden="true"
          className="hairlines pointer-events-none absolute inset-x-0 top-0 bottom-24 opacity-70"
        />
        <Container className="relative">
          <Reveal>
            <span className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-medium text-muted">
              <span className="blink h-1.5 w-1.5 rounded-full bg-flame" />
              Yeni projeler için müsaitiz
            </span>
          </Reveal>

          <div className="max-w-6xl">
            <Reveal>
              <Eyebrow>Kurumsal web sitesi · kişiye özel yazılım</Eyebrow>
            </Reveal>

            <RevealLines
              className="display mt-8 text-ink"
              lines={[
                <>İşinizi anlatan</>,
                <>
                  <span className="text-faint">dijital</span> yüzünüzü
                </>,
                <>
                  kuruyoruz<span className="text-flame">.</span>
                </>,
              ]}
            />
          </div>

          <div className="mt-14 flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
            <Reveal delay={420} className="max-w-lg">
              <div className="flex gap-5">
                <span className="mt-3 h-px w-12 shrink-0 bg-flame" />
                <p className="text-[17px] leading-relaxed text-muted">
                  Hazır tema kurmuyoruz. Şirketinizin işleyişine göre sıfırdan
                  kodlanan, mobilde kusursuz çalışan, hızlı açılan ve Google&apos;da
                  bulunan kurumsal siteler ve web yazılımları geliştiriyoruz.
                </p>
              </div>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="/teklif-al">
                  Ücretsiz teklif al
                  <Icon
                    name="arrowUpRight"
                    className="h-4 w-4 transition-transform duration-500 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                  />
                </Button>
                <Button href="/projeler" variant="outline">
                  Projeleri gör
                </Button>
              </div>
            </Reveal>

            <Reveal delay={560}>
              <Link href="/teklif-al" className="group block">
                <RotatingBadge />
              </Link>
            </Reveal>
          </div>

          <Reveal delay={700}>
            <div className="mt-16 flex items-center gap-3 text-muted">
              <Icon name="arrowDown" className="h-4 w-4 animate-bounce" />
              <span className="overline">Kaydırın</span>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ---------------- KAYAN ŞERİT ---------------- */}
      <div className="rule border-b border-line py-6">
        <Marquee
          items={[
 "Kurumsal Web Sitesi",
 "Kişiye Özel Yazılım",
 "Web Tasarım",
 "SEO & Hız",
 "Bakım & Destek",
          ]}
        />
      </div>

      {/* ---------------- MANİFESTO ---------------- */}
      <section className="py-24 sm:py-36">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-3">
              <Eyebrow>Biz</Eyebrow>
            </Reveal>
            <div className="lg:col-span-9">
              <Reveal delay={80}>
                <p className="text-2xl leading-[1.35] font-medium tracking-tight text-ink sm:text-[2.1rem]">
                  Çoğu işletmenin sitesi ucuza yapılmış, mobilde bozulan ve
                  kimsenin dokunmaya cesaret edemediği bir yük.{" "}
                  <span className="text-muted">
                    Biz her projeye işi anlamakla başlıyor, sayfa yapısını ve
                    ziyaretçinin izleyeceği yolu sizin işinize göre kurguluyoruz
                    — sonra bunu sıfırdan kodluyoruz.
                  </span>
                </p>
              </Reveal>
              <Reveal delay={200}>
                <div className="mt-10">
                  <ArrowLink href="/hakkimizda">Çalışma yaklaşımımız</ArrowLink>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------- HİZMETLER ---------------- */}
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <Eyebrow>Hizmetler</Eyebrow>
                <h2 className="headline mt-6 max-w-xl text-ink">
                  Ne yapıyoruz?
                </h2>
              </div>
              <p className="max-w-sm text-[15px] leading-relaxed text-muted">
                Her işi yapıyoruz demiyoruz. Sosyal medya yönetimi ve e-ticaret
                listemizde yok — odağımız kurumsal siteler ve özel yazılımlar.
              </p>
            </div>
          </Reveal>

          <div className="mt-16 border-t border-line">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={i * 60}>
                <ServiceRow service={service} index={i} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- PROJELER ---------------- */}
      <section className="bg-paper-2 py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <Eyebrow>Seçilmiş işler</Eyebrow>
                <h2 className="headline mt-6 text-ink">Projeler</h2>
              </div>
              <ArrowLink href="/projeler">Tüm projeler</ArrowLink>
            </div>
          </Reveal>

          <div className="mt-16 border-t border-line">
            {projects.slice(0, 5).map((p, i) => (
              <Reveal key={p.slug} delay={i * 60}>
                <ProjectRow project={p} index={i} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- RAKAMLAR ---------------- */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {site.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 90}>
                <div className="border-t border-line pt-6">
                  <div className="text-5xl font-bold tracking-tighter text-ink sm:text-6xl">
                    <Counter value={s.value} />
                  </div>
                  <div className="mt-3 text-sm text-muted">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- FARKIMIZ ---------------- */}
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <Eyebrow>Farkımız</Eyebrow>
            <h2 className="headline mt-6 max-w-2xl text-ink">
              Bizimle çalışırken ne değişir?
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {advantages.map((a, i) => (
              <Reveal key={a.title} delay={(i % 3) * 90}>
                <div className="group border-t border-line pt-6">
                  <span className="overline text-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-xl font-bold tracking-tight text-ink">
                    {a.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">
                    {a.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- SÜREÇ ---------------- */}
      <section className="bg-paper-2 py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <Eyebrow>Süreç</Eyebrow>
                <h2 className="headline mt-6 text-ink">
                  Dört adımda
                  <br />
                  yayına
                </h2>
              </div>
              <ArrowLink href="/surec">Süreci detaylı incele</ArrowLink>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-px overflow-hidden rounded-lg bg-line md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((s, i) => (
              <Reveal key={s.step} delay={i * 90} className="bg-paper">
                <div className="group h-full p-8 transition-colors duration-500 hover:bg-paper-3">
                  <div className="flex items-start justify-between">
                    <span className="text-5xl font-bold tracking-tighter text-line-strong transition-colors duration-500 group-hover:text-flame">
                      {s.step}
                    </span>
                    <Icon name={s.icon} className="h-5 w-5 text-muted" />
                  </div>
                  <h3 className="mt-8 text-lg font-bold tracking-tight text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-xs tracking-wide text-flame uppercase">
                    {s.duration}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {s.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- SSS ---------------- */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <Eyebrow>SSS</Eyebrow>
              <h2 className="headline mt-6 text-ink">
                Sık sorulan
                <br />
                sorular
              </h2>
              <div className="mt-8 flex flex-col gap-4">
                <ArrowLink href="/sss">Tüm soruları gör</ArrowLink>
                <a
                  href={whatsappLink("Merhaba, bir sorum olacaktı.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted transition hover:text-ink"
                >
                  WhatsApp&apos;tan sor →
                </a>
              </div>
            </Reveal>

            <Reveal delay={120} className="lg:col-span-8">
              <Faq items={generalFaq.slice(0, 5) as unknown as { q: string; a: string }[]} />
            </Reveal>
          </div>
        </Container>
      </section>

      <CtaSection />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
