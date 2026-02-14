"use client";

import { useState } from "react";
import AppNav from "@/components/AppNav";
import type { GrowthRecord, HealthResult, DiseaseResult } from "@/lib/mockData";
import { getRecords } from "@/lib/storage";

export default function HealthPage() {
  const [records] = useState<GrowthRecord[]>(getRecords());
  const [healthResult, setHealthResult] = useState<HealthResult | null>(null);
  const [diseases, setDiseases] = useState<DiseaseResult[]>([]);

  const runHealthAnalysis = async () => {
    if (records.length < 2) return;
    const res = await fetch("/api/health-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPhotoUrl: records[0].photoUrl,
        baselinePhotoUrl: records[1].photoUrl,
        note: records[0].memo,
        crop: records[0].crop,
      }),
    });

    const data = (await res.json()) as { health: HealthResult; diseases: DiseaseResult[] };
    setHealthResult(data.health);
    setDiseases(data.diseases);
  };

  return (
    <main className="app theme-garden">
      <AppNav />
      <section className="card">
        <h2>SCR-004 健全度詳細</h2>
        <button onClick={runHealthAnalysis} disabled={records.length < 2}>健全度を算出（比較）</button>
        {healthResult ? (
          <>
            <p>健全度スコア: {healthResult.score} / 100</p>
            <p>比較時刻: {healthResult.comparedAt}</p>
            <p>根拠: {healthResult.reason}</p>
            <p>推奨行動: {healthResult.adviceText}</p>
            <p>病名候補は診断画面でも確認できます（{diseases.length}件）。</p>
          </>
        ) : (
          <p>同一作物の記録を2件以上投稿すると算出できます。</p>
        )}
      </section>
    </main>
  );
}
