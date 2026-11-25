import { NextResponse } from "next/server";
import { depo } from "@/lib/depo";
import { teklifBasligi, teklifGovdesi, type TeklifVerisi } from "@/lib/teklif";

export const runtime = "nodejs";

/**
 * Sitenin teklif formu buraya gönderir (NEXT_PUBLIC_TEKLIF_API). Talep
 * depoya yazılır (GitHub'da "teklif" etiketli issue), panelde listelenir ve
 * RESEND_API_KEY tanımlıysa e-posta olarak da iletilir.
 *
 * Site ayrı alan adında olduğu için CORS: yalnızca SITE_ORIGINS'teki
 * adreslerden gelen isteklere izin verilir.
 */

type Payload = Partial<TeklifVerisi> & { consent?: boolean; website?: string };

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

function izinliKoken(istek: Request) {
  const koken = istek.headers.get("origin") ?? "";
  const izinliler = (process.env.SITE_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim().replace(/\/$/, ""))
    .filter(Boolean);
  return izinliler.includes(koken) ? koken : null;
}

function corsBasliklari(koken: string | null) {
  return {
    ...(koken ? { "Access-Control-Allow-Origin": koken, Vary: "Origin" } : {}),
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

/* Basit hız sınırı: aynı IP'den dakikada en fazla 5 talep (sunucu örneği başına). */
const sayac = new Map<string, { n: number; t: number }>();
function hizAsildi(ip: string) {
  const simdi = Date.now();
  const k = sayac.get(ip);
  if (!k || simdi - k.t > 60_000) {
    sayac.set(ip, { n: 1, t: simdi });
    return false;
  }
  k.n += 1;
  return k.n > 5;
}

export async function OPTIONS(istek: Request) {
  return new NextResponse(null, { status: 204, headers: corsBasliklari(izinliKoken(istek)) });
}

export async function POST(istek: Request) {
  const koken = izinliKoken(istek);
  const basliklar = corsBasliklari(koken);
  const origin = istek.headers.get("origin");
  if (origin && !koken) {
    return NextResponse.json({ ok: false, error: "Bu adresten gönderime izin verilmiyor." }, { status: 403, headers: basliklar });
  }

  const ip = istek.headers.get("x-forwarded-for")?.split(",")[0].trim() || "bilinmiyor";
  if (hizAsildi(ip)) {
    return NextResponse.json({ ok: false, error: "Çok sık deneme. Biraz sonra tekrar deneyin." }, { status: 429, headers: basliklar });
  }

  let data: Payload;
  try {
    data = (await istek.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Geçersiz istek." }, { status: 400, headers: basliklar });
  }

  // Bot tuzağı: gizli alan doluysa başarılı gibi davran, hiçbir şey yapma.
  if (data.website) return NextResponse.json({ ok: true, delivered: false }, { headers: basliklar });

  const v: TeklifVerisi = {
    name: (data.name ?? "").trim().slice(0, 120),
    company: (data.company ?? "").trim().slice(0, 120),
    email: (data.email ?? "").trim().slice(0, 200),
    phone: (data.phone ?? "").trim().slice(0, 40),
    service: (data.service ?? "").trim().slice(0, 120),
    budget: (data.budget ?? "").trim().slice(0, 60),
    message: (data.message ?? "").trim().slice(0, 5000),
    kaynak: origin ?? undefined,
  };

  const errors: Record<string, string> = {};
  if (v.name.length < 2) errors.name = "Lütfen adınızı yazın.";
  if (!isEmail(v.email)) errors.email = "Geçerli bir e-posta adresi girin.";
  if (v.message.length < 10) errors.message = "Projenizi birkaç cümleyle anlatın (en az 10 karakter).";
  if (!data.consent) errors.consent = "Devam etmek için onay vermelisiniz.";
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422, headers: basliklar });
  }

  let numara: number | null = null;
  try {
    numara = await depo().teklifOlustur(teklifBasligi(v), teklifGovdesi(v));
  } catch (e) {
    console.error("[teklif] depoya yazılamadı:", e);
  }

  const apiKey = process.env.RESEND_API_KEY;
  let eposta = false;
  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL ?? "Teklif Formu <onboarding@resend.dev>",
          to: [process.env.CONTACT_TO_EMAIL ?? "info@rebirthsoftware.com"],
          reply_to: v.email,
          subject: teklifBasligi(v),
          text: teklifGovdesi(v).replace(/<!-- teklif-verisi[\s\S]*-->/, "").replace(/\*\*/g, ""),
        }),
      });
      eposta = res.ok;
    } catch (e) {
      console.error("[teklif] e-posta gönderilemedi:", e);
    }
  }

  if (numara === null && !eposta) {
    console.info("[teklif] Kaydedilemeyen talep:\n" + teklifGovdesi(v));
    return NextResponse.json({ ok: false, error: "Talebiniz şu an kaydedilemedi. Lütfen WhatsApp'tan ulaşın." }, { status: 503, headers: basliklar });
  }

  return NextResponse.json({ ok: true, delivered: true, numara }, { headers: basliklar });
}
