import { Trash2, ChevronRight } from 'lucide-react';
import { Entry } from '../types';
import { useAgeCalculator } from '../hooks/useAgeCalculator';

interface EntryCardProps {
  entry: Entry;
  onDelete: (id: string) => void;
  onClick: (entry: Entry) => void;
}

export const EntryCard = ({ entry, onDelete, onClick }: EntryCardProps) => {
  const { formatDate, formatDateShort } = useAgeCalculator();
  const photos = entry.photoUrls || [];

  return (
    <div
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer active:scale-[0.98]"
      onClick={() => onClick(entry)}
    >
      {photos.length > 0 && (
        <div className="flex overflow-x-auto gap-1 p-3 pb-0 scrollbar-hide">
          {photos.map((url, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden bg-gray-100"
            >
              <img
                src={url}
                alt={`照片 ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-4 p-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-800">{entry.daysOld}</span>
            <span className="text-base text-gray-600">天</span>
          </div>
          <p className="text-sm text-gray-600 font-medium">{formatDateShort(entry.date)}</p>
          <p className="text-xs text-gray-500 mt-1">{formatDate(entry.date)}</p>
          <div className="flex items-center gap-3 mt-1">
            {entry.height && (
              <span className="text-xs text-primary-600 font-medium">身高 {entry.height}cm</span>
            )}
            {entry.weight && (
              <span className="text-xs text-accent-600 font-medium">体重 {entry.weight}kg</span>
            )}
            {photos.length > 1 && (
              <span className="text-xs text-gray-400">{photos.length}张照片</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(entry.id);
            }}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            aria-label="删除记录"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </div>
      </div>
    </div>
  );
};
