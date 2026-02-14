import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Plus, Sprout } from "lucide-react";
import { RecordFormDialog, PlantRecord } from "./components/RecordFormDialog";
import { PlantStatus } from "./components/PlantStatus";
import { VeggieCharacter } from "./components/VeggieCharacter";
import { StreakDisplay } from "./components/StreakDisplay";
import { FeedbackSection } from "./components/FeedbackSection";

const STORAGE_KEY = "plant-records";

// Mock data for demonstration
const MOCK_RECORDS: PlantRecord[] = [
  {
    id: "3",
    date: new Date().toISOString(), // Today
    stemThickness: 4.2,
    leafColor: "薄い緑色",
    height: 28,
    notes: "葉の色が少し薄くなってきた気がする",
    photoUrl: "https://images.unsplash.com/photo-1759832068487-3dd88411d187?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBwbGFudCUyMGdyb3d0aCUyMHN0YWdlc3xlbnwxfHx8fDE3NzEwMzg0Njd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "2",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    stemThickness: 4.0,
    leafColor: "薄い緑色",
    height: 26,
    notes: "少し成長している。水やりは順調。",
    photoUrl: "https://images.unsplash.com/photo-1713955871231-93e0e90d18b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm93aW5nJTIwdG9tYXRvJTIwcGxhbnQlMjBsZWF2ZXN8ZW58MXx8fHwxNzcxMDM4NDY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "1",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    stemThickness: 3.8,
    leafColor: "緑色",
    height: 24,
    notes: "初めての記録。元気に育っている。",
    photoUrl: "https://images.unsplash.com/photo-1580581497986-9436c8dd8f4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHRvbWF0byUyMHBsYW50JTIwc2VlZGxpbmd8ZW58MXx8fHwxNzcxMDM4NDY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export default function App() {
  const [records, setRecords] = useState<PlantRecord[]>(MOCK_RECORDS); // Initialize with mock data
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [streakDays, setStreakDays] = useState(0);

  // Load records from localStorage
  useEffect(() => {
    const savedRecords = localStorage.getItem(STORAGE_KEY);
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  // Save records to localStorage
  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
  }, [records]);

  // Calculate streak
  useEffect(() => {
    if (records.length === 0) {
      setStreakDays(0);
      return;
    }

    const sortedRecords = [...records].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const record of sortedRecords) {
      const recordDate = new Date(record.date);
      recordDate.setHours(0, 0, 0, 0);

      const diffTime = currentDate.getTime() - recordDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === streak) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (diffDays > streak) {
        break;
      }
    }

    setStreakDays(streak);
  }, [records]);

  const handleAddRecord = (record: PlantRecord) => {
    setRecords((prev) => [record, ...prev]);
  };

  const latestRecord = records[0];
  const previousRecord = records[1];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-3 rounded-full">
              <Sprout className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">植物育成記録</h1>
              <p className="text-sm text-muted-foreground">
                あなたの植物の成長をサポートします
              </p>
            </div>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} size="lg">
            <Plus className="mr-2 size-5" />
            記録を追加
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Character & Streak */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4 text-center">
                トマトくん
              </h2>
              <VeggieCharacter
                streakDays={streakDays}
                lastRecordDate={latestRecord?.date}
              />
              <p className="text-center text-sm text-muted-foreground mt-4">
                {streakDays > 0
                  ? "毎日の記録、ありがとう！"
                  : "記録をつけて僕を元気にしてね！"}
              </p>
            </div>

            <StreakDisplay
              streakDays={streakDays}
              totalRecords={records.length}
              lastRecordDate={latestRecord?.date}
            />
          </div>

          {/* Right Column - Status & Feedback */}
          <div className="lg:col-span-2 space-y-6">
            <PlantStatus
              latestRecord={latestRecord}
              previousRecord={previousRecord}
            />

            <FeedbackSection
              latestRecord={latestRecord}
              streakDays={streakDays}
            />

            {/* Recent Records */}
            {records.length > 1 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4">最近の記録</h2>
                <div className="space-y-3">
                  {records.slice(1, 6).map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-md"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {new Date(record.date).toLocaleDateString("ja-JP", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          茎: {record.stemThickness}mm | 高さ: {record.height}cm |{" "}
                          葉: {record.leafColor}
                        </p>
                      </div>
                      {record.photoUrl && (
                        <img
                          src={record.photoUrl}
                          alt="植物の写真"
                          className="size-12 object-cover rounded border"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Record Form Dialog */}
      <RecordFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleAddRecord}
      />
    </div>
  );
}