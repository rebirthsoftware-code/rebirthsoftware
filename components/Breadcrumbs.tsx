import Link from "next/link";
import { site } from "@/lib/site";
import { Icon } from "./Icon";

export type Crumb = { href: string; label: string };

/**
 * Yol izi. Görsel gezinme dışında schema.org BreadcrumbList çıktısı da
 * üretir; Google arama sonuçlarında yol izini göstermek için kullanılır.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ href: "/", label: "Ana sayfa" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${site.url}${c.href === "/" ? "" : c.href}`,
    })),
  };

  return (
    <>
      <nav aria-label="Yol izi">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-muted">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.href} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="max-w-[60vw] truncate text-faint">
                    {c.label}
                  </span>
                ) : (
                  <Link href={c.href} className="link-underline hover:text-ink">
                    {c.label}
                  </Link>
                )}
                {last ? null : (
                  <Icon name="arrow" className="h-3 w-3 text-line-strong" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
