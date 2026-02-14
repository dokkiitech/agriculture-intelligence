export type Crop = "トマト" | "きゅうり" | "いちご";

export type GrowthRecord = {
  id: string;
  crop: Crop;
  date: string;
  memo: string;
  photoUrl: string;
};

export type DiseaseResult = {
  name: string;
  confidence: number;
  firstAction: string;
};

export type HealthResult = {
  score: number;
  comparedAt: string;
  reason: string;
  adviceText: string;
};

export const crops: Crop[] = ["トマト", "きゅうり", "いちご"];

export const cropKnowledge: Record<Crop, { season: string; soil: string; tips: string[] }> = {
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
