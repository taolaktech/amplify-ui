import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authorization = req.headers.get("authorization");
  if (!authorization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();

  const apiHost = process.env.NEXT_PUBLIC_API_HOST;
  if (!apiHost) {
    return NextResponse.json(
      { error: "API host not configured" },
      { status: 500 },
    );
  }

  const upstream = await fetch(`${apiHost}/assets/upload`, {
    method: "POST",
    headers: {
      authorization,
    },
    body: formData,
  });

  const data = await upstream.json();

  if (!upstream.ok) {
    return NextResponse.json(data, { status: upstream.status });
  }

  return NextResponse.json(data, { status: upstream.status });
}
