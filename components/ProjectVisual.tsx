import type { Project } from "@/lib/projects";
import { asset } from "@/lib/asset";
import { BrowserFrame, domainOf } from "./BrowserFrame";
import { ProjectMockup } from "./ProjectMockup";

/**
 * Ekran görüntüleri 640 / 1200 / 1600 piksel genişlikte duruyor. Tarayıcı
 * `sizes` değerine bakıp en küçüğünü seçsin diye her kullanım yeri kartın
 * gerçek genişliğini bildiriyor; aksi hâlde 1.6 megapiksellik görseller
 * boşuna çözülüp kaydırmayı tutukluyor.
 */
function srcSetOf(image: string) {
  const taban = image.replace(/\.webp$/, "");
  return [640, 1200]
    .map((g) => `${asset(`${taban}-${g}.webp`)} ${g}w`)
    .concat(`${asset(image)} 1600w`)
    .join(", ");
}

/**
 * Proje görseli. Ekran görüntüsü varsa tarayıcı çerçevesi içinde,
 * yoksa proje türüne göre üretilen arayüz çizimini gösterir.
 * İki durumda da sunum aynı olduğu için kartlar birbiriyle uyumlu durur.
 */
export function ProjectVisual({
  project,
  className = "",
  zoomOnHover = false,
  sizes = "(min-width: 1024px) 36rem, (min-width: 640px) 58vw, 82vw",
}: {
  project: Project;
  className?: string;
  zoomOnHover?: boolean;
  sizes?: string;
}) {
  if (project.image) {
    return (
      <div className={`h-full w-full ${className}`}>
        <BrowserFrame label={domainOf(project.url)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(project.image)}
            srcSet={srcSetOf(project.image)}
            sizes={sizes}
            alt={`${project.title} ekran görüntüsü`}
            width={1600}
            height={1000}
            loading="lazy"
            decoding="async"
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
