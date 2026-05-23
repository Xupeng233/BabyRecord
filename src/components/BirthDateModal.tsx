import { useState } from 'react';
import { X } from 'lucide-react';

interface BirthDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (birthDate: string) => void;
  currentDate?: string;
}

export const BirthDateModal = ({ isOpen, onClose, onSave, currentDate }: BirthDateModalProps) => {
  const [birthDate, setBirthDate] = useState(currentDate || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!birthDate) {
      setError('请选择出生日期');
      return;
    }

    const today = new Date();
    const selectedDate = new Date(birthDate);
    
    if (selectedDate > today) {
      setError('出生日期不能大于今天');
      return;
    }

    onSave(birthDate);
    onClose();
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">设置出生日期</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              宝宝出生日期
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => {
                setBirthDate(e.target.value);
                setError('');
              }}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
          >
            保存
          </button>
        </form>
      </div>
    </div>
  );
};