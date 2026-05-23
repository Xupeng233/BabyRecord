import { Trash2 } from 'lucide-react';
import { Entry } from '../types';
import { useAgeCalculator } from '../hooks/useAgeCalculator';

interface EntryCardProps {
  entry: Entry;
  onDelete: (id: string) => void;
}

export const EntryCard = ({ entry, onDelete }: EntryCardProps) => {
  const { formatDate, formatDateShort } = useAgeCalculator();

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex items-center gap-4 p-4 hover:shadow-lg transition-shadow">
      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
        <img
          src={entry.photoBase64}
          alt={formatDate(entry.date)}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-800">{entry.daysOld}</span>
          <span className="text-base text-gray-600">天</span>
        </div>
        <p className="text-sm text-gray-600 font-medium">{formatDateShort(entry.date)}</p>
        <p className="text-xs text-gray-500 mt-1">{formatDate(entry.date)}</p>
      </div>
      <button
        onClick={() => onDelete(entry.id)}
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
        aria-label="删除记录"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};