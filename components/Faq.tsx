export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      {items.map((item) => (
        <details key={item.q} className="group px-5 py-4 sm:px-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium text-white marker:hidden">
            {item.q}
            <span className="relative h-4 w-4 shrink-0 text-brand-300">
              <span className="absolute top-1/2 left-0 h-0.5 w-4 -translate-y-1/2 rounded bg-current" />
              <span className="absolute top-0 left-1/2 h-4 w-0.5 -translate-x-1/2 rounded bg-current transition group-open:rotate-90 group-open:opacity-0" />
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-ink-300">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
