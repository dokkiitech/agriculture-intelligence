"use client";

import { useMemo, useState } from "react";
import AppNav from "@/components/AppNav";
import { getRecords } from "@/lib/storage";

export default function KidsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const streak = useMemo(() => Math.min(getRecords().length, 7), []);
  const achievementReached = streak >= 3;

  const notifications = [
    { id: "n1", title: "朝の水やりチェック", dueAt: "07:00", read: !notificationsEnabled },
    { id: "n2", title: "追肥タイミング", dueAt: "18:00", read: !notificationsEnabled },
  ];

  return (
    <main className="app theme-kids">
      <AppNav />
      <section className="card">
        <h2>通知設定（栽培タイミング通知）</h2>
        <label>
          <input type="checkbox" checked={notificationsEnabled} onChange={(e) => setNotificationsEnabled(e.target.checked)} />
          通知を有効化
        </label>
        <ul>
          {notifications.map((n) => (
            <li key={n.id}>{n.dueAt} {n.title} {n.read ? "(既読)" : "(未読)"}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>SCR-007 キッズ達成画面</h2>
        <p>連続投稿ゲージ: {streak}/7</p>
        {achievementReached ? <p>🎉 3日連続達成！バッジ「おせわ名人」を獲得！</p> : <p>あと{3 - streak}回で達成！</p>}
      </section>
    </main>
  );
}
