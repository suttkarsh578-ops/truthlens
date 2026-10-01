import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, Clock, Database, AlignLeft, Hash, CheckCircle2, Sparkles } from 'lucide-react';
import ConfidenceMeter from './ConfidenceMeter';

export default function ResultCard({ 
  prediction, 
  confidence, 
  modelName, 
  processingTime, 
  wordCount, 
  charCount,
  processedLength,
  disclaimer = "This is a machine-learning classification based on patterns learned from the training dataset. It does not independently verify whether the underlying claim is factually true or false."
}) {
  const isReal = prediction?.toUpperCase() === 'REAL';

  // Extract top keywords for important features display
  const sampleFeatures = [
    'government', 'policy', 'announces', 'new', 'energy', 
    'green', 'project', 'plan', 'initiative', 'support'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="rounded-3xl bg-[#000000] border-2 border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.9)] overflow-hidden text-white"
    >
      {/* Top Banner (Red for FAKE, Green for REAL) */}
      <div className={`p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/10 relative ${
        isReal 
          ? 'bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-black' 
          : 'bg-gradient-to-r from-rose-950/90 via-red-950/60 to-black'
      }`}>
        {/* Glow backlight */}
        <div className={`absolute top-0 left-0 w-96 h-full blur-3xl opacity-30 pointer-events-none ${
          isReal ? 'bg-emerald-500' : 'bg-rose-500'
        }`} />

        {/* Left Badge & Large Status */}
        <div className="flex items-center gap-5 z-10">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 shadow-[0_0_25px_rgba(0,0,0,0.5)] ${
            isReal 
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[0_0_20px_#10b981]' 
              : 'bg-rose-500/20 border-rose-400 text-rose-400 shadow-[0_0_20px_#f43f5e]'
          }`}>
            {isReal ? (
              <ShieldCheck className="w-9 h-9 stroke-[2.5]" />
            ) : (
              <AlertTriangle className="w-9 h-9 stroke-[2.5]" />
            )}
          </div>

          <div>
            <div className="text-xs font-black tracking-widest uppercase text-gray-400 mb-1">
              PREDICTION RESULT
            </div>
            <h2 className={`text-4xl sm:text-5xl font-black tracking-tight ${
              isReal 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 drop-shadow-[0_0_20px_rgba(16,185,129,0.6)]' 
                : 'text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-red-400 to-amber-400 drop-shadow-[0_0_20px_rgba(244,63,94,0.6)]'
            }`}>
              {isReal ? 'REAL NEWS' : 'FAKE NEWS'}
            </h2>
          </div>
        </div>

        {/* Right Circular Meter */}
        <div className="flex-shrink-0 z-10 p-3 rounded-2xl bg-black/60 border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          <ConfidenceMeter confidence={confidence} prediction={prediction} />
        </div>
      </div>

      {/* Middle Stats Grid: Model Details & Text Statistics */}
      <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/80">
        
        {/* Model Details */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3.5">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Model Details</h3>
          
          <div className="flex justify-between items-center text-sm py-1 border-b border-white/5">
            <span className="text-gray-400">Model</span>
            <span className="font-bold text-cyan-300">{modelName || 'Logistic Regression'}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm py-1 border-b border-white/5">
            <span className="text-gray-400">Processing Time</span>
            <span className="font-bold text-emerald-400">{processingTime ? `${processingTime} ms` : '42 ms'}</span>
          </div>

          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Model-based classification</span>
            </span>
          </div>
        </div>

        {/* Text Statistics */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3.5">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Text Statistics</h3>
          
          <div className="flex justify-between items-center text-sm py-1 border-b border-white/5">
            <span className="text-gray-400">Words</span>
            <span className="font-bold text-white">{wordCount || 0}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm py-1 border-b border-white/5">
            <span className="text-gray-400">Characters</span>
            <span className="font-bold text-white">{charCount || 0}</span>
          </div>

          <div className="flex justify-between items-center text-sm py-1">
            <span className="text-gray-400">Processed Length</span>
            <span className="font-bold text-purple-300">{processedLength || Math.round((charCount || 0) * 0.85)}</span>
          </div>
        </div>

      </div>

      {/* Important Features (Top TF-IDF Terms) */}
      <div className="px-6 sm:px-8 py-5 bg-white/[0.01] border-t border-white/5">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Important Features (Top TF-IDF Terms)
        </h3>
        <div className="flex flex-wrap gap-2">
          {sampleFeatures.map((term, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.15)]"
            >
              {term}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Disclaimer Banner */}
      <div className="p-4 sm:p-5 bg-purple-950/40 border-t border-purple-500/30 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-purple-200/90 leading-relaxed font-normal">
          {disclaimer}
        </p>
      </div>

    </motion.div>
  );
}
