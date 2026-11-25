"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";

export const MENU = [
  { href: "/", etiket: "Özet", ikon: "home" },
  { href: "/teklifler", etiket: "Teklifler", ikon: "inbox" },
  { href: "/projeler", etiket: "Projeler", ikon: "folder" },
  { href: "/yazilar", etiket: "Yazılar", ikon: "pen" },
  { href: "/hizmetler", etiket: "Hizmetler", ikon: "layers" },
  { href: "/musteri-siteleri", etiket: "Müşteri siteleri", ikon: "globe" },
  { href: "/site-bilgileri", etiket: "Site bilgileri", ikon: "settings" },
] as const;

/**
 * Geniş ekranda sol kenar çubuğu, telefonda ekranın altına yapışan sekme
 * çubuğu. Tek liste, iki görünüm; aktif öğe adrese göre belirlenir.
 */
export function Gezinme({ bekleyenTeklif }: { bekleyenTeklif: number }) {
  const yol = usePathname();
  const aktifMi = (href: string) => (href === "/" ? yol === "/" : yol.startsWith(href));

  return (
    <nav aria-label="Panel bölümleri" data-gezinme>
      <ul className="alt-gezinme fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-white/95 backdrop-blur lg:static lg:block lg:border-0 lg:bg-transparent lg:backdrop-blur-none">
        {MENU.map((m) => {
          const aktif = aktifMi(m.href);
          const rozet = m.href === "/teklifler" && bekleyenTeklif > 0 ? bekleyenTeklif : 0;
          // Telefonda 7 öğe sığmaz: ikincil olanlar yalnızca geniş ekranda.
          const telefondaGizle = m.href === "/hizmetler" || m.href === "/site-bilgileri";
          return (
            <li key={m.href} className={`${telefondaGizle ? "hidden lg:block" : "flex-1"} lg:mb-0.5`}>
              <Link
                href={m.href}
                aria-current={aktif ? "page" : undefined}
                className={`relative flex flex-col items-center gap-1 px-1 pb-2 pt-2.5 text-[10px] font-semibold transition lg:flex-row lg:gap-3 lg:rounded-xl lg:px-3 lg:py-2.5 lg:text-sm ${
                  aktif
                    ? "text-flame lg:bg-white lg:text-ink lg:shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
              >
                <Icon name={m.ikon} className="h-5 w-5 lg:h-4.5 lg:w-4.5" />
                <span className="truncate">{m.etiket}</span>
                {rozet ? (
                  <span className="absolute right-[calc(50%-1.5rem)] top-1 rounded-full bg-flame px-1.5 py-0.5 text-[10px] font-bold leading-none text-white lg:static lg:ml-auto">
                    {rozet}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
