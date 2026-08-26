import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Faq } from "@/components/Faq";
import { CtaSection } from "@/components/CtaSection";
import { ServiceRow } from "@/components/rows";
import { Carousel, CarouselItem } from "@/components/Carousel";
import { HeroMockup } from "@/components/HeroMockup";
import {
  Counter,
  Magnetic,
  Marquee,
  Parallax,
  Reveal,
  RevealLines,
  ScrollText,
} from "@/components/motion";
import { ArrowLink, Button, Container, Eyebrow } from "@/components/ui";
import { services } from "@/lib/services";
import { projects } from "@/lib/projects";
import { ProjectVisual } from "@/components/ProjectVisual";
import { advantages, generalFaq, processSteps, sectors } from "@/lib/process";
import { site, whatsappLink } from "@/lib/site";
import { formatDate, sortedPosts } from "@/lib/posts";

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
      <section className="noise relative flex min-h-svh items-center overflow-hidden pt-32 pb-20">
        <div
          aria-hidden="true"
          className="hairlines pointer-events-none absolute inset-0 opacity-70"
        />
        <Container className="relative">
          <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
            {/* Sol sütun — mesaj */}
            <div className="lg:col-span-7">
              <Reveal>
                <span className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-medium text-muted">
                  <span className="blink h-1.5 w-1.5 rounded-full bg-flame" />
                  Yeni projeler için müsaitiz
                </span>
              </Reveal>

              <Reveal delay={60}>
                <Eyebrow>Kurumsal web sitesi · kişiye özel yazılım</Eyebrow>
              </Reveal>

              <RevealLines
                as="h1"
                className="display mt-6 text-ink"
                delay={120}
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

              <Reveal delay={480}>
                <div className="mt-10 flex max-w-lg gap-5">
                  <span className="mt-3 h-px w-12 shrink-0 bg-flame" />
                  <p className="text-[17px] leading-relaxed text-muted">
                    Hazır tema kurmuyoruz. Şirketinizin işleyişine göre sıfırdan
                    kodlanan, mobilde kusursuz çalışan, hızlı açılan ve
                    Google&apos;da bulunan kurumsal siteler ve web yazılımları
                    geliştiriyoruz.
                  </p>
                </div>

                {/* Teslim süresi artık ayırt edici bir vaat; ilk ekranda görünüyor */}
                <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-sm text-muted">
                  {[
                    "2 günde teslim",
                    "Sabit fiyat",
                    "Kaynak kod sizin",
                  ].map((madde) => (
                    <li key={madde} className="flex items-center gap-2">
                      <Icon name="check" className="h-4 w-4 text-flame" />
                      {madde}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Magnetic>
                    <Button href="/teklif-al">
                      Ücretsiz teklif al
                      <Icon
                        name="arrowUpRight"
                        className="h-4 w-4 transition-transform duration-500 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                      />
                    </Button>
                  </Magnetic>
                  <Button href="/projeler" variant="outline">
                    Projeleri gör
                  </Button>
                </div>
              </Reveal>
            </div>

            {/* Sağ sütun — arayüz maketi */}
            <Reveal delay={320} className="lg:col-span-5">
              <Parallax speed={0.05} className="flex justify-center lg:justify-end">
                <HeroMockup />
              </Parallax>
            </Reveal>
          </div>

          <Reveal delay={900}>
            <div className="mt-20 flex items-center gap-3 text-muted">
              <Icon name="arrowDown" className="h-4 w-4 animate-bounce" />
              <span className="label">Kaydırın</span>
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
              <Eyebrow index={1}>Biz</Eyebrow>
            </Reveal>
            <div className="lg:col-span-9">
              <ScrollText
                className="text-2xl leading-[1.35] font-medium tracking-tight sm:text-[2.1rem]"
                text="Çoğu işletmenin sitesi ucuza yapılmış, mobilde bozulan ve kimsenin dokunmaya cesaret edemediği bir yük. Biz her projeye işi anlamakla başlıyor, sayfa yapısını ve ziyaretçinin izleyeceği yolu sizin işinize göre kurguluyoruz — sonra bunu sıfırdan kodluyoruz."
              />

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
                <Eyebrow index={2}>Hizmetler</Eyebrow>
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
                <Eyebrow index={3}>Seçilmiş işler</Eyebrow>
                <h2 className="headline mt-6 text-ink">Projeler</h2>
              </div>
              <ArrowLink href="/projeler">Tüm projeler</ArrowLink>
            </div>
          </Reveal>
        </Container>

        {/* Kaydırmalı vitrin — kenarlara kadar uzanır, kartlar hizaya oturur */}
        <Reveal delay={120}>
          <Carousel
            label="Projeler"
            className="mt-14"
            // scroll-pl, padding ile aynı olmalı: aksi hâlde snap sol boşluğu yok
            // sayıp ilk kartı ekran kenarına yaslıyor.
            trackClassName="px-6 scroll-pl-6 sm:px-10 sm:scroll-pl-10 lg:px-[max(2.5rem,calc((100vw-1360px)/2+2.5rem))] lg:scroll-pl-[max(2.5rem,calc((100vw-1360px)/2+2.5rem))]"
            controlsClassName="mx-auto max-w-[1360px] px-6 sm:px-10"
          >
            {projects.map((project) => (
              <CarouselItem key={project.slug}>
                <Link
                  href={`/projeler/${project.slug}`}
                  className="group block"
                  draggable={false}
                >
                  <div className="overflow-hidden rounded-lg border border-line bg-white shadow-[0_20px_50px_-40px_rgba(20,20,15,0.5)] transition duration-500 group-hover:shadow-[0_28px_60px_-38px_rgba(20,20,15,0.55)]">
                    <div className="aspect-16/10">
                      <ProjectVisual project={project} zoomOnHover />
                    </div>
                  </div>

                  <div className="mt-6 flex items-start justify-between gap-5">
                    <div className="min-w-0">
                      {/* Sektör dar ekranda gizlenir; ayracıyla birlikte
                          kaldırıldığı için satır sonunda boşta nokta kalmaz. */}
                      <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted">
                        <span>{project.type}</span>
                        <span className="hidden h-1 w-1 rounded-full bg-line-strong sm:block" />
                        <span className="hidden sm:inline">{project.sector}</span>
                        <span className="h-1 w-1 rounded-full bg-line-strong" />
                        <span>{project.year}</span>
                      </div>
                      <h3 className="mt-2.5 text-2xl font-bold tracking-tight text-ink transition-colors duration-500 group-hover:text-flame">
                        {project.client}
                      </h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-muted">
                        {project.summary}
                      </p>
                    </div>

                    <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-ink transition duration-500 group-hover:border-flame group-hover:bg-flame group-hover:text-white">
                      <Icon
                        name="arrowUpRight"
                        className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </Carousel>
        </Reveal>
      </section>

      {/* ---------------- RAKAMLAR ---------------- */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {site.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 90}>
                <div className="group">
                  <span className="block h-px w-full overflow-hidden bg-line">
                    <span
                      className="block h-full w-full origin-left scale-x-0 bg-flame transition-transform duration-1000 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100"
                      style={{ transitionDelay: `${i * 80}ms` }}
                    />
                  </span>
                  <div className="mt-6 text-5xl font-bold tracking-tighter text-ink sm:text-6xl">
                    <Counter value={s.value} />
                  </div>
                  <div className="mt-3 text-sm text-muted">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>

        {/* Hizmet verdiğimiz sektörler — ters yönde kayan şerit */}
        <div className="mt-20 border-y border-line py-5">
          <Container className="mb-4">
            <Reveal>
              <span className="label text-faint">
                Hizmet verdiğimiz sektörler
              </span>
            </Reveal>
          </Container>
          <Marquee items={[...sectors]} reverse size="sm" />
        </div>
      </section>

      {/* ---------------- FARKIMIZ ---------------- */}
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <Eyebrow index={4}>Farkımız</Eyebrow>
            <h2 className="headline mt-6 max-w-2xl text-ink">
              Bizimle çalışırken ne değişir?
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {advantages.map((a, i) => (
              <Reveal key={a.title} delay={(i % 3) * 90}>
                <div className="group border-t border-line pt-6">
                  <span className="label text-faint">
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
                <Eyebrow index={5}>Süreç</Eyebrow>
                <h2 className="headline mt-6 text-ink">
                  Dört adımda,
                  <br />
                  iki günde yayına
                </h2>
              </div>
              <ArrowLink href="/surec">Süreci detaylı incele</ArrowLink>
            </div>
          </Reveal>

          <div className="relative mt-20">
            {/* Adımları birleştiren yatay çizgi */}
            <span
              aria-hidden="true"
              className="absolute top-6 right-0 left-0 hidden h-px bg-line lg:block"
            />

            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {processSteps.map((s, i) => (
                <Reveal key={s.step} delay={i * 110}>
                  <div className="group relative">
                    <div className="flex items-center gap-4">
                      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-muted transition duration-500 group-hover:border-flame group-hover:bg-flame group-hover:text-white">
                        <Icon name={s.icon} className="h-5 w-5" />
                      </span>
                      <span className="text-4xl font-bold tracking-tighter text-ink/12 transition-colors duration-500 group-hover:text-flame/40">
                        {s.step}
                      </span>
                    </div>

                    <h3 className="mt-7 text-xl font-bold tracking-tight text-ink">
                      {s.title}
                    </h3>
                    <p className="mt-1.5 text-xs font-semibold tracking-wide text-flame uppercase">
                      {s.duration}
                    </p>
                    <p className="mt-4 text-[15px] leading-relaxed text-muted">
                      {s.text}
                    </p>

                    <p className="mt-5 border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
                      <span className="font-semibold text-ink">Çıktı: </span>
                      {s.output}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------- BLOG ---------------- */}
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <Eyebrow index={6}>Blog</Eyebrow>
                <h2 className="headline mt-6 text-ink">Yazdıklarımız</h2>
              </div>
              <ArrowLink href="/blog">Tüm yazılar</ArrowLink>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-lg bg-line md:grid-cols-3">
            {sortedPosts.slice(0, 3).map((post, i) => (
              <Reveal key={post.slug} delay={i * 90} className="bg-paper">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col p-8 transition-colors duration-500 hover:bg-white"
                >
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span className="rounded-full border border-line px-2.5 py-1">
                      {post.category}
                    </span>
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </div>

                  <h3 className="mt-5 text-xl font-bold tracking-tight text-ink transition-colors duration-500 group-hover:text-flame">
                    {post.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">
                    {post.excerpt}
                  </p>

                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink">
                    <span className="link-underline">{post.readingMinutes} dk okuma</span>
                    <Icon
                      name="arrowUpRight"
                      className="h-3.5 w-3.5 text-flame transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </Link>
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
              <Eyebrow index={7}>SSS</Eyebrow>
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
