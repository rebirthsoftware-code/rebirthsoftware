"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

/**
 * Yatay kaydırmalı vitrin.
 *
 * - Fare ile sürüklenebilir (sürükleme sonrası yanlışlıkla tıklama engellenir)
 * - Dokunmatikte doğal kaydırma, kartlar hizaya oturur (scroll-snap)
 * - Ok tuşlarıyla ve Tab ile gezilebilir; kaydırma alanı odaklanabilir
 * - Uçlarda oklar pasifleşir, altta ilerleme çubuğu görünür
 */
export function Carousel({
  children,
  label,
  className = "",
  trackClassName = "",
  controlsClassName = "",
}: {
  children: React.ReactNode;
  /** Ekran okuyucular için bölüm adı */
  label: string;
  className?: string;
  /** Kaydırma alanının kenar boşluğu (kartların ekran kenarına yaslanması için) */
  trackClassName?: string;
  /** Ok ve ilerleme çubuğunun bulunduğu satırın hizası */
  controlsClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [ilerleme, setIlerleme] = useState(0);
  const [basta, setBasta] = useState(true);
  const [sonda, setSonda] = useState(false);
  const [suruklu, setSuruklu] = useState(false);

  const olc = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setIlerleme(max > 0 ? el.scrollLeft / max : 0);
    setBasta(el.scrollLeft <= 2);
    setSonda(max <= 0 || el.scrollLeft >= max - 2);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(() => { olc(); raf = 0; });
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [olc]);

  /** Bir kart kadar kaydır */
  const kaydir = (yon: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const kart = el.querySelector<HTMLElement>("[data-kart]");
    const adim = kart ? kart.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: yon * adim, behavior: "smooth" });
  };

  // --- Fare ile sürükleme ---
  const surukleme = useRef({ aktif: false, x: 0, scroll: 0, mesafe: 0 });

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    surukleme.current = { aktif: true, x: e.clientX, scroll: el.scrollLeft, mesafe: 0 };
    setSuruklu(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const s = surukleme.current;
    const el = ref.current;
    if (!s.aktif || !el) return;
    const fark = e.clientX - s.x;
    s.mesafe = Math.max(s.mesafe, Math.abs(fark));
    el.scrollLeft = s.scroll - fark;
  };

  const bitir = () => {
    surukleme.current.aktif = false;
    setSuruklu(false);
  };

  // Sürükledikten sonra bağlantının açılmasını engelle
  const onClickCapture = (e: React.MouseEvent) => {
    if (surukleme.current.mesafe > 6) {
      e.preventDefault();
      e.stopPropagation();
      surukleme.current.mesafe = 0;
    }
  };

  return (
    <div className={className}>
      <div className="relative">
        {/* Kenar solmaları — kaydırılacak içerik olduğunu belli eder */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper to-transparent transition-opacity duration-300 ${
            basta ? "opacity-0" : "opacity-100"
          }`}
        />
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-paper to-transparent transition-opacity duration-300 ${
            sonda ? "opacity-0" : "opacity-100"
          }`}
        />

        <div
          ref={ref}
          role="region"
          aria-label={label}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={bitir}
          onPointerLeave={bitir}
          onClickCapture={onClickCapture}
          className={`no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 ${trackClassName} ${
            suruklu ? "cursor-grabbing select-none" : "cursor-grab"
          }`}
        >
          {children}
        </div>
      </div>

      {/* Kontroller */}
      <div className={`mt-8 flex items-center gap-6 ${controlsClassName}`}>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => kaydir(-1)}
            disabled={basta}
            aria-label="Önceki projeler"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-line-strong text-ink transition duration-300 hover:border-ink hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-30"
          >
            <Icon name="arrow" className="h-4 w-4 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => kaydir(1)}
            disabled={sonda}
            aria-label="Sonraki projeler"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-line-strong text-ink transition duration-300 hover:border-ink hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-30"
          >
            <Icon name="arrow" className="h-4 w-4" />
          </button>
        </div>

        <div
          aria-hidden="true"
          className="h-px flex-1 overflow-hidden bg-line"
        >
          <div
            className="h-full w-1/3 origin-left rounded-full bg-flame transition-transform duration-200 ease-out"
            style={{ transform: `translateX(${ilerleme * 200}%)` }}
          />
        </div>

        <span className="hidden text-xs text-muted sm:block">
          Sürükleyerek gezin
        </span>
      </div>
    </div>
  );
}

/** Vitrin içindeki tek kart */
export function CarouselItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-kart
      className={`w-[82vw] shrink-0 snap-start sm:w-[58vw] lg:w-[clamp(26rem,39vw,36rem)] ${className}`}
    >
      {children}
    </div>
  );
}
