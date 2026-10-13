"use client";

import { usePathname } from "next/navigation";
import { CookieNotice } from "./CookieNotice";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ScrollProgress } from "./ScrollProgress";
import { WhatsAppFab } from "./WhatsAppFab";

/**
 * Kurumsal sitenin çerçevesi: başlık, alt bilgi, WhatsApp düğmesi, çerez notu.
 *
 * Bağımsız araç sayfaları (ör. /satis) bu çerçeveyi kullanmaz; sayfa kendi
 * başlığını taşır. Yeni bir bağımsız sayfa eklerken aşağıdaki listeye ekleyin.
 */
const CERCEVESIZ = ["/satis"];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const cercevesiz = CERCEVESIZ.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (cercevesiz) {
    return <main id="icerik">{children}</main>;
  }

  return (
    <>
      <a
        href="#icerik"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-99 focus:rounded-full focus:bg-flame focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        İçeriğe geç
      </a>
      <ScrollProgress />
      <Header />
      <main id="icerik">{children}</main>
      <Footer />
      <WhatsAppFab />
      <CookieNotice />
    </>
  );
}
