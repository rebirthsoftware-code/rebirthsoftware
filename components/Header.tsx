"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { Icon } from "./Icon";
import { MenuToggle } from "./MenuToggle";
import { MobileMenu, type NavItem } from "./MobileMenu";
import { Container } from "./ui";
import { LogoMark } from "./Logo";

const nav: NavItem[] = [
  { href: "/hakkimizda", label: "Biz", hint: "Nasıl çalışan bir ekibiz" },
  { href: "/hizmetler", label: "Hizmetler", hint: "Ne yapıyoruz, neler dahil" },
  { href: "/projeler", label: "Projeler", hint: "Tamamladığımız işler" },
  { href: "/surec", label: "Süreç", hint: "Keşiften yayına dört adım" },
  { href: "/blog", label: "Blog", hint: "İşinize yarayacak notlar" },
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

  // Sayfa değişince menüyü kapat. Effect yerine render sırasında düzeltme
  // yapılıyor; React'in önerdiği "prop değişince state'i ayarla" kalıbı.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

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
            // Saydam + backdrop-blur, kaydırmanın her karesinde tam genişlikte
            // yeniden boyama demek. Düz zemin görsel olarak aynı, bedavaya geliyor.
            solid && !open ? "border-b border-line bg-paper" : ""
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
                <LogoMark className="h-9 w-auto transition-transform duration-500 group-hover:scale-105" />
                <span className="flex flex-col leading-none">
                  <span className="text-[15px] font-bold tracking-[0.12em] text-ink">
                    REBIRTH
                  </span>
                  <span className="mt-1 text-[9px] font-semibold tracking-[0.2em] text-muted">
                    SOFTWARE SYSTEMS
                  </span>
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
