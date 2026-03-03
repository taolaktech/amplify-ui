import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "Asset library API is not available" },
    { status: 501 },
  );
}

export async function POST(req: Request) {
  void req;
  return NextResponse.json(
    { error: "Asset library API is not available" },
    { status: 501 },
  );
}

export async function DELETE(req: Request) {
  void req;
  return NextResponse.json(
    { error: "Asset library API is not available" },
    { status: 501 },
  );
}
