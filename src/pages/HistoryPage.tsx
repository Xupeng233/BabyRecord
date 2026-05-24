import { ArrowLeft } from 'lucide-react';
import { Entry } from '../types';
import { useAgeCalculator } from '../hooks/useAgeCalculator';
import { clsx } from 'clsx';
import { TrendingUp, Scale, Ruler } from 'lucide-react';

interface HistoryPageProps {
  entries: Entry[];
  onDelete: (id: string) => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const HistoryPage = ({ entries, onDelete, showBackButton = false, onBack }: HistoryPageProps) => {
  const { formatDate, formatDateShort } = useAgeCalculator();
  
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const entriesWithHeight = sortedEntries.filter(e => e.height);
  const entriesWithWeight = sortedEntries.filter(e => e.weight);

  const groupedEntries = sortedEntries.reverse().reduce((groups, entry) => {
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
        {showBackButton && onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="返回"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h1 className={clsx('text-lg font-bold text-gray-800', !showBackButton && 'ml-2')}>成长历史</h1>
        <span className="ml-auto text-sm text-gray-600 font-medium">共 {entries.length} 条</span>
      </header>

      <div className="p-4 space-y-6">
        {entriesWithHeight.length > 1 ? (
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-4">
              <Ruler className="w-5 h-5 text-primary-600" />
              <h2 className="text-base font-bold text-gray-800">身高曲线</h2>
            </div>
            <div className="relative h-40">
              <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="heightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                {(() => {
                  const heights = entriesWithHeight.map(e => e.height!);
                  const minHeight = Math.min(...heights);
                  const maxHeight = Math.max(...heights);
                  const range = maxHeight - minHeight || 1;
                  const points = entriesWithHeight.map((entry, index) => {
                    const x = (index / (entriesWithHeight.length - 1)) * 280 + 10;
                    const y = 110 - ((entry.height! - minHeight) / range) * 90 - 10;
                    return { x, y, entry };
                  });
                  const linePath = points.reduce((path, point, i) => {
                    if (i === 0) return `M ${point.x} ${point.y}`;
                    const prev = points[i - 1];
                    const cpx1 = prev.x + (point.x - prev.x) / 2;
                    const cpx2 = point.x - (point.x - prev.x) / 2;
                    return `${path} C ${cpx1} ${prev.y}, ${cpx2} ${point.y}, ${point.x} ${point.y}`;
                  }, '');
                  const areaPath = `${linePath} L ${points[points.length - 1].x} 110 L ${points[0].x} 110 Z`;
                  return (
                    <>
                      <path d={areaPath} fill="url(#heightGradient)" />
                      <path d={linePath} fill="none" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      {points.map((point, i) => (
                        <g key={point.entry.id}>
                          <circle cx={point.x} cy={point.y} r="4" fill="#ec4899" />
                          <circle cx={point.x} cy={point.y} r="2" fill="white" />
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-2">
                {entriesWithHeight.map((entry) => (
                  <span key={entry.id}>{entry.daysOld}天</span>
                ))}
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>身高: {Math.min(...entriesWithHeight.map(e => e.height!))}cm</span>
              <span>{Math.max(...entriesWithHeight.map(e => e.height!))}cm</span>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-4">
              <Ruler className="w-5 h-5 text-gray-400" />
              <h2 className="text-base font-bold text-gray-800">身高曲线</h2>
            </div>
            <div className="h-32 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              <div className="text-center">
                <p className="text-sm">暂无身高数据</p>
                <p className="text-xs mt-1">记录至少2条身高后自动生成曲线</p>
              </div>
            </div>
          </div>
        )}

        {entriesWithWeight.length > 1 ? (
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-accent-600" />
              <h2 className="text-base font-bold text-gray-800">体重曲线</h2>
            </div>
            <div className="relative h-40">
              <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="weightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                {(() => {
                  const weights = entriesWithWeight.map(e => e.weight!);
                  const minWeight = Math.min(...weights);
                  const maxWeight = Math.max(...weights);
                  const range = maxWeight - minWeight || 1;
                  const points = entriesWithWeight.map((entry, index) => {
                    const x = (index / (entriesWithWeight.length - 1)) * 280 + 10;
                    const y = 110 - ((entry.weight! - minWeight) / range) * 90 - 10;
                    return { x, y, entry };
                  });
                  const linePath = points.reduce((path, point, i) => {
                    if (i === 0) return `M ${point.x} ${point.y}`;
                    const prev = points[i - 1];
                    const cpx1 = prev.x + (point.x - prev.x) / 2;
                    const cpx2 = point.x - (point.x - prev.x) / 2;
                    return `${path} C ${cpx1} ${prev.y}, ${cpx2} ${point.y}, ${point.x} ${point.y}`;
                  }, '');
                  const areaPath = `${linePath} L ${points[points.length - 1].x} 110 L ${points[0].x} 110 Z`;
                  return (
                    <>
                      <path d={areaPath} fill="url(#weightGradient)" />
                      <path d={linePath} fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      {points.map((point, i) => (
                        <g key={point.entry.id}>
                          <circle cx={point.x} cy={point.y} r="4" fill="#8b5cf6" />
                          <circle cx={point.x} cy={point.y} r="2" fill="white" />
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-2">
                {entriesWithWeight.map((entry) => (
                  <span key={entry.id}>{entry.daysOld}天</span>
                ))}
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>体重: {Math.min(...entriesWithWeight.map(e => e.weight!))}kg</span>
              <span>{Math.max(...entriesWithWeight.map(e => e.weight!))}kg</span>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-gray-400" />
              <h2 className="text-base font-bold text-gray-800">体重曲线</h2>
            </div>
            <div className="h-32 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              <div className="text-center">
                <p className="text-sm">暂无体重数据</p>
                <p className="text-xs mt-1">记录至少2条体重后自动生成曲线</p>
              </div>
            </div>
          </div>
        )}

        <div>
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
                            {entry.height && <p className="text-sm text-gray-500">身高: {entry.height}cm</p>}
                            {entry.weight && <p className="text-sm text-gray-500">体重: {entry.weight}kg</p>}
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
    </div>
  );
};