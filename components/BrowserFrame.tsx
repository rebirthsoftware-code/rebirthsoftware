/**
 * Proje görsellerini içine alan tarayıcı çerçevesi.
 *
 * Ekran görüntüleri farklı oranlarda olabildiği için doğrudan karta
 * basıldığında kırpılıp kötü oturuyordu. Çerçeve, her görsele aynı
 * sunumu vererek bunu çözer: içerik hep aynı oranda bir "ekran" içinde
 * durur ve üstten hizalandığı için sitenin hero bölümü her zaman görünür.
 *
 * Ölçüler yüzde ve konteyner birimi (cqi) ile verildiği için çerçeve
 * küçük kartta da, büyük öne çıkan blokta da orantılı görünür.
 */
export function BrowserFrame({
  label,
  children,
  className = "",
}: {
  /** Adres çubuğunda görünecek alan adı */
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`@container flex h-full w-full flex-col bg-paper-2 p-[4%] ${className}`}
    >
      {/* Ölçüler konteynerle orantılı büyür ama bir üst sınırdan sonra
          sabitlenir; böylece küçük kartta da büyük blokta da dengeli durur. */}
      <div className="flex shrink-0 items-center gap-[min(1cqi,0.4rem)] pb-[3%]">
        <span className="h-[min(1.1cqi,0.4rem)] w-[min(1.1cqi,0.4rem)] rounded-full bg-ink/20" />
        <span className="h-[min(1.1cqi,0.4rem)] w-[min(1.1cqi,0.4rem)] rounded-full bg-ink/15" />
        <span className="h-[min(1.1cqi,0.4rem)] w-[min(1.1cqi,0.4rem)] rounded-full bg-ink/10" />
        <span className="ml-[min(1.5cqi,0.6rem)] flex min-w-0 flex-1 items-center justify-center rounded-full bg-white px-[min(2cqi,0.75rem)] py-[min(0.9cqi,0.3rem)]">
          <span className="truncate text-[min(2.1cqi,0.7rem)] leading-none text-muted">
            {label ?? ""}
          </span>
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-[min(0.8cqi,0.3rem)] bg-white shadow-[0_1cqi_3cqi_-2cqi_rgba(20,20,15,0.35)]">
        {children}
      </div>
    </div>
  );
}

/** URL'den adres çubuğunda gösterilecek sade alan adını çıkarır */
export function domainOf(url?: string) {
  if (!url) return undefined;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}
