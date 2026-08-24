import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { site } from "@/lib/site";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "kurumsal web sitesi",
    "web tasarım",
    "kişiye özel yazılım",
    "web yazılım",
    "next.js web sitesi",
    "seo uyumlu web sitesi",
    site.city,
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0d1a",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  description: site.description,
  url: site.url,
  telephone: site.phone,
  email: site.email,
  areaServed: "TR",
  address: {
    "@type": "PostalAddress",
    addressLocality: site.city,
    addressCountry: "TR",
  },
  sameAs: [site.social.linkedin, site.social.github, site.social.instagram],
  makesOffer: [
    "Kurumsal web sitesi",
    "Kişiye özel yazılım",
    "Web tasarım",
    "SEO ve hız optimizasyonu",
  ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="font-sans antialiased">
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-99 focus:rounded-full focus:bg-brand-500 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          İçeriğe geç
        </a>
        <Header />
        <main id="icerik" className="pt-18">
          {children}
        </main>
        <Footer />
        <WhatsAppFab />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </body>
    </html>
  );
}
