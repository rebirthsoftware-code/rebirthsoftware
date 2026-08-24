"use client";

import { useEffect, useRef, useState } from "react";

function useInView<T extends HTMLElement>(once = true) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            if (once) io.unobserve(e.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return { ref, visible };
}

/** Scroll ile aşağıdan yukarı beliren sarmalayıcı */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  as?: "div" | "section" | "li" | "span" | "p";
  className?: string;
}) {
  const { ref, visible } = useInView<HTMLDivElement>();
  return (
    <Tag
      ref={ref as never}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/** Satırları maskeden yukarı kayarak açılan başlık */
export function RevealLines({
  lines,
  className = "",
  delay = 0,
}: {
  lines: React.ReactNode[];
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`${visible ? "is-visible" : ""} ${className}`}>
      {lines.map((line, i) => (
        <span
          key={i}
          className="line-mask"
          style={{ ["--reveal-delay" as string]: `${delay + i * 110}ms` }}
        >
          <span>{line}</span>
        </span>
      ))}
    </div>
  );
}

/** Görünür olunca hedef sayıya kadar sayan rakam */
export function Counter({
  value,
  duration = 1600,
}: {
  value: string;
  duration?: number;
}) {
  const { ref, visible } = useInView<HTMLSpanElement>();
  const [shown, setShown] = useState("0");

  useEffect(() => {
    if (!visible) return;
    const match = value.match(/^(\D*)(\d+)(.*)$/);
    if (!match) {
      setShown(value);
      return;
    }
    const [, prefix, digits, suffix] = match;
    const target = Number(digits);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(`${prefix}${Math.round(target * eased)}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, value, duration]);

  return <span ref={ref}>{shown}</span>;
}

/** Dönen dairesel yazı + ok — sitenin imza hareketi */
export function RotatingBadge({
  text = "PROJENİZİ KONUŞALIM · TEKLİF ALIN · ",
  className = "relative h-40 w-40 sm:h-48 sm:w-48",
  radius = "-4.6rem",
}: {
  text?: string;
  className?: string;
  /** Harflerin merkezden uzaklığı; küçük rozetlerde daraltın */
  radius?: string;
}) {
  const chars = text.split("");
  const step = 360 / chars.length;

  return (
    <div className={`relative ${className}`}>
      <div className="spin-slow absolute inset-0">
        {chars.map((c, i) => (
          <span
            key={i}
            className="absolute top-1/2 left-1/2 origin-[0_0] text-[10px] font-semibold tracking-widest text-muted sm:text-[11px]"
            style={{
              transform: `rotate(${i * step}deg) translate(0, ${radius})`,
            }}
          >
            {c}
          </span>
        ))}
      </div>
      <span className="absolute inset-[22%] flex items-center justify-center rounded-full border border-line transition group-hover:border-flame">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-1/3 w-1/3 text-ink transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
        >
          <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}

/** Kesintisiz kayan yazı şeridi */
export function Marquee({
  items,
  className = "",
  reverse = false,
  size = "lg",
}: {
  items: string[];
  className?: string;
  reverse?: boolean;
  size?: "lg" | "sm";
}) {
  const doubled = [...items, ...items];
  const text =
    size === "lg"
      ? "text-2xl font-semibold tracking-tight text-ink-soft sm:text-4xl"
      : "text-sm font-medium tracking-tight text-muted sm:text-base";

  return (
    <div className={`overflow-hidden ${className}`}>
      <div className={`marquee-track ${reverse ? "marquee-reverse" : ""}`}>
        {doubled.map((item, i) => (
          <span
            key={i}
            className={`flex shrink-0 items-center gap-6 pr-6 sm:gap-8 sm:pr-8 ${text}`}
          >
            {item}
            <span className="text-flame">{size === "lg" ? "✦" : "·"}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
