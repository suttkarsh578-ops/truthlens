import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function LoadingPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(10);
  const [statusIndex, setStatusIndex] = useState(0);

  const statuses = [
    { text: 'Starting Verification System...', color: 'text-cyan-400' },
    { text: 'Loading Language Filters...', color: 'text-purple-400' },
    { text: 'Connecting Verified Database...', color: 'text-pink-400' },
    { text: 'Connecting Live Feeds...', color: 'text-amber-400' },
    { text: 'System Ready', color: 'text-emerald-400' },
  ];

  useEffect(() => {
    const duration = 1200; // 1.2s smooth boot
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      const idx = Math.min(statuses.length - 1, Math.floor((pct / 100) * statuses.length));
      setStatusIndex(idx);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          sessionStorage.setItem('truthlens_loaded', 'true');
          navigate('/');
        }, 150);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleEnter = () => {
    sessionStorage.setItem('truthlens_loaded', 'true');
    navigate('/');
  };

  return (
    <div className="fixed inset-0 bg-[#000000] text-white flex flex-col items-center justify-between p-8 select-none z-50 overflow-hidden">
      
      {/* Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/10 via-purple-600/10 to-transparent rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-pink-500/10 via-amber-500/5 to-transparent rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ffff08_1px,transparent_1px),linear-gradient(to_bottom,#00ffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-center pt-4">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 animate-spin p-[2px] shadow-[0_0_15px_rgba(0,242,254,0.6)]">
              <div className="w-full h-full bg-black rounded-full" />
            </div>
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-cyan-400 to-pink-500 shadow-[0_0_10px_#00f2fe]" />
          </div>
          <div>
            <div className="flex items-center tracking-wider font-black text-xl">
              <span className="text-white">TRUTH</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400">LENS</span>
            </div>
            <p className="text-[10px] tracking-widest text-cyan-300/80 uppercase font-bold -mt-0.5">
              News Verification & Fact Checking
            </p>
          </div>
        </div>
      </header>

      {/* Center Boot Content */}
      <main className="relative z-10 max-w-xl w-full text-center space-y-6 my-auto">
        
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(168,85,247,0.3)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>STARTING SYSTEM</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-teal-200 to-yellow-200 drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]">
              Welcome to
            </span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-rose-400 to-amber-300 drop-shadow-[0_0_35px_rgba(236,72,153,0.5)]">
              TruthLens
            </span>
          </h1>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-300/85 text-sm sm:text-base max-w-md mx-auto leading-relaxed"
        >
          Preparing news credibility verification system...
        </motion.p>

        {/* Multi-color Progress Bar */}
        <div className="pt-6 max-w-md mx-auto w-full space-y-3">
          <div className="relative h-2.5 rounded-full bg-gray-900 border border-white/15 p-[1px] overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.9)]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#00f0ff] via-[#39ff14] via-[#ffea00] via-[#ff007f] to-[#9d00ff] shadow-[0_0_15px_#00f0ff]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.05 }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono font-bold px-1">
            <AnimatePresence mode="wait">
              <motion.span
                key={statusIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={statuses[statusIndex].color}
              >
                ● {statuses[statusIndex].text}
              </motion.span>
            </AnimatePresence>
            <span className="text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
              {progress}%
            </span>
          </div>

          {/* Direct Proceed Button */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={handleEnter}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 hover:from-cyan-500/40 hover:to-pink-500/40 border border-cyan-400/40 text-cyan-200 text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>Enter Home Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </main>

      <footer className="relative z-10 text-center text-xs text-gray-500 pb-2">
        <span>TruthLens &bull; Fact-Checking & Credibility Verification</span>
      </footer>

    </div>
  );
}
