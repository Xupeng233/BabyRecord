import { useState } from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { PhotoUploader, PendingPhoto } from '../components/PhotoUploader';
import { DatePicker } from '../components/DatePicker';
import { useAgeCalculator } from '../hooks/useAgeCalculator';
import { Entry } from '../types';

interface EntryDetailPageProps {
  entry: Entry;
  birthDate: string;
  userId: string;
  onSave: (id: string, entry: Partial<Entry>, newFiles: File[]) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export const EntryDetailPage = ({ entry, birthDate, userId, onSave, onDelete, onBack }: EntryDetailPageProps) => {
  const [date, setDate] = useState(entry.date);
  const [existingUrls, setExistingUrls] = useState<string[]>(entry.photoUrls || []);
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([]);
  const [height, setHeight] = useState(String(entry.height || ''));
  const [weight, setWeight] = useState(String(entry.weight || ''));
  const [hasChanges, setHasChanges] = useState(false);
  const { calculateDaysOld, formatDate, getTodayString } = useAgeCalculator();

  const daysOld = date && birthDate ? calculateDaysOld(birthDate, date) : entry.daysOld;

  const handleChange = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setHasChanges(true);
  };

  const handlePhotosChange = (_files: File[], urls: string[]) => {
    setExistingUrls(urls);
    setHasChanges(true);
  };

  const handlePendingChange = (pending: PendingPhoto[]) => {
    setPendingPhotos(pending);
    if (pending.length > 0) setHasChanges(true);
  };

  const handleSave = () => {
    onSave(entry.id, {
      date,
      photoUrls: existingUrls,
      daysOld,
      height: parseFloat(height),
      weight: parseFloat(weight),
    }, pendingPhotos.map(p => p.file));
  };

  const handleDelete = () => {
    if (window.confirm('确定要删除这条记录吗？')) {
      onDelete(entry.id);
    }
  };

  const isFormValid = (existingUrls.length + pendingPhotos.length) > 0 && date && height && weight;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white px-4 py-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="返回"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-800">记录详情</h1>
        </div>
        <button
          onClick={handleDelete}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          aria-label="删除记录"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </header>

      <div className="p-4 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            选择日期
          </label>
          <DatePicker
            value={date}
            onChange={handleChange(setDate)}
            max={getTodayString()}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            照片
          </label>
          <PhotoUploader
            existingUrls={existingUrls}
            pendingPhotos={pendingPhotos}
            onPendingChange={handlePendingChange}
            onPhotosChange={handlePhotosChange}
          />
        </div>

        <div className="bg-gradient-to-r from-primary-100 to-accent-100 rounded-2xl p-6">
          <p className="text-sm text-gray-600 mb-2 font-medium">宝宝日龄</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-primary-700">{daysOld}</span>
            <span className="text-xl text-gray-600">天</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {formatDate(date)} (距出生 {daysOld} 天)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            身高 (cm)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => handleChange(setHeight)(e.target.value)}
            placeholder="请输入身高"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            体重 (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => handleChange(setWeight)(e.target.value)}
            placeholder="请输入体重"
            step="0.1"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        {hasChanges && (
          <button
            onClick={handleSave}
            disabled={!isFormValid}
            className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all shadow-md ${
              isFormValid
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            保存修改
          </button>
        )}
      </div>
    </div>
  );
};
