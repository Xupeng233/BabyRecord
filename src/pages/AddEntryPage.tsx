import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { PhotoUploader } from '../components/PhotoUploader';
import { DatePicker } from '../components/DatePicker';
import { useAgeCalculator } from '../hooks/useAgeCalculator';
import { Entry } from '../types';

interface AddEntryPageProps {
  birthDate: string;
  onSave: (entry: Entry) => void;
  onBack: () => void;
}

export const AddEntryPage = ({ birthDate, onSave, onBack }: AddEntryPageProps) => {
  const [date, setDate] = useState('');
  const [photoBase64, setPhotoBase64] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const { calculateDaysOld, formatDate, getTodayString } = useAgeCalculator();

  useEffect(() => {
    setDate(getTodayString());
  }, [getTodayString]);

  const daysOld = date && birthDate ? calculateDaysOld(birthDate, date) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!photoBase64 || !height || !weight) {
      return;
    }

    const entry: Entry = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      date,
      photoBase64,
      daysOld,
      height: parseFloat(height),
      weight: parseFloat(weight),
      createdAt: new Date().toISOString(),
    };

    onSave(entry);
  };

  const isFormValid = photoBase64 && date && height && weight;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="返回"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">添加记录</h1>
      </header>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            选择日期
          </label>
          <DatePicker
            value={date}
            onChange={setDate}
            max={getTodayString()}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            上传照片
          </label>
          <PhotoUploader
            onPhotoSelect={setPhotoBase64}
            currentPhoto={photoBase64}
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
            onChange={(e) => setHeight(e.target.value)}
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
            onChange={(e) => setWeight(e.target.value)}
            placeholder="请输入体重"
            step="0.1"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all shadow-md ${
            isFormValid
              ? 'bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          保存记录
        </button>
      </form>
    </div>
  );
};