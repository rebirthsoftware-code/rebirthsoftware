import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

/**
 * Web uygulaması bildirimi: site telefona "ana ekrana ekle" ile uygulama gibi
 * kurulur. İkonlar `npm run gorsel` ile assets/logo-kaynak.png dosyasından üretilir.
 */
export default function manifest(): MetadataRoute.Manifest {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    lang: "tr",
    start_url: `${base}/`,
    scope: `${base}/`,
    display: "standalone",
    background_color: "#fbfaf9",
    theme_color: "#fbfaf9",
    icons: [
      { src: `${base}/pwa/ikon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${base}/pwa/ikon-512.png`, sizes: "512x512", type: "image/png" },
      {
        src: `${base}/pwa/ikon-maskable-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
