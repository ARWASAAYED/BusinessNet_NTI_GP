"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';

export interface TrendDataPoint {
  timestamp: string;
  value: number;
}

interface TrendChartProps {
  data: TrendDataPoint[];
  title?: string;
  color?: string;
}

export default function TrendChart({ 
  data, 
  title = "Trend Activity",
  color = "#3B82F6" 
}: TrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          No data available
        </div>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  // Calculate SVG path for the line chart
  const width = 600;
  const height = 200;
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((point.value - minValue) / range) * chartHeight;
    return { x, y, value: point.value };
  });

  const pathD = points.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }
    return `${path} L ${point.x} ${point.y}`;
  }, '');

  // Create area path
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <Card className="p-6">
      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
      
      <div className="relative">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines */}
          <g className="opacity-20">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = padding + chartHeight * (1 - ratio);
              return (
                <line
                  key={i}
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-gray-300 dark:text-gray-600"
                />
              );
            })}
          </g>

          {/* Area fill */}
          <motion.path
            d={areaD}
            fill={color}
            fillOpacity="0.1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Line */}
          <motion.path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />

          {/* Data points */}
          {points.map((point, index) => (
            <motion.g
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="white"
                stroke={color}
                strokeWidth="2"
                className="cursor-pointer hover:r-6 transition-all"
              />
              <title>{`Value: ${point.value}`}</title>
            </motion.g>
          ))}
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 pr-2">
          <span>{maxValue.toFixed(0)}</span>
          <span>{((maxValue + minValue) / 2).toFixed(0)}</span>
          <span>{minValue.toFixed(0)}</span>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
        {data.length > 0 && (
          <>
            <span>{new Date(data[0].timestamp).toLocaleDateString()}</span>
            {data.length > 1 && (
              <span>{new Date(data[data.length - 1].timestamp).toLocaleDateString()}</span>
            )}
          </>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Peak</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {maxValue.toFixed(0)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Average</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {(data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(0)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Low</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {minValue.toFixed(0)}
          </p>
        </div>
      </div>
    </Card>
  );
}
