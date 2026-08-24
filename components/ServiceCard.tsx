import Link from "next/link";
import type { Service } from "@/lib/services";
import { Icon } from "./Icon";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/hizmetler/${service.slug}`}
      className="group flex flex-col border-t border-line pt-6 transition-colors duration-500"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink-soft transition duration-500 group-hover:border-flame group-hover:bg-flame group-hover:text-white">
        <Icon name={service.icon} className="h-5 w-5" />
      </span>
      <h3 className="mt-6 text-xl font-bold tracking-tight text-ink transition-colors duration-500 group-hover:text-flame">
        {service.title}
      </h3>
      <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">
        {service.short}
      </p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink">
        <span className="link-underline">Detaylar</span>
        <Icon
          name="arrowUpRight"
          className="h-4 w-4 text-flame transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      </span>
    </Link>
  );
}
