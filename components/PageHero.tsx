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
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="bg-aurora pointer-events-none absolute inset-0" />
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <Container className="relative">
        <div className="animate-rise max-w-3xl py-16 sm:py-20">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <h1 className="mt-5 text-3xl leading-tight font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-5 text-lg leading-relaxed text-ink-300">
              {description}
            </p>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}
