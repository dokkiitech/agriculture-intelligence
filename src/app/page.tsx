"use client";

import { useMemo, useState } from "react";

type Crop = "トマト" | "きゅうり" | "いちご";

type GrowthRecord = {
  id: string;
  crop: Crop;
  date: string;
  memo: string;
  photoUrl: string;
};

type HealthResult = {
  score: number;
  comparedAt: string;
  reason: string;
  adviceText: string;
};

type DiseaseResult = {
  name: string;
  confidence: number;
  firstAction: string;
};

type NotificationItem = {
  id: string;
  title: string;
  dueAt: string;
  read: boolean;
};

const crops: Crop[] = ["トマト", "きゅうり", "いちご"];

const cropKnowledge: Record<Crop, { season: string; soil: string; tips: string[] }> = {
  トマト: {
    season: "植え付け: 4〜5月 / 収穫: 6〜8月",
    soil: "水はけの良い土、元肥は控えめ",
    tips: ["脇芽をこまめに摘む", "乾燥気味に育てる", "支柱固定を早めに行う"],
  },
  きゅうり: {
    season: "植え付け: 4〜6月 / 収穫: 6〜9月",
    soil: "保水性のある土、追肥を切らさない",
    tips: ["朝に収穫して株を軽くする", "水切れを避ける", "うどんこ病の初期対策を行う"],
  },
  いちご: {
    season: "植え付け: 9〜10月 / 収穫: 4〜6月",
    soil: "有機質を含むふかふかの土",
    tips: ["灰色かび病を予防する", "花後の水やりは一定に", "古葉取りで風通しを確保"],
  },
};

export default function Home() {
  const [selectedCrop, setSelectedCrop] = useState<Crop>("トマト");
  const [memo, setMemo] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [records, setRecords] = useState<GrowthRecord[]>([]);
  const [healthResult, setHealthResult] = useState<HealthResult | null>(null);
  const [diseases, setDiseases] = useState<DiseaseResult[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [locationLabel, setLocationLabel] = useState("位置情報取得前");
  const [manualRegion, setManualRegion] = useState("福岡県北九州市");
  const [sensorMoisture, setSensorMoisture] = useState(55);
  const [backgroundTheme, setBackgroundTheme] = useState("garden");
  const [uploading, setUploading] = useState(false);

  const streak = useMemo(() => Math.min(records.length, 7), [records.length]);
  const achievementReached = streak >= 3;

  const weatherHint = useMemo(() => {
    if (manualRegion.includes("北九州")) {
      return "2日後に降雨予報あり";
    }
    return "明日は降雨確率20%";
  }, [manualRegion]);

  const notifications: NotificationItem[] = [
    {
      id: "n1",
      title: "朝の水やりチェック",
      dueAt: "07:00",
      read: !notificationsEnabled,
    },
    {
      id: "n2",
      title: "追肥タイミング",
      dueAt: "18:00",
      read: !notificationsEnabled,
    },
  ];

  const wateringAdvice = useMemo(() => {
    const base = selectedCrop === "きゅうり" ? 2 : 1;
    const rainAdjustment = weatherHint.includes("降雨") ? -1 : 0;
    const moistureAdjustment = sensorMoisture < 35 ? 1 : sensorMoisture > 70 ? -1 : 0;
    const times = Math.max(0, base + rainAdjustment + moistureAdjustment);
    const fertilizer = selectedCrop === "トマト" ? "週1回" : "週2回";
    return {
      times,
      fertilizer,
      detail: `${weatherHint}・土壌水分${sensorMoisture}%を考慮`,
    };
  }, [selectedCrop, sensorMoisture, weatherHint]);

  const requestLocation = () => {
    if (!("geolocation" in navigator)) {
      setLocationLabel("この端末はGPS非対応のため手動入力を使用");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationLabel(`緯度:${pos.coords.latitude.toFixed(3)} 経度:${pos.coords.longitude.toFixed(3)}`);
      },
      () => {
        setLocationLabel("GPS拒否: 手動地域を利用中");
      },
    );
  };

  const uploadRecord = async () => {
    if (!photoFile) {
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("crop", selectedCrop);
    formData.append("memo", memo);
    formData.append("photo", photoFile);

    const res = await fetch("/api/photos", {
      method: "POST",
      body: formData,
    });
    const data = (await res.json()) as GrowthRecord;
    setRecords((prev) => [data, ...prev]);
    setMemo("");
    setPhotoFile(null);
    setUploading(false);
  };

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
    <main className={`app theme-${backgroundTheme}`}>
      <header className="card">
        <h1>家庭菜園AIモック（MVP）</h1>
        <p>今日の作業・通知・健全度サマリーを1画面で確認できます。</p>
        <div className="row">
          <label>
            背景テーマ（外観カスタマイズ）
            <select value={backgroundTheme} onChange={(e) => setBackgroundTheme(e.target.value)}>
              <option value="garden">ガーデン</option>
              <option value="wood">ウッドデッキ</option>
              <option value="kids">キッズ</option>
            </select>
          </label>
          <div>
            <strong>設置調和デザイン:</strong> プランターに馴染む自然色UI
          </div>
        </div>
      </header>

      <section className="card">
        <h2>SCR-002 写真投稿</h2>
        <div className="grid2">
          <label>
            作物
            <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value as Crop)}>
              {crops.map((crop) => (
                <option key={crop}>{crop}</option>
              ))}
            </select>
          </label>
          <label>
            写真
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>
        <label>
          メモ
          <textarea
            maxLength={300}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="葉の色が少し薄い、実が増えてきた 等"
          />
        </label>
        <button onClick={uploadRecord} disabled={!photoFile || uploading}>
          {uploading ? "投稿中..." : "記録を投稿"}
        </button>
      </section>

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

      <section className="card">
        <h2>SCR-004 健全度詳細</h2>
        <button onClick={runHealthAnalysis} disabled={records.length < 2}>
          健全度を算出（比較）
        </button>
        {healthResult ? (
          <div>
            <p>健全度スコア: {healthResult.score} / 100</p>
            <p>比較時刻: {healthResult.comparedAt}</p>
            <p>根拠: {healthResult.reason}</p>
            <p>推奨行動: {healthResult.adviceText}</p>
          </div>
        ) : (
          <p>同一作物の記録を2件以上投稿すると算出できます。</p>
        )}
      </section>

      <section className="card">
        <h2>SCR-006 病害虫診断結果（有料想定）</h2>
        {diseases.length === 0 ? (
          <p>健全度算出後に病名候補を表示します。</p>
        ) : (
          <ol>
            {diseases.map((d) => (
              <li key={d.name}>
                {d.name}（信頼度 {d.confidence}%）: {d.firstAction}
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="card">
        <h2>FR-006/012 水やり・肥料提案</h2>
        <div className="grid2">
          <div>
            <button onClick={requestLocation}>GPSで地域を自動取得</button>
            <p>{locationLabel}</p>
            <label>
              手動地域（GPS拒否時）
              <input value={manualRegion} onChange={(e) => setManualRegion(e.target.value)} />
            </label>
          </div>
          <label>
            センサー水分（PoC連携）: {sensorMoisture}%
            <input
              type="range"
              min={0}
              max={100}
              value={sensorMoisture}
              onChange={(e) => setSensorMoisture(Number(e.target.value))}
            />
          </label>
        </div>
        <p>水やり回数提案: 1日 {wateringAdvice.times} 回</p>
        <p>肥料目安: {wateringAdvice.fertilizer}</p>
        <p>{wateringAdvice.detail}</p>
      </section>

      <section className="card">
        <h2>SCR-005 作物知識ライブラリ</h2>
        <p>{cropKnowledge[selectedCrop].season}</p>
        <p>{cropKnowledge[selectedCrop].soil}</p>
        <ul>
          {cropKnowledge[selectedCrop].tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>通知設定（栽培タイミング通知）</h2>
        <label>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
          />
          通知を有効化
        </label>
        <ul>
          {notifications.map((n) => (
            <li key={n.id}>
              {n.dueAt} {n.title} {n.read ? "(既読)" : "(未読)"}
            </li>
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
