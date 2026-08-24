import type { NextConfig } from "next";

/**
 * İki farklı çıktı modu:
 *
 * 1) Varsayılan (Vercel / npm run dev)
 *    Sunucu tarafı çalışır, /api/teklif aktiftir, form e-posta gönderir.
 *
 * 2) STATIC_EXPORT=true (GitHub Pages)
 *    Site tamamen statik HTML olarak dışa aktarılır. Sunucu kodu
 *    çalışmadığı için teklif formu WhatsApp yönlendirmesine düşer.
 */
const isStaticExport = process.env.STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(isStaticExport
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
