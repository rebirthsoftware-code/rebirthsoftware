import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ProjectCard } from "@/components/ProjectCard";
import { ServiceCard } from "@/components/ServiceCard";
import { Faq } from "@/components/Faq";
import { CtaSection } from "@/components/CtaSection";
import {
  ArrowLink,
  Button,
  Container,
  Eyebrow,
  SectionHeading,
} from "@/components/ui";
import { services } from "@/lib/services";
import { featuredProjects } from "@/lib/projects";
import { advantages, generalFaq, processSteps, techStack } from "@/lib/process";
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
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="bg-aurora pointer-events-none absolute inset-0" />
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <Container className="relative">
          <div className="grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-12 lg:gap-8">
            <div className="animate-rise lg:col-span-7">
              <Eyebrow>Kurumsal web sitesi & özel yazılım</Eyebrow>
              <h1 className="mt-6 text-4xl leading-[1.1] font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
                İşinizi hak ettiği gibi anlatan{" "}
                <span className="text-gradient">kurumsal web siteleri</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-300">
                Hazır tema kurmuyoruz. Şirketinizin işleyişine göre sıfırdan
                kodlanan, mobilde kusursuz çalışan, hızlı açılan ve Google&apos;da
                bulunan siteler ve web yazılımları geliştiriyoruz.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="/teklif-al">
                  Ücretsiz Teklif Al
                  <Icon name="arrow" className="h-4 w-4" />
                </Button>
                <Button href="/projeler" variant="outline">
                  Referans Projeler
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-400">
                <span className="flex items-center gap-2">
                  <Icon name="check" className="h-4 w-4 text-accent-400" />
                  Sabit fiyat, sürpriz yok
                </span>
                <span className="flex items-center gap-2">
                  <Icon name="check" className="h-4 w-4 text-accent-400" />
                  Kaynak kod sizin
                </span>
                <span className="flex items-center gap-2">
                  <Icon name="check" className="h-4 w-4 text-accent-400" />
                  Teslim sonrası destek
                </span>
              </div>
            </div>

            <div className="animate-rise lg:col-span-5">
              <HeroPanel />
            </div>
          </div>

          {/* İSTATİSTİKLER */}
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-4">
            {site.stats.map((s) => (
              <div key={s.label} className="bg-ink-950 px-5 py-7 text-center">
                <div className="text-2xl font-semibold text-white sm:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1 text-xs text-ink-400 sm:text-sm">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* HİZMETLER */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Hizmetler"
              title="Ne yapıyoruz?"
              description="Her işi yapıyoruz demiyoruz. Odağımız kurumsal web siteleri ve kişiye özel web yazılımları — ve bunların çalışır kalması."
            />
            <ArrowLink href="/hizmetler">Tüm hizmetler</ArrowLink>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </Container>
      </section>

      {/* FARKIMIZ */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="bg-aurora pointer-events-none absolute inset-0 opacity-50" />
        <Container className="relative">
          <SectionHeading
            eyebrow="Farkımız"
            title="Neden Rebirth Software?"
            description="Ajans kalabalığı yerine, işini bilen bir muhatap. Aşağıdakiler pazarlama cümlesi değil, çalışma şeklimiz."
            align="center"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {advantages.map((a) => (
              <div key={a.title} className="card p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500/12 text-accent-400">
                  <Icon name={a.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-white">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">
                  {a.text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* REFERANSLAR */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Referanslar"
              title="Son projelerimiz"
              description="Her projede önce sorunu tanımlıyor, sonra çözümü ölçülebilir bir sonuca bağlıyoruz."
            />
            <ArrowLink href="/projeler">Tüm projeler</ArrowLink>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </Container>
      </section>

      {/* SÜREÇ */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Süreç"
            title="Nasıl çalışıyoruz?"
            description="Sürecin her adımında ne olacağını baştan biliyorsunuz. Sürpriz gecikme ya da 'ne oldu acaba' dönemi yok."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((s) => (
              <div key={s.step} className="card relative p-6">
                <span className="text-4xl font-semibold text-white/10">
                  {s.step}
                </span>
                <span className="absolute top-6 right-6 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300">
                  <Icon name={s.icon} className="h-4.5 w-4.5" />
                </span>
                <h3 className="mt-3 text-base font-semibold text-white">
                  {s.title}
                </h3>
                <p className="mt-1 text-xs text-accent-400">{s.duration}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-400">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <ArrowLink href="/surec">Süreci detaylı incele</ArrowLink>
          </div>
        </Container>
      </section>

      {/* TEKNOLOJİ */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="card grid gap-10 p-8 sm:p-12 lg:grid-cols-2">
            <div>
              <Eyebrow>Teknoloji</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
                Güncel ve kalıcı teknolojilerle geliştiriyoruz
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-300">
                Moda olduğu için değil, uzun ömürlü ve hızlı olduğu için tercih
                ettiğimiz araçlarla çalışıyoruz. Böylece siteniz yıllar sonra da
                güncellenebilir kalıyor — kimse size &quot;bu altyapı artık
                desteklenmiyor&quot; demiyor.
              </p>
              <div className="mt-6">
                <ArrowLink href="/hakkimizda">Çalışma yaklaşımımız</ArrowLink>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
              {techStack.map((t) => (
                <div
                  key={t.name}
                  className="rounded-xl border border-white/10 bg-ink-900/50 px-4 py-3.5"
                >
                  <div className="text-sm font-semibold text-white">
                    {t.name}
                  </div>
                  <div className="mt-0.5 text-xs text-ink-400">{t.note}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* SSS */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading
                eyebrow="SSS"
                title="Sık sorulan sorular"
                description="Aklınızdaki soru burada yoksa doğrudan sorun; net cevap veririz."
              />
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href="/sss"
                  className="text-sm font-semibold text-brand-300 hover:text-brand-200"
                >
                  Tüm soruları gör →
                </Link>
                <a
                  href={whatsappLink("Merhaba, bir sorum olacaktı.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink-400 hover:text-white"
                >
                  WhatsApp&apos;tan sor →
                </a>
              </div>
            </div>
            <div className="lg:col-span-8">
              <Faq items={generalFaq.slice(0, 5) as unknown as { q: string; a: string }[]} />
            </div>
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

function HeroPanel() {
  return (
    <div className="card relative overflow-hidden p-1.5">
      <div className="rounded-xl bg-ink-900/80 p-4">
        <div className="flex items-center gap-1.5 border-b border-white/10 pb-3">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-3 truncate rounded-md bg-ink-950/70 px-2.5 py-1 text-[11px] text-ink-400">
            www.sirketiniz.com
          </span>
        </div>

        <div className="space-y-3 pt-4">
          <div className="h-2.5 w-1/3 rounded bg-white/15" />
          <div className="h-2 w-2/3 rounded bg-white/10" />
          <div className="h-2 w-1/2 rounded bg-white/10" />
          <div className="flex gap-2 pt-1">
            <div className="h-7 w-24 rounded-full bg-brand-500/80" />
            <div className="h-7 w-20 rounded-full border border-white/15" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-16 rounded-lg border border-white/10 bg-white/5"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-1.5 grid grid-cols-3 gap-1.5">
        {[
          { label: "PageSpeed", value: "98" },
          { label: "Mobil uyum", value: "%100" },
          { label: "Açılış", value: "0.9sn" },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-xl bg-ink-900/80 px-3 py-3 text-center"
          >
            <div className="text-lg font-semibold text-accent-400">
              {m.value}
            </div>
            <div className="mt-0.5 text-[10px] text-ink-400">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
