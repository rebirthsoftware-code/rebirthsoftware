import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaSection } from "@/components/CtaSection";
import { Icon } from "@/components/Icon";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/ui";
import { formatDate, getPost, posts, sortedPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Yazı bulunamadı" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const others = sortedPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  return (
    <>
      <article>
        <header className="noise relative overflow-hidden border-b border-line pt-32 pb-14 sm:pt-40 sm:pb-16">
          <Container className="relative">
            <Breadcrumbs
              items={[
                { href: "/blog", label: "Blog" },
                { href: `/blog/${post.slug}`, label: post.title },
              ]}
            />

            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-muted">
              <span className="rounded-full bg-flame-tint px-3 py-1 font-medium text-flame">
                {post.category}
              </span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span className="h-1 w-1 rounded-full bg-line-strong" />
              <span>{post.readingMinutes} dk okuma</span>
            </div>

            <h1 className="headline mt-6 max-w-4xl text-ink">{post.title}</h1>
            <p className="mt-7 flex max-w-2xl gap-5 text-[17px] leading-relaxed text-muted">
              <span className="mt-3 h-px w-12 shrink-0 bg-flame" />
              {post.excerpt}
            </p>
          </Container>
        </header>

        <div className="py-16 sm:py-20">
          <Container>
            <div className="prose-tr mx-auto max-w-2xl">
              {post.body.map((block, i) => (
                <div key={i} className="mt-9 first:mt-0">
                  {block.h ? (
                    <h2 className="text-2xl font-bold tracking-tight text-ink">
                      {block.h}
                    </h2>
                  ) : null}
                  {block.p ? (
                    <p className="mt-4 text-[17px] leading-[1.8] text-ink-soft">
                      {block.p}
                    </p>
                  ) : null}
                  {block.list ? (
                    <ul className="mt-5 space-y-3">
                      {block.list.map((li) => (
                        <li
                          key={li}
                          className="flex gap-3 text-[16px] leading-relaxed text-ink-soft"
                        >
                          <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-flame" />
                          {li}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </Container>
        </div>
      </article>

      <section className="border-t border-line py-16 sm:py-20">
        <Container>
          <h2 className="text-xl font-bold tracking-tight text-ink">
            Diğer yazılar
          </h2>
          <div className="mt-8 grid gap-px overflow-hidden rounded-lg bg-line md:grid-cols-3">
            {others.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group bg-paper p-7 transition-colors duration-500 hover:bg-white"
              >
                <span className="text-xs text-muted">{p.category}</span>
                <h3 className="mt-3 text-lg font-bold tracking-tight text-ink transition-colors duration-500 group-hover:text-flame">
                  {p.title}
                </h3>
                <span className="mt-5 inline-flex items-center gap-2 text-sm text-muted">
                  {p.readingMinutes} dk
                  <Icon
                    name="arrowUpRight"
                    className="h-3.5 w-3.5 text-flame transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CtaSection />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
