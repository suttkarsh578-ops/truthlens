import { useEffect, useState } from 'react';

export default function ConfidenceMeter({ confidence, prediction }) {
  const [offset, setOffset] = useState(100);
  const size = 130;
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const isReal = prediction?.toUpperCase() === 'REAL';
  
  // Normalize confidence whether passed as 0.0-1.0 or 0-100 percentage
  const rawVal = typeof confidence === 'number' ? confidence : 90.0;
  const normalizedValue = rawVal <= 1.0 ? rawVal * 100 : rawVal;
  const percentage = Math.min(99.9, Math.max(50.0, parseFloat(normalizedValue.toFixed(1))));

  const strokeColor = isReal ? '#06b6d4' : '#f43f5e';

  useEffect(() => {
    const timer = setTimeout(() => {
      const progressOffset = ((100 - percentage) / 100) * circumference;
      setOffset(progressOffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage, circumference]);

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-gray-200 dark:text-white/10"
          strokeWidth={strokeWidth}
        />
        {/* Animated Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
          {percentage}%
        </span>
        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Confidence
        </span>
      </div>
    </div>
  );
}
