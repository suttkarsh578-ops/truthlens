import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, RotateCcw, AlertCircle, Sparkles, FileText, ArrowRight, Clipboard, CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react';

const sampleArticles = [
  {
    id: 'real',
    badge: '🟢 Real News Example',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20',
    title: 'Renewable Storage Technology Breakthrough',
    headline: 'Global Research Consortium Validates Solid-State Renewable Storage Technology',
    content: 'International energy laboratories and university researchers have published verified experimental results demonstrating a major breakthrough in solid-state energy storage with over 5,000 thermal cycles without degradation. The peer-reviewed study, published across three independent academic journals, confirms that scalable pilot manufacturing is scheduled to commence next year with international safety certification.'
  },
  {
    id: 'fake',
    badge: '🔴 Fake News Example',
    badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/20',
    title: 'Sensational Miracle Remedy Claim',
    headline: 'Secret Miracle Frequency Compound Cures All Ailments in 48 Hours, Officials Stunned',
    content: 'An anonymous doctor has revealed a suppressed natural frequency compound that allegedly eliminates all bacterial and viral infections in under 48 hours without medical intervention. The viral video claiming government suppression has gathered millions of shares online, although no peer-reviewed documentation, laboratory testing, or clinical verification exists to support any of the medical claims.'
  }
];

export default function AnalyzerPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Clean empty initial state - NO default pre-filled news unless explicitly passed via route state
  const [headline, setHeadline] = useState(() => location.state?.headline || '');
  const [content, setContent] = useState(() => location.state?.content || '');
  const [sourceMeta, setSourceMeta] = useState(() => location.state?.source ? location.state : null);
  const [validationError, setValidationError] = useState('');
  const [activeSampleId, setActiveSampleId] = useState(null);

  useEffect(() => {
    if (location.state?.headline || location.state?.content) {
      setHeadline(location.state.headline || '');
      setContent(location.state.content || '');
      setSourceMeta(location.state);
      setActiveSampleId(null);
    }
  }, [location.state]);

  const getWordCount = (text) => text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const totalChars = (headline + content).length;
  const totalWords = getWordCount(headline + ' ' + content);

  const handleAnalyze = () => {
    if (!headline.trim() && !content.trim()) {
      setValidationError('Please enter at least a news headline or article text to analyze.');
      return;
    }
    setValidationError('');

    const inputData = {
      headline: headline.trim(),
      content: content.trim(),
      sourceMeta: sourceMeta
    };

    sessionStorage.setItem('truthlens_pending_input', JSON.stringify(inputData));
    navigate('/analyzing', { state: { inputData } });
  };

  const handleClear = () => {
    setHeadline('');
    setContent('');
    setSourceMeta(null);
    setValidationError('');
    setActiveSampleId(null);
  };

  const handlePasteHeadline = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setHeadline(text);
        setValidationError('');
        setActiveSampleId(null);
      }
    } catch (e) {
      // clipboard permission denied or not supported
    }
  };

  const handlePasteContent = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setContent(text);
        setValidationError('');
        setActiveSampleId(null);
      }
    } catch (e) {
      // clipboard permission denied or not supported
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleAnalyze();
    }
  };

  return (
    <div 
      onKeyDown={handleKeyDown}
      className="bg-slate-50 dark:bg-[#000000] text-slate-900 dark:text-white pt-36 sm:pt-40 pb-24 min-h-screen relative overflow-hidden transition-colors duration-300"
    >
      
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-28 left-10 w-[500px] h-[500px] bg-cyan-600/10 dark:bg-cyan-500/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-purple-600/10 dark:bg-purple-500/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-10 left-1/3 w-[450px] h-[450px] bg-pink-600/10 dark:bg-pink-500/15 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Page Header */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 dark:bg-cyan-950/70 border border-cyan-500/30 dark:border-cyan-500/50 text-cyan-700 dark:text-cyan-300 text-xs font-black uppercase tracking-wider shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>NEWS VERIFICATION TOOL</span>
          </motion.div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-serif">
            Check Any News Story
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Paste any news headline or full article text below to verify whether it matches verified journalistic reporting or fake news patterns.
          </p>
        </div>

        {/* Quick Sample Selector */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#030611]/80 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-[0_0_25px_rgba(0,0,0,0.8)] flex flex-wrap items-center justify-between gap-3 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-800 dark:text-gray-200">
            <Sparkles className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <span>Quick Test Templates:</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {sampleArticles.map((sample) => {
              const isSelected = activeSampleId === sample.id;
              return (
                <button
                  key={sample.id}
                  onClick={() => {
                    setHeadline(sample.headline);
                    setContent(sample.content);
                    setActiveSampleId(sample.id);
                    setValidationError('');
                  }}
                  className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center gap-2 ${
                    isSelected
                      ? `${sample.badgeClass} ring-2 ring-cyan-500/30 scale-[1.02]`
                      : 'bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300'
                  }`}
                  title={`Load ${sample.title}`}
                >
                  <span>{sample.badge}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* News Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#030611]/90 border border-gray-200 dark:border-white/15 shadow-xl dark:shadow-[0_0_40px_rgba(0,0,0,0.9)] space-y-6 backdrop-blur-xl transition-colors duration-300"
        >
          {/* Validation Alert */}
          {validationError && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-500/40 text-red-700 dark:text-red-300 text-xs font-bold flex items-center gap-2.5 animate-pulse">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Headline Input Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>News Headline</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePasteHeadline}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-[11px] font-bold text-gray-600 dark:text-gray-300 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Paste headline from clipboard"
                >
                  <Clipboard className="w-3 h-3" />
                  <span>Paste</span>
                </button>
                <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 font-bold">
                  {headline.length} chars
                </span>
              </div>
            </div>
            <input
              type="text"
              value={headline}
              onChange={(e) => {
                setHeadline(e.target.value);
                setActiveSampleId(null);
                if (validationError) setValidationError('');
              }}
              placeholder="e.g., Central bank announces new interest rate policy / Scientists discover clean energy breakthrough..."
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-black/80 border border-gray-300 dark:border-white/15 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 text-sm font-medium transition-all outline-none shadow-sm"
            />
          </div>

          {/* Content Textarea Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>News Article Content</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePasteContent}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-[11px] font-bold text-gray-600 dark:text-gray-300 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Paste article text from clipboard"
                >
                  <Clipboard className="w-3 h-3" />
                  <span>Paste</span>
                </button>
                <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 font-bold">
                  {content.length} chars &bull; {getWordCount(content)} words
                </span>
              </div>
            </div>
            <textarea
              rows={8}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setActiveSampleId(null);
                if (validationError) setValidationError('');
              }}
              placeholder="Paste or type the full news article body, claim, or report text here for detailed linguistic verification..."
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-black/80 border border-gray-300 dark:border-white/15 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 text-sm leading-relaxed font-sans transition-all outline-none resize-y shadow-sm font-normal"
            />
          </div>

          {/* Metrics Counter Bar */}
          <div className="p-4 rounded-2xl bg-gray-100 dark:bg-black/60 border border-gray-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-6">
              <span>Total Characters: <strong className="text-cyan-600 dark:text-cyan-300 font-mono text-sm">{totalChars}</strong></span>
              <span>Total Words: <strong className="text-purple-600 dark:text-purple-300 font-mono text-sm">{totalWords}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Vocabulary & Writing Style Evaluation</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-black/60 dark:hover:bg-white/5 border border-gray-300 dark:border-white/15 text-gray-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear Text</span>
            </button>

            <button
              type="button"
              onClick={handleAnalyze}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 hover:opacity-95 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center gap-2.5 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Search className="w-4 h-4 stroke-[3]" />
              <span>Check News Authenticity</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          <div className="text-center">
            <span className="text-[11px] text-gray-400 dark:text-gray-500">
              Pro-tip: Press <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 font-mono text-[10px]">Ctrl + Enter</kbd> to analyze immediately.
            </span>
          </div>

        </motion.div>

      </div>
    </div>
  );
}
