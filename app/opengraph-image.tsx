import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const dynamic = "force-static";
export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
 "linear-gradient(140deg, #0e0e0d 0%, #1a1a18 60%, #232320 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 30,
            color: "#ff4b2b",
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#ff4b2b",
            }}
          />
          Rebirth Software
        </div>
        <div
          style={{
            marginTop: 34,
            fontSize: 68,
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: 940,
          }}
        >
          İşinizi anlatan dijital yüzünüzü kuruyoruz
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 30,
            color: "#918f87",
            maxWidth: 900,
          }}
        >
          Hazır tema değil — sıfırdan kodlanan, hızlı ve SEO uyumlu projeler.
        </div>
      </div>
    ),
    size
  );
}
