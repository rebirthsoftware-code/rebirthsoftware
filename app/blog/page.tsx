import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CtaSection } from "@/components/CtaSection";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/motion";
import { Container } from "@/components/ui";
import { formatDate, sortedPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Web sitesi, SEO, hız ve kişiye özel yazılım üzerine sade, işinize yarayan yazılar.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const [lead, ...rest] = sortedPosts;

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Yazılar"
        description="Satış konuşması değil; web sitesi yaptırırken, fiyat karşılaştırırken ve yazılım kararı alırken işinize yarayacak notlar."
      />

      <section className="py-16 sm:py-20">
        <Container>
          {/* Öne çıkan yazı */}
          <Reveal>
            <Link
              href={`/blog/${lead.slug}`}
              className="group block border-b border-line pb-12"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                <span className="rounded-full bg-flame-tint px-3 py-1 font-medium text-flame">
                  {lead.category}
                </span>
                <time dateTime={lead.date}>{formatDate(lead.date)}</time>
                <span className="h-1 w-1 rounded-full bg-line-strong" />
                <span>{lead.readingMinutes} dk okuma</span>
              </div>

              <h2 className="mt-5 max-w-3xl text-3xl font-bold tracking-tight text-ink transition-colors duration-500 group-hover:text-flame sm:text-5xl">
                {lead.title}
              </h2>
              <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted">
                {lead.excerpt}
              </p>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="link-underline">Yazıyı oku</span>
                <Icon
                  name="arrowUpRight"
                  className="h-4 w-4 text-flame transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </span>
            </Link>
          </Reveal>

          {/* Diğer yazılar */}
          <div className="mt-4">
            {rest.map((post, i) => (
              <Reveal key={post.slug} delay={i * 70}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="row-hover -mx-4 block border-b border-line px-4 py-8 hover:bg-white"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-10">
                    <div className="flex shrink-0 flex-wrap items-center gap-3 text-xs text-muted lg:w-56">
                      <span className="rounded-full border border-line px-2.5 py-1">
                        {post.category}
                      </span>
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-bold tracking-tight text-ink transition-colors duration-500 group-hover:text-flame sm:text-2xl">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-muted">
                        {post.excerpt}
                      </p>
                    </div>

                    <span className="shrink-0 text-xs text-faint lg:w-24 lg:text-right">
                      {post.readingMinutes} dk
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaSection
        title="Sorunuz mu var"
        description="Yazıda geçen bir konuyu kendi projeniz için konuşmak isterseniz, kısa bir görüşme ayarlayalım."
      />
    </>
  );
}
