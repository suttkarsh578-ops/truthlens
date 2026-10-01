import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle2, Cpu, Database, Code, Globe, Server, Layers, Terminal } from 'lucide-react';

const technologies = [
  { name: 'Python', role: 'Core Logic & Training', icon: Terminal, color: 'text-amber-400 border-amber-500/30' },
  { name: 'FastAPI', role: 'High-Performance API', icon: Server, color: 'text-emerald-400 border-emerald-500/30' },
  { name: 'React', role: 'Vite & Tailwind UI', icon: Globe, color: 'text-cyan-400 border-cyan-500/30' },
  { name: 'NLP', role: 'Text Processing', icon: Cpu, color: 'text-purple-400 border-purple-500/30' },
  { name: 'TF-IDF', role: 'Vectorization (5k)', icon: Layers, color: 'text-pink-400 border-pink-500/30' },
  { name: 'Scikit-learn', role: 'Classifiers Ensemble', icon: Code, color: 'text-orange-400 border-orange-500/30' },
  { name: 'PostgreSQL', role: 'Primary Datastore', icon: Database, color: 'text-blue-400 border-blue-500/30' },
  { name: 'Three.js', role: '3D Hologram Scene', icon: Globe, color: 'text-rose-400 border-rose-500/30' },
];

export default function AboutPage() {
  return (
    <div className="bg-[#000000] text-white pt-36 sm:pt-40 pb-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold tracking-widest uppercase mb-3 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <span>ABOUT PROJECT</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            TruthLens
          </h1>
          <h2 className="text-base sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-pink-400 to-amber-300 mt-1">
            Fake News Detection Using Natural Language Processing
          </h2>
          <p className="text-sm sm:text-base text-gray-400 mt-4 leading-relaxed max-w-3xl">
            TruthLens is an AI-powered platform that uses Natural Language Processing and Machine Learning to detect fake news and identify patterns in news content. Built for academic research and presentation.
          </p>
        </div>

        {/* Main Grid: Key Features & Technology Used */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          
          {/* Key Features */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#05070f] border border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.8)] space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Key Features
            </h3>
            
            <div className="space-y-3.5">
              {[
                'NLP text preprocessing & regex cleaning pipeline',
                'TF-IDF n-gram feature extraction & weighting',
                '4 Machine learning classification algorithms',
                'Real-time model prediction with confidence scoring',
                'Comprehensive database-driven analytics dashboard',
                'Full PostgreSQL persistence for history & telemetry'
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-gray-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technology Used */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#05070f] border border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.8)]">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" /> Technology Used
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {technologies.map((tech) => {
                const Icon = tech.icon;
                return (
                  <div 
                    key={tech.name} 
                    className={`p-3 rounded-xl bg-black/60 border ${tech.color} flex items-center gap-2.5`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">{tech.name}</div>
                      <div className="text-[10px] text-gray-500">{tech.role}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Important Limitation Alert Banner */}
        <div className="p-6 rounded-3xl bg-amber-950/30 border border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.15)] flex items-start gap-4">
          <ShieldAlert className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-extrabold text-amber-300 uppercase tracking-wide">
              Important Limitation
            </h4>
            <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed font-normal">
              The system performs text classification based on patterns learned from labeled training data. It does not independently verify claims against external evidence. Predictions represent statistical language model confidence rather than absolute factual certainty.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
