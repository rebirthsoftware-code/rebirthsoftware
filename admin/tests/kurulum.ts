import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

/**
 * Testler gerçek GitHub deposuna dokunmaz: sitenin content/ klasörü geçici
 * bir yere kopyalanır ve panel yerel depo modunda bu kopya üzerinde çalışır.
 */
export default async function kurulum() {
  const kok = path.resolve(process.env.ICERIK_KOKU ?? "./.yerel/test-icerik");
  await rm(kok, { recursive: true, force: true });
  await mkdir(path.join(kok, "content"), { recursive: true });
  await cp(path.resolve("../content"), path.join(kok, "content"), { recursive: true });
  // Yerel teklif dosyası da sıfırlanır.
  await rm(path.resolve(".yerel/teklifler.json"), { force: true });
}
