import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import { services } from "@/lib/services";
import { Logo } from "./Header";
import { Container } from "./ui";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-carbon-950">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <Logo />
              <span className="text-[17px] font-bold tracking-tight text-carbon-50">
                rebirth<span className="text-flame-500">.</span>
              </span>
            </div>
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-carbon-400">
              Kurumsal web siteleri ve kişiye özel web yazılımları. Hazır tema
              değil, işinize göre kodlanan çözümler.
            </p>
            <div className="mt-8 flex gap-6">
              {[
                ["LinkedIn", site.social.linkedin],
                ["GitHub", site.social.github],
                ["Instagram", site.social.instagram],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="overline link-underline text-carbon-400 transition hover:text-carbon-50"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="overline text-carbon-500">Hizmetler</h3>
            <ul className="mt-6 space-y-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/hizmetler/${s.slug}`}
                    className="link-underline text-[15px] text-carbon-300 transition hover:text-carbon-50"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="overline text-carbon-500">Kurumsal</h3>
            <ul className="mt-6 space-y-3">
              {[
                { href: "/hakkimizda", label: "Biz" },
                { href: "/surec", label: "Süreç" },
                { href: "/projeler", label: "Projeler" },
                { href: "/sss", label: "SSS" },
                { href: "/teklif-al", label: "Teklif Al" },
                { href: "/iletisim", label: "İletişim" },
                { href: "/kvkk", label: "KVKK" },
                { href: "/gizlilik", label: "Gizlilik" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="link-underline text-[15px] text-carbon-300 transition hover:text-carbon-50"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="overline text-carbon-500">İletişim</h3>
            <ul className="mt-6 space-y-4 text-[15px]">
              <li>
                <a
                  href={site.phoneHref}
                  className="link-underline text-carbon-50 transition hover:text-flame-500"
                >
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="link-underline text-carbon-300 transition hover:text-carbon-50"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink("Merhaba, bilgi almak istiyorum.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-carbon-300 transition hover:text-carbon-50"
                >
                  WhatsApp
                </a>
              </li>
              <li className="text-carbon-400">{site.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-carbon-500">
            © {year} {site.name}. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-carbon-600">
            Next.js ile geliştirildi · Vercel üzerinde yayında
          </p>
        </div>
      </Container>
    </footer>
  );
}
