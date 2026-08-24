import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import { services } from "@/lib/services";
import { Icon } from "./Icon";
import { Logo } from "./Header";
import { Container } from "./ui";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-white/10 bg-ink-950">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <Logo />
              <span className="text-[15px] font-semibold text-white">
                Rebirth<span className="text-brand-400">Software</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
              Kurumsal web siteleri ve kişiye özel web yazılımları
              geliştiriyoruz. Hazır tema değil, işinize göre kodlanan çözümler.
            </p>
            <div className="mt-5 flex gap-2">
              <SocialLink href={site.social.linkedin} label="LinkedIn">
                in
              </SocialLink>
              <SocialLink href={site.social.github} label="GitHub">
                gh
              </SocialLink>
              <SocialLink href={site.social.instagram} label="Instagram">
                ig
              </SocialLink>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Hizmetler</h3>
            <ul className="mt-4 space-y-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/hizmetler/${s.slug}`}
                    className="text-sm text-ink-400 transition hover:text-brand-300"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Kurumsal</h3>
            <ul className="mt-4 space-y-2.5">
              {[
                { href: "/hakkimizda", label: "Hakkımızda" },
                { href: "/surec", label: "Nasıl Çalışıyoruz" },
                { href: "/projeler", label: "Referanslar" },
                { href: "/sss", label: "Sık Sorulan Sorular" },
                { href: "/teklif-al", label: "Teklif Al" },
                { href: "/iletisim", label: "İletişim" },
                { href: "/kvkk", label: "KVKK Aydınlatma Metni" },
                { href: "/gizlilik", label: "Gizlilik Politikası" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-ink-400 transition hover:text-brand-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">İletişim</h3>
            <ul className="mt-4 space-y-3.5 text-sm text-ink-400">
              <li>
                <a
                  href={site.phoneHref}
                  className="flex items-start gap-2.5 transition hover:text-brand-300"
                >
                  <Icon name="phone" className="mt-0.5 h-4 w-4 text-brand-400" />
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-start gap-2.5 transition hover:text-brand-300"
                >
                  <Icon name="mail" className="mt-0.5 h-4 w-4 text-brand-400" />
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink("Merhaba, web sitesi hakkında bilgi almak istiyorum.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 transition hover:text-brand-300"
                >
                  <Icon
                    name="whatsapp"
                    className="mt-0.5 h-4 w-4 text-accent-400"
                  />
                  WhatsApp&apos;tan yazın
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon name="pin" className="mt-0.5 h-4 w-4 text-brand-400" />
                {site.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-500">
            © {year} {site.name}. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-ink-500">
            Next.js ile geliştirildi, Vercel üzerinde yayında.
          </p>
        </div>
      </Container>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-semibold text-ink-300 uppercase transition hover:border-brand-400/50 hover:text-white"
    >
      {children}
    </a>
  );
}
