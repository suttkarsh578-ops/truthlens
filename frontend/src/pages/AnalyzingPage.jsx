import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Sparkles, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { useApi } from '../hooks/useApi';

export default function AnalyzingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { submitAnalysis } = useApi();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);

  // Retrieve submitted headline & content from state or session
  const inputData = useRef(null);

  const analysisSteps = [
    { num: '01', title: 'Reading News Input', desc: 'Parsing submitted headline and article text', color: 'text-cyan-400' },
    { num: '02', title: 'Cleaning & Normalizing', desc: 'Formatting text and filtering out clutter', color: 'text-purple-400' },
    { num: '03', title: 'Scanning Key Words & Tone', desc: 'Extracting writing style, terminology, and tone patterns', color: 'text-pink-400' },
    { num: '04', title: 'Matching Credibility Patterns', desc: 'Comparing with verified journalism vs misleading story patterns', color: 'text-amber-400' },
    { num: '05', title: 'Calculating Confidence Score', desc: 'Determining authenticity probability and consistency', color: 'text-emerald-400' },
    { num: '06', title: 'Compiling Verification Report', desc: 'Preparing detailed results and credibility breakdown', color: 'text-rose-400' },
  ];

  const runAnalysis = async () => {
    let data = location.state?.inputData;
    if (!data) {
      const saved = sessionStorage.getItem('truthlens_pending_input');
      if (saved) {
        try {
          data = JSON.parse(saved);
        } catch (e) {
          data = null;
        }
      }
    }

    if (!data || (!data.headline?.trim() && !data.content?.trim())) {
      navigate('/analyzer', { replace: true });
      return;
    }

    inputData.current = data;
    setErrorMessage('');
    setIsRetrying(false);
    setCurrentStepIndex(0);

    // Sequential step animation during inference
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < analysisSteps.length) {
        setCurrentStepIndex(step);
      }
    }, 280);

    try {
      const startTime = Date.now();
      // Execute REAL backend prediction request
      const res = await submitAnalysis({
        headline: data.headline || '',
        content: data.content || ''
      });

      const elapsed = Date.now() - startTime;
      if (elapsed < 900) {
        await new Promise(resolve => setTimeout(resolve, 900 - elapsed));
      }

      clearInterval(interval);

      if (!res.data) {
        throw new Error(res.error || 'Prediction service returned an empty response.');
      }

      const predictionResult = res.data;
      predictionResult.headline = data.headline || '';
      predictionResult.content = data.content || '';

      if (data.sourceMeta) {
        predictionResult.sourceMeta = data.sourceMeta;
      }

      // Store in both localStorage and sessionStorage for /analysis-result
      try {
        localStorage.setItem('truthlens_latest_prediction', JSON.stringify(predictionResult));
        sessionStorage.setItem('truthlens_latest_prediction', JSON.stringify(predictionResult));
        sessionStorage.removeItem('truthlens_pending_input');
      } catch (e) {
        // Ignore storage exceptions
      }

      // Navigate to /analysis-result
      navigate('/analysis-result', { state: { latestPrediction: predictionResult }, replace: true });


    } catch (err) {
      clearInterval(interval);
      setErrorMessage(err.message || 'Failed to connect to TruthLens analysis API.');
    }

  };

  useEffect(() => {
    runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[550px] h-[550px] bg-gradient-to-br from-cyan-500/10 via-purple-600/15 to-transparent rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[550px] h-[550px] bg-gradient-to-tl from-pink-500/10 via-rose-500/10 to-transparent rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ffff08_1px,transparent_1px),linear-gradient(to_bottom,#00ffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />
      </div>

      <div className="relative z-10 max-w-xl w-full text-center space-y-8">
        
        {/* Pulsing Neural Core Animation */}
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-spin p-[2px] shadow-[0_0_30px_rgba(0,242,254,0.6)]">
            <div className="w-full h-full bg-black rounded-full" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/30 via-purple-600/30 to-pink-500/30 border border-cyan-400/50 flex items-center justify-center backdrop-blur-md shadow-[0_0_20px_#00f2fe]"
          >
            <Brain className="w-8 h-8 text-cyan-300" />
          </motion.div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>VERIFYING STORY</span>
          </motion.div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-pink-400 to-amber-300 drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]">
              Verifying News...
            </span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm">
            Scanning text structure, vocabulary, and credibility patterns against verified records.
          </p>
        </div>

        {/* Error State if any */}
        {errorMessage ? (
          <div className="p-6 rounded-2xl bg-red-950/40 border border-red-500/40 space-y-4">
            <div className="flex items-center justify-center gap-2 text-rose-400 font-bold text-sm">
              <AlertCircle className="w-5 h-5" />
              <span>{errorMessage}</span>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setIsRetrying(true);
                  runAnalysis();
                }}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
              <button
                onClick={() => navigate('/analyzer')}
                className="px-6 py-2.5 rounded-xl bg-black/60 border border-white/20 text-gray-300 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to News Input</span>
              </button>
            </div>
          </div>
        ) : (
          /* Sequential Pipeline Step Cards */
          <div className="space-y-3 pt-2 text-left">
            {analysisSteps.map((s, idx) => {
              const isCurrent = idx === currentStepIndex;
              const isDone = idx < currentStepIndex;

              return (
                <motion.div
                  key={s.num}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                    isCurrent
                      ? 'bg-black/90 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)] scale-[1.02]'
                      : isDone
                      ? 'bg-black/50 border-white/10 opacity-70'
                      : 'bg-black/30 border-white/5 opacity-30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black font-mono border ${
                      isCurrent
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                        : isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400/40'
                        : 'bg-white/5 text-gray-500 border-white/10'
                    }`}>
                      {isDone ? '✓' : s.num}
                    </span>
                    <div>
                      <div className={`text-xs font-bold ${isCurrent ? s.color : 'text-gray-300'}`}>
                        {s.title}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {s.desc}
                      </div>
                    </div>
                  </div>

                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shadow-[0_0_8px_#00f2fe]" />
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
