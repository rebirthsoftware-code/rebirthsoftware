"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { site, whatsappLink } from "@/lib/site";
import { Icon } from "./Icon";
import { Container } from "./ui";
import { Wordmark } from "./Wordmark";

export type NavItem = { href: string; label: string; hint: string };

/**
 * Tam ekran mobil menü.
 * - Üstten perde gibi açılır (clip-path)
 * - Satırlar maskeden sırayla yukarı kayar
 * - Esc ile kapanır, odak menü içinde tutulur, kapanınca düğmeye döner
 */
export function MobileMenu({
  open,
  onClose,
  items,
  activeHref,
  returnFocusTo,
}: {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  activeHref: string;
  returnFocusTo?: React.RefObject<HTMLButtonElement | null>;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Esc ile kapat + odak tuzağı
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        returnFocusTo?.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => firstLinkRef.current?.focus(), 420);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, onClose, returnFocusTo]);

  return (
    <div
      id="mobil-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site menüsü"
      aria-hidden={!open}
      inert={!open ? true : undefined}
      className="fixed inset-0 z-60 overflow-y-auto bg-paper lg:hidden"
      style={{
        clipPath: open ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
        transition: "clip-path .75s cubic-bezier(.76,0,.24,1)",
        pointerEvents: open ? "auto" : "none",
      }}
    >
      <Container className="flex min-h-full flex-col pt-28 pb-10">
        <nav>
          <ul>
            {items.map((item, i) => {
              const active =
                item.href === "/"
                  ? activeHref === "/"
                  : activeHref.startsWith(item.href);
              return (
                <li key={item.href} className="border-b border-line">
                  <span className="line-mask block">
                    <span
                      style={{
                        display: "block",
                        transform: open ? "none" : "translateY(105%)",
                        transition: `transform .8s cubic-bezier(.16,1,.3,1) ${
                          open ? 220 + i * 70 : 0
                        }ms`,
                      }}
                    >
                      <Link
                        ref={i === 0 ? firstLinkRef : undefined}
                        href={item.href}
                        onClick={onClose}
                        className="group flex items-baseline gap-4 py-5"
                      >
                        <span className="label w-6 shrink-0 text-faint transition-colors duration-500 group-hover:text-flame">
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span
                            className={`block text-[2.1rem] leading-none font-bold tracking-tight transition-colors duration-500 sm:text-5xl ${
                              active ? "text-flame" : "text-ink"
                            }`}
                          >
                            {item.label}
                          </span>
                          <span className="mt-2 block text-sm text-muted">
                            {item.hint}
                          </span>
                        </span>

                        <Icon
                          name="arrowUpRight"
                          className="h-5 w-5 shrink-0 self-center text-faint transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-flame"
                        />
                      </Link>
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Alt blok: eylem + iletişim */}
        <div
          className="mt-10"
          style={{
            opacity: open ? 1 : 0,
            transform: open ? "none" : "translateY(16px)",
            transition: `opacity .7s ease ${open ? 640 : 0}ms, transform .7s cubic-bezier(.16,1,.3,1) ${open ? 640 : 0}ms`,
          }}
        >
          <Link
            href="/teklif-al"
            onClick={onClose}
            className="group flex items-center justify-between gap-4 rounded-full bg-ink px-7 py-4 text-sm font-semibold text-paper transition-colors duration-500 hover:bg-flame hover:text-white"
          >
            Ücretsiz teklif al
            <Icon
              name="arrowUpRight"
              className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>

          <div className="mt-8 grid gap-3 border-t border-line pt-8">
            <a
              href={site.phoneHref}
              className="flex items-center gap-3 text-lg font-semibold tracking-tight text-ink"
            >
              <Icon name="phone" className="h-4 w-4 text-flame" />
              {site.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="flex items-center gap-3 text-sm text-muted"
            >
              <Icon name="mail" className="h-4 w-4 text-flame" />
              {site.email}
            </a>
            <a
              href={whatsappLink("Merhaba, bilgi almak istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-muted"
            >
              <Icon name="whatsapp" className="h-4 w-4 text-flame" />
              WhatsApp&apos;tan yaz
            </a>
          </div>

          <div className="mt-7 flex gap-6 border-t border-line pt-6">
            {[
              ["LinkedIn", site.social.linkedin],
              ["GitHub", site.social.github],
              ["Instagram", site.social.instagram],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="label link-underline text-muted"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Kelime işareti */}
        <div
          className="mt-auto pt-12"
          style={{
            transform: open ? "none" : "translateY(30%)",
            opacity: open ? 1 : 0,
            transition: `transform 1s cubic-bezier(.16,1,.3,1) ${open ? 700 : 0}ms, opacity .8s ease ${open ? 700 : 0}ms`,
          }}
        >
          <Wordmark />
        </div>
      </Container>
    </div>
  );
}
