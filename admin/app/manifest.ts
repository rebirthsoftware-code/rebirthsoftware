import type { MetadataRoute } from "next";

export const dynamic = "force-static";

/** Panel telefona "ana ekrana ekle" ile uygulama gibi kurulur. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Rebirth Yönetim",
    short_name: "Yönetim",
    description: "Site içeriği, teklif talepleri ve müşteri siteleri.",
    lang: "tr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fbfaf9",
    theme_color: "#fbfaf9",
    icons: [
      { src: "/pwa/ikon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/pwa/ikon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/pwa/ikon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
