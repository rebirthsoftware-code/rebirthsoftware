import type { Project } from "@/lib/projects";

/**
 * Proje görseli. Ekran görüntüsü varsa onu, yoksa markanın tek vurgu
 * rengine sadık kalan nötr bir yer tutucu gösterir.
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
        src={project.image}
        alt={`${project.title} ekran görüntüsü`}
        loading="lazy"
        className={`h-full w-full object-cover ${
          zoomOnHover ? "transition duration-700 group-hover:scale-105" : ""
        } ${className}`}
      />
    );
  }

  const initials = project.client
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toLocaleUpperCase("tr-TR");

  return (
    <div
      className={`relative flex h-full w-full flex-col justify-between p-6 ${className}`}
      style={
        project.gradient
          ? {
              backgroundImage: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`,
            }
          : undefined
      }
    >
      {project.gradient ? null : (
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-carbon-800"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgb(255 255 255 / 0.035) 0 1px, transparent 1px 12px)",
          }}
        />
      )}

      <span className="relative text-6xl font-bold tracking-tighter text-white/12 sm:text-7xl">
        {initials}
      </span>
      <span className="relative text-lg font-bold tracking-tight text-white/85 sm:text-xl">
        {project.client}
      </span>
    </div>
  );
}
