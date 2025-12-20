import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function ensureTableExists() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      status VARCHAR(50) DEFAULT 'draft',
      source_ad_id VARCHAR(100),
      source_brand VARCHAR(255),
      product_name VARCHAR(255),
      headline TEXT,
      preview_type VARCHAR(50),
      preview_url TEXT,
      platform VARCHAR(50),
      niche VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function GET() {
  try {
    await ensureTableExists();
    const result = await pool.query(
      `SELECT * FROM campaigns ORDER BY created_at DESC`
    );
    return NextResponse.json({ campaigns: result.rows });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json({ campaigns: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureTableExists();
    const body = await request.json();
    const { name, type, sourceAd } = body;

    const result = await pool.query(
      `INSERT INTO campaigns (name, type, source_ad_id, source_brand, product_name, headline, preview_type, preview_url, platform, niche)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        name,
        type,
        sourceAd?.id || null,
        sourceAd?.brand || null,
        sourceAd?.productName || null,
        sourceAd?.headline || null,
        sourceAd?.previewType || null,
        sourceAd?.previewUrl || null,
        sourceAd?.platform || null,
        sourceAd?.niche || null,
      ]
    );

    return NextResponse.json({ campaign: result.rows[0] });
  } catch (error) {
    console.error("Error creating campaign:", error);
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Campaign ID required" }, { status: 400 });
    }

    await pool.query("DELETE FROM campaigns WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 });
  }
}
