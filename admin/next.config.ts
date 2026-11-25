import type { NextConfig } from "next";

/**
 * Rebirth Software yönetim paneli — kurumsal siteden ayrı bir uygulama.
 *
 * Vercel'de ayrı proje olarak yayınlanır (Root Directory: admin). Sunucu
 * tarafı gerektirir: oturum çerezi, GitHub API çağrıları ve teklif formu
 * ucu (/api/teklif) burada çalışır. Statik dışa aktarılamaz.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  serverExternalPackages: ["sharp"],
  // Üst dizinde sitenin lockfile'ı var; kök bu klasördür.
  turbopack: { root: __dirname },
  async headers() {
    return [
      {
        // İç kullanım aracı: arama motorları hiçbir sayfayı listelemesin.
        source: "/(.*)",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
