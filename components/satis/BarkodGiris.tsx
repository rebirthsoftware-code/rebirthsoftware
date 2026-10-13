"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { temizleBarkod } from "@/lib/satis";
import { Icon } from "@/components/Icon";

/**
 * Barkod giriş alanı.
 *
 * İki yolla çalışır:
 * 1) USB / Bluetooth barkod okuyucu: cihaz klavye gibi davranır, barkodu
 *    yazıp Enter gönderir. Alan odaklıyken okutmak yeterlidir.
 * 2) Kamera: tarayıcı BarcodeDetector API'sini destekliyorsa (Chrome, Edge,
 *    Android, Safari 17+) kamerayla okuma yapılır. Ek paket gerekmez.
 *
 * Elle yazıp Enter'a basmak da aynı şekilde çalışır.
 */

type BarcodeDetectorCtor = new (opts?: { formats?: string[] }) => {
  detect(kaynak: HTMLVideoElement): Promise<{ rawValue: string }[]>;
};

function barcodeDetector(): BarcodeDetectorCtor | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as { BarcodeDetector?: BarcodeDetectorCtor }).BarcodeDetector ?? null;
}

/* Kamera desteği sunucuda "yok", tarayıcıda gerçek değer; hidrasyon uyuşmazlığı olmaz. */
const bosAbone = () => () => {};
const kameraDestekVarMi = () => !!barcodeDetector() && !!navigator.mediaDevices?.getUserMedia;

/** Okuma başarılı olunca kısa bir "bip" — okuyucu cihazlardaki gibi. */
function bip() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 1760;
    gain.gain.value = 0.05;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
    osc.onended = () => ctx.close();
  } catch {
    /* ses desteklenmiyorsa sessiz devam */
  }
}

export function BarkodGiris({
  onOkundu,
  etiket = "Barkod okut veya yaz",
  placeholder = "Barkodu okutun, yazıp Enter'a basın",
  otomatikOdak = true,
  id = "barkod-giris",
}: {
  onOkundu: (barkod: string) => void;
  etiket?: string;
  placeholder?: string;
  otomatikOdak?: boolean;
  id?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [deger, setDeger] = useState("");
  const [kameraAcik, setKameraAcik] = useState(false);
  const [kameraHata, setKameraHata] = useState<string | null>(null);
  const kameraDestek = useSyncExternalStore(bosAbone, kameraDestekVarMi, () => false);

  useEffect(() => {
    if (otomatikOdak) inputRef.current?.focus();
  }, [otomatikOdak]);

  function gonder(ham: string) {
    const b = temizleBarkod(ham);
    if (!b) return;
    bip();
    onOkundu(b);
    setDeger("");
    inputRef.current?.focus();
  }

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs font-medium tracking-wide text-muted uppercase">
        {etiket}
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Icon
            name="search"
            className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-faint"
          />
          <input
            ref={inputRef}
            id={id}
            value={deger}
            onChange={(e) => setDeger(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Tab") {
                if (!deger.trim()) return;
                e.preventDefault();
                gonder(deger);
              }
            }}
            inputMode="numeric"
            autoComplete="off"
            spellCheck={false}
            placeholder={placeholder}
            className="w-full rounded-xl border border-line bg-white py-3 pr-4 pl-11 font-mono text-base text-ink placeholder:font-sans placeholder:text-sm placeholder:text-faint transition outline-none focus:border-flame/70 focus:ring-2 focus:ring-flame/20"
          />
        </div>
        <button
          type="button"
          onClick={() => gonder(deger)}
          disabled={!deger.trim()}
          className="rounded-xl bg-ink px-4 text-sm font-semibold text-paper transition hover:bg-flame disabled:cursor-not-allowed disabled:opacity-40"
        >
          Ekle
        </button>
        {kameraDestek ? (
          <button
            type="button"
            onClick={() => {
              setKameraHata(null);
              setKameraAcik((v) => !v);
            }}
            aria-pressed={kameraAcik}
            className={`rounded-xl border px-4 text-sm font-semibold transition ${
              kameraAcik
                ? "border-flame bg-flame text-white"
                : "border-line-strong text-ink hover:border-ink"
            }`}
            title="Kamera ile oku"
          >
            Kamera
          </button>
        ) : null}
      </div>

      {kameraAcik ? (
        <KameraOkuyucu
          onOkundu={(b) => gonder(b)}
          onHata={(m) => {
            setKameraHata(m);
            setKameraAcik(false);
          }}
        />
      ) : null}
      {kameraHata ? <p className="mt-2 text-xs text-rose-600">{kameraHata}</p> : null}
      {!kameraDestek ? (
        <p className="mt-2 text-xs text-faint">
          Bu tarayıcı kamerayla okumayı desteklemiyor. USB/Bluetooth barkod okuyucu veya elle giriş kullanın.
        </p>
      ) : null}
    </div>
  );
}

function KameraOkuyucu({
  onOkundu,
  onHata,
}: {
  onOkundu: (barkod: string) => void;
  onHata: (mesaj: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Geri çağrılar her render'da değişebilir; kamerayı yeniden başlatmamak için ref'te tutulur.
  const okunduRef = useRef(onOkundu);
  const hataRef = useRef(onHata);
  useEffect(() => {
    okunduRef.current = onOkundu;
    hataRef.current = onHata;
  });

  useEffect(() => {
    const Detector = barcodeDetector();
    const video = videoRef.current;
    if (!Detector || !video) return;

    let aktif = true;
    let stream: MediaStream | null = null;
    let zamanlayici: number | undefined;
    let sonKod = "";
    let sonZaman = 0;

    const detector = new Detector({
      formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39", "qr_code", "itf"],
    });

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false })
      .then((s) => {
        if (!aktif) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = s;
        video.srcObject = s;
        return video.play();
      })
      .then(() => {
        if (!aktif) return;
        zamanlayici = window.setInterval(async () => {
          if (!aktif || video.readyState < 2) return;
          try {
            const sonuc = await detector.detect(video);
            const kod = sonuc[0]?.rawValue;
            if (!kod) return;
            const simdi = Date.now();
            // Aynı barkodu 1,5 sn içinde tekrar okuma (video karesi başına tetiklenmesin).
            if (kod === sonKod && simdi - sonZaman < 1500) return;
            sonKod = kod;
            sonZaman = simdi;
            okunduRef.current(kod);
          } catch {
            /* tek kare hatası; devam */
          }
        }, 250);
      })
      .catch((e: unknown) => {
        if (!aktif) return;
        const ad = e instanceof Error ? e.name : "";
        hataRef.current(
          ad === "NotAllowedError"
            ? "Kamera izni verilmedi. Tarayıcı ayarlarından izin verip tekrar deneyin."
            : "Kamera açılamadı. Cihazda kamera olduğundan ve başka bir uygulamanın kullanmadığından emin olun."
        );
      });

    return () => {
      aktif = false;
      if (zamanlayici) window.clearInterval(zamanlayici);
      stream?.getTracks().forEach((t) => t.stop());
      video.srcObject = null;
    };
  }, []);

  return (
    <div className="relative mt-3 overflow-hidden rounded-xl border border-line bg-ink">
      <video ref={videoRef} muted playsInline className="aspect-video w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-24 w-3/4 rounded-lg border-2 border-flame/80 shadow-[0_0_0_9999px_rgba(20,20,15,0.35)]" />
      </div>
      <p className="absolute inset-x-0 bottom-0 bg-ink/70 px-3 py-2 text-center text-xs text-paper">
        Barkodu çerçevenin içine getirin
      </p>
    </div>
  );
}
