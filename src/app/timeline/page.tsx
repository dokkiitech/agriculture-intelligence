"use client";

import { useState } from "react";
import AppNav from "@/components/AppNav";
import type { GrowthRecord } from "@/lib/mockData";
import { getRecords } from "@/lib/storage";

export default function TimelinePage() {
  const [records] = useState<GrowthRecord[]>(getRecords());

  return (
    <main className="app theme-wood">
      <AppNav />
      <section className="card">
        <h2>SCR-003 成長タイムライン</h2>
        {records.length === 0 ? <p>まだ投稿がありません。</p> : null}
        <ul>
          {records.map((record) => (
            <li key={record.id}>
              <strong>{record.date}</strong> / {record.crop} / {record.memo || "メモなし"}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
