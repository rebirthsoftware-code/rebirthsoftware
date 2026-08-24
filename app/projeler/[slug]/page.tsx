import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaSection } from "@/components/CtaSection";
import { Icon } from "@/components/Icon";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectVisual } from "@/components/ProjectVisual";
import { Button, CheckItem, Container } from "@/components/ui";
import { getProject, projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Proje bulunamadı" };
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projeler/${project.slug}` },
    openGraph: { title: project.title, description: project.summary },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const related = projects.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="" />
        <Container className="relative">
          <div className="py-14 sm:py-16">
            <Breadcrumbs
              items={[
                { href: "/projeler", label: "Projeler" },
                { href: `/projeler/${project.slug}`, label: project.title },
              ]}
            />

            <div className="mt-6 grid items-start gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-flame/15 px-3 py-1 font-medium text-flame">
                    {project.type}
                  </span>
                  <span className="rounded-full border border-line px-3 py-1 text-muted">
                    {project.sector}
                  </span>
                  <span className="rounded-full border border-line px-3 py-1 text-muted">
                    {project.year}
                  </span>
                </div>
                <h1 className="mt-5 text-3xl leading-tight font-semibold tracking-tight text-ink sm:text-4xl">
                  {project.title}
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-muted">
                  {project.summary}
                </p>
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-flame hover:text-flame-soft"
                  >
                    <Icon name="globe" className="h-4 w-4" />
                    Siteyi ziyaret et
                  </a>
                ) : null}
              </div>

              <div className="lg:col-span-5">
                <div className="aspect-16/10 overflow-hidden rounded-sm border border-line">
                  <ProjectVisual project={project} />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <Block title="Sorun neydi?" text={project.challenge} />
              <Block title="Ne yaptık?" text={project.solution} />

              <h2 className="mt-10 text-xl font-semibold text-ink">
                Sonuç
              </h2>
              <ul className="mt-5 space-y-3">
                {project.result.map((r) => (
                  <CheckItem key={r}>{r}</CheckItem>
                ))}
              </ul>
            </div>

            <aside className="lg:col-span-4">
              <div className="card sticky top-24 p-6">
                <Meta label="Müşteri" value={project.client} />
                <Meta label="Sektör" value={project.sector} />
                <Meta label="Proje türü" value={project.type} />
                <Meta label="Yıl" value={project.year} />

                <div className="mt-5 border-t border-line pt-5">
                  <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">
                    Kullanılan teknolojiler
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-lg border border-line bg-ink/[0.04] px-2.5 py-1.5 text-xs text-ink-soft"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <Button href="/teklif-al" className="w-full">
                    Benzer bir proje istiyorum
                  </Button>
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-20">
            <h2 className="text-xl font-semibold text-ink">Diğer projeler</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}

function Block({ title, text }: { title: string; text: string }) {
  return (
    <div className="mt-10 first:mt-0">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <p className="prose-tr mt-4 text-base leading-relaxed text-ink-soft">
        {text}
      </p>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 last:border-0">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-right text-sm font-medium text-ink">{value}</span>
    </div>
  );
}
