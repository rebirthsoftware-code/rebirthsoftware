"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { Icon } from "./Icon";
import { MenuToggle } from "./MenuToggle";
import { MobileMenu, type NavItem } from "./MobileMenu";
import { Container } from "./ui";

const nav: NavItem[] = [
  { href: "/hakkimizda", label: "Biz", hint: "Nasıl çalışan bir ekibiz" },
  { href: "/hizmetler", label: "Hizmetler", hint: "Ne yapıyoruz, neler dahil" },
  { href: "/projeler", label: "Projeler", hint: "Tamamladığımız işler" },
  { href: "/surec", label: "Süreç", hint: "Keşiften yayına dört adım" },
  { href: "/iletisim", label: "İletişim", hint: "Bize ulaşın" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

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
    if (!open) {
      document.body.style.overflow = "";
      return;
    }
    // Menü açıkken arka planın kaymasını engelle
    const y = window.scrollY;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      window.scrollTo(0, y);
    };
  }, [open]);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-70 transition-transform duration-500 ${
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
              <Link
                href="/"
                className="group flex items-center gap-3"
                aria-label="Ana sayfa"
                onClick={() => setOpen(false)}
              >
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
                    className={`label link-underline transition-colors ${
                      isActive(item.href)
                        ? "text-flame"
                        : "text-ink-soft hover:text-flame"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="hidden items-center gap-5 lg:flex">
                <a
                  href={site.phoneHref}
                  className="link-underline text-[13px] font-medium tracking-tight text-ink-soft transition hover:text-ink"
                >
                  {site.phone}
                </a>
                <Link
                  href="/teklif-al"
                  className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[13px] font-semibold text-paper transition duration-300 hover:bg-flame hover:text-white"
                >
                  Teklif Al
                  <Icon
                    name="arrowUpRight"
                    className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>

              <MenuToggle
                open={open}
                onClick={() => setOpen((v) => !v)}
                buttonRef={toggleRef}
              />
            </div>
          </Container>
        </div>
      </header>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        items={nav}
        activeHref={pathname}
        returnFocusTo={toggleRef}
      />
    </>
  );
}

export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle
        cx="20"
        cy="20"
        r="19"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.18"
      />
      <path
        d="M13 29V11h8c3.7 0 6.2 2.1 6.2 5.5 0 2.6-1.5 4.4-3.9 5.1L28 29h-4.6l-4-7.2H17V29h-4Zm4-10.6h3.4c1.8 0 2.9-1 2.9-2.5s-1.1-2.4-2.9-2.4H17v4.9Z"
        fill="currentColor"
        className="text-ink"
      />
      <circle cx="31" cy="10" r="3.5" className="fill-flame" />
    </svg>
  );
}
