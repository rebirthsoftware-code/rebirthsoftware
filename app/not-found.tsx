import { Button, Container } from "@/components/ui";
import { Icon } from "@/components/Icon";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div className="" />
      <Container className="relative">
        <div className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
          <span className="text-7xl font-semibold text-line-strong sm:text-8xl">
            404
          </span>
          <h1 className="mt-4 text-2xl font-semibold text-ink sm:text-3xl">
            Aradığınız sayfayı bulamadık
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
            Bağlantı taşınmış veya silinmiş olabilir. Ana sayfadan devam
            edebilir ya da doğrudan teklif formuna geçebilirsiniz.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/">
              Ana sayfaya dön
              <Icon name="arrow" className="h-4 w-4" />
            </Button>
            <Button href="/iletisim" variant="outline">
              İletişime geç
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
