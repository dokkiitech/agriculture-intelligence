import { PlantRecord } from "./RecordFormDialog";
import { TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface PlantStatusProps {
  latestRecord?: PlantRecord;
  previousRecord?: PlantRecord;
}

interface IdealConditions {
  stemThickness: { min: number; max: number };
  height: { min: number; max: number };
  leafColor: string[];
}

const IDEAL_CONDITIONS: IdealConditions = {
  stemThickness: { min: 5, max: 15 },
  height: { min: 20, max: 100 },
  leafColor: ["濃い緑色", "緑色"],
};

export function PlantStatus({ latestRecord, previousRecord }: PlantStatusProps) {
  if (!latestRecord) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>発育状況</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            まだ記録がありません。<br />
            最初の記録を追加してください。
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStemThicknessStatus = () => {
    const value = latestRecord.stemThickness;
    if (value < IDEAL_CONDITIONS.stemThickness.min) {
      return { status: "細すぎる", color: "text-orange-600", icon: AlertCircle };
    } else if (value > IDEAL_CONDITIONS.stemThickness.max) {
      return { status: "太すぎる", color: "text-orange-600", icon: AlertCircle };
    }
    return { status: "理想的", color: "text-green-600", icon: TrendingUp };
  };

  const getHeightStatus = () => {
    const value = latestRecord.height;
    if (value < IDEAL_CONDITIONS.height.min) {
      return { status: "低い", color: "text-orange-600", icon: AlertCircle };
    } else if (value > IDEAL_CONDITIONS.height.max) {
      return { status: "高すぎる", color: "text-blue-600", icon: TrendingUp };
    }
    return { status: "順調", color: "text-green-600", icon: TrendingUp };
  };

  const getLeafColorStatus = () => {
    if (IDEAL_CONDITIONS.leafColor.includes(latestRecord.leafColor)) {
      return { status: "健康的", color: "text-green-600", icon: TrendingUp };
    }
    return { status: "注意が必要", color: "text-orange-600", icon: AlertCircle };
  };

  const getTrend = (current: number, previous?: number) => {
    if (!previous) return null;
    if (current > previous) return <TrendingUp className="size-4 text-green-600" />;
    if (current < previous) return <TrendingDown className="size-4 text-red-600" />;
    return <Minus className="size-4 text-gray-400" />;
  };

  const stemStatus = getStemThicknessStatus();
  const heightStatus = getHeightStatus();
  const leafColorStatus = getLeafColorStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle>発育状況</CardTitle>
        <p className="text-sm text-muted-foreground">
          最終更新: {new Date(latestRecord.date).toLocaleDateString("ja-JP")}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">茎の太さ</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{latestRecord.stemThickness} mm</p>
                {previousRecord && getTrend(latestRecord.stemThickness, previousRecord.stemThickness)}
              </div>
            </div>
            <div className={`flex items-center gap-1 ${stemStatus.color}`}>
              <stemStatus.icon className="size-4" />
              <span className="text-sm font-medium">{stemStatus.status}</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">背丈</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{latestRecord.height} cm</p>
                {previousRecord && getTrend(latestRecord.height, previousRecord.height)}
              </div>
            </div>
            <div className={`flex items-center gap-1 ${heightStatus.color}`}>
              <heightStatus.icon className="size-4" />
              <span className="text-sm font-medium">{heightStatus.status}</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">葉の色</p>
              <p className="text-2xl font-bold">{latestRecord.leafColor}</p>
            </div>
            <div className={`flex items-center gap-1 ${leafColorStatus.color}`}>
              <leafColorStatus.icon className="size-4" />
              <span className="text-sm font-medium">{leafColorStatus.status}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-sm font-medium mb-2">理想的な状態</p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• 茎の太さ: {IDEAL_CONDITIONS.stemThickness.min}〜{IDEAL_CONDITIONS.stemThickness.max} mm</p>
            <p>• 背丈: {IDEAL_CONDITIONS.height.min}〜{IDEAL_CONDITIONS.height.max} cm</p>
            <p>• 葉の色: {IDEAL_CONDITIONS.leafColor.join("、")}</p>
          </div>
        </div>

        {latestRecord.notes && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium mb-1">メモ</p>
            <p className="text-sm text-muted-foreground">{latestRecord.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
