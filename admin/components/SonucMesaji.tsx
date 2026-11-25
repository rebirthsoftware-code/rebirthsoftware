import { Uyari } from "./ui";

/** Liste sayfalarında ?kaydedildi= / ?silindi= parametresini mesaja çevirir. */
export async function SonucMesaji({
  searchParams,
}: {
  searchParams: Promise<{ kaydedildi?: string; silindi?: string }>;
}) {
  const p = await searchParams;
  if (p.kaydedildi)
    return (
      <div className="mb-5">
        <Uyari tur="ok">
          <strong>{p.kaydedildi}</strong> kaydedildi. Siteye yansıması 1-2 dakika sürer.
        </Uyari>
      </div>
    );
  if (p.silindi)
    return (
      <div className="mb-5">
        <Uyari tur="ok">
          <strong>{p.silindi}</strong> silindi.
        </Uyari>
      </div>
    );
  return null;
}
