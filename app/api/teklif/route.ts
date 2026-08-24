import { NextResponse } from "next/server";
import { site } from "@/lib/site";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  service?: string;
  budget?: string;
  message?: string;
  consent?: boolean;
  /** spam tuzağı: dolu gelirse istek sessizce yutulur */
  website?: string;
};

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export async function POST(request: Request) {
  let data: Payload;
  try {
    data = (await request.json()) as Payload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Geçersiz istek." },
      { status: 400 }
    );
  }

  // Bot tuzağı: gizli alan doluysa başarılı gibi davran, hiçbir şey yapma.
  if (data.website) {
    return NextResponse.json({ ok: true, delivered: false });
  }

  const name = (data.name ?? "").trim();
  const email = (data.email ?? "").trim();
  const message = (data.message ?? "").trim();

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Lütfen adınızı yazın.";
  if (!isEmail(email)) errors.email = "Geçerli bir e-posta adresi girin.";
  if (message.length < 10)
    errors.message = "Projenizi birkaç cümleyle anlatın (en az 10 karakter).";
  if (!data.consent) errors.consent = "Devam etmek için onay vermelisiniz.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const lines = [
    `Ad Soyad : ${name}`,
    `Firma    : ${data.company?.trim() || "-"}`,
    `E-posta  : ${email}`,
    `Telefon  : ${data.phone?.trim() || "-"}`,
    `Hizmet   : ${data.service?.trim() || "-"}`,
    `Bütçe    : ${data.budget?.trim() || "-"}`,
    "",
    message,
  ].join("\n");

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Teklif Formu <onboarding@resend.dev>";

  // E-posta servisi tanımlı değilse istek sunucu günlüğüne yazılır.
  if (!apiKey) {
    console.info("[teklif-formu] Yeni talep (e-posta servisi tanımsız):\n" + lines);
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Yeni teklif talebi — ${name}${
          data.company ? ` (${data.company})` : ""
        }`,
        text: lines,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[teklif-formu] Resend hatası:", res.status, detail);
      console.info("[teklif-formu] Kaydedilen talep:\n" + lines);
      return NextResponse.json({ ok: true, delivered: false });
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[teklif-formu] Gönderim hatası:", err);
    console.info("[teklif-formu] Kaydedilen talep:\n" + lines);
    return NextResponse.json({ ok: true, delivered: false });
  }
}
