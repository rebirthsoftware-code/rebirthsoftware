import type { Project } from "@/lib/projects";
import { asset } from "@/lib/asset";
import { BrowserFrame, domainOf } from "./BrowserFrame";
import { ProjectMockup } from "./ProjectMockup";

/**
 * Proje görseli. Ekran görüntüsü varsa tarayıcı çerçevesi içinde,
 * yoksa proje türüne göre üretilen arayüz çizimini gösterir.
 * İki durumda da sunum aynı olduğu için kartlar birbiriyle uyumlu durur.
 */
export function ProjectVisual({
  project,
  className = "",
  zoomOnHover = false,
}: {
  project: Project;
  className?: string;
  zoomOnHover?: boolean;
}) {
  if (project.image) {
    return (
      <div className={`h-full w-full ${className}`}>
        <BrowserFrame label={domainOf(project.url)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(project.image)}
            alt={`${project.title} ekran görüntüsü`}
            loading="lazy"
            className={`h-full w-full object-cover object-top ${
              zoomOnHover
                ? "transition-transform duration-700 group-hover:scale-[1.03]"
                : ""
            }`}
          />
        </BrowserFrame>
      </div>
    );
  }

  if (project.gradient) {
    return (
      <div
        className={`h-full w-full ${className}`}
        style={{
          backgroundImage: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`,
        }}
      />
    );
  }

  return (
    <div className={`h-full w-full ${className}`}>
      <ProjectMockup project={project} />
    </div>
  );
}
