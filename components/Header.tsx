"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { Icon } from "./Icon";
import { Container } from "./ui";

const nav = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/projeler", label: "Referanslar" },
  { href: "/surec", label: "Nasıl Çalışıyoruz" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition ${
        scrolled
          ? "border-b border-white/10 bg-ink-950/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <Container>
        <div className="flex h-18 items-center justify-between py-4">
          <Link
            href="/"
            className="group flex items-center gap-2.5"
            aria-label={`${site.name} ana sayfa`}
          >
            <Logo />
            <span className="text-[15px] font-semibold tracking-tight text-white">
              Rebirth<span className="text-brand-400">Software</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3.5 py-2 text-sm transition ${
                  isActive(item.href)
                    ? "bg-white/10 text-white"
                    : "text-ink-300 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={site.phoneHref}
              className="flex items-center gap-2 text-sm font-medium text-ink-200 transition hover:text-white"
            >
              <Icon name="phone" className="h-4 w-4 text-brand-400" />
              {site.phone}
            </a>
            <Link
              href="/teklif-al"
              className="rounded-full bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-400"
            >
              Teklif Al
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden"
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={open}
          >
            <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </Container>

      {open ? (
        <div className="border-t border-white/10 bg-ink-950/98 backdrop-blur-xl lg:hidden">
          <Container className="py-5">
            <nav className="flex flex-col gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-4 py-3 text-base transition ${
                    isActive(item.href)
                      ? "bg-white/10 text-white"
                      : "text-ink-300"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-5 flex flex-col gap-3">
              <Link
                href="/teklif-al"
                className="rounded-full bg-brand-500 px-5 py-3 text-center text-sm font-semibold text-white"
              >
                Ücretsiz Teklif Al
              </Link>
              <a
                href={site.phoneHref}
                className="flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white"
              >
                <Icon name="phone" className="h-4 w-4" />
                {site.phone}
              </a>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}

export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="rb-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6b93ff" />
          <stop offset="100%" stopColor="#14c8b8" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#rb-logo)" opacity="0.16" />
      <path
        d="M14 29V11h7.4c3.6 0 6 2 6 5.3 0 2.5-1.4 4.2-3.7 4.9L28 29h-4.3l-3.7-7h-2.2v7H14Zm3.8-10.2h3.1c1.7 0 2.7-.9 2.7-2.3 0-1.5-1-2.3-2.7-2.3h-3.1v4.6Z"
        fill="url(#rb-logo)"
      />
    </svg>
  );
}
