import { ArrowLeft } from 'lucide-react';
import { Entry } from '../types';
import { useAgeCalculator } from '../hooks/useAgeCalculator';

interface HistoryPageProps {
  entries: Entry[];
  onBack: () => void;
  onDelete: (id: string) => void;
}

export const HistoryPage = ({ entries, onBack, onDelete }: HistoryPageProps) => {
  const { formatDate, formatDateShort } = useAgeCalculator();
  
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const groupedEntries = sortedEntries.reduce((groups, entry) => {
    const date = new Date(entry.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const key = `${year}年${month}月`;
    
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(entry);
    return groups;
  }, {} as Record<string, Entry[]>);

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
        <h1 className="text-lg font-bold text-gray-800">历史记录</h1>
        <span className="ml-auto text-sm text-gray-600 font-medium">共 {entries.length} 条</span>
      </header>

      <div className="p-4 space-y-6">
        {Object.keys(groupedEntries).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-lg font-medium">暂无历史记录</p>
            <p className="text-sm">开始记录宝宝的第一条成长吧</p>
          </div>
        ) : (
          Object.entries(groupedEntries).map(([month, monthEntries]) => (
            <div key={month}>
              <h2 className="text-base font-bold text-gray-700 mb-3 sticky top-0 bg-gray-50 py-2 z-10">
                {month}
              </h2>
              <div className="space-y-3">
                {monthEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                          <img
                            src={entry.photoBase64}
                            alt={formatDate(entry.date)}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-3xl font-bold text-primary-600">{entry.daysOld}</span>
                            <span className="text-base text-gray-600 font-medium">天</span>
                          </div>
                          <p className="text-base text-gray-700 font-medium">{formatDateShort(entry.date)}</p>
                          <p className="text-sm text-gray-500 mt-1">{formatDate(entry.date)}</p>
                        </div>
                        <button
                          onClick={() => onDelete(entry.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                          aria-label="删除记录"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};