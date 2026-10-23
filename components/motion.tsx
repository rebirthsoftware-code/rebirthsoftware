"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tek bir paylaşılan IntersectionObserver.
 *
 * Sayfada 45'in üzerinde beliren blok var; her biri kendi gözlemcisini
 * oluşturunca ilk yüklemede kayda değer bir maliyet çıkıyordu. Hepsi
 * aynı gözlemciye kaydoluyor, geri çağrılar bir haritadan dağıtılıyor.
 */
type Geri = (gorunur: boolean) => void;

const kayitlar = new WeakMap<Element, { geri: Geri; birKez: boolean }>();
let gozlemci: IntersectionObserver | null = null;

function gozlemciyiAl() {
  if (gozlemci) return gozlemci;
  gozlemci = new IntersectionObserver(
    (girisler) => {
      for (const g of girisler) {
        const kayit = kayitlar.get(g.target);
        if (!kayit) continue;
        if (g.isIntersecting) {
          kayit.geri(true);
          if (kayit.birKez) {
            gozlemci!.unobserve(g.target);
            kayitlar.delete(g.target);
          }
        } else if (!kayit.birKez) {
          kayit.geri(false);
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  return gozlemci;
}

function useInView<T extends HTMLElement>(once = true) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = gozlemciyiAl();
    kayitlar.set(el, { geri: setVisible, birKez: once });
    io.observe(el);
    return () => {
      io.unobserve(el);
      kayitlar.delete(el);
    };
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
  as: Tag = "div",
}: {
  lines: React.ReactNode[];
  className?: string;
  delay?: number;
  /** Başlık olarak kullanılacaksa h1/h2 verin; belge yapısı için önemli. */
  as?: "h1" | "h2" | "h3" | "div" | "p";
}) {
  const { ref, visible } = useInView<HTMLDivElement>();
  return (
    <Tag
      ref={ref as never}
      className={`${visible ? "is-visible" : ""} ${className}`}
    >
      {lines.map((line, i) => (
        <span
          key={i}
          className="line-mask"
          style={{ ["--reveal-delay" as string]: `${delay + i * 110}ms` }}
        >
          <span>{line}</span>
        </span>
      ))}
    </Tag>
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
  // Sunucuda ve JS çalışmadığında doğru değer görünsün diye başlangıç
  // durumu son değerdir; animasyon ilk karede sıfırdan başlar.
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (!visible) return;
    const match = value.match(/^(\D*)(\d+)(.*)$/);
    if (!match) return;

    const [, prefix, digits, suffix] = match;
    const target = Number(digits);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
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
  // Şerit ekrandan çıkınca animasyonu durdur (boşuna GPU harcamasın)
  const { ref, visible } = useInView<HTMLDivElement>(false);
  const doubled = [...items, ...items];
  const text =
    size === "lg"
      ? "text-2xl font-semibold tracking-tight text-ink-soft sm:text-4xl"
      : "text-sm font-medium tracking-tight text-muted sm:text-base";

  return (
    <div
      ref={ref}
      className={`overflow-hidden ${visible ? "" : "marquee-durdur"} ${className}`}
    >
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

/**
 * Kelime kelime koyulaşan paragraf.
 *
 * Önceki sürüm her kaydırma karesinde ~45 span'ın rengini color-mix ile
 * yeniden hesaplıyordu; bu, ölçümde en büyük takılma kaynağıydı.
 * Şimdi paragraf görünür olduğunda tek bir sınıf ekleniyor ve kelimeler
 * CSS gecikmeleriyle sırayla koyulaşıyor — kaydırma başına maliyet yok.
 */
export function ScrollText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const { ref, visible } = useInView<HTMLParagraphElement>();
  const words = text.split(" ");

  return (
    <p
      ref={ref}
      className={`kelime-akis ${visible ? "is-visible" : ""} ${className}`}
    >
      {words.map((w, i) => (
        <span
          key={i}
          style={{ transitionDelay: `${Math.min(i * 28, 1400)}ms` }}
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}

/** İmlece hafifçe yaklaşan sarmalayıcı (birincil eylemler için) */
export function Magnetic({
  children,
  strength = 0.28,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [d, setD] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    setD({
      x: (e.clientX - (r.left + r.width / 2)) * strength,
      y: (e.clientY - (r.top + r.height / 2)) * strength,
    });
  };

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setD({ x: 0, y: 0 })}
      className={`inline-block ${className}`}
      style={{
        transform: `translate3d(${d.x}px, ${d.y}px, 0)`,
        transition: "transform .45s cubic-bezier(.16,1,.3,1)",
      }}
    >
      {children}
    </span>
  );
}

/** Sayfa kaydıkça yavaş hareket eden katman */
export function Parallax({
  children,
  speed = 0.06,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [y, setY] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      const el = ref.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const mid = r.top + r.height / 2 - window.innerHeight / 2;
        setY(-mid * speed);
      }
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform: `translate3d(0, ${y}px, 0)` }}
    >
      {children}
    </div>
  );
}
