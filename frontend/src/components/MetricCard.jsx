import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function MetricCard({ title, value, suffix = '', icon: Icon, color = 'text-electric-blue', description }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (typeof value === 'number') {
      let start = 0;
      const end = value;
      if (start === end) {
        setDisplayValue(end);
        return;
      }
      let totalDuration = 1000;
      let incrementTime = 20;
      let steps = totalDuration / incrementTime;
      let stepValue = (end - start) / steps;
      let current = start;

      const timer = setInterval(() => {
        current += stepValue;
        if ((stepValue > 0 && current >= end) || (stepValue < 0 && current <= end)) {
          setDisplayValue(end);
          clearInterval(timer);
        } else {
          setDisplayValue(current);
        }
      }, incrementTime);
      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  const formatValue = (val) => {
    if (typeof val === 'number') {
      return Number.isInteger(val) ? val.toLocaleString() : val.toFixed(2);
    }
    return val;
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass p-6 rounded-xl border border-gray-800 hover:border-electric-blue/30 transition-all relative overflow-hidden group"
    >
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 blur-2xl group-hover:opacity-10 transition-opacity bg-current ${color}`} />
      
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-400 font-medium text-sm uppercase tracking-wider">{title}</h3>
        {Icon && <Icon className={`w-5 h-5 ${color} opacity-80`} />}
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-white tracking-tight">
          {formatValue(displayValue)}
        </span>
        <span className={`text-lg font-semibold ${color}`}>{suffix}</span>
      </div>
      
      {description && (
        <p className="text-xs text-gray-500 mt-2">{description}</p>
      )}
    </motion.div>
  );
}
