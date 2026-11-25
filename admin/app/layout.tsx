import type { Metadata, Viewport } from "next";
import { Epilogue } from "next/font/google";
import "./globals.css";

const epilogue = Epilogue({
  subsets: ["latin", "latin-ext"],
  variable: "--font-epilogue",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Rebirth Yönetim", template: "%s | Rebirth Yönetim" },
  description: "Rebirth Software yönetim paneli: site içeriği, teklif talepleri ve müşteri siteleri.",
  applicationName: "Rebirth Yönetim",
  manifest: "/manifest.webmanifest",
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: "Rebirth Yönetim", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#fbfaf9",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={epilogue.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
