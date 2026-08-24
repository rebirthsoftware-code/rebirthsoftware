import Link from "next/link";
import type { Service } from "@/lib/services";
import { Icon } from "./Icon";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/hizmetler/${service.slug}`}
      className="card card-hover group flex flex-col p-6"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300 transition group-hover:bg-brand-500/25">
        <Icon name={service.icon} className="h-5.5 w-5.5" />
      </span>
      <h3 className="mt-5 text-lg font-semibold text-white">{service.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-400">
        {service.short}
      </p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300">
        Detaylar
        <Icon
          name="arrow"
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}
