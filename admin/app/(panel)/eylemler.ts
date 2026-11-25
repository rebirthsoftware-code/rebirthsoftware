"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { depo, type Dosya } from "@/lib/depo";
import { GORSEL_SINIRI, projeGorselleri } from "@/lib/gorsel";
import {
  type Hatalar,
  hizmetDogrula,
  kaydet,
  metin,
  musteriSitesiDogrula,
  oku,
  projeDogrula,
  siteDogrula,
  yaziDogrula,
} from "@/lib/icerik";
import { oturumGerekli } from "@/lib/oturum";

/**
 * Tüm yazma işlemleri burada. Her eylem:
 *  1. oturumu doğrular,
 *  2. formu doğrular (hata varsa alan bazlı hataları döner),
 *  3. içeriği depoya yazar (GitHub'da tek commit),
 *  4. ilgili sayfaları tazeler ve listeye döner.
 */

export type FormDurumu = { hatalar?: Hatalar; genel?: string; ok?: string };

function genelHata(e: unknown): FormDurumu {
  const mesaj = e instanceof Error ? e.message : "Beklenmeyen hata.";
  return { genel: `Kaydedilemedi: ${mesaj}` };
}

/* ---------------- Projeler ---------------- */

export async function projeKaydet(eskiSlug: string | null, _d: FormDurumu, fd: FormData): Promise<FormDurumu> {
  await oturumGerekli();
  const liste = await oku("projeler");
  const { deger, hatalar } = projeDogrula(fd, liste.map((p) => p.slug), eskiSlug ?? undefined);
  if (!deger) return { hatalar };

  const ekDosyalar: Dosya[] = [];
  const dosya = fd.get("gorsel");
  if (dosya instanceof File && dosya.size > 0) {
    if (dosya.size > GORSEL_SINIRI) return { hatalar: { gorsel: "Görsel 12 MB'tan küçük olmalı." } };
    try {
      ekDosyalar.push(...(await projeGorselleri(deger.slug, Buffer.from(await dosya.arrayBuffer()))));
    } catch (e) {
      return { hatalar: { gorsel: e instanceof Error ? e.message : "Görsel işlenemedi." } };
    }
    deger.image = `/projeler/${deger.slug}.webp`;
  } else if (eskiSlug) {
    // Görsel değişmediyse eski görsel yolu korunur.
    const eski = liste.find((p) => p.slug === eskiSlug);
    if (eski?.image && !deger.image) deger.image = eski.image;
    if (eski?.gradient) deger.gradient = eski.gradient;
  }

  const yeniListe = eskiSlug
    ? liste.map((p) => (p.slug === eskiSlug ? deger : p))
    : [deger, ...liste];

  try {
    await kaydet("projeler", yeniListe, eskiSlug ? `Proje güncellendi: ${deger.title}` : `Proje eklendi: ${deger.title}`, ekDosyalar);
  } catch (e) {
    return genelHata(e);
  }
  revalidatePath("/projeler");
  redirect(`/projeler?kaydedildi=${encodeURIComponent(deger.title)}`);
}

export async function projeSil(fd: FormData) {
  await oturumGerekli();
  const slug = metin(fd, "slug");
  const liste = await oku("projeler");
  const silinen = liste.find((p) => p.slug === slug);
  if (!silinen) return;
  await kaydet("projeler", liste.filter((p) => p.slug !== slug), `Proje silindi: ${silinen.title}`);
  revalidatePath("/projeler");
  redirect(`/projeler?silindi=${encodeURIComponent(silinen.title)}`);
}

export async function projeSirala(fd: FormData) {
  await oturumGerekli();
  const slug = metin(fd, "slug");
  const yon = metin(fd, "yon") === "yukari" ? -1 : 1;
  const liste = await oku("projeler");
  const i = liste.findIndex((p) => p.slug === slug);
  const j = i + yon;
  if (i < 0 || j < 0 || j >= liste.length) return;
  [liste[i], liste[j]] = [liste[j], liste[i]];
  await kaydet("projeler", liste, `Proje sırası değişti: ${liste[j].title}`);
  revalidatePath("/projeler");
}

/* ---------------- Yazılar ---------------- */

export async function yaziKaydet(eskiSlug: string | null, _d: FormDurumu, fd: FormData): Promise<FormDurumu> {
  await oturumGerekli();
  const liste = await oku("yazilar");
  const { deger, hatalar } = yaziDogrula(fd, liste.map((y) => y.slug), eskiSlug ?? undefined);
  if (!deger) return { hatalar };
  const yeniListe = eskiSlug ? liste.map((y) => (y.slug === eskiSlug ? deger : y)) : [deger, ...liste];
  try {
    await kaydet("yazilar", yeniListe, eskiSlug ? `Yazı güncellendi: ${deger.title}` : `Yazı eklendi: ${deger.title}`);
  } catch (e) {
    return genelHata(e);
  }
  revalidatePath("/yazilar");
  redirect(`/yazilar?kaydedildi=${encodeURIComponent(deger.title)}`);
}

export async function yaziSil(fd: FormData) {
  await oturumGerekli();
  const slug = metin(fd, "slug");
  const liste = await oku("yazilar");
  const silinen = liste.find((y) => y.slug === slug);
  if (!silinen) return;
  await kaydet("yazilar", liste.filter((y) => y.slug !== slug), `Yazı silindi: ${silinen.title}`);
  revalidatePath("/yazilar");
  redirect(`/yazilar?silindi=${encodeURIComponent(silinen.title)}`);
}

/* ---------------- Hizmetler ---------------- */

export async function hizmetKaydet(eskiSlug: string | null, _d: FormDurumu, fd: FormData): Promise<FormDurumu> {
  await oturumGerekli();
  const liste = await oku("hizmetler");
  const { deger, hatalar } = hizmetDogrula(fd, liste.map((h) => h.slug), eskiSlug ?? undefined);
  if (!deger) return { hatalar };
  const yeniListe = eskiSlug ? liste.map((h) => (h.slug === eskiSlug ? deger : h)) : [...liste, deger];
  try {
    await kaydet("hizmetler", yeniListe, eskiSlug ? `Hizmet güncellendi: ${deger.title}` : `Hizmet eklendi: ${deger.title}`);
  } catch (e) {
    return genelHata(e);
  }
  revalidatePath("/hizmetler");
  redirect(`/hizmetler?kaydedildi=${encodeURIComponent(deger.title)}`);
}

export async function hizmetSil(fd: FormData) {
  await oturumGerekli();
  const slug = metin(fd, "slug");
  const liste = await oku("hizmetler");
  const silinen = liste.find((h) => h.slug === slug);
  if (!silinen) return;
  await kaydet("hizmetler", liste.filter((h) => h.slug !== slug), `Hizmet silindi: ${silinen.title}`);
  revalidatePath("/hizmetler");
  redirect(`/hizmetler?silindi=${encodeURIComponent(silinen.title)}`);
}

/* ---------------- Site bilgileri ---------------- */

export async function siteKaydet(_d: FormDurumu, fd: FormData): Promise<FormDurumu> {
  await oturumGerekli();
  const { deger, hatalar } = siteDogrula(fd);
  if (!deger) return { hatalar };
  try {
    await kaydet("site", deger, "Site bilgileri güncellendi");
  } catch (e) {
    return genelHata(e);
  }
  revalidatePath("/site-bilgileri");
  return { ok: "Site bilgileri kaydedildi. Değişiklik birkaç dakika içinde sitede görünür." };
}

/* ---------------- Müşteri siteleri ---------------- */

export async function musteriSitesiKaydet(eskiId: string | null, _d: FormDurumu, fd: FormData): Promise<FormDurumu> {
  await oturumGerekli();
  const liste = await oku("musteriSiteleri");
  const { deger, hatalar } = musteriSitesiDogrula(fd, liste.map((m) => m.id), eskiId ?? undefined);
  if (!deger) return { hatalar };
  const yeniListe = eskiId ? liste.map((m) => (m.id === eskiId ? deger : m)) : [...liste, deger];
  try {
    await kaydet("musteriSiteleri", yeniListe, eskiId ? `Müşteri sitesi güncellendi: ${deger.ad}` : `Müşteri sitesi eklendi: ${deger.ad}`);
  } catch (e) {
    return genelHata(e);
  }
  revalidatePath("/musteri-siteleri");
  redirect(`/musteri-siteleri?kaydedildi=${encodeURIComponent(deger.ad)}`);
}

export async function musteriSitesiSil(fd: FormData) {
  await oturumGerekli();
  const id = metin(fd, "id");
  const liste = await oku("musteriSiteleri");
  const silinen = liste.find((m) => m.id === id);
  if (!silinen) return;
  await kaydet("musteriSiteleri", liste.filter((m) => m.id !== id), `Müşteri sitesi silindi: ${silinen.ad}`);
  revalidatePath("/musteri-siteleri");
  redirect(`/musteri-siteleri?silindi=${encodeURIComponent(silinen.ad)}`);
}

/* ---------------- Teklifler ---------------- */

export async function teklifDurumDegistir(fd: FormData) {
  await oturumGerekli();
  const numara = Number(fd.get("numara"));
  const durum = metin(fd, "durum") === "yanitlandi" ? "yanitlandi" : "yeni";
  if (!Number.isInteger(numara)) return;
  await depo().teklifDurum(numara, durum);
  revalidatePath("/teklifler");
  revalidatePath(`/teklifler/${numara}`);
  revalidatePath("/");
}

export async function teklifNotEkle(_d: FormDurumu, fd: FormData): Promise<FormDurumu> {
  await oturumGerekli();
  const numara = Number(fd.get("numara"));
  const not = metin(fd, "not");
  if (not.length < 2) return { hatalar: { not: "Not boş olamaz." } };
  try {
    await depo().teklifNot(numara, not);
  } catch (e) {
    return genelHata(e);
  }
  revalidatePath(`/teklifler/${numara}`);
  return { ok: "Not eklendi." };
}
