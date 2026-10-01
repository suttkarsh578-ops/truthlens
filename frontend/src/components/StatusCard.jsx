import { motion } from 'framer-motion';

export default function StatusCard({ title, status, subtitle }) {
  const getStatusColor = () => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'loading': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'offline': return 'text-red-400';
      case 'loading': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="glass p-4 rounded-xl border border-gray-800 hover:border-electric-blue/30 transition-all flex items-center justify-between"
    >
      <div>
        <h3 className="text-gray-300 font-medium text-sm">{title}</h3>
        {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-bold uppercase tracking-wider ${getStatusText()}`}>
          {status}
        </span>
        <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor()} ${status === 'online' || status === 'loading' ? 'animate-pulse' : ''}`} />
      </div>
    </motion.div>
  );
}
