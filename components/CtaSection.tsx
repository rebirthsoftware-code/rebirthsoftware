import { site, whatsappLink } from "@/lib/site";
import { Icon } from "./Icon";
import { Button, Container } from "./ui";

export function CtaSection({
  title = "Projenizi konuşalım",
  description = "Ne yapmak istediğinizi anlatın; size uygun kapsamı, süreyi ve bütçeyi ücretsiz olarak çıkaralım. Anlaşma zorunluluğu yok.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="card relative overflow-hidden p-8 text-center sm:p-14">
          <div className="bg-aurora pointer-events-none absolute inset-0 opacity-70" />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-300">
              {description}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/teklif-al">
                Ücretsiz Teklif Al
                <Icon name="arrow" className="h-4 w-4" />
              </Button>
              <Button
                href={whatsappLink("Merhaba, projem hakkında görüşebilir miyiz?")}
                variant="outline"
                external
              >
                <Icon name="whatsapp" className="h-4 w-4 text-accent-400" />
                WhatsApp&apos;tan yaz
              </Button>
            </div>
            <p className="mt-6 text-sm text-ink-400">
              Ya da doğrudan arayın:{" "}
              <a
                href={site.phoneHref}
                className="font-semibold text-white hover:text-brand-300"
              >
                {site.phone}
              </a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
