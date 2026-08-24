"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import type { Service } from "@/lib/services";
import { Icon } from "./Icon";
import { ProjectVisual } from "./ProjectVisual";

/** Numaralı, üzerine gelince açılan büyük hizmet satırı */
export function ServiceRow({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  return (
    <Link
      href={`/hizmetler/${service.slug}`}
      className="group row-hover -mx-4 block border-b border-line px-4 py-8 hover:bg-white sm:py-10"
    >
      <div className="flex items-start gap-6 sm:gap-10">
        <span className="overline mt-2 w-8 shrink-0 text-faint transition-colors duration-500 group-hover:text-flame">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
            <h3 className="text-2xl font-bold tracking-tight text-ink transition-colors duration-500 group-hover:text-flame sm:text-4xl">
              {service.title}
            </h3>
            <span className="hidden shrink-0 text-sm text-muted lg:block">
              {service.features.length} kalem dahil
            </span>
          </div>

          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted sm:text-base">
            {service.short}
          </p>

          {/* Sadece hover'da açılan detay */}
          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-5">
                {service.features.slice(0, 4).map((f) => (
                  <li key={f} className="text-sm text-muted">
                    <span className="mr-2 text-flame">/</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-ink transition duration-500 group-hover:border-flame group-hover:bg-flame">
          <Icon
            name="arrowUpRight"
            className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </Link>
  );
}

/** Üzerine gelince önizlemesi beliren proje satırı */
export function ProjectRow({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLAnchorElement>(null);

  // Önizleme imleci takip eder; yumuşak gecikme için CSS transition kullanılır.
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <Link
      ref={ref}
      href={`/projeler/${project.slug}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={onMove}
      className="group relative block border-b border-line hover:bg-white"
    >
      <div className="row-hover flex items-center gap-6 py-7 sm:gap-10 sm:py-9">
        <span className="overline w-8 shrink-0 text-faint transition-colors duration-500 group-hover:text-flame">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-2xl font-bold tracking-tight text-ink transition-colors duration-500 group-hover:text-flame sm:text-[2.5rem]">
            {project.client}
          </h3>
          <p className="mt-1.5 text-sm text-muted sm:hidden">
            {project.type}
          </p>
        </div>

        <span className="hidden shrink-0 text-sm text-muted md:block">
          {project.type}
        </span>
        <span className="hidden w-16 shrink-0 text-right text-sm text-muted sm:block">
          {project.year}
        </span>

        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-ink transition duration-500 group-hover:border-flame group-hover:bg-flame">
          <Icon
            name="arrowUpRight"
            className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>

      {/* Hover önizlemesi — sadece geniş ekranda */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute top-0 left-0 z-20 hidden aspect-4/3 w-72 overflow-hidden rounded-md border border-line bg-white shadow-[0_30px_60px_-35px_rgba(20,20,15,0.5)] lg:block ${
          hover ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transform: `translate3d(${pos.x - 144}px, ${pos.y - 108}px, 0) scale(${hover ? 1 : 0.94}) rotate(${hover ? -1.5 : 0}deg)`,
          transition:
            "transform .45s cubic-bezier(.16,1,.3,1), opacity .35s ease",
        }}
      >
        <ProjectVisual project={project} />
      </div>
    </Link>
  );
}
