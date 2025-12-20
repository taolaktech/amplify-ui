import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT ad_id, brand, product_name, headline, preview_type, preview_url, platform, status, niche, sub_niche, domain, cta, created_at 
       FROM saved_ads 
       ORDER BY created_at DESC`
    );
    
    const savedAds = result.rows.map((row) => ({
      id: row.ad_id,
      brand: row.brand,
      productName: row.product_name,
      headline: row.headline,
      previewType: row.preview_type,
      previewUrl: row.preview_url,
      platform: row.platform,
      status: row.status,
      niche: row.niche,
      subNiche: row.sub_niche,
      domain: row.domain,
      cta: row.cta,
      savedAt: row.created_at,
    }));
    
    return NextResponse.json({ savedAds });
  } catch (error) {
    console.error("Error fetching saved ads:", error);
    return NextResponse.json({ savedAds: [] });
  }
}
