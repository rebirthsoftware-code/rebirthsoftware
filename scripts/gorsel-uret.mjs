/**
 * Türetilmiş görselleri yeniden üretir.
 *
 *   npm run gorsel
 *
 * İki iş yapar:
 *  1. public/projeler/*.webp içindeki tam boy (1600px) ekran görüntülerinden
 *     640 ve 1200 piksellik varyantları çıkarır. ProjectVisual bunları srcset
 *     ile sunuyor; yeni bir proje görseli eklendiğinde bu komutu çalıştırın.
 *  2. Logonun şeffaf zeminli webp'lerini ve favicon'ları üretir.
 *     Kaynak: public/logo/kaynak.png (düz lacivert çizim, beyaz zemin).
 */
import sharp from "sharp";
import { readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const KOK = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROJE_DIZIN = join(KOK, "public/projeler");
const GENISLIKLER = [640, 1200];
const MUREKKEP = [14, 35, 59]; // --color-ink
const KAGIT = [251, 250, 249]; // --color-paper

const kb = (p) => Math.round(statSync(p).size / 1024) + "KB";

async function projeVaryantlari() {
  for (const dosya of readdirSync(PROJE_DIZIN)) {
    if (!dosya.endsWith(".webp")) continue;
    if (GENISLIKLER.some((g) => dosya.endsWith(`-${g}.webp`))) continue;

    const taban = dosya.replace(/\.webp$/, "");
    for (const g of GENISLIKLER) {
      const hedef = join(PROJE_DIZIN, `${taban}-${g}.webp`);
      await sharp(join(PROJE_DIZIN, dosya))
        .resize({ width: g })
        .webp({ quality: 82, effort: 6 })
        .toFile(hedef);
      console.log("  ", `${taban}-${g}.webp`, kb(hedef));
    }
  }
}

/**
 * Beyaz zemin üzerindeki düz renkli çizimi şeffaf alfaya çevirir: piksel ne
 * kadar koyuysa o kadar opak olur, rengi de marka lacivertine sabitlenir.
 * Böylece logo her zemin üzerinde kutu göstermeden duruyor.
 */
async function alfayaCevir(kaynak, { left, top, width, height }, pad = 6) {
  const { data, info } = await sharp(kaynak)
    .extract({ left: left - pad, top: top - pad, width: width + pad * 2, height: height + pad * 2 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const murekkepL = 0.299 * MUREKKEP[0] + 0.587 * MUREKKEP[1] + 0.114 * MUREKKEP[2];
  const olcek = 255 / (255 - murekkepL);
  const cikti = Buffer.alloc(info.width * info.height * 4);

  for (let p = 0; p < info.width * info.height; p++) {
    const i = p * info.channels;
    const L = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    cikti[p * 4] = MUREKKEP[0];
    cikti[p * 4 + 1] = MUREKKEP[1];
    cikti[p * 4 + 2] = MUREKKEP[2];
    cikti[p * 4 + 3] = Math.round(
      Math.min(255, Math.max(0, (255 - L) * olcek)) * (data[i + 3] / 255)
    );
  }
  return sharp(cikti, { raw: { width: info.width, height: info.height, channels: 4 } });
}

async function logoVarliklari() {
  const kaynak = join(KOK, "assets/logo-kaynak.png");
  if (!existsSync(kaynak)) {
    console.log("   assets/logo-kaynak.png yok, logo adımı atlandı.");
    return;
  }

  // Kaynaktaki çizimin konumları (562x565 daire içinde).
  const isaret = await alfayaCevir(kaynak, { left: 210, top: 144, width: 141, height: 165 });
  const kilit = await alfayaCevir(kaynak, { left: 144, top: 144, width: 272, height: 304 });

  for (const [varlik, dosya, g, y] of [
    [isaret, "public/logo/isaret.webp", 205, 240],
    [kilit, "public/logo/kilit.webp", 286, 320],
  ]) {
    const hedef = join(KOK, dosya);
    await varlik
      .clone()
      .resize({ width: g, height: y, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 90, alphaQuality: 92, effort: 6 })
      .toFile(hedef);
    console.log("  ", dosya, kb(hedef));
  }

  // Favicon ve Apple ikonu: şeffaf logo koyu tarayıcı arayüzünde kaybolmasın
  // diye kağıt zemine yerleştiriliyor.
  for (const [dosya, boy, ic] of [
    ["app/icon.png", 256, 48],
    ["app/apple-icon.png", 180, 30],
  ]) {
    const mark = await isaret
      .clone()
      .resize({
        width: boy - ic * 2,
        height: boy - ic * 2,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();
    const hedef = join(KOK, dosya);
    await sharp({
      create: {
        width: boy,
        height: boy,
        channels: 4,
        background: { r: KAGIT[0], g: KAGIT[1], b: KAGIT[2], alpha: 1 },
      },
    })
      .composite([{ input: mark, gravity: "center" }])
      .png({ compressionLevel: 9 })
      .toFile(hedef);
    console.log("  ", dosya, kb(hedef));
  }
}

console.log("Proje görselleri:");
await projeVaryantlari();
console.log("Logo varlıkları:");
await logoVarliklari();
