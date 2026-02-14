"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Flame,
  Lightbulb,
  Plus,
  Sprout,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

type PlantRecord = {
  id: string;
  date: string;
  stemThickness: number;
  leafColor: string;
  height: number;
  notes: string;
  photoUrl?: string;
};

const STORAGE_KEY = "plant-records";

const MOCK_RECORDS: PlantRecord[] = [
  {
    id: "3",
    date: new Date().toISOString(),
    stemThickness: 4.2,
    leafColor: "薄い緑色",
    height: 28,
    notes: "葉の色が少し薄くなってきた気がする",
    photoUrl:
      "https://images.unsplash.com/photo-1759832068487-3dd88411d187?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    stemThickness: 4.0,
    leafColor: "薄い緑色",
    height: 26,
    notes: "少し成長している。水やりは順調。",
    photoUrl:
      "https://images.unsplash.com/photo-1713955871231-93e0e90d18b9?auto=format&fit=crop&w=800&q=80",
  },
];

const loadRecords = () => {
  if (typeof window === "undefined") return MOCK_RECORDS;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return MOCK_RECORDS;
  try {
    return JSON.parse(raw) as PlantRecord[];
  } catch {
    return MOCK_RECORDS;
  }
};

export default function Home() {
  const [records, setRecords] = useState<PlantRecord[]>(loadRecords);
  const [open, setOpen] = useState(false);

  const [stemThickness, setStemThickness] = useState("");
  const [height, setHeight] = useState("");
  const [leafColor, setLeafColor] = useState("緑色");
  const [notes, setNotes] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const latestRecord = records[0];
  const previousRecord = records[1];

  const streakDays = useMemo(() => {
    const sorted = [...records].sort((a, b) => +new Date(b.date) - +new Date(a.date));
    if (!sorted.length) return 0;
    let streak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    for (const record of sorted) {
      const d = new Date(record.date);
      d.setHours(0, 0, 0, 0);
      const diff = Math.floor((cursor.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
      if (diff === streak) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
      } else if (diff > streak) {
        break;
      }
    }
    return streak;
  }, [records]);

  const save = (next: PlantRecord[]) => {
    setRecords(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addRecord = () => {
    const rec: PlantRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      stemThickness: Number(stemThickness),
      height: Number(height),
      leafColor,
      notes,
      photoUrl: photoUrl || undefined,
    };
    save([rec, ...records]);
    setStemThickness("");
    setHeight("");
    setLeafColor("緑色");
    setNotes("");
    setPhotoUrl("");
    setOpen(false);
  };

  const feedback = useMemo(() => {
    if (!latestRecord)
      return {
        type: "info",
        messages: ["最初の記録を追加して、植物の成長を追跡しましょう！"],
      } as const;
    const messages: string[] = [];
    let type: "success" | "warning" | "info" = "info";
    if (streakDays >= 3) {
      messages.push(`${streakDays}日連続記録中！継続は力なりです。`);
    }
    if (latestRecord.stemThickness < 5) {
      messages.push("⚠️ 茎が細いです。栄養不足の可能性があるため、追肥を検討してください。");
      type = "warning";
    } else {
      messages.push("茎の太さは理想的です。良い状態です！");
      type = "success";
    }
    if (!["濃い緑色", "緑色"].includes(latestRecord.leafColor)) {
      messages.push("⚠️ 葉色に変化があります。病害虫と栄養状態を確認してください。");
      type = "warning";
    }
    messages.push("植物の成長は環境で変化します。無理なく毎日観察しましょう。");
    return { type, messages };
  }, [latestRecord, streakDays]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-600 p-3 text-white">
              <Sprout className="size-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">植物育成記録</h1>
              <p className="text-sm text-gray-500">デザインモック準拠のUI</p>
            </div>
          </div>
          <button onClick={() => setOpen(true)} className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-white">
            <Plus className="mr-2 size-5" />
            記録を追加
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-center text-lg font-semibold">トマトくん</h2>
              <div className="mx-auto flex size-36 items-center justify-center rounded-full bg-orange-100 text-5xl">🍅</div>
              <p className="mt-4 text-center text-sm text-gray-500">{streakDays > 0 ? "毎日の記録、ありがとう！" : "記録をつけて僕を元気にしてね！"}</p>
            </div>

            <div className="rounded-lg border border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-orange-500 p-3 text-white"><Flame className="size-6" /></div>
                  <div>
                    <p className="text-sm text-gray-500">連続記録日数</p>
                    <p className="text-4xl font-bold text-orange-600">{streakDays}<span className="ml-1 text-xl">日</span></p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="mb-1 flex items-center justify-end gap-2 text-sm text-gray-500"><Calendar className="size-4" />総記録数</div>
                  <p className="text-2xl font-bold text-gray-700">{records.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">発育状況</h2>
              {latestRecord ? (
                <div className="mt-4 space-y-3">
                  <StatusRow label="茎の太さ" value={`${latestRecord.stemThickness} mm`} trend={previousRecord ? latestRecord.stemThickness - previousRecord.stemThickness : 0} ok={latestRecord.stemThickness >= 5 && latestRecord.stemThickness <= 15} />
                  <StatusRow label="背丈" value={`${latestRecord.height} cm`} trend={previousRecord ? latestRecord.height - previousRecord.height : 0} ok={latestRecord.height >= 20 && latestRecord.height <= 100} />
                  <StatusRow label="葉の色" value={latestRecord.leafColor} trend={0} ok={["濃い緑色", "緑色"].includes(latestRecord.leafColor)} />
                  {latestRecord.notes ? <p className="border-t pt-3 text-sm text-gray-600">メモ: {latestRecord.notes}</p> : null}
                </div>
              ) : (
                <p className="py-8 text-center text-gray-500">まだ記録がありません。</p>
              )}
            </section>

            <section className={`rounded-lg border p-6 shadow-sm ${feedback.type === "warning" ? "border-orange-200 bg-orange-50" : feedback.type === "success" ? "border-green-200 bg-green-50" : "border-blue-200 bg-blue-50"}`}>
              <div className="mb-3 flex items-center gap-2 font-semibold">
                {feedback.type === "warning" ? <AlertCircle className="size-5 text-orange-600" /> : feedback.type === "success" ? <CheckCircle className="size-5 text-green-600" /> : <Lightbulb className="size-5 text-blue-600" />}
                トマトくんからのアドバイス
              </div>
              <ul className="space-y-2 text-sm">
                {feedback.messages.map((m) => (
                  <li key={m}>• {m}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">最近の記録</h2>
              <div className="space-y-3">
                {records.slice(0, 5).map((record) => (
                  <div key={record.id} className="flex items-center justify-between rounded-md bg-gray-50 p-3">
                    <div>
                      <p className="text-sm font-medium">{new Date(record.date).toLocaleDateString("ja-JP")}</p>
                      <p className="text-xs text-gray-500">茎: {record.stemThickness}mm | 高さ: {record.height}cm | 葉: {record.leafColor}</p>
                    </div>
                    {record.photoUrl ? <Image src={record.photoUrl} alt="植物の写真" width={48} height={48} className="size-12 rounded border object-cover" unoptimized /> : null}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">植物の記録を追加</h3>
            <div className="space-y-3">
              <label className="block text-sm">茎の太さ (mm)<input className="mt-1 w-full rounded border px-3 py-2" type="number" value={stemThickness} onChange={(e) => setStemThickness(e.target.value)} /></label>
              <label className="block text-sm">背丈 (cm)<input className="mt-1 w-full rounded border px-3 py-2" type="number" value={height} onChange={(e) => setHeight(e.target.value)} /></label>
              <label className="block text-sm">葉の色
                <select className="mt-1 w-full rounded border px-3 py-2" value={leafColor} onChange={(e) => setLeafColor(e.target.value)}>
                  <option>濃い緑色</option><option>緑色</option><option>薄い緑色</option><option>黄緑色</option><option>黄色がかっている</option><option>茶色がかっている</option>
                </select>
              </label>
              <label className="block text-sm">写真URL<input className="mt-1 w-full rounded border px-3 py-2" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} /></label>
              <label className="block text-sm">メモ<textarea className="mt-1 w-full rounded border px-3 py-2" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="rounded border px-4 py-2" onClick={() => setOpen(false)}>キャンセル</button>
              <button className="rounded bg-green-600 px-4 py-2 text-white" onClick={addRecord} disabled={!stemThickness || !height}>記録を追加</button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function StatusRow({
  label,
  value,
  trend,
  ok,
}: {
  label: string;
  value: string;
  trend: number;
  ok: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold">{value}</p>
          {trend > 0 ? <TrendingUp className="size-4 text-green-600" /> : trend < 0 ? <TrendingDown className="size-4 text-red-600" /> : null}
        </div>
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${ok ? "text-green-600" : "text-orange-600"}`}>
        {ok ? <CheckCircle className="size-4" /> : <AlertCircle className="size-4" />}
        {ok ? "良好" : "要注意"}
      </div>
    </div>
  );
}
