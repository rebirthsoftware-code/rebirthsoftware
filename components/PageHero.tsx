import { Reveal, RevealLines } from "./motion";
import { Container, Eyebrow } from "./ui";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="noise relative overflow-hidden border-b border-line pt-36 pb-16 sm:pt-44 sm:pb-24">
      <Container className="relative">
        {eyebrow ? (
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
        ) : null}

        <RevealLines
          className="headline mt-7 max-w-4xl text-ink"
          lines={[title]}
          delay={100}
        />

        {description ? (
          <Reveal delay={300}>
            <div className="mt-8 flex max-w-2xl gap-5">
              <span className="mt-3 h-px w-12 shrink-0 bg-flame" />
              <p className="text-[17px] leading-relaxed text-muted">
                {description}
              </p>
            </div>
          </Reveal>
        ) : null}

        {children ? <Reveal delay={420}><div className="mt-10">{children}</div></Reveal> : null}
      </Container>
    </section>
  );
}
