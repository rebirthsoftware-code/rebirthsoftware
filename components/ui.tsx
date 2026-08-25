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
    <div className={`mx-auto w-full max-w-[1360px] px-6 sm:px-10 ${className}`}>
      {children}
    </div>
  );
}

export function Eyebrow({
  children,
  index,
}: {
  children: React.ReactNode;
  /** Bölüm sırası — "01" gibi editoryal numara gösterir */
  index?: number;
}) {
  return (
    <span className="label flex items-center gap-3 text-muted">
      {index !== undefined ? (
        <span className="text-faint tabular-nums">
          {String(index).padStart(2, "0")}
        </span>
      ) : null}
      <span className="h-px w-8 bg-flame" />
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
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <div className={align === "center" ? "flex justify-center" : ""}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      ) : null}
      <h2 className="headline mt-6 text-ink">{title}</h2>
      {description ? (
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
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
 "group/btn inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-4 text-sm font-semibold tracking-tight transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flame";
  const styles = {
    primary: "bg-ink text-paper hover:bg-flame hover:text-white",
    outline:
 "border border-line-strong text-ink hover:border-ink hover:bg-ink hover:text-paper",
    ghost: "text-muted hover:text-ink",
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
      className="group inline-flex items-center gap-2 text-sm font-semibold text-ink"
    >
      <span className="link-underline">{children}</span>
      <Icon
        name="arrow"
        className="h-4 w-4 text-flame transition-transform duration-500 group-hover:translate-x-1.5"
      />
    </Link>
  );
}

export function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-4 border-b border-line pb-4 text-[15px] text-ink-soft last:border-0">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-flame" />
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}
