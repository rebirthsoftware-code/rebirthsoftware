import hizmetlerJson from "@/content/hizmetler.json";

export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: string;
  features: string[];
  deliverables: string[];
  faq: { q: string; a: string }[];
};

/**
 * Hizmetler. Veri `content/hizmetler.json` dosyasında durur ve yönetim
 * panelinden düzenlenebilir; buradaki `Service` tipi o dosyanın şemasıdır.
 * `icon`, components/Icon.tsx içindeki bir simge adı olmalıdır.
 */
export const services: Service[] = hizmetlerJson as Service[];

export const getService = (slug: string) =>
  services.find((s) => s.slug === slug);
