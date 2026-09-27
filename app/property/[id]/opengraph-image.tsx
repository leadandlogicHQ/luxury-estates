import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { resolveImage } from "@/lib/image";
import type { Property } from "@prisma/client";

/*
 * CRITICAL: metadata image routes default to the Edge runtime, where the
 * standard Prisma client (Node engine) cannot execute — that was the 500.
 * Node runtime also lets ImageResponse render with the bundled wasm.
 */
export const runtime = "nodejs";

export const alt = "Luxury Estate — featured residence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* ArrayBuffer → base64 helper (works on any runtime). */
const toBase64 = (buf: ArrayBuffer) => {
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
};

const formatPrice = (price: number) => `$${price.toLocaleString("en-US")}`;

export default async function PropertyOgImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  /* Crash-proof: a DB hiccup degrades to the brand-only card, never a 500 */
  let property: Property | null = null;
  try {
    property = await prisma.property.findUnique({ where: { id } });
  } catch {
    property = null;
  }

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://luxury-estates-rho.vercel.app"
  ).replace(/\/$/, "");

  /* Photo is optional — the card still renders beautifully without it */
  let photo: string | null = null;
  if (property?.image) {
    try {
      const imageUrl = property.image.startsWith("http")
        ? property.image
        : `${siteUrl}${resolveImage(property.image)}`;
      const response = await fetch(imageUrl, {
        next: { revalidate: 86400 },
      });
      if (response.ok) {
        const type = response.headers.get("content-type") || "image/jpeg";
        photo = `data:${type};base64,${toBase64(await response.arrayBuffer())}`;
      }
    } catch {
      photo = null;
    }
  }

  const title = property?.title || "Exceptional Residences";
  const location = property
    ? `${property.city}, ${property.state}`
    : "Curated luxury portfolio";
  const status = (property?.status || "For Sale").toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#171717",
          color: "#FFFFFF",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        {/* VISUAL ANCHOR */}
        {photo ? (
          <div
            style={{
              position: "relative",
              display: "flex",
              width: "58%",
              height: "100%",
              overflow: "hidden",
              background: "#292929",
            }}
          >
            <img
              src={photo}
              width={696}
              height={630}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                background:
                  "linear-gradient(90deg, rgba(23,23,23,0.02) 58%, rgba(23,23,23,0.34) 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                width: 3,
                height: "100%",
                display: "flex",
                background: "#C8A45D",
              }}
            />
          </div>
        ) : null}

        {/* INFORMATION PANEL */}
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "46px 50px 42px",
            background: "#171717",
          }}
        >
          {/* BRAND */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  width: 42,
                  height: 42,
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1.5px solid #C8A45D",
                  borderRadius: 8,
                  color: "#C8A45D",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                LE
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span
                  style={{
                    color: "#E5D2A6",
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: 17,
                    letterSpacing: 3.5,
                  }}
                >
                  LUXURY ESTATE
                </span>
                <span
                  style={{
                    color: "#746D64",
                    fontSize: 10,
                    letterSpacing: 2.4,
                  }}
                >
                  CURATED RESIDENCES
                </span>
              </div>
            </div>
            <div style={{ display: "flex", width: 46, height: 1, background: "#8A6B2A" }} />
          </div>

          {/* PROPERTY IDENTITY */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 420,
              marginTop: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  display: "flex",
                  width: 7,
                  height: 7,
                  borderRadius: 999,
                  background: "#C8A45D",
                }}
              />
              <span
                style={{
                  color: "#C8A45D",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 2.5,
                }}
              >
                {status}
              </span>
            </div>
            <span
              style={{
                marginTop: 18,
                color: "#FFFFFF",
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: title.length > 38 ? 36 : 42,
                fontWeight: 700,
                lineHeight: 1.12,
              }}
            >
              {title}
            </span>
            <span
              style={{
                marginTop: 12,
                color: "#A9A39B",
                fontSize: 17,
                lineHeight: 1.4,
              }}
            >
              {location}
            </span>
          </div>

          {/* DECISION BLOCK */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {property ? (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    gap: 18,
                    paddingTop: 18,
                    borderTop: "1px solid #3A3835",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    <span
                      style={{
                        color: "#746D64",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 2,
                      }}
                    >
                      OFFERED AT
                    </span>
                    <span
                      style={{
                        color: "#C8A45D",
                        fontFamily: "Georgia, 'Times New Roman', serif",
                        fontSize: 34,
                        fontWeight: 700,
                      }}
                    >
                      {formatPrice(property.price)}
                    </span>
                  </div>
                  <span
                    style={{
                      color: "#C9C4BC",
                      fontSize: 13,
                      lineHeight: 1.5,
                      textAlign: "right",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {`${property.beds} bd · ${property.baths} ba\n${property.sqft.toLocaleString("en-US")} sqft`}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    color: "#E5D2A6",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1.5,
                  }}
                >
                  <span
                    style={{ display: "flex", width: 28, height: 1, background: "#C8A45D" }}
                  />
                  PRIVATE PROPERTY COLLECTION
                </div>
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  paddingTop: 18,
                  borderTop: "1px solid #3A3835",
                  color: "#E5D2A6",
                  fontSize: 13,
                  letterSpacing: 1.5,
                }}
              >
                PRIVATE PROPERTY COLLECTION
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    size,
  );
}