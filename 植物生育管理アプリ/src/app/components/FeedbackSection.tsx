import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PlantRecord } from "./RecordFormDialog";
import { Lightbulb, AlertTriangle, CheckCircle } from "lucide-react";

interface FeedbackSectionProps {
  latestRecord?: PlantRecord;
  streakDays: number;
}

export function FeedbackSection({ latestRecord, streakDays }: FeedbackSectionProps) {
  const generateFeedback = (): { type: "success" | "warning" | "info"; messages: string[] } => {
    if (!latestRecord) {
      return {
        type: "info",
        messages: [
          "最初の記録を追加して、植物の成長を追跡しましょう！",
          "定期的な記録が、健康な植物を育てる鍵です。",
        ],
      };
    }

    const messages: string[] = [];
    let type: "success" | "warning" | "info" = "info";

    // Check streak
    if (streakDays === 0) {
      messages.push("記録が途切れています。今日から再開しましょう！");
      type = "warning";
    } else if (streakDays >= 7) {
      messages.push(`素晴らしい！${streakDays}日間連続で記録を続けています！この調子です！`);
      type = "success";
    } else if (streakDays >= 3) {
      messages.push(`${streakDays}日連続記録中！継続は力なりです。`);
    }

    // Check stem thickness
    if (latestRecord.stemThickness < 5) {
      messages.push("茎が細くなっています。栄養素が不足しているように思われるので、肥料を追加してください！");
      type = "warning";
    } else if (latestRecord.stemThickness > 15) {
      messages.push("茎が太くなりすぎています。水やりの頻度を見直しましょう。");
      type = type === "success" ? "info" : "warning";
    } else {
      messages.push("茎の太さは理想的です！良い状態を保っています。");
      if (type !== "warning") type = "success";
    }

    // Check height
    if (latestRecord.height < 20) {
      messages.push("まだ小さめです。栄養補給が必要です。");
    } else if (latestRecord.height > 100) {
      messages.push("とても順調に成長しています！支柱が必要かもしれません。");
    } else if (latestRecord.height < 30) {
      messages.push("成長スピードがゆっくりです。栄養不足が考えられます。");
    } else {
      messages.push("高さは順調に成長しています。");
    }

    // Check leaf color - emphasize nutrient deficiency
    const idealColors = ["濃い緑色", "緑色"];
    if (!idealColors.includes(latestRecord.leafColor)) {
      if (latestRecord.leafColor.includes("黄")) {
        messages.push("⚠️ 葉が黄色くなっています。窒素不足の可能性が高いです。すぐに肥料を追加してください！");
        type = "warning";
      } else if (latestRecord.leafColor.includes("茶")) {
        messages.push("⚠️ 葉が茶色くなっています。深刻な栄養不足か病気の可能性があります。すぐに対処してください！");
        type = "warning";
      } else if (latestRecord.leafColor === "薄い緑色") {
        messages.push("⚠️ 葉の色が薄いです。栄養素が不足しているので肥料を追加してください！特に窒素が必要です。");
        type = "warning";
      }
    } else {
      messages.push("葉の色は健康的です！");
    }

    // General advice based on season
    const month = new Date().getMonth() + 1;
    if (month >= 6 && month <= 8) {
      messages.push("夏季は水分が蒸発しやすいので、朝晩の水やりを忘れずに。");
    } else if (month >= 12 || month <= 2) {
      messages.push("冬季は成長が緩やかになります。水やりは控えめにしましょう。");
    }

    return { type, messages };
  };

  const feedback = generateFeedback();

  const getIcon = () => {
    switch (feedback.type) {
      case "success":
        return <CheckCircle className="size-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="size-5 text-orange-600" />;
      default:
        return <Lightbulb className="size-5 text-blue-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (feedback.type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <Card className={getBackgroundColor()}>
      <CardHeader>
        <div className="flex items-center gap-2">
          {getIcon()}
          <CardTitle>トマトくんからのアドバイス</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {feedback.messages.map((message, index) => (
            <div key={index} className="flex gap-3">
              <span className="text-lg">•</span>
              <p className="text-sm flex-1">{message}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-current opacity-30">
          <p className="text-xs text-muted-foreground italic text-center">
            植物の成長は環境によって異なります。あなたの植物に合ったケアを見つけていきましょう！
          </p>
        </div>
      </CardContent>
    </Card>
  );
}