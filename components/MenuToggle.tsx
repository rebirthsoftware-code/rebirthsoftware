"use client";

/** Çizgileri X'e dönüşen hamburger düğmesi */
export function MenuToggle({
  open,
  onClick,
  buttonRef,
}: {
  open: boolean;
  onClick: () => void;
  /** Menü kapanınca odağın geri döneceği düğme */
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}) {
  const bar =
    "absolute left-1/2 block h-[1.5px] w-5 -translate-x-1/2 rounded-full bg-current transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]";

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
      aria-expanded={open}
      aria-controls="mobil-menu"
      className="relative z-70 flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors duration-500 hover:border-ink lg:hidden"
    >
      <span className="relative block h-4 w-5">
        <span
          className={bar}
          style={{
            top: open ? "7px" : "2px",
            transform: `translateX(-50%) rotate(${open ? 45 : 0}deg)`,
          }}
        />
        <span
          className={bar}
          style={{
            top: "7px",
            opacity: open ? 0 : 1,
            transform: `translateX(-50%) scaleX(${open ? 0.2 : 1})`,
          }}
        />
        <span
          className={bar}
          style={{
            top: open ? "7px" : "12px",
            width: open ? "1.25rem" : "0.875rem",
            transform: `translateX(-50%) rotate(${open ? -45 : 0}deg)`,
          }}
        />
      </span>
    </button>
  );
}
