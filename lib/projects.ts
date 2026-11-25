import projelerJson from "@/content/projeler.json";

export type Project = {
  slug: string;
  title: string;
  client: string;
  sector: string;
  year: string;
  type: "Kurumsal Web Sitesi" | "Kişiye Özel Yazılım" | "Web Tasarım";
  summary: string;
  challenge: string;
  solution: string;
  result: string[];
  stack: string[];
  url?: string;
  /** Görsel: /public/projeler klasörüne ekle, örn "/projeler/ornek.webp" */
  image?: string;
  /** İsteğe bağlı: görsel yokken kart arka planına degrade uygular.
   *  Boş bırakılırsa nötr koyu bir yer tutucu kullanılır (önerilen). */
  gradient?: [string, string];
  featured?: boolean;
};

/**
 * Gerçek referans projeler.
 *
 * Veri `content/projeler.json` dosyasında durur ve yönetim panelinden
 * düzenlenebilir; buradaki `Project` tipi o dosyanın şemasıdır.
 *
 * NOT — `result` alanı: buradaki maddeler siteye bakılarak yazılmış,
 * doğrulanabilir çıktılardır. Elinizde gerçek ölçüm varsa (ziyaretçi artışı,
 * randevu sayısı, PageSpeed skoru) bunları o rakamlarla değiştirin —
 * ölçülebilir sonuç, özellik listesinden çok daha ikna edicidir.
 */
// `type` ve `gradient` gibi dar tipli alanları yönetim paneli doğrular.
export const projects: Project[] = projelerJson as Project[];

export const featuredProjects = projects.filter((p) => p.featured);
export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
export const projectTypes = Array.from(new Set(projects.map((p) => p.type)));
