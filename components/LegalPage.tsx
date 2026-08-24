import { PageHero } from "./PageHero";
import { Container } from "./ui";

export type LegalSection = { heading: string; body: string[]; list?: string[] };

export function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={intro} />
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-xs text-muted">Son güncelleme: {updated}</p>
            <div className="mt-8 space-y-10">
              {sections.map((s) => (
                <div key={s.heading}>
                  <h2 className="text-lg font-semibold text-ink">
                    {s.heading}
                  </h2>
                  {s.body.map((p) => (
                    <p
                      key={p}
                      className="mt-3 text-sm leading-relaxed text-muted"
                    >
                      {p}
                    </p>
                  ))}
                  {s.list ? (
                    <ul className="mt-4 space-y-2">
                      {s.list.map((li) => (
                        <li
                          key={li}
                          className="flex gap-2.5 text-sm leading-relaxed text-muted"
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-flame" />
                          {li}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
