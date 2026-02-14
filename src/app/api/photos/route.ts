import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const crop = String(formData.get("crop") ?? "トマト");
  const memo = String(formData.get("memo") ?? "");
  const photo = formData.get("photo");

  if (!(photo instanceof File)) {
    return NextResponse.json({ error: "画像ファイルが必要です" }, { status: 400 });
  }

  const record = {
    id: crypto.randomUUID(),
    crop,
    memo,
    date: new Date().toLocaleString("ja-JP"),
    photoUrl: `mock://${Date.now()}-${photo.name}`,
  };

  return NextResponse.json(record);
}
