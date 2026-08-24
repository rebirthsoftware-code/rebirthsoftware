import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/Icon";
import { CheckItem, Container } from "@/components/ui";
import { getService } from "@/lib/services";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ücretsiz Teklif Al",
  description:
    "Projenizi anlatın; kapsam, süre ve sabit fiyat teklifini 1 iş günü içinde gönderelim. Bağlayıcılığı yoktur.",
  alternates: { canonical: "/teklif-al" },
};

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ hizmet?: string }>;
}) {
  const { hizmet } = await searchParams;
  const service = hizmet ? getService(hizmet) : undefined;

  return (
    <>
      <PageHero
        eyebrow="Teklif"
        title="Projeniz için ücretsiz teklif alın"
        description="Formu doldurmanız yaklaşık 2 dakika sürüyor. En geç 1 iş günü içinde kapsamı, süreyi ve sabit fiyatı içeren teklifi yazılı olarak gönderiyoruz."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ContactForm defaultService={service?.title} />
            </div>

            <aside className="lg:col-span-5">
              <div className="card p-6 sm:p-7">
                <h2 className="text-base font-semibold text-white">
                  Teklif sürecinde ne oluyor?
                </h2>
                <ol className="mt-5 space-y-4">
                  {[
                    "Formu gönderiyorsunuz, aynı gün içinde ulaşıyoruz.",
                    "15-20 dakikalık kısa bir görüşmede ihtiyacı netleştiriyoruz.",
                    "Kapsam, süre ve sabit fiyatı içeren teklifi yazılı gönderiyoruz.",
                    "Uygun bulursanız sözleşmeyle başlıyoruz; bulmazsanız hiçbir yükümlülüğünüz olmuyor.",
                  ].map((t, i) => (
                    <li key={t} className="flex gap-3 text-sm text-ink-300">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-xs font-semibold text-brand-300">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{t}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="card mt-5 p-6 sm:p-7">
                <h2 className="text-base font-semibold text-white">
                  Doğrudan iletişim
                </h2>
                <div className="mt-4 flex flex-col gap-2.5">
                  <a
                    href={site.phoneHref}
                    className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-white transition hover:bg-white/5"
                  >
                    <Icon name="phone" className="h-4 w-4 text-brand-400" />
                    {site.phone}
                  </a>
                  <a
                    href={whatsappLink("Merhaba, teklif almak istiyorum.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-white transition hover:bg-white/5"
                  >
                    <Icon name="whatsapp" className="h-4 w-4 text-accent-400" />
                    WhatsApp&apos;tan yaz
                  </a>
                  <a
                    href={`mailto:${site.email}`}
                    className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-white transition hover:bg-white/5"
                  >
                    <Icon name="mail" className="h-4 w-4 text-brand-400" />
                    {site.email}
                  </a>
                </div>
              </div>

              <div className="card mt-5 p-6 sm:p-7">
                <h2 className="text-base font-semibold text-white">
                  Teklifi hızlandırmak için
                </h2>
                <ul className="mt-4 space-y-3">
                  <CheckItem>Beğendiğiniz 1-2 örnek site bağlantısı</CheckItem>
                  <CheckItem>Yaklaşık sayfa sayısı veya modül listesi</CheckItem>
                  <CheckItem>Varsa logo ve kurumsal renkleriniz</CheckItem>
                  <CheckItem>Hedeflediğiniz yayın tarihi</CheckItem>
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
