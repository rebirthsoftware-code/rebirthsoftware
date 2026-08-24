import Link from "next/link";
import { Icon } from "./Icon";

export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-brand-300 uppercase">
      <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "max-w-2xl text-left"
      }
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-ink-300">
          {description}
        </p>
      ) : null}
    </div>
  );
}

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "outline";
  className?: string;
  external?: boolean;
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  external,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400";
  const styles = {
    primary:
      "bg-brand-500 text-white shadow-glow hover:bg-brand-400 active:translate-y-px",
    outline:
      "border border-white/15 bg-white/5 text-white hover:border-brand-400/60 hover:bg-white/10",
    ghost: "text-ink-200 hover:text-white",
  }[variant];

  const cls = `${base} ${styles} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function ArrowLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300 transition hover:text-brand-200"
    >
      {children}
      <Icon
        name="arrow"
        className="h-4 w-4 transition-transform group-hover:translate-x-1"
      />
    </Link>
  );
}

export function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm text-ink-200">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-brand-300">
        <Icon name="check" className="h-3.5 w-3.5" />
      </span>
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}
