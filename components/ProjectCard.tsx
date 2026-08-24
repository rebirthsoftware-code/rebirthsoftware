import Link from "next/link";
import type { Project } from "@/lib/projects";
import { Icon } from "./Icon";
import { ProjectVisual } from "./ProjectVisual";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projeler/${project.slug}`} className="group block">
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-sm border border-white/10">
        <ProjectVisual project={project} zoomOnHover />
        <span className="absolute inset-0 bg-flame-500/0 transition duration-500 group-hover:bg-flame-500/10" />
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 text-xs text-carbon-500">
            <span>{project.type}</span>
            <span className="h-1 w-1 rounded-full bg-carbon-600" />
            <span>{project.year}</span>
          </div>
          <h3 className="mt-2 text-lg font-bold tracking-tight text-carbon-50 transition-colors duration-500 group-hover:text-flame-500">
            {project.title}
          </h3>
        </div>
        <Icon
          name="arrowUpRight"
          className="mt-6 h-4 w-4 shrink-0 text-flame-500 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      </div>
    </Link>
  );
}
