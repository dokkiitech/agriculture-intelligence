import { NextResponse } from "next/server";

const diseaseCatalog = [
  { name: "うどんこ病", firstAction: "発症葉を除去し風通しを改善" },
  { name: "灰色かび病", firstAction: "過湿を避けて朝に水やり" },
  { name: "ハダニ被害", firstAction: "葉裏を洗浄し初期防除を実施" },
];

export async function POST(request: Request) {
  const body = (await request.json()) as {
    note?: string;
    crop?: string;
  };

  const noteFactor = Math.min((body.note?.length ?? 0) / 10, 20);
  const cropFactor = body.crop === "いちご" ? -5 : body.crop === "きゅうり" ? -2 : 0;
  const score = Math.max(0, Math.min(100, Math.round(72 + noteFactor + cropFactor)));

  const health = {
    score,
    comparedAt: new Date().toISOString(),
    reason: "葉色・茎の張り・ユーザーメモの症状を比較したモック評価",
    adviceText:
      score >= 80
        ? "現状維持でOK。乾燥時のみ軽く水やり。"
        : "風通し改善と葉裏観察を優先し、追肥は少量に調整してください。",
  };

  const diseases = diseaseCatalog.map((d, i) => ({
    ...d,
    confidence: Math.max(30, Math.min(95, score - i * 8)),
  }));

  return NextResponse.json({ health, diseases });
}
