/**
 * Teklif talebi biçimi. Site formu /api/teklif'e JSON gönderir; panel bunu
 * depoda (GitHub issue ya da yerel dosya) okunur bir metin + makinece
 * ayrıştırılabilir JSON bloğu olarak saklar.
 */
export type TeklifVerisi = {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
  kaynak?: string;
};

export function teklifBasligi(v: TeklifVerisi) {
  return `Teklif talebi — ${v.name}${v.company ? ` (${v.company})` : ""}`;
}

export function teklifGovdesi(v: TeklifVerisi) {
  return [
    `**Ad Soyad:** ${v.name}`,
    `**Firma:** ${v.company || "-"}`,
    `**E-posta:** ${v.email}`,
    `**Telefon:** ${v.phone || "-"}`,
    `**Hizmet:** ${v.service || "-"}`,
    `**Bütçe:** ${v.budget || "-"}`,
    v.kaynak ? `**Kaynak:** ${v.kaynak}` : null,
    "",
    "**Mesaj:**",
    "",
    v.message,
    "",
    "<!-- teklif-verisi",
    JSON.stringify(v),
    "-->",
  ]
    .filter((s) => s !== null)
    .join("\n");
}

export function teklifAyristir(govde: string): TeklifVerisi | null {
  const m = govde.match(/<!-- teklif-verisi\n([\s\S]*?)\n-->/);
  if (!m) return null;
  try {
    return JSON.parse(m[1]) as TeklifVerisi;
  } catch {
    return null;
  }
}

export const tarihTr = (iso: string, saat = true) =>
  new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    ...(saat ? { timeStyle: "short" } : {}),
    timeZone: "Europe/Istanbul",
  }).format(new Date(iso));
