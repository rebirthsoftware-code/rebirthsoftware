import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ProjectCard } from "@/components/ProjectCard";
import { CtaSection } from "@/components/CtaSection";
import { Container } from "@/components/ui";
import { projects, projectTypes } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Referanslar",
  description:
    "Tamamladığımız kurumsal web sitesi ve kişiye özel yazılım projeleri: sorun, çözüm ve elde edilen sonuçlar.",
  alternates: { canonical: "/projeler" },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Referanslar"
        title="Tamamladığımız projeler"
        description="Her proje bir ihtiyaçla başladı. Aşağıda ne yapıldığını değil, hangi sorunun nasıl çözüldüğünü ve sonucunda ne değiştiğini bulacaksınız."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="mb-8 flex flex-wrap gap-2">
            {projectTypes.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-ink-300"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </Container>
      </section>

      <CtaSection
        title="Sıradaki proje sizinki olsun"
        description="Referanslarımızdaki işlere benzer bir ihtiyacınız varsa, kapsamı ve bütçeyi birlikte netleştirelim."
      />
    </>
  );
}
