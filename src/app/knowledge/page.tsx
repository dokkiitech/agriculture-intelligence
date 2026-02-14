"use client";

import { useMemo, useState } from "react";
import AppNav from "@/components/AppNav";
import { cropKnowledge, crops, type Crop } from "@/lib/mockData";

export default function KnowledgePage() {
  const [selectedCrop, setSelectedCrop] = useState<Crop>("トマト");
  const [locationLabel, setLocationLabel] = useState("位置情報取得前");
  const [manualRegion, setManualRegion] = useState("福岡県北九州市");
  const [sensorMoisture, setSensorMoisture] = useState(55);

  const weatherHint = useMemo(() => (manualRegion.includes("北九州") ? "2日後に降雨予報あり" : "明日は降雨確率20%"), [manualRegion]);

  const wateringAdvice = useMemo(() => {
    const base = selectedCrop === "きゅうり" ? 2 : 1;
    const rainAdjustment = weatherHint.includes("降雨") ? -1 : 0;
    const moistureAdjustment = sensorMoisture < 35 ? 1 : sensorMoisture > 70 ? -1 : 0;
    const times = Math.max(0, base + rainAdjustment + moistureAdjustment);
    const fertilizer = selectedCrop === "トマト" ? "週1回" : "週2回";
    return { times, fertilizer, detail: `${weatherHint}・土壌水分${sensorMoisture}%を考慮` };
  }, [selectedCrop, sensorMoisture, weatherHint]);

  const requestLocation = () => {
    if (!("geolocation" in navigator)) {
      setLocationLabel("この端末はGPS非対応のため手動入力を使用");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => setLocationLabel(`緯度:${pos.coords.latitude.toFixed(3)} 経度:${pos.coords.longitude.toFixed(3)}`),
      () => setLocationLabel("GPS拒否: 手動地域を利用中"),
    );
  };

  return (
    <main className="app theme-garden">
      <AppNav />
      <section className="card">
        <h2>SCR-005 作物知識ライブラリ</h2>
        <label>
          作物
          <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value as Crop)}>
            {crops.map((crop) => (
              <option key={crop}>{crop}</option>
            ))}
          </select>
        </label>
        <p>{cropKnowledge[selectedCrop].season}</p>
        <p>{cropKnowledge[selectedCrop].soil}</p>
        <ul>
          {cropKnowledge[selectedCrop].tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>FR-006/012 水やり・肥料提案</h2>
        <button onClick={requestLocation}>GPSで地域を自動取得</button>
        <p>{locationLabel}</p>
        <label>
          手動地域（GPS拒否時）
          <input value={manualRegion} onChange={(e) => setManualRegion(e.target.value)} />
        </label>
        <label>
          センサー水分（PoC連携）: {sensorMoisture}%
          <input type="range" min={0} max={100} value={sensorMoisture} onChange={(e) => setSensorMoisture(Number(e.target.value))} />
        </label>
        <p>水やり回数提案: 1日 {wateringAdvice.times} 回</p>
        <p>肥料目安: {wateringAdvice.fertilizer}</p>
        <p>{wateringAdvice.detail}</p>
      </section>
    </main>
  );
}
