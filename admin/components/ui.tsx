import Link from "next/link";
import { Icon } from "./Icon";

export function SayfaBasligi({
  baslik,
  aciklama,
  eylem,
}: {
  baslik: string;
  aciklama?: React.ReactNode;
  eylem?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{baslik}</h1>
        {aciklama ? <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">{aciklama}</p> : null}
      </div>
      {eylem ? <div className="flex shrink-0 gap-2">{eylem}</div> : null}
    </div>
  );
}

const butonTaban =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";
const butonTur = {
  birincil: "bg-ink text-paper hover:bg-flame",
  ikincil: "border border-line-strong text-ink hover:border-ink",
  tehlike: "border border-rose-300 text-rose-700 hover:bg-rose-50",
  sade: "text-muted hover:text-ink",
};

export function Buton({
  children,
  tur = "birincil",
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { tur?: keyof typeof butonTur }) {
  return (
    <button className={`${butonTaban} ${butonTur[tur]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function BaglantiButonu({
  href,
  children,
  tur = "birincil",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  tur?: keyof typeof butonTur;
  className?: string;
}) {
  return (
    <Link href={href} className={`${butonTaban} ${butonTur[tur]} ${className}`}>
      {children}
    </Link>
  );
}

export function Alan({
  etiket,
  ad,
  hata,
  ipucu,
  children,
}: {
  etiket: string;
  ad: string;
  hata?: string;
  ipucu?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={ad} className="mb-1.5 block text-xs font-semibold tracking-wide text-muted uppercase">
        {etiket}
      </label>
      {children}
      {hata ? (
        <p id={`${ad}-hata`} role="alert" className="mt-1.5 text-xs font-medium text-rose-700">
          {hata}
        </p>
      ) : ipucu ? (
        <p className="mt-1.5 text-xs text-faint">{ipucu}</p>
      ) : null}
    </div>
  );
}

export function Rozet({
  children,
  ton = "notr",
}: {
  children: React.ReactNode;
  ton?: "notr" | "iyi" | "uyari" | "kotu" | "vurgu";
}) {
  const cls = {
    notr: "bg-paper-2 text-ink-soft",
    iyi: "bg-emerald-50 text-emerald-800",
    uyari: "bg-amber-50 text-amber-800",
    kotu: "bg-rose-50 text-rose-800",
    vurgu: "bg-flame-tint text-flame",
  }[ton];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {children}
    </span>
  );
}

export function BosDurum({ baslik, aciklama, eylem }: { baslik: string; aciklama?: string; eylem?: React.ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper-2 text-muted">
        <Icon name="sparkle" className="h-5 w-5" />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-ink">{baslik}</h2>
      {aciklama ? <p className="mt-1.5 max-w-sm text-sm text-muted">{aciklama}</p> : null}
      {eylem ? <div className="mt-6">{eylem}</div> : null}
    </div>
  );
}

/** Sunucu eyleminden dönen sonuç kutusu */
export function Uyari({ tur, children }: { tur: "ok" | "hata"; children: React.ReactNode }) {
  return (
    <div
      role={tur === "hata" ? "alert" : "status"}
      data-uyari={tur}
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
        tur === "ok"
          ? "border-emerald-500/30 bg-emerald-50 text-emerald-900"
          : "border-rose-500/30 bg-rose-50 text-rose-900"
      }`}
    >
      <Icon name={tur === "ok" ? "check" : "close"} className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex-1">{children}</div>
    </div>
  );
}
