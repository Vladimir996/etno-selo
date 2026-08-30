import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";

export const alt = "Etno selo Raonica";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logoData = await readFile(join(process.cwd(), "src/app/apple-icon.png"), "base64");
const logoSrc = `data:image/png;base64,${logoData}`;

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          backgroundColor: "#1a2318",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={200} height={200} alt="" />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 62, fontWeight: 700, color: "#fbf8f2", letterSpacing: 2 }}>
            Etno selo Raonica
          </div>
          <div style={{ marginTop: 14, fontSize: 28, color: "#efe6d5" }}>
            Odmor u brvnarama okruženim prirodom
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
