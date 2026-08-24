import type { Project } from "@/lib/projects";
import { asset } from "@/lib/asset";
import { ProjectMockup } from "./ProjectMockup";

/**
 * Proje görseli. Ekran görüntüsü varsa onu, yoksa markanın diline sadık
 * kalan nötr bir yer tutucu gösterir.
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
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={asset(project.image)}
        alt={`${project.title} ekran görüntüsü`}
        loading="lazy"
        className={`h-full w-full object-cover ${
          zoomOnHover ? "transition duration-700 group-hover:scale-105" : ""
        } ${className}`}
      />
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
