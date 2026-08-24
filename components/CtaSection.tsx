import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import { Icon } from "./Icon";
import { Reveal, RevealLines, RotatingBadge } from "./motion";
import { Button, Container } from "./ui";

export function CtaSection({
  title = "Hadi başlayalım",
  description = "Ne yapmak istediğinizi anlatın; size uygun kapsamı, süreyi ve bütçeyi ücretsiz olarak çıkaralım. Anlaşma zorunluluğu yok.",
}: {
  title?: string;
  description?: string;
}) {
  const [first, ...rest] = title.split(" ");

  return (
    <section className="noise relative overflow-hidden border-t border-white/10 py-28 sm:py-40">
      <Container className="relative">
        <div className="flex flex-col items-start justify-between gap-14 lg:flex-row lg:items-center">
          <div className="max-w-3xl">
            <RevealLines
              className="display text-carbon-50"
              lines={[
                <>
                  {first}{" "}
                  <span className="text-flame-500">{rest.join(" ")}</span>
                </>,
              ]}
            />
            <Reveal delay={220}>
              <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-carbon-300">
                {description}
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button href="/teklif-al">
                  Ücretsiz teklif al
                  <Icon
                    name="arrowUpRight"
                    className="h-4 w-4 transition-transform duration-500 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                  />
                </Button>
                <Button
                  href={whatsappLink("Merhaba, projem hakkında görüşebilir miyiz?")}
                  variant="outline"
                  external
                >
                  <Icon name="whatsapp" className="h-4 w-4" />
                  WhatsApp&apos;tan yaz
                </Button>
              </div>
              <p className="mt-8 text-sm text-carbon-400">
                Ya da doğrudan arayın:{" "}
                <a
                  href={site.phoneHref}
                  className="link-underline font-semibold text-carbon-50"
                >
                  {site.phone}
                </a>
              </p>
            </Reveal>
          </div>

          <Reveal delay={340}>
            <Link href="/teklif-al" className="group block">
              <RotatingBadge text="TEKLİF ALIN · ÜCRETSİZ GÖRÜŞME · " />
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
