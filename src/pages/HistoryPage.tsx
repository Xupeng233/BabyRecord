import { Entry } from '../types';
import { Scale, Ruler } from 'lucide-react';

interface HistoryPageProps {
  entries: Entry[];
}

export const HistoryPage = ({ entries }: HistoryPageProps) => {
  const sortedEntries = [...entries].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const entriesWithHeight = sortedEntries.filter(e => e.height);
  const entriesWithWeight = sortedEntries.filter(e => e.weight);

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
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
                    {points.map((point) => (
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
                    {points.map((point) => (
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
    </div>
  );
};
