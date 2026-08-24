export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="border-t border-line">
      {items.map((item) => (
        <details key={item.q} className="group border-b border-line py-6">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg font-semibold tracking-tight text-ink transition-colors duration-300 marker:hidden group-open:text-flame hover:text-flame">
            {item.q}
            <span className="relative mt-2 h-3.5 w-3.5 shrink-0">
              <span className="absolute top-1/2 left-0 h-px w-3.5 -translate-y-1/2 bg-current" />
              <span className="absolute top-0 left-1/2 h-3.5 w-px -translate-x-1/2 bg-current transition-transform duration-500 group-open:rotate-90" />
            </span>
          </summary>
          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 group-open:grid-rows-[1fr]">
            <p className="overflow-hidden text-[15px] leading-relaxed text-muted">
              <span className="block pt-4">{item.a}</span>
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
