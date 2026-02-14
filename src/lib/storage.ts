import type { GrowthRecord } from "./mockData";

const STORAGE_KEY = "growth-records";

export function getRecords(): GrowthRecord[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as GrowthRecord[];
  } catch {
    return [];
  }
}

export function saveRecords(records: GrowthRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}
