import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CtaSection } from "@/components/CtaSection";
import { Icon } from "@/components/Icon";
import { CheckItem, Container, SectionHeading } from "@/components/ui";
import { advantages, techStack } from "@/lib/process";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
 "Rebirth Software; kurumsal web siteleri ve kişiye özel web yazılımları geliştiren bir yazılım stüdyosudur.",
  alternates: { canonical: "/hakkimizda" },
};

const values = [
  {
    title: "Açık iletişim",
    text: "Teknik terimlerin arkasına saklanmayız. Neyin neden yapıldığını anlayacağınız dilde anlatırız.",
  },
  {
    title: "Az iş, iyi iş",
    text: "Aynı anda onlarca proje almayız. Az sayıda projeyle çalışıp her birine hak ettiği zamanı ayırırız.",
  },
  {
    title: "Ölçülebilir sonuç",
    text: "'Güzel oldu' yeterli değil. Hız skoru, form dönüşümü ve arama sıralaması gibi ölçülebilir hedefler koyarız.",
  },
  {
    title: "Uzun vadeli ilişki",
    text: "Amacımız tek seferlik satış değil; işiniz büyüdükçe yanınızda olan teknik ortağınız olmak.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Hakkımızda"
        title="Yazılımı işinize yarayacak hale getiriyoruz"
        description="Rebirth Software, kurumsal web siteleri ve kişiye özel web yazılımları geliştiren bir yazılım stüdyosudur. İşimiz kod yazmak değil; işletmenizin bir sorununu çözen, çalışır bir ürün teslim etmek."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="prose-tr space-y-5 text-base leading-relaxed text-ink-soft">
                <p>
                  Çoğu işletmenin dijital tecrübesi birbirine benziyor: ucuza
                  yapılmış, mobilde bozulan, güncellenemeyen ve bir süre sonra
                  kimsenin dokunmaya cesaret edemediği bir site. Rebirth
                  Software bu tabloyu değiştirmek için kuruldu.
                </p>
                <p>
                  Hazır tema satın alıp içeriğini değiştirmiyoruz. Her projeye
                  işinizi anlamakla başlıyor; sayfa yapısını, içerik akışını ve
                  ziyaretçinin izleyeceği yolu sizin işinize göre kurguluyoruz.
                  Ardından bunu sıfırdan, güncel teknolojilerle kodluyoruz.
                </p>
                <p>
                  Kurumsal sitenin yanı sıra, hazır programların
                  karşılayamadığı ihtiyaçlar için kişiye özel web yazılımları
                  geliştiriyoruz: servis takibi, teklif yönetimi, randevu
                  sistemi, stok ve raporlama panelleri gibi. Ortak nokta hep
                  aynı: işinizi hızlandıran, size uyum sağlayan bir yazılım.
                </p>
                <p>
                  Bilinçli olarak dar bir alanda kalıyoruz. Sosyal medya
                  yönetimi ya da e-ticaret sistemleri hizmet listemizde yok —
                  çünkü iyi yaptığımız işi daha iyi yapmayı, her işi yapıyor
                  görünmeye tercih ediyoruz.
                </p>
              </div>

              <h2 className="mt-12 text-xl font-semibold text-ink">
                Çalışma ilkelerimiz
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {values.map((v) => (
                  <div key={v.title} className="card p-5">
                    <h3 className="text-sm font-semibold text-ink">
                      {v.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {v.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="card p-6 sm:p-7">
                <h2 className="text-base font-semibold text-ink">
                  Kısaca {site.name}
                </h2>
                <ul className="mt-5 space-y-3">
                  <CheckItem>
                    Kurumsal web sitesi ve kişiye özel web yazılımı geliştirme
                  </CheckItem>
                  <CheckItem>Hazır tema yok, her proje sıfırdan kodlanır</CheckItem>
                  <CheckItem>Türkiye geneline uzaktan hizmet</CheckItem>
                  <CheckItem>Tek muhatap, hızlı geri dönüş</CheckItem>
                  <CheckItem>Teslim sonrası bakım ve destek</CheckItem>
                </ul>

                <div className="mt-7 border-t border-line pt-6">
                  <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">
                    Kullandığımız teknolojiler
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {techStack.map((t) => (
                      <span
                        key={t.name}
                        className="rounded-lg border border-line bg-ink/[0.04] px-2.5 py-1.5 text-xs text-ink-soft"
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3 border-t border-line pt-6">
                  {site.stats.map((s) => (
                    <div key={s.label}>
                      <div className="text-2xl font-semibold text-ink">
                        {s.value}
                      </div>
                      <div className="text-xs text-muted">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-20">
            <SectionHeading
              eyebrow="Farkımız"
              title="Bizimle çalışırken ne değişir?"
              align="center"
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {advantages.map((a) => (
                <div key={a.title} className="card p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-flame/15 text-flame">
                    <Icon name={a.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-ink">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {a.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
