"use client";

import { useState } from "react";
import AppNav from "@/components/AppNav";
import { crops, type Crop, type GrowthRecord } from "@/lib/mockData";
import { getRecords, saveRecords } from "@/lib/storage";

export default function PhotosPage() {
  const [selectedCrop, setSelectedCrop] = useState<Crop>("トマト");
  const [memo, setMemo] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const uploadRecord = async () => {
    if (!photoFile) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("crop", selectedCrop);
    formData.append("memo", memo);
    formData.append("photo", photoFile);

    const res = await fetch("/api/photos", { method: "POST", body: formData });
    const data = (await res.json()) as GrowthRecord;

    const nextRecords = [data, ...getRecords()];
    saveRecords(nextRecords);

    setMemo("");
    setPhotoFile(null);
    setUploading(false);
  };

  return (
    <main className="app theme-garden">
      <AppNav />
      <section className="card">
        <h2>SCR-002 写真投稿画面</h2>
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
            <input type="file" accept="image/png,image/jpeg" onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)} />
          </label>
        </div>
        <label>
          メモ
          <textarea maxLength={300} value={memo} onChange={(e) => setMemo(e.target.value)} />
        </label>
        <button onClick={uploadRecord} disabled={!photoFile || uploading}>{uploading ? "投稿中..." : "記録を投稿"}</button>
      </section>
    </main>
  );
}
