import { useState } from 'react';
import { Entry } from '../types';
import { Scale, Ruler, Calendar, Clock } from 'lucide-react';
import { GrowthChart } from '../components/GrowthChart';

interface HistoryPageProps {
  entries: Entry[];
}

interface SelectedPoint {
  entry: Entry;
  value: number;
  key: 'height' | 'weight';
}

const formatValue = (value: number, key: 'height' | 'weight'): string => {
  if (key === 'height') {
    return `${value.toFixed(1)}cm`;
  }
  return `${value.toFixed(2)}kg`;
};

export const HistoryPage = ({ entries }: HistoryPageProps) => {
  const [selectedHeightPoint, setSelectedHeightPoint] = useState<SelectedPoint | null>(null);
  const [selectedWeightPoint, setSelectedWeightPoint] = useState<SelectedPoint | null>(null);

  const sortedEntries = [...entries].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const entriesWithHeight = sortedEntries.filter(e => e.height && e.height > 0);
  const entriesWithWeight = sortedEntries.filter(e => e.weight && e.weight > 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      {entriesWithHeight.length > 1 ? (
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4">
            <Ruler className="w-5 h-5 text-primary-600" />
            <h2 className="text-base font-bold text-gray-800">身高曲线</h2>
          </div>
          {selectedHeightPoint && (
            <div className="mb-3 p-3 bg-pink-50 rounded-lg border border-pink-100">
              <div className="flex items-center gap-2 text-sm text-pink-800">
                <span className="font-bold">{formatValue(selectedHeightPoint.value, 'height')}</span>
                <span className="text-pink-600">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(selectedHeightPoint.entry.date).toLocaleDateString('zh-CN')}
                </span>
                <span className="text-pink-600">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {selectedHeightPoint.entry.daysOld}天
                </span>
              </div>
            </div>
          )}
          <div className="relative h-64">
            <svg className="w-full h-full" viewBox="0 0 300 130" preserveAspectRatio="none">
              <GrowthChart 
                data={entriesWithHeight} 
                keyType="height" 
                color="#ec4899" 
                gradientId="heightGradient" 
              />
            </svg>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>身高范围: {Math.min(...entriesWithHeight.map(e => e.height!))}-{Math.max(...entriesWithHeight.map(e => e.height!))}cm</span>
            <span>共 {entriesWithHeight.length} 条记录</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">点击数据点可查看详情</p>
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
          {selectedWeightPoint && (
            <div className="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-center gap-2 text-sm text-purple-800">
                <span className="font-bold">{formatValue(selectedWeightPoint.value, 'weight')}</span>
                <span className="text-purple-600">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(selectedWeightPoint.entry.date).toLocaleDateString('zh-CN')}
                </span>
                <span className="text-purple-600">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {selectedWeightPoint.entry.daysOld}天
                </span>
              </div>
            </div>
          )}
          <div className="relative h-64">
            <svg className="w-full h-full" viewBox="0 0 300 130" preserveAspectRatio="none">
              <GrowthChart 
                data={entriesWithWeight} 
                keyType="weight" 
                color="#8b5cf6" 
                gradientId="weightGradient" 
              />
            </svg>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>体重范围: {Math.min(...entriesWithWeight.map(e => e.weight!))}-{Math.max(...entriesWithWeight.map(e => e.weight!))}kg</span>
            <span>共 {entriesWithWeight.length} 条记录</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">点击数据点可查看详情</p>
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
