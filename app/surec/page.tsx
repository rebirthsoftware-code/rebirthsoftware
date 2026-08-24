import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CtaSection } from "@/components/CtaSection";
import { Icon } from "@/components/Icon";
import { CheckItem, Container, SectionHeading } from "@/components/ui";
import { processSteps } from "@/lib/process";

export const metadata: Metadata = {
  title: "Nasıl Çalışıyoruz",
  description:
    "Keşiften teslime kadar proje sürecimiz: analiz, tasarım, geliştirme, yayın ve destek adımları.",
  alternates: { canonical: "/surec" },
};

const promises = [
  "Teklifte yazan fiyat, teslimde de aynı fiyattır.",
  "Tasarım onayınız olmadan kodlamaya geçmeyiz.",
  "Her aşamada canlı bir test bağlantısından ilerlemeyi görürsünüz.",
  "Alan adı, hosting ve kaynak kod sizin adınıza kaydedilir.",
  "Teslim sonrası ilk ay tüm küçük düzeltmeler ücretsizdir.",
];

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Süreç"
        title="Projeniz adım adım nasıl ilerliyor?"
        description="Web projesi yaptırmanın en can sıkıcı yanı belirsizliktir. Bu yüzden süreci dört net adıma böldük; her adımın ne kadar süreceğini ve sonunda elinize ne geçeceğini baştan biliyorsunuz."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <ol className="relative space-y-6 border-l border-white/10 pl-6 sm:pl-10">
            {processSteps.map((s) => (
              <li key={s.step} className="relative">
                <span className="absolute top-6 -left-[1.85rem] flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-ink-950 text-brand-300 sm:-left-[3.1rem]">
                  <Icon name={s.icon} className="h-4 w-4" />
                </span>
                <div className="card p-6 sm:p-7">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-semibold tracking-widest text-ink-500">
                      ADIM {s.step}
                    </span>
                    <span className="rounded-full bg-accent-500/12 px-2.5 py-1 text-xs font-medium text-accent-400">
                      {s.duration}
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-white">
                    {s.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink-300">
                    {s.text}
                  </p>
                  <p className="mt-4 flex items-start gap-2 rounded-xl bg-white/5 px-4 py-3 text-sm text-ink-200">
                    <Icon
                      name="check"
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent-400"
                    />
                    <span>
                      <strong className="font-medium text-white">
                        Bu adımın çıktısı:
                      </strong>{" "}
                      {s.output}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-16 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Taahhüt"
                title="Size verdiğimiz sözler"
                description="Sözleşmeye de yazdığımız, pazarlama cümlesi olmayan maddeler."
              />
            </div>
            <div className="lg:col-span-7">
              <ul className="card space-y-4 p-6 sm:p-8">
                {promises.map((p) => (
                  <CheckItem key={p}>{p}</CheckItem>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <CtaSection
        title="İlk adımı atalım"
        description="Keşif görüşmesi ücretsizdir ve hiçbir bağlayıcılığı yoktur. Sadece ne yapmak istediğinizi anlatmanız yeterli."
      />
    </>
  );
}
