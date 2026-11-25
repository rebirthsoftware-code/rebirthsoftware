import "server-only";
import sharp from "sharp";
import type { Dosya } from "./depo";

/**
 * Proje ekran görüntüsünü sitenin beklediği üç dosyaya çevirir:
 * tam boy (1600px), 640 ve 1200 piksellik varyantlar — sitenin
 * scripts/gorsel-uret.mjs betiğiyle aynı ölçüler ve kalite.
 */
export async function projeGorselleri(slug: string, kaynak: Buffer): Promise<Dosya[]> {
  const temel = sharp(kaynak).rotate();
  const meta = await temel.metadata();
  if (!meta.width || !meta.height) throw new Error("Görsel okunamadı.");
  if (meta.width < 640) throw new Error("Görsel en az 640 piksel genişlikte olmalı.");

  const uret = (genislik: number) =>
    temel.clone().resize({ width: genislik, withoutEnlargement: true }).webp({ quality: 82, effort: 6 }).toBuffer();

  const [tam, k640, k1200] = await Promise.all([uret(1600), uret(640), uret(1200)]);
  return [
    { yol: `public/projeler/${slug}.webp`, icerik: tam },
    { yol: `public/projeler/${slug}-640.webp`, icerik: k640 },
    { yol: `public/projeler/${slug}-1200.webp`, icerik: k1200 },
  ];
}

export const GORSEL_SINIRI = 12 * 1024 * 1024;
