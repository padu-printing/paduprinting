import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getCategoryBySlug,
} from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const categoryName = (await getCategoryBySlug(product.categorySlug))?.name;

  const fontDir = path.join(process.cwd(), "public", "fonts");
  const [regularData, boldData] = await Promise.all([
    readFile(path.join(fontDir, "Inter-Regular.ttf")),
    readFile(path.join(fontDir, "Inter-Bold.ttf")),
  ]);

  const price = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(product.basePrice);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background:
            "radial-gradient(circle at 15% 0%, rgba(168,85,247,0.35), transparent 45%), radial-gradient(circle at 100% 110%, rgba(124,58,237,0.45), transparent 50%), linear-gradient(135deg, #1A2340 0%, #2A214D 55%, #3B1960 100%)",
          fontFamily: "Inter",
          color: "#FFFFFF",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #A855F7, #6B2C91)",
              fontSize: "34px",
              fontWeight: 700,
            }}
          >
            P
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ fontSize: "30px", fontWeight: 700 }}>PADU Printing</div>
            <div style={{ fontSize: "20px", color: "rgba(255,255,255,0.6)" }}>
              Percetakan Digital Jakarta Timur
            </div>
          </div>
        </div>

        {/* Body summary */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {categoryName && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                alignSelf: "flex-start",
                padding: "10px 24px",
                borderRadius: "999px",
                background: "rgba(168,85,247,0.25)",
                border: "1px solid rgba(192,132,252,0.5)",
                fontSize: "22px",
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              {categoryName.toUpperCase()}
            </div>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div
              style={{
                fontSize: "58px",
                fontWeight: 700,
                lineHeight: 1.1,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {product.name}
            </div>
            <div
              style={{
                fontSize: "26px",
                color: "rgba(255,255,255,0.72)",
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {product.shortDescription}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
            <div style={{ fontSize: "24px", color: "rgba(255,255,255,0.6)" }}>
              Mulai dari
            </div>
            <div style={{ fontSize: "46px", fontWeight: 700, color: "#C084FC" }}>
              {price}
            </div>
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            {SITE_URL.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
      fonts: [
        {
          name: "Inter",
          data: regularData,
          weight: 400,
          style: "normal",
        },
        {
          name: "Inter",
          data: boldData,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );
}