import yazilarJson from "@/content/yazilar.json";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // YYYY-MM-DD
  readingMinutes: number;
  category: "Web Tasarım" | "SEO" | "Yazılım" | "İşletme";
  /** Paragraf ve alt başlıklardan oluşan gövde */
  body: ({ h?: string; p?: string; list?: string[] })[];
};

/**
 * Blog yazıları. Veri `content/yazilar.json` dosyasında durur ve yönetim
 * panelinden düzenlenebilir. Yeni yazı eklemek için diziye bir nesne ekleyin;
 * liste, detay sayfası, site haritası ve RSS otomatik güncellenir.
 */
// `category` gibi dar tipli alanları yönetim paneli doğrular.
export const posts: Post[] = yazilarJson as Post[];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const sortedPosts = [...posts].sort((a, b) =>
  b.date.localeCompare(a.date)
);

export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
