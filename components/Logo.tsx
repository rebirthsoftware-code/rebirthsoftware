import { asset } from "@/lib/asset";

/**
 * Marka işareti (monogram). Header ve menüde kullanılır.
 * Dosya şeffaf zeminli ve ekrandaki boyutunun birkaç katı çözünürlükte.
 */
export function LogoMark({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset("/logo/isaret.webp")}
      alt=""
      width={205}
      height={240}
      decoding="async"
      className={className}
    />
  );
}

/**
 * Tam kilit: işaret + "REBIRTH SOFTWARE SYSTEMS" yazısı.
 * Footer gibi markanın tam hâliyle durduğu yerlerde kullanılır; ekranın
 * altında kaldığı için tembel yüklenir.
 */
export function LogoLockup({
  className = "h-28 w-auto",
}: {
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset("/logo/kilit.webp")}
      alt="Rebirth Software Systems"
      width={286}
      height={320}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}
