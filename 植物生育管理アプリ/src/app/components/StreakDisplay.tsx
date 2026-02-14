import { Card, CardContent } from "./ui/card";
import { Flame, Calendar } from "lucide-react";
import { motion } from "motion/react";

interface StreakDisplayProps {
  streakDays: number;
  totalRecords: number;
  lastRecordDate?: string;
}

export function StreakDisplay({ streakDays, totalRecords, lastRecordDate }: StreakDisplayProps) {
  const today = new Date().toDateString();
  const lastRecord = lastRecordDate ? new Date(lastRecordDate).toDateString() : null;
  const recordedToday = lastRecord === today;

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                scale: streakDays > 0 ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 0.6,
                repeat: streakDays > 0 ? Infinity : 0,
                repeatDelay: 1,
              }}
            >
              <div className="bg-orange-500 p-3 rounded-full">
                <Flame className="size-6 text-white" />
              </div>
            </motion.div>
            
            <div>
              <p className="text-sm text-muted-foreground">連続記録日数</p>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold text-orange-600">{streakDays}</p>
                <span className="text-xl text-orange-500">日</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-1">
              <Calendar className="size-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">総記録数</p>
            </div>
            <p className="text-2xl font-bold text-gray-700">{totalRecords}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-orange-200">
          {recordedToday ? (
            <div className="flex items-center gap-2 text-green-600">
              <div className="size-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-medium">今日は記録済みです！</p>
            </div>
          ) : streakDays > 0 ? (
            <div className="flex items-center gap-2 text-orange-600">
              <div className="size-2 bg-orange-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-medium">連続記録を続けましょう！</p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-600">
              <div className="size-2 bg-gray-400 rounded-full"></div>
              <p className="text-sm font-medium">新しい記録を始めましょう</p>
            </div>
          )}
        </div>

        {streakDays >= 7 && (
          <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded-md">
            <p className="text-sm text-yellow-800 text-center font-medium">
              🎉 素晴らしい！1週間連続達成！
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
