import { ImageResponse } from "next/og";

export const alt = "Kunal Singh, Software Engineer: AI automation and full-stack web";
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
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0b0d14 0%, #151a2e 60%, #1f1440 100%)",
          color: "#f5f5f7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#a5a8c0", letterSpacing: 2 }}>
          KUNALTECHIE.ME
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 1.05 }}>Kunal Singh</div>
          <div style={{ marginTop: 20, fontSize: 44, color: "#c4b5fd" }}>
            Software Engineer
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#a5a8c0" }}>
          AI automation and full-stack web · Python · TypeScript · Next.js
        </div>
      </div>
    ),
    size
  );
}
