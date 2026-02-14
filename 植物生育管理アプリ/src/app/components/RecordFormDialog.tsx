import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Camera, Upload } from "lucide-react";

interface RecordFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (record: PlantRecord) => void;
}

export interface PlantRecord {
  id: string;
  date: string;
  stemThickness: number; // mm
  leafColor: string;
  height: number; // cm
  notes: string;
  photoUrl?: string;
}

export function RecordFormDialog({ open, onOpenChange, onSubmit }: RecordFormDialogProps) {
  const [formData, setFormData] = useState({
    stemThickness: "",
    leafColor: "緑色",
    height: "",
    notes: "",
    photoUrl: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const record: PlantRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      stemThickness: parseFloat(formData.stemThickness) || 0,
      leafColor: formData.leafColor,
      height: parseFloat(formData.height) || 0,
      notes: formData.notes,
      photoUrl: formData.photoUrl || undefined,
    };

    onSubmit(record);
    
    // Reset form
    setFormData({
      stemThickness: "",
      leafColor: "緑色",
      height: "",
      notes: "",
      photoUrl: "",
    });
    
    onOpenChange(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>植物の記録を追加</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="photo">植物の写真</Label>
            <div className="flex gap-2">
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById("photo")?.click()}
              >
                <Camera className="mr-2 size-4" />
                写真を選択
              </Button>
            </div>
            {formData.photoUrl && (
              <div className="mt-2">
                <img 
                  src={formData.photoUrl} 
                  alt="植物の写真" 
                  className="w-full h-40 object-cover rounded-md border"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stemThickness">茎の太さ (mm)</Label>
              <Input
                id="stemThickness"
                type="number"
                step="0.1"
                value={formData.stemThickness}
                onChange={(e) => setFormData(prev => ({ ...prev, stemThickness: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">背丈 (cm)</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                value={formData.height}
                onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="leafColor">葉の色</Label>
            <select
              id="leafColor"
              value={formData.leafColor}
              onChange={(e) => setFormData(prev => ({ ...prev, leafColor: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="濃い緑色">濃い緑色</option>
              <option value="緑色">緑色</option>
              <option value="薄い緑色">薄い緑色</option>
              <option value="黄緑色">黄緑色</option>
              <option value="黄色がかっている">黄色がかっている</option>
              <option value="茶色がかっている">茶色がかっている</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">メモ</Label>
            <Textarea
              id="notes"
              placeholder="気づいたことを記録..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              キャンセル
            </Button>
            <Button type="submit">
              記録を追加
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
