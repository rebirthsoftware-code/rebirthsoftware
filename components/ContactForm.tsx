"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { getService, services } from "@/lib/services";
import { whatsappLink } from "@/lib/site";
import { Icon } from "./Icon";

const budgets = [
  "Henüz netleşmedi",
  "15.000 ₺ - 30.000 ₺",
  "30.000 ₺ - 60.000 ₺",
  "60.000 ₺ - 120.000 ₺",
  "120.000 ₺ ve üzeri",
];

type Status = "idle" | "loading" | "success" | "error";

/**
 * Statik dışa aktarımda (GitHub Pages) sunucu tarafı çalışmadığı için
 * /api/teklif yoktur. Bu modda form, doldurulan bilgileri hazır bir
 * WhatsApp mesajına çevirip yönlendirir.
 */
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

export function ContactForm({
  defaultService,
  useQueryService,
}: {
  defaultService?: string;
  /** URL'deki ?hizmet=slug parametresini seçili getirir */
  useQueryService?: boolean;
}) {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const querySlug = useQueryService ? searchParams.get("hizmet") : null;
  const selectedService =
    defaultService ?? (querySlug ? getService(querySlug)?.title : undefined);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      company: String(fd.get("company") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      service: String(fd.get("service") ?? ""),
      budget: String(fd.get("budget") ?? ""),
      message: String(fd.get("message") ?? ""),
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") ?? ""),
    };

    // Statik ortam: sunucu yok, WhatsApp'a yönlendir.
    if (isStaticExport) {
      const localErrors: Record<string, string> = {};
      if (payload.name.trim().length < 2)
        localErrors.name = "Lütfen adınızı yazın.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.email.trim()))
        localErrors.email = "Geçerli bir e-posta adresi girin.";
      if (payload.message.trim().length < 10)
        localErrors.message =
          "Projenizi birkaç cümleyle anlatın (en az 10 karakter).";
      if (!payload.consent)
        localErrors.consent = "Devam etmek için onay vermelisiniz.";

      if (Object.keys(localErrors).length > 0) {
        setErrors(localErrors);
        setStatus("error");
        return;
      }

      const text = [
        "Merhaba, teklif talebim:",
        `Ad Soyad: ${payload.name}`,
        payload.company ? `Firma: ${payload.company}` : null,
        `E-posta: ${payload.email}`,
        payload.phone ? `Telefon: ${payload.phone}` : null,
        payload.service ? `Hizmet: ${payload.service}` : null,
        payload.budget ? `Bütçe: ${payload.budget}` : null,
        "",
        payload.message,
      ]
        .filter(Boolean)
        .join("\n");

      window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
      form.reset();
      setStatus("success");
      return;
    }

    setStatus("loading");
    setErrors({});

    try {
      const res = await fetch("/api/teklif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrors(data.errors ?? {});
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="card p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-500/15 text-accent-400">
          <Icon name="check" className="h-7 w-7" />
        </span>
        <h3 className="mt-5 text-xl font-semibold text-white">
          {isStaticExport ? "WhatsApp'a yönlendirildiniz" : "Talebiniz bize ulaştı"}
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-300">
          {isStaticExport
            ? "Bilgileriniz hazır bir mesaja dönüştürüldü. WhatsApp penceresi açılmadıysa aşağıdaki butonu kullanabilirsiniz."
            : "En geç 1 iş günü içinde size dönüş yapacağız. Daha hızlı ilerlemek isterseniz WhatsApp'tan da yazabilirsiniz."}
        </p>
        <a
          href={whatsappLink("Merhaba, az önce teklif formunu doldurdum.")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          <Icon name="whatsapp" className="h-4 w-4 text-accent-400" />
          WhatsApp&apos;tan yaz
        </a>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 block w-full text-xs text-ink-500 underline-offset-4 hover:underline"
        >
          Yeni bir talep gönder
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 sm:p-8" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Ad Soyad *" error={errors.name}>
          <input
            name="name"
            required
            autoComplete="name"
            placeholder="Adınız ve soyadınız"
            className={inputCls}
          />
        </Field>
        <Field label="Firma">
          <input
            name="company"
            autoComplete="organization"
            placeholder="Firma adınız (varsa)"
            className={inputCls}
          />
        </Field>
        <Field label="E-posta *" error={errors.email}>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="ornek@firma.com"
            className={inputCls}
          />
        </Field>
        <Field label="Telefon">
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="05xx xxx xx xx"
            className={inputCls}
          />
        </Field>
        <Field label="İlgilendiğiniz hizmet">
          <select
            name="service"
            key={selectedService ?? "none"}
            defaultValue={selectedService ?? ""}
            className={inputCls}
          >
            <option value="">Seçiniz</option>
            {services.map((s) => (
              <option key={s.slug} value={s.title}>
                {s.title}
              </option>
            ))}
            <option value="Diğer">Diğer / emin değilim</option>
          </select>
        </Field>
        <Field label="Bütçe aralığı">
          <select name="budget" defaultValue="" className={inputCls}>
            <option value="">Seçiniz</option>
            {budgets.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Projeniz hakkında *" error={errors.message}>
          <textarea
            name="message"
            required
            rows={5}
            placeholder="Ne yapmak istediğinizi kısaca anlatın: mevcut siteniz var mı, hedefiniz ne, teslim için bir tarihiniz var mı?"
            className={`${inputCls} resize-y`}
          />
        </Field>
      </div>

      {/* bot tuzağı — kullanıcıya görünmez */}
      <div className="hidden" aria-hidden="true">
        <label>
          Web sitesi
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-ink-400">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-white/5 accent-brand-500"
        />
        <span>
          <a href="/kvkk" className="text-brand-300 underline-offset-2 hover:underline">
            KVKK Aydınlatma Metni
          </a>
          &apos;ni okudum; bilgilerimin teklif süreci için işlenmesini kabul
          ediyorum. *
        </span>
      </label>
      {errors.consent ? (
        <p className="mt-1.5 text-xs text-rose-400">{errors.consent}</p>
      ) : null}

      {status === "error" && Object.keys(errors).length === 0 ? (
        <p className="mt-4 rounded-lg border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          Gönderim sırasında bir sorun oluştu. Lütfen tekrar deneyin veya
          doğrudan WhatsApp&apos;tan yazın.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Gönderiliyor…" : "Teklif Talebi Gönder"}
        {status === "loading" ? null : (
          <Icon name="arrow" className="h-4 w-4" />
        )}
      </button>
      <p className="mt-3 text-xs text-ink-500">
        {isStaticExport
          ? "Bu önizleme sürümünde form, doldurduğunuz bilgileri WhatsApp mesajına dönüştürür."
          : "Bilgileriniz üçüncü kişilerle paylaşılmaz. Genellikle 1 iş günü içinde dönüş yapıyoruz."}
      </p>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-ink-900/70 px-4 py-3 text-sm text-white placeholder:text-ink-500 transition outline-none focus:border-brand-400/70 focus:ring-2 focus:ring-brand-500/25";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium tracking-wide text-ink-300 uppercase">
        {label}
      </span>
      {children}
      {error ? <span className="mt-1.5 block text-xs text-rose-400">{error}</span> : null}
    </label>
  );
}
