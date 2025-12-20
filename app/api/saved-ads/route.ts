import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const result = await pool.query("SELECT ad_id FROM saved_ads");
    const savedAdIds = result.rows.map((row: { ad_id: string }) => row.ad_id);
    return NextResponse.json({ savedAdIds });
  } catch (error) {
    console.error("Error fetching saved ads:", error);
    return NextResponse.json({ savedAdIds: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ad } = body;

    if (!ad || !ad.id) {
      return NextResponse.json({ error: "Invalid ad data" }, { status: 400 });
    }

    const adId = String(ad.id);

    const existingResult = await pool.query(
      "SELECT id FROM saved_ads WHERE ad_id = $1",
      [adId]
    );

    if (existingResult.rows.length > 0) {
      await pool.query("DELETE FROM saved_ads WHERE ad_id = $1", [adId]);
      return NextResponse.json({ saved: false, adId });
    } else {
      await pool.query(
        `INSERT INTO saved_ads (ad_id, brand, product_name, headline, preview_type, preview_url, platform, status, niche, sub_niche, domain, cta)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          adId,
          ad.brand,
          ad.productName,
          ad.headline,
          ad.previewType,
          ad.previewUrl,
          ad.platform,
          ad.status,
          ad.niche,
          ad.subNiche,
          ad.domain,
          ad.cta,
        ]
      );
      return NextResponse.json({ saved: true, adId });
    }
  } catch (error) {
    console.error("Error saving ad:", error);
    return NextResponse.json({ error: "Failed to save ad" }, { status: 500 });
  }
}
