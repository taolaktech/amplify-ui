import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

type Asset = {
  assetId: string;
  type: "image" | "video";
  source: "generated" | "uploaded";
  url?: string;
  storageUrl?: string;
  thumbnailUrl?: string;
  campaignId?: string;
  campaignName?: string;
  productId?: string;
  productName?: string;
  destinationUrl?: string;
  platform?: "Google" | "Meta" | "TikTok" | "Other";
  format?: string;
  headlineUsed?: string;
  descriptionUsed?: string;
  promptUsed?: string;
  tags?: string[];
  createdAt: string;
};

const DB_PATH = path.join(process.cwd(), ".asset-library.json");

async function readDb(): Promise<Asset[]> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Asset[]) : [];
  } catch {
    return [];
  }
}

async function writeDb(assets: Asset[]) {
  await fs.writeFile(DB_PATH, JSON.stringify(assets, null, 2), "utf8");
}

export async function GET() {
  const assets = await readDb();
  return NextResponse.json({ data: assets });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Asset>;
    if (!body.assetId || (body.type !== "image" && body.type !== "video")) {
      return NextResponse.json(
        { error: "Invalid asset payload" },
        { status: 400 },
      );
    }

    const assets = await readDb();
    const next: Asset = {
      assetId: body.assetId,
      type: body.type,
      source: body.source === "uploaded" ? "uploaded" : "generated",
      url: body.url,
      storageUrl: body.storageUrl,
      thumbnailUrl: body.thumbnailUrl,
      campaignId: body.campaignId,
      campaignName: body.campaignName,
      productId: body.productId,
      productName: body.productName,
      destinationUrl: body.destinationUrl,
      platform: body.platform,
      format: body.format,
      headlineUsed: body.headlineUsed,
      descriptionUsed: body.descriptionUsed,
      promptUsed: body.promptUsed,
      tags: Array.isArray(body.tags) ? body.tags : undefined,
      createdAt: body.createdAt || new Date().toISOString(),
    };

    const idx = assets.findIndex((a) => a.assetId === next.assetId);
    const merged = idx >= 0 ? { ...assets[idx], ...next } : next;

    const updated = idx >= 0
      ? assets.map((a) => (a.assetId === merged.assetId ? merged : a))
      : [merged, ...assets];

    await writeDb(updated);
    return NextResponse.json({ data: merged });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const assetId = searchParams.get("assetId");
  if (!assetId) {
    return NextResponse.json({ error: "assetId required" }, { status: 400 });
  }

  const assets = await readDb();
  const updated = assets.filter((a) => a.assetId !== assetId);
  await writeDb(updated);

  return NextResponse.json({ data: { deleted: true } });
}
