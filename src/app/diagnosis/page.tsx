"use client";

import { useState } from "react";
import AppNav from "@/components/AppNav";
import type { DiseaseResult, GrowthRecord, HealthResult } from "@/lib/mockData";
import { getRecords } from "@/lib/storage";

export default function DiagnosisPage() {
  const [records] = useState<GrowthRecord[]>(getRecords());
  const [diseases, setDiseases] = useState<DiseaseResult[]>([]);

  const runDiagnosis = async () => {
    if (records.length === 0) return;
    const res = await fetch("/api/health-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: records[0].memo, crop: records[0].crop }),
    });

    const data = (await res.json()) as { health: HealthResult; diseases: DiseaseResult[] };
    setDiseases(data.diseases);
  };

  return (
    <main className="app theme-wood">
      <AppNav />
      <section className="card">
        <h2>SCR-006 病害虫診断結果（有料想定）</h2>
        <button onClick={runDiagnosis} disabled={records.length === 0}>病害虫候補を取得</button>
        {diseases.length === 0 ? (
          <p>まず写真投稿を行い、診断を実行してください。</p>
        ) : (
          <ol>
            {diseases.map((d) => (
              <li key={d.name}>{d.name}（信頼度 {d.confidence}%）: {d.firstAction}</li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}
