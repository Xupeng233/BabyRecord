import { useState } from 'react';
import { Entry } from '../types';

interface SelectedPoint {
  entry: Entry;
  value: number;
  key: 'height' | 'weight';
}

interface GrowthChartProps {
  data: Entry[];
  keyType: 'height' | 'weight';
  color: string;
  gradientId: string;
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

const generateYAxisTicks = (min: number, max: number, key: 'height' | 'weight') => {
  if (key === 'height') {
    const niceStep = 5;
    const niceMin = Math.floor(min / niceStep) * niceStep;
    const niceMax = Math.ceil(max / niceStep) * niceStep;
    const ticks = [];
    for (let val = niceMin; val <= niceMax; val += niceStep) {
      ticks.push(val);
    }
    if (ticks.length > 7) {
      return generateYAxisTicks(min, max, key);
    }
    return ticks;
  }
  
  const range = max - min;
  let niceStep;
  
  if (range < 2) {
    niceStep = 0.5;
  } else if (range < 5) {
    niceStep = 1;
  } else {
    niceStep = 2;
  }
  
  const niceMin = Math.floor(min / niceStep) * niceStep;
  const niceMax = Math.ceil(max / niceStep) * niceStep;
  const ticks = [];
  
  for (let val = niceMin; val <= niceMax; val += niceStep) {
    ticks.push(val);
  }
  
  return ticks;
};

const formatValue = (value: number, key: 'height' | 'weight'): string => {
  if (key === 'height') {
    return `${value.toFixed(1)}cm`;
  }
  return `${value.toFixed(2)}kg`;
};

export const GrowthChart = ({ data, keyType, color, gradientId }: GrowthChartProps) => {
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(null);
  
  const values = data.map(e => e[keyType]!);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;
  const padding = range * 0.1;
  const adjustedMin = minVal - padding;
  const adjustedMax = maxVal + padding;
  const adjustedRange = adjustedMax - adjustedMin;
  
  const points = data.map((entry, index) => {
    const x = (index / (data.length - 1)) * 250 + 50;
    const normalizedY = (entry[keyType]! - adjustedMin) / adjustedRange;
    const y = 100 - normalizedY * 70;
    return { x, y, entry };
  });

  const yTicks = generateYAxisTicks(adjustedMin, adjustedMax, keyType);
  
  const linePath = createSmoothCurve(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} 100 L ${points[0].x} 100 Z`;

  const getY = (val: number) => {
    const normalizedY = (val - adjustedMin) / adjustedRange;
    return 100 - normalizedY * 70;
  };

  const handlePointClick = (entry: Entry) => {
    const value = entry[keyType]!;
    if (selectedPoint?.entry.id === entry.id) {
      setSelectedPoint(null);
    } else {
      setSelectedPoint({ entry, value, key: keyType });
    }
  };

  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      
      <rect x="50" y="15" width="250" height="85" fill="none" stroke="#e5e7eb" strokeWidth="1" />
      
      {yTicks.map((tick, index) => {
        const y = getY(tick);
        return (
          <g key={`y-grid-${index}`}>
            <line x1="50" y1={y} x2="300" y2={y} stroke="#f0f0f0" strokeWidth="1" />
            <line x1="45" y1={y} x2="50" y2={y} stroke="#9ca3af" strokeWidth="1.5" />
            <text 
              x="40" 
              y={y + 4} 
              textAnchor="end" 
              fontSize="12" 
              fontWeight="500"
              fill="#4b5563"
            >
              {formatValue(tick, keyType)}
            </text>
          </g>
        );
      })}
      
      {(() => {
        let displayIndices: number[];
        
        if (data.length <= 5) {
          displayIndices = Array.from({ length: data.length }, (_, i) => i);
        } else if (data.length <= 10) {
          displayIndices = [0, Math.floor(data.length / 2), data.length - 1];
        } else {
          const step = Math.max(1, Math.floor(data.length / 4));
          displayIndices = [0, step, Math.floor(data.length / 2), Math.floor(data.length - step), data.length - 1];
          displayIndices = [...new Set(displayIndices)];
        }
        
        return displayIndices.map((index) => {
          const x = (index / (data.length - 1)) * 250 + 50;
          return (
            <g key={`x-tick-${index}`}>
              <line x1={x} y1="100" x2={x} y2="108" stroke="#9ca3af" strokeWidth="1.5" />
              <text 
                x={x} 
                y="122" 
                textAnchor="middle" 
                fontSize="12" 
                fontWeight="500"
                fill="#4b5563"
              >
                {data[index].daysOld}天
              </text>
            </g>
          );
        });
      })()}
      
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path 
        d={linePath} 
        fill="none" 
        stroke={color} 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      {points.map((point) => {
        const isSelected = selectedPoint?.entry.id === point.entry.id;
        return (
          <g key={point.entry.id} style={{ pointerEvents: 'auto' }}>
            <circle 
              cx={point.x} 
              cy={point.y} 
              r={isSelected ? 8 : 5} 
              fill="white" 
              stroke={color} 
              strokeWidth={isSelected ? 3 : 2}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              onClick={() => handlePointClick(point.entry)}
            />
            <circle 
              cx={point.x} 
              cy={point.y} 
              r={isSelected ? 3 : 2} 
              fill={color}
            />
          </g>
        );
      })}
      {selectedPoint && (() => {
        const selectedPointData = points.find(p => p.entry.id === selectedPoint.entry.id);
        if (!selectedPointData) return null;
        return (
          <g style={{ pointerEvents: 'none' }}>
            <line x1={selectedPointData.x} y1={selectedPointData.y} x2={selectedPointData.x} y2="100" stroke={color} strokeWidth="1" strokeDasharray="3,3" />
            <line x1="50" y1={selectedPointData.y} x2={selectedPointData.x} y2={selectedPointData.y} stroke={color} strokeWidth="1" strokeDasharray="3,3" />
            <rect 
              x={selectedPointData.x + 10} 
              y={selectedPointData.y - 25} 
              width="70" 
              height="40" 
              rx="4" 
              fill="white" 
              stroke={color}
              strokeWidth="1"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
            />
            <text 
              x={selectedPointData.x + 45} 
              y={selectedPointData.y - 10} 
              textAnchor="middle" 
              fontSize="12" 
              fontWeight="600"
              fill={color}
            >
              {formatValue(selectedPointData.entry[keyType]!, keyType)}
            </text>
            <text 
              x={selectedPointData.x + 45} 
              y={selectedPointData.y + 5} 
              textAnchor="middle" 
              fontSize="9" 
              fill="#6b7280"
            >
              {selectedPointData.entry.daysOld}天
            </text>
          </g>
        );
      })()}
    </>
  );
};
