import { Plus } from 'lucide-react';
import { Entry } from '../types';
import { EntryCard } from '../components/EntryCard';

interface HomePageProps {
  entries: Entry[];
  onAddClick: () => void;
  onDelete: (id: string) => void;
}

export const HomePage = ({ entries, onAddClick, onDelete }: HomePageProps) => {
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="flex-1 pb-24">
      {sortedEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-500">暂无记录</p>
          <p className="text-sm text-gray-400">点击下方按钮添加第一条记录</p>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">成长记录</h2>
            <span className="text-sm text-gray-600">共 {entries.length} 条</span>
          </div>
          {sortedEntries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
      
      <button
        onClick={onAddClick}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110"
        aria-label="添加记录"
      >
        <Plus className="w-7 h-7" />
      </button>
    </div>
  );
};