import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Tek parolalı oturum.
 *
 * Panel tek kişinin kullandığı bir araç olduğu için kullanıcı tablosu yok:
 * ADMIN_PAROLA ortam değişkeniyle karşılaştırılır, doğruysa imzalı bir çerez
 * verilir. Çerez `sonKullanma.imza` biçimindedir; imza HMAC-SHA256 ile
 * OTURUM_GIZLI (yoksa paroladan türetilen) anahtarla atılır. Sunucuda hiçbir
 * şey saklanmaz; parola değişince eski oturumlar kendiliğinden düşer.
 */
export const OTURUM_CEREZI = "ry_oturum";
const SURE_SN = 30 * 24 * 60 * 60;

function gizli() {
  const g = process.env.OTURUM_GIZLI || process.env.ADMIN_PAROLA || "";
  return g ? createHmac("sha256", "rebirth-yonetim").update(g).digest() : null;
}

function imzala(veri: string) {
  const g = gizli();
  if (!g) return "";
  return createHmac("sha256", g).update(veri).digest("base64url");
}

const esit = (a: string, b: string) => {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
};

export const parolaTanimli = () => Boolean(process.env.ADMIN_PAROLA);

export function parolaDogru(girdi: string) {
  const p = process.env.ADMIN_PAROLA;
  return Boolean(p) && esit(girdi, p!);
}

export function jetonUret() {
  const son = String(Math.floor(Date.now() / 1000) + SURE_SN);
  return `${son}.${imzala(son)}`;
}

export function jetonGecerli(jeton?: string) {
  if (!jeton || !gizli()) return false;
  const [son, imza] = jeton.split(".");
  if (!son || !imza) return false;
  if (!/^\d+$/.test(son) || Number(son) < Date.now() / 1000) return false;
  return esit(imzala(son), imza);
}

export async function oturumVar() {
  const c = await cookies();
  return jetonGecerli(c.get(OTURUM_CEREZI)?.value);
}

/** Korunan sayfaların başında çağrılır; oturum yoksa girişe yönlendirir. */
export async function oturumGerekli() {
  if (!(await oturumVar())) redirect("/giris");
}

export async function oturumAc() {
  const h = await headers();
  const https =
    h.get("x-forwarded-proto") === "https" ||
    (process.env.NEXT_PUBLIC_PANEL_URL ?? "").startsWith("https://");
  const c = await cookies();
  c.set(OTURUM_CEREZI, jetonUret(), {
    httpOnly: true,
    sameSite: "lax",
    secure: https,
    path: "/",
    maxAge: SURE_SN,
  });
}

export async function oturumKapat() {
  const c = await cookies();
  c.delete(OTURUM_CEREZI);
}
