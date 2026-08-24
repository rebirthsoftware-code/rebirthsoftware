"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hero görseli: kurulan bir sitenin canlandırması.
 * Tarayıcı çerçevesi içinde bloklar sırayla belirir, altta performans
 * göstergeleri dolar. Görsel dosya kullanmaz, tamamen CSS ile çizilir.
 */
export function HeroMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setOn(true),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setTilt({
        x: ((e.clientY - cy) / cy) * -2.5,
        y: ((e.clientX - cx) / cx) * 3,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const step = (i: number) => ({
    opacity: on ? 1 : 0,
    transform: on ? "none" : "translateY(10px)",
    transition: `opacity .7s cubic-bezier(.16,1,.3,1) ${300 + i * 130}ms, transform .7s cubic-bezier(.16,1,.3,1) ${300 + i * 130}ms`,
  });

  return (
    <div ref={ref} className="relative w-full max-w-[520px]">
      <div
        className="relative rounded-xl border border-line bg-white p-2.5 shadow-[0_40px_80px_-50px_rgba(20,20,15,0.45)]"
        style={{
          transform: `perspective(1400px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform .5s cubic-bezier(.16,1,.3,1)",
        }}
      >
        {/* tarayıcı çubuğu */}
        <div className="flex items-center gap-1.5 px-1 pb-2.5">
          <span className="h-2 w-2 rounded-full bg-ink/15" />
          <span className="h-2 w-2 rounded-full bg-ink/12" />
          <span className="h-2 w-2 rounded-full bg-ink/10" />
          <span className="ml-2 flex-1 truncate rounded-md bg-paper-2 px-2.5 py-1 text-[10px] text-muted">
            www.sirketiniz.com
          </span>
        </div>

        {/* sayfa içeriği */}
        <div className="space-y-3 rounded-lg bg-paper p-5">
          <div className="flex items-center justify-between" style={step(0)}>
            <span className="h-2 w-14 rounded-full bg-ink/20" />
            <div className="flex gap-2">
              <span className="h-2 w-6 rounded-full bg-ink/10" />
              <span className="h-2 w-6 rounded-full bg-ink/10" />
              <span className="h-4 w-10 rounded-full bg-flame" />
            </div>
          </div>

          <div className="space-y-2 pt-2" style={step(1)}>
            <span className="block h-4 w-[85%] rounded-full bg-ink/85" />
            <span className="block h-4 w-[55%] rounded-full bg-ink/25" />
          </div>

          <div className="space-y-1.5" style={step(2)}>
            <span className="block h-1.5 w-[70%] rounded-full bg-ink/10" />
            <span className="block h-1.5 w-[58%] rounded-full bg-ink/10" />
          </div>

          <div className="flex gap-2 pt-1" style={step(3)}>
            <span className="h-7 w-24 rounded-full bg-ink" />
            <span className="h-7 w-20 rounded-full border border-ink/15" />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3" style={step(4)}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-14 rounded-md border border-line bg-white"
                style={{
                  transitionDelay: `${820 + i * 110}ms`,
                  opacity: on ? 1 : 0,
                  transform: on ? "none" : "translateY(8px)",
                  transition: "opacity .6s ease, transform .6s cubic-bezier(.16,1,.3,1)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* performans göstergeleri */}
      <div
        className="absolute -bottom-8 -left-3 flex gap-2 sm:-left-12"
        style={step(6)}
      >
        {[
          { label: "PageSpeed", value: 98 },
          { label: "Erişilebilirlik", value: 100 },
        ].map((m, i) => (
          <div
            key={m.label}
            className="rounded-lg border border-line bg-white px-3.5 py-2.5 shadow-[0_10px_30px_-20px_rgba(20,20,15,0.5)]"
          >
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold tracking-tight text-ink">
                {m.value}
              </span>
              <span className="text-[10px] text-muted">/100</span>
            </div>
            <span className="mt-1 block h-1 w-16 overflow-hidden rounded-full bg-ink/8">
              <span
                className="block h-full rounded-full bg-flame"
                style={{
                  width: on ? `${m.value}%` : "0%",
                  transition: `width 1.4s cubic-bezier(.16,1,.3,1) ${1100 + i * 180}ms`,
                }}
              />
            </span>
            <span className="mt-1.5 block text-[10px] text-muted">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
