import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/Icon";
import { Container } from "@/components/ui";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "İletişim",
  description: `${site.name} ile iletişime geçin. Telefon, WhatsApp, e-posta ve teklif formu.`,
  alternates: { canonical: "/iletisim" },
};

const channels = [
  {
    icon: "phone",
    label: "Telefon",
    value: site.phone,
    href: site.phoneHref,
    note: "Hafta içi 09:00 - 18:00",
  },
  {
    icon: "whatsapp",
    label: "WhatsApp",
    value: "Mesaj gönderin",
    href: whatsappLink("Merhaba, bilgi almak istiyorum."),
    note: "Genellikle birkaç saat içinde dönüş",
    external: true,
  },
  {
    icon: "mail",
    label: "E-posta",
    value: site.email,
    href: `mailto:${site.email}`,
    note: "En geç 1 iş günü içinde yanıt",
  },
  {
    icon: "pin",
    label: "Konum",
    value: site.address,
    note: "Türkiye geneline uzaktan hizmet",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="İletişim"
        title="Konuşalım"
        description="Aklınızdaki projeyi anlatın ya da sadece bir soru sorun. Satış baskısı yapmadan, işinize yarayacak bir yönlendirme yapmaya çalışırız."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((c) => {
              const inner = (
                <>
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300">
                    <Icon name={c.icon} className="h-5 w-5" />
                  </span>
                  <div className="mt-4 text-xs tracking-wide text-ink-500 uppercase">
                    {c.label}
                  </div>
                  <div className="mt-1 text-sm font-semibold break-words text-white">
                    {c.value}
                  </div>
                  <div className="mt-1.5 text-xs text-ink-400">{c.note}</div>
                </>
              );
              return c.href ? (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noopener noreferrer" : undefined}
                  className="card card-hover p-5"
                >
                  {inner}
                </a>
              ) : (
                <div key={c.label} className="card p-5">
                  {inner}
                </div>
              );
            })}
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="text-xl font-semibold text-white">
                Mesaj bırakın
              </h2>
              <p className="mt-2 text-sm text-ink-400">
                Formu doldurun, size dönüş yapalım.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="card overflow-hidden">
                <div className="bg-aurora flex aspect-4/3 items-center justify-center p-8 text-center">
                  <div>
                    <Icon
                      name="globe"
                      className="mx-auto h-10 w-10 text-brand-300"
                    />
                    <p className="mt-4 text-sm leading-relaxed text-ink-200">
                      Projelerin tamamını uzaktan yürütüyoruz. Türkiye&apos;nin
                      her yerinden müşterilerimizle çevrim içi görüşme,
                      ekran paylaşımı ve düzenli ilerleme raporlarıyla
                      çalışıyoruz.
                    </p>
                  </div>
                </div>
                <div className="border-t border-white/10 p-6">
                  <h3 className="text-sm font-semibold text-white">
                    Çalışma saatleri
                  </h3>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between text-ink-300">
                      <dt>Pazartesi - Cuma</dt>
                      <dd>09:00 - 18:00</dd>
                    </div>
                    <div className="flex justify-between text-ink-300">
                      <dt>Cumartesi</dt>
                      <dd>10:00 - 14:00</dd>
                    </div>
                    <div className="flex justify-between text-ink-500">
                      <dt>Pazar</dt>
                      <dd>Kapalı</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-xs leading-relaxed text-ink-500">
                    Acil durumlar için mevcut müşterilerimize 7/24 destek hattı
                    sağlıyoruz.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
