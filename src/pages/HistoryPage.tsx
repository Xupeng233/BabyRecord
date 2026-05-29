import { Entry } from '../types';
import { Scale, Ruler } from 'lucide-react';

interface HistoryPageProps {
  entries: Entry[];
}

const createSmoothCurve = (points: { x: number; y: number }[]): string => {
  if (points.length < 2) return '';
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  const path = ['M', points[0].x, points[0].y];
  
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i === 0 ? points[i] : points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i === points.length - 2 ? p2 : points[i + 2];
    
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    
    path.push('C', cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }
  
  return path.join(' ');
};

export const HistoryPage = ({ entries }: HistoryPageProps) => {
  const sortedEntries = [...entries].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const entriesWithHeight = sortedEntries.filter(e => e.height && e.height > 0);
  const entriesWithWeight = sortedEntries.filter(e => e.weight && e.weight > 0);

  const renderCurve = (data: Entry[], key: 'height' | 'weight', color: string, gradientId: string) => {
    const values = data.map(e => e[key]!);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;
    const padding = range * 0.1;
    
    const points = data.map((entry, index) => {
      const x = (index / (data.length - 1)) * 280 + 10;
      const normalizedY = (entry[key]! - minVal + padding) / (range + padding * 2);
      const y = 110 - normalizedY * 90 - 10;
      return { x, y, entry };
    });

    const linePath = createSmoothCurve(points);
    const areaPath = `${linePath} L ${points[points.length - 1].x} 110 L ${points[0].x} 110 Z`;

    return (
      <>
        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path 
          d={linePath} 
          fill="none" 
          stroke={color} 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        {points.map((point) => (
          <g key={point.entry.id}>
            <circle cx={point.x} cy={point.y} r="5" fill="white" stroke={color} strokeWidth="2" />
            <circle cx={point.x} cy={point.y} r="2" fill={color} />
          </g>
        ))}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      {entriesWithHeight.length > 1 ? (
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4">
            <Ruler className="w-5 h-5 text-primary-600" />
            <h2 className="text-base font-bold text-gray-800">身高曲线</h2>
          </div>
          <div className="relative h-48">
            <svg className="w-full h-full" viewBox="0 0 300 140" preserveAspectRatio="none">
              <defs>
                <linearGradient id="heightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              {renderCurve(entriesWithHeight, 'height', '#ec4899', 'heightGradient')}
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-2">
              {entriesWithHeight.map((entry) => (
                <span key={entry.id}>{entry.daysOld}天</span>
              ))}
            </div>
            <div className="absolute top-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-2">
              <span>{Math.max(...entriesWithHeight.map(e => e.height!))}cm</span>
              <span>{Math.min(...entriesWithHeight.map(e => e.height!))}cm</span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>身高范围: {Math.min(...entriesWithHeight.map(e => e.height!))}-{Math.max(...entriesWithHeight.map(e => e.height!))}cm</span>
            <span>共 {entriesWithHeight.length} 条记录</span>
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
          <div className="relative h-48">
            <svg className="w-full h-full" viewBox="0 0 300 140" preserveAspectRatio="none">
              <defs>
                <linearGradient id="weightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              {renderCurve(entriesWithWeight, 'weight', '#8b5cf6', 'weightGradient')}
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-2">
              {entriesWithWeight.map((entry) => (
                <span key={entry.id}>{entry.daysOld}天</span>
              ))}
            </div>
            <div className="absolute top-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-2">
              <span>{Math.max(...entriesWithWeight.map(e => e.weight!))}kg</span>
              <span>{Math.min(...entriesWithWeight.map(e => e.weight!))}kg</span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>体重范围: {Math.min(...entriesWithWeight.map(e => e.weight!))}-{Math.max(...entriesWithWeight.map(e => e.weight!))}kg</span>
            <span>共 {entriesWithWeight.length} 条记录</span>
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
