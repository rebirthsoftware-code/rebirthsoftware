"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { Icon } from "./Icon";
import { Container } from "./ui";

const nav = [
  { href: "/hakkimizda", label: "Biz" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/projeler", label: "Projeler" },
  { href: "/surec", label: "Süreç" },
  { href: "/iletisim", label: "İletişim" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 24);
      setHidden(y > 220 && y > last);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div
          className={`transition-colors duration-500 ${
            solid && !open ? "border-b border-line bg-paper/85 backdrop-blur-xl" : ""
          }`}
        >
          <Container>
            <div className="flex h-20 items-center justify-between">
              <Link href="/" className="group flex items-center gap-3" aria-label="Ana sayfa">
                <Logo />
                <span className="text-[17px] font-bold tracking-tight text-ink">
                  rebirth<span className="text-flame">.</span>
                </span>
              </Link>

              <nav className="hidden items-center gap-9 lg:flex">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`overline link-underline transition-colors ${
                      isActive(item.href)
                        ? "text-ink"
                        : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="hidden items-center gap-5 lg:flex">
                <a
                  href={site.phoneHref}
                  className="text-[13px] font-medium tracking-tight text-ink-soft link-underline transition hover:text-ink"
                >
                  {site.phone}
                </a>
                <Link
                  href="/teklif-al"
                  className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[13px] font-semibold text-paper transition duration-300 hover:bg-flame hover:text-white"
                >
                  Teklif Al
                  <Icon
                    name="arrow"
                    className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1"
                  />
                </Link>
              </div>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition hover:border-ink lg:hidden"
                aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
                aria-expanded={open}
              >
                <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
              </button>
            </div>
          </Container>
        </div>
      </header>

      {/* Tam ekran mobil menü */}
      <div
        className={`fixed inset-0 z-40 bg-paper transition-opacity duration-500 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <Container className="flex h-full flex-col justify-center pt-20 pb-10">
          <nav className="flex flex-col">
            {nav.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className="row-hover border-b border-line py-5 text-4xl font-bold tracking-tight text-ink hover:text-flame"
                style={{
                  transitionDelay: open ? `${i * 60}ms` : "0ms",
                  opacity: open ? 1 : 0,
                  transform: open ? "none" : "translateY(20px)",
                  transitionProperty: "opacity, transform, color, padding-left",
                  transitionDuration: "600ms",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-10 flex flex-col gap-4">
            <Link
              href="/teklif-al"
              className="rounded-full bg-flame px-6 py-4 text-center text-sm font-semibold text-white"
            >
              Ücretsiz Teklif Al
            </Link>
            <a
              href={site.phoneHref}
              className="text-center text-sm text-muted"
            >
              {site.phone}
            </a>
          </div>
        </Container>
      </div>
    </>
  );
}

export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeOpacity="0.18" />
      <path
        d="M13 29V11h8c3.7 0 6.2 2.1 6.2 5.5 0 2.6-1.5 4.4-3.9 5.1L28 29h-4.6l-4-7.2H17V29h-4Zm4-10.6h3.4c1.8 0 2.9-1 2.9-2.5s-1.1-2.4-2.9-2.4H17v4.9Z"
        fill="currentColor"
        className="text-ink"
      />
      <circle cx="31" cy="10" r="3.5" className="fill-flame" />
    </svg>
  );
}
