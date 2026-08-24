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
            "linear-gradient(135deg, #0a0d1a 0%, #131829 55%, #1b2450 100%)",
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
            color: "#6b93ff",
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#34e0d0",
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
          Kurumsal web siteleri ve kişiye özel yazılım
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 30,
            color: "#b0b8d1",
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
