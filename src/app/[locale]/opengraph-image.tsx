import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { isLocale, locales } from "@/core/i18n/config";
import { getMessages } from "@/core/i18n/messages";
import { site } from "@/core/site/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = site.owner.fullName;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

async function readPublicImageAsDataUrl(publicPath: string, mimeType: string) {
  const fileBuffer = await readFile(join(process.cwd(), "public", publicPath));

  return `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
}

type OpenGraphImageProps = { params: Promise<{ locale: string }> };

export default async function OpenGraphImage({ params }: OpenGraphImageProps) {
  const { locale } = await params;
  const messages = getMessages(isLocale(locale) ? locale : "en");
  const photoDataUrl = await readPublicImageAsDataUrl(site.owner.photo.src, "image/jpeg");
  const studioLogoDataUrl = await readPublicImageAsDataUrl(site.studio.logo, "image/png");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "72px 88px",
          background: "linear-gradient(160deg, #1d1d29 0%, #15151e 100%)",
          color: "#e8e6f0",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "flex-start",
              padding: "8px 18px",
              borderRadius: 999,
              border: "1px solid rgba(61, 220, 132, 0.45)",
              background: "rgba(61, 220, 132, 0.1)",
              color: "#7ee8ad",
              fontSize: 24,
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: 999, background: "#3ddc84", marginRight: 12 }} />
            {messages.home.openToWork}
          </div>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, marginTop: 32, letterSpacing: -2 }}>
            {site.owner.fullName}
            <span style={{ color: "#ff6b3d" }}>.</span>
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#ff6b3d", marginTop: 12 }}>{messages.meta.role}</div>
          <div style={{ display: "flex", fontSize: 28, color: "#9a98ab", marginTop: 28, lineHeight: 1.4 }}>
            {messages.home.lead}
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 40, fontSize: 22, color: "#9a98ab" }}>
            <img src={studioLogoDataUrl} width={40} height={40} style={{ marginRight: 14 }} alt="" />
            {site.studio.name}
          </div>
        </div>
        <img
          src={photoDataUrl}
          width={340}
          height={340}
          style={{
            borderRadius: 999,
            border: "8px solid #ff6b3d",
            objectFit: "cover",
            objectPosition: "50% 25%",
          }}
          alt=""
        />
      </div>
    ),
    size,
  );
}
