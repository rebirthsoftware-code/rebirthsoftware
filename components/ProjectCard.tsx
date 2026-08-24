import Link from "next/link";
import type { Project } from "@/lib/projects";
import { Icon } from "./Icon";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projeler/${project.slug}`}
      className="card card-hover group flex flex-col overflow-hidden"
    >
      <div
        className="relative aspect-16/10 w-full overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`,
        }}
      >
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={`${project.title} ekran görüntüsü`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-end p-5">
            <span className="text-2xl font-semibold text-white/85 drop-shadow">
              {project.client}
            </span>
          </div>
        )}
        <span className="absolute top-4 left-4 rounded-full bg-ink-950/70 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
          {project.type}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-ink-400">
          <span>{project.sector}</span>
          <span className="h-1 w-1 rounded-full bg-ink-600" />
          <span>{project.year}</span>
        </div>
        <h3 className="mt-2 text-lg font-semibold text-white transition group-hover:text-brand-300">
          {project.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-400">
          {project.summary}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300">
          Projeyi incele
          <Icon
            name="arrow"
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}
