/**
 * public/ altındaki dosyalara basePath'i ekler.
 *
 * next/link ve next/image basePath'i kendisi ekler, ancak düz <img src="...">
 * ve CSS url() eklemez. GitHub Pages gibi alt dizinde yayınlanan ortamlarda
 * bu yol kullanılmazsa görseller 404 verir.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (path: string) =>
  path.startsWith("/") ? `${BASE}${path}` : path;
