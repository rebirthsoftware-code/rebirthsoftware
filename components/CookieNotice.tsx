"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "rs-cerez-onay";

/**
 * Çerez bildirimi. Karar tarayıcıda saklanır, sunucuya gönderilmez.
 * Reddedilirse ölçüm çerezleri hiç yüklenmez (şu an yalnızca zorunlu
 * çerezler kullanılıyor; ölçüm eklendiğinde bu karar okunmalıdır).
 */
export function CookieNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Karar okuma tarayıcıya bağlı; gizli sekmede erişim hata verebilir.
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(KEY);
    } catch {
      stored = null;
    }
    if (!stored) {
      const t = window.setTimeout(() => setShow(true), 1200);
      return () => window.clearTimeout(t);
    }
  }, []);

  const decide = (value: "kabul" | "red") => {
    try {
      window.localStorage.setItem(KEY, value);
    } catch {
      /* saklanamıyorsa sadece bu oturumda gizle */
    }
    setShow(false);
  };

  return (
    <div
      aria-live="polite"
      className={`fixed bottom-4 left-4 z-50 max-w-sm transition-all duration-500 sm:bottom-6 sm:left-6 ${
        show
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div className="rounded-lg border border-line bg-white p-5 shadow-[0_24px_50px_-30px_rgba(20,20,15,0.5)]">
        <p className="text-sm leading-relaxed text-muted">
          Bu sitede yalnızca çalışması için gerekli çerezler ve anonim ziyaret
          ölçümü kullanılır. Ayrıntı için{" "}
          <Link href="/gizlilik" className="text-flame underline underline-offset-2 hover:no-underline">
            Gizlilik ve Çerez Politikası
          </Link>
          .
        </p>
        <div className="mt-4 flex gap-2.5">
          <button
            type="button"
            onClick={() => decide("kabul")}
            className="rounded-full bg-ink px-5 py-2.5 text-xs font-semibold text-paper transition hover:bg-flame hover:text-white"
          >
            Kabul et
          </button>
          <button
            type="button"
            onClick={() => decide("red")}
            className="rounded-full border border-line px-5 py-2.5 text-xs font-semibold text-ink transition hover:border-ink"
          >
            Sadece zorunlu
          </button>
        </div>
      </div>
    </div>
  );
}
