import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  ShieldCheck, AlertTriangle, Activity, Database,
  Sparkles, FileText, CheckCircle2, Clock, RotateCcw, ArrowRight,
  Shield, Check, Search
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { useTheme } from '../context/ThemeContext';
import ConfidenceMeter from '../components/ConfidenceMeter';

export default function AnalysisResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { fetchDashboard, fetchDatasetStats, fetchModelMetrics, fetchModelInfo, fetchHistory } = useApi();
  
  // Synchronous initialization so the result renders instantly on the first frame
  const [predictionData, setPredictionData] = useState(() => {
    if (location.state?.latestPrediction) return location.state.latestPrediction;
    try {
      const saved = localStorage.getItem('truthlens_latest_prediction') || sessionStorage.getItem('truthlens_latest_prediction');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore JSON parse errors
    }
    return null;
  });

  const [dashboardStats, setDashboardStats] = useState(null);
  const [datasetStats, setDatasetStats] = useState(null);
  const [modelMetrics, setModelMetrics] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);
  
  const chartTooltipStyle = {
    contentStyle: { 
      backgroundColor: isDark ? '#090d16' : '#ffffff', 
      borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#e2e8f0', 
      color: isDark ? '#ffffff' : '#0f172a', 
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
      fontSize: '12px'
    },
    itemStyle: { color: isDark ? '#ffffff' : '#0f172a' }
  };

  useEffect(() => {
    let data = location.state?.latestPrediction;
    if (!data) {
      try {
        const saved = localStorage.getItem('truthlens_latest_prediction') || sessionStorage.getItem('truthlens_latest_prediction');
        if (saved) data = JSON.parse(saved);
      } catch (e) {
        data = null;
      }
    }

    if (data) {
      setPredictionData(data);
    }


    const loadData = async () => {
      try {
        const [dashRes, dataRes, modelRes, histRes] = await Promise.all([
          fetchDashboard(),
          fetchDatasetStats(),
          fetchModelMetrics(),
          fetchHistory({ page: 1, page_size: 10, sort: 'desc' })
        ]);

        if (dashRes?.data) setDashboardStats(dashRes.data);
        if (dataRes?.data) setDatasetStats(dataRes.data);
        if (modelRes?.data && Array.isArray(modelRes.data)) setModelMetrics(modelRes.data);
        if (histRes?.data?.items) setRecentHistory(histRes.data.items);
      } catch (err) {
        // Fallback gracefully
      }
    };

    loadData();
  }, [location.state, fetchDashboard, fetchDatasetStats, fetchModelMetrics, fetchHistory]);

  if (!predictionData) {
    return (
      <div className="bg-slate-50 dark:bg-[#000000] text-slate-900 dark:text-white pt-40 pb-24 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-white dark:bg-black/80 border border-gray-200 dark:border-white/10 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black font-serif text-slate-900 dark:text-white">
              No Analysis Result Found
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Please enter a news headline or article to perform a verification check.
            </p>
          </div>
          <button
            onClick={() => navigate('/analyzer')}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Go to News Analyzer</span>
          </button>
        </div>
      </div>
    );
  }


  const isFake = predictionData.prediction === 'FAKE';
  
  // Normalize confidence percentage
  const rawConf = typeof predictionData.confidence === 'number' ? predictionData.confidence : null;
  const confidenceScore = rawConf !== null ? (rawConf <= 1.0 ? rawConf * 100 : rawConf) : null;
  const confidenceVal = confidenceScore !== null ? parseFloat(confidenceScore.toFixed(1)) : null;

  // Model Probabilities for THIS specific story
  const modelProbs = predictionData.model_probabilities || null;
  const storyRealProb = modelProbs && typeof modelProbs.real_prob === 'number'
    ? parseFloat(Number(modelProbs.real_prob).toFixed(1))
    : (confidenceVal !== null ? (isFake ? parseFloat((100 - confidenceVal).toFixed(1)) : confidenceVal) : null);

  const storyFakeProb = modelProbs && typeof modelProbs.fake_prob === 'number'
    ? parseFloat(Number(modelProbs.fake_prob).toFixed(1))
    : (confidenceVal !== null ? (isFake ? confidenceVal : parseFloat((100 - confidenceVal).toFixed(1))) : null);

  // Submitted article text
  const submittedHeadline = (predictionData.headline || '').trim();
  const submittedContent = (predictionData.content || '').trim();
  const fullText = `${submittedHeadline} ${submittedContent}`.trim();
  
  const textStats = predictionData.text_statistics || {
    characters: predictionData.char_count || fullText.length,
    words: predictionData.word_count || fullText.split(/\s+/).filter(w => w.length > 0).length,
    sentences: (fullText.match(/[^.!?]+[.!?]+/g) || [fullText]).length,
    processed_length: predictionData.processed_length || fullText.length
  };

  const totalDatasetRecords = datasetStats?.total ? `${datasetStats.total} Verified Stories` : 'Verified Database';

  const handleAnalyzeAnother = () => {
    sessionStorage.removeItem('truthlens_latest_prediction');
    sessionStorage.removeItem('truthlens_pending_input');
    navigate('/analyzer');
  };

  // --- DYNAMIC CHART 1: Story Real vs Fake Probability for THIS article ---
  const storyProbabilityData = (storyRealProb !== null && storyFakeProb !== null) ? [
    { name: 'Real Probability', value: storyRealProb, color: '#06b6d4' },
    { name: 'Fake Probability', value: storyFakeProb, color: '#f43f5e' }
  ] : [];

  // --- DYNAMIC CHART 2: 4-Model Consensus on THIS specific article ---
  const multiModelList = (Array.isArray(predictionData.multi_model_analysis) && predictionData.multi_model_analysis.length > 0)
    ? predictionData.multi_model_analysis
    : [];

  const storyModelConsensusData = multiModelList.map(m => {
    const rawName = String(m?.name || 'Model');
    const cleanName = rawName.replace('Classifier', '').trim();
    const rVal = typeof m?.real_prob === 'number' ? m.real_prob : (typeof m?.confidence === 'number' ? (m.prediction === 'REAL' ? m.confidence : 100 - m.confidence) : null);
    const fVal = typeof m?.fake_prob === 'number' ? m.fake_prob : (typeof m?.confidence === 'number' ? (m.prediction === 'FAKE' ? m.confidence : 100 - m.confidence) : null);
    return {
      name: cleanName,
      'Real %': rVal !== null ? parseFloat(Number(rVal).toFixed(1)) : 0,
      'Fake %': fVal !== null ? parseFloat(Number(fVal).toFixed(1)) : 0,
    };
  });

  // --- DYNAMIC CHART 3: Credibility & Style Fingerprint for THIS article ---
  const credIndicators = predictionData.credibility_indicators || null;
  const styleFingerprintData = credIndicators ? [
    { metric: 'Objectivity', score: credIndicators.objectivity, fill: credIndicators.objectivity > 50 ? '#10b981' : '#f59e0b' },
    { metric: 'Lexical Richness', score: credIndicators.lexical_richness, fill: '#8b5cf6' },
    { metric: 'Attribution & Sources', score: credIndicators.attribution_density, fill: '#06b6d4' },
    { metric: 'Structural Depth', score: credIndicators.structural_depth, fill: '#3b82f6' },
    { metric: 'Sensationalism Index', score: credIndicators.sensationalism, fill: credIndicators.sensationalism > 40 ? '#f43f5e' : '#10b981' }
  ].filter(item => typeof item.score === 'number') : [];

  // --- DYNAMIC CHART 4: Top Influential Words in THIS article ---
  const rawKeywords = (Array.isArray(predictionData.top_keywords) && predictionData.top_keywords.length > 0)
    ? predictionData.top_keywords
    : [];

  const topKeywordsData = rawKeywords.slice(0, 6).map(k => {
    const wordStr = String(k?.word || '').trim();
    const weightNum = typeof k?.weight === 'number' ? k.weight : 0;
    const tendencyStr = String(k?.tendency || (isFake ? 'Fake-Leaning' : 'Real-Leaning'));
    return {
      word: wordStr,
      weight: parseFloat(Number(weightNum).toFixed(1)),
      tendency: tendencyStr,
      fill: (tendencyStr === 'Real-Leaning' || (!k?.tendency && !isFake)) ? '#06b6d4' : '#f43f5e'
    };
  }).filter(k => k.word.length > 0);



  return (
    <div className="bg-slate-50 dark:bg-[#000000] text-slate-900 dark:text-white pt-36 sm:pt-40 pb-24 min-h-screen relative overflow-hidden transition-colors duration-300">
      
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-20 left-1/4 w-[600px] h-[600px] rounded-full blur-[160px] ${
          isFake ? 'bg-rose-600/10' : 'bg-cyan-600/10'
        }`} />
        <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[170px]" />
        <div className="absolute bottom-20 left-1/3 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Top Header & Quick Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 dark:bg-cyan-950/70 border border-cyan-500/30 dark:border-cyan-500/50 text-cyan-700 dark:text-cyan-300 text-xs font-black uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>VERIFICATION REPORT</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-serif">
              News Verification Result
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-black/60 dark:hover:bg-white/10 border border-gray-300 dark:border-white/15 text-gray-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              Home
            </Link>
            <button
              onClick={handleAnalyzeAnother}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Check Another Story</span>
            </button>
          </div>
        </div>

        {/* ================= 1. MAIN RESULT HERO CARD ================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className={`p-6 sm:p-10 rounded-3xl border backdrop-blur-xl relative overflow-hidden shadow-xl ${
            isFake 
              ? 'bg-gradient-to-br from-rose-50 via-white to-red-50 dark:from-[#1a050f]/95 dark:via-[#0c0207]/95 dark:to-black border-rose-300 dark:border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.15)]' 
              : 'bg-gradient-to-br from-cyan-50 via-white to-emerald-50 dark:from-[#02181d]/95 dark:via-[#010e11]/95 dark:to-black border-cyan-300 dark:border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.15)]'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Result Explanation */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Result Badge */}
              <div className="flex items-center gap-3">
                {isFake ? (
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 border-2 border-rose-500/50 shadow-md">
                    <AlertTriangle className="w-7 h-7 text-rose-600 dark:text-rose-400 stroke-[2.5]" />
                    <span className="text-2xl sm:text-4xl font-black text-rose-600 dark:text-rose-300 tracking-wider font-serif">
                      FAKE NEWS
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border-2 border-emerald-500/50 shadow-md">
                    <ShieldCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                    <span className="text-2xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-300 tracking-wider font-serif">
                      REAL NEWS
                    </span>
                  </div>
                )}
              </div>

              {/* Simple Human Summary Description */}
              <p className="text-slate-800 dark:text-gray-100 text-base sm:text-lg leading-relaxed font-medium">
                {isFake ? (
                  <span>
                    This story shows strong signs of being <strong className="text-rose-600 dark:text-rose-400">Fake News</strong>. It uses sensational wording, unproven claims, or emotional manipulation commonly seen in viral internet rumors.
                  </span>
                ) : (
                  <span>
                    This story looks like <strong className="text-emerald-600 dark:text-emerald-400">Real News</strong>. It uses a neutral, objective reporting style and vocabulary consistent with authentic, verified journalism.
                  </span>
                )}
              </p>

              {/* Quick Info Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white dark:bg-black/60 border border-gray-200 dark:border-white/10 space-y-1 shadow-sm">
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>Verdict</span>
                  </div>
                  <div className={`text-xs font-black truncate ${isFake ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {isFake ? 'Likely False' : 'Authentic'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-black/60 border border-gray-200 dark:border-white/10 space-y-1 shadow-sm">
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Check Time</span>
                  </div>
                  <div className="text-xs font-black text-purple-600 dark:text-purple-300">
                    {predictionData.processing_time_ms || 18} ms
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-black/60 border border-gray-200 dark:border-white/10 space-y-1 shadow-sm">
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                    <span>Word Count</span>
                  </div>
                  <div className="text-xs font-black text-pink-600 dark:text-pink-300">
                    {textStats.words} Words
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-black/60 border border-gray-200 dark:border-white/10 space-y-1 shadow-sm">
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold flex items-center gap-1">
                    <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Checked Against</span>
                  </div>
                  <div className="text-xs font-black text-emerald-600 dark:text-emerald-300">
                    {totalDatasetRecords}
                  </div>
                </div>
              </div>

              {/* Friendly Note */}
              <div className="p-3.5 rounded-xl bg-gray-100/90 dark:bg-black/40 border border-gray-200 dark:border-white/10 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                <strong>Note: </strong>
                This assessment is based on writing patterns and language analysis. We always recommend double-checking important breaking news with multiple official sources.
              </div>

            </div>

            {/* Right Confidence Gauge */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-white dark:bg-black/60 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm">
              <div className="text-xs uppercase font-black tracking-wider text-gray-700 dark:text-gray-300 mb-3">
                Confidence Score
              </div>
              <ConfidenceMeter confidence={confidenceVal} prediction={predictionData.prediction} />
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3 font-medium max-w-[200px]">
                How confident the system is based on language style and vocabulary.
              </div>
            </div>

          </div>
        </motion.div>

        {/* ================= 2. SUBMITTED NEWS ARTICLE ================= */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#030611]/90 border border-gray-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-black text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>The Story You Analyzed</span>
          </div>

          <div className="space-y-3">
            {submittedHeadline ? (
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-black/80 border border-gray-200 dark:border-white/10 space-y-1">
                <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">Headline</div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {submittedHeadline}
                </h2>
              </div>
            ) : null}

            {submittedContent ? (
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-black/80 border border-gray-200 dark:border-white/10 space-y-1">
                <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">Article Content</div>
                <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">
                  {submittedContent}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* ================= 3. TEXT DETAILS ================= */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>Text Details</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Letters', val: textStats.characters, color: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-300 dark:border-cyan-500/30' },
              { label: 'Total Words', val: textStats.words, color: 'text-purple-600 dark:text-purple-400', border: 'border-purple-300 dark:border-purple-500/30' },
              { label: 'Sentences', val: textStats.sentences, color: 'text-pink-600 dark:text-pink-400', border: 'border-pink-300 dark:border-pink-500/30' },
              { label: 'Cleaned Length', val: textStats.processed_length, color: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-300 dark:border-emerald-500/30' },
            ].map((stat, i) => (
              <div key={i} className={`p-4 rounded-2xl bg-white dark:bg-black/70 border ${stat.border} shadow-sm space-y-1`}>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">{stat.label}</div>
                <div className={`text-2xl font-black font-mono ${stat.color}`}>{stat.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= 4. STEP-BY-STEP VERIFICATION FLOW ================= */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#030611]/90 border border-gray-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="text-xs font-black text-cyan-700 dark:text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-500" />
            <span>How We Checked This News (Step-by-Step)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
            {[
              { step: '1', title: 'Read Input', desc: 'Read headline & article body' },
              { step: '2', title: 'Clean Text', desc: 'Remove formatting clutter & symbols' },
              { step: '3', title: 'Check Words', desc: 'Scan tone, phrasing & style' },
              { step: '4', title: 'Match Patterns', desc: 'Compare with verified database' },
              { step: '5', title: 'Final Verdict', desc: `${predictionData.prediction} (${confidenceVal}%)` },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-gray-50 dark:bg-black/60 border border-gray-200 dark:border-white/10 space-y-1">
                <div className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs flex items-center justify-center mx-auto mb-1">
                  {item.step}
                </div>
                <div className="text-xs font-black text-slate-900 dark:text-white">{item.title}</div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= 5. LIVE CHARTS & GRAPHS (DYNAMIC TO THIS STORY) ================= */}
        <div className="space-y-6 pt-2">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2 font-serif">
              <Activity className="w-6 h-6 text-pink-500" />
              <span>Story Analysis & Credibility Graphs</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
              Dynamic verification graphs generated specifically for this submitted news story.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Chart 1: Story Probability Distribution for THIS Article */}
            <div className="p-6 rounded-3xl bg-white dark:bg-black/80 border border-gray-200 dark:border-white/10 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-300">
                  1. Story Credibility Distribution
                </span>
                <span className="text-xs font-mono font-bold text-gray-500">
                  Real: {storyRealProb}% | Fake: {storyFakeProb}%
                </span>
              </div>
              <div style={{ width: '100%', height: 240 }}>
                {storyProbabilityData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={storyProbabilityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {storyProbabilityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip {...chartTooltipStyle} formatter={(val) => [`${val}%`, 'Probability']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-medium">
                    No data available
                  </div>
                )}
              </div>
            </div>

            {/* Chart 2: Multi-Model Consensus on THIS Article */}
            <div className="p-6 rounded-3xl bg-white dark:bg-black/80 border border-gray-200 dark:border-white/10 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-300">
                  2. Algorithm Consensus on This Story (%)
                </span>
                <span className="text-xs text-gray-500 font-mono">4 Trained Models</span>
              </div>
              <div style={{ width: '100%', height: 240 }}>
                {storyModelConsensusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={storyModelConsensusData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#222' : '#e2e8f0'} />
                      <XAxis dataKey="name" stroke={isDark ? '#888' : '#64748b'} fontSize={10} interval={0} angle={-10} textAnchor="end" height={40} />
                      <YAxis stroke={isDark ? '#888' : '#64748b'} domain={[0, 100]} fontSize={10} unit="%" />
                      <Tooltip {...chartTooltipStyle} formatter={(val) => [`${val}%`, '']} />
                      <Legend />
                      <Bar dataKey="Real %" name="Real %" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Fake %" name="Fake %" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-medium">
                    No data available
                  </div>
                )}
              </div>
            </div>

            {/* Chart 3: Credibility & Style Fingerprint for THIS Article */}
            <div className="p-6 rounded-3xl bg-white dark:bg-black/80 border border-gray-200 dark:border-white/10 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-purple-700 dark:text-purple-300">
                  3. Article Credibility & Style Fingerprint
                </span>
                <span className="text-xs text-gray-500 font-mono">Linguistic Scan</span>
              </div>
              <div style={{ width: '100%', height: 220 }}>
                {styleFingerprintData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={styleFingerprintData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#222' : '#e2e8f0'} />
                      <XAxis type="number" domain={[0, 100]} stroke={isDark ? '#888' : '#64748b'} fontSize={10} unit="%" />
                      <YAxis dataKey="metric" type="category" stroke={isDark ? '#888' : '#64748b'} fontSize={10} width={135} />
                      <Tooltip {...chartTooltipStyle} formatter={(val) => [`${val}%`, 'Score']} />
                      <Bar dataKey="score" name="Score %" radius={[0, 4, 4, 0]}>
                        {styleFingerprintData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-medium">
                    No data available
                  </div>
                )}
              </div>
            </div>

            {/* Chart 4: Top Influential Words in THIS Article */}
            <div className="p-6 rounded-3xl bg-white dark:bg-black/80 border border-gray-200 dark:border-white/10 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-pink-700 dark:text-pink-300">
                  4. Key Influential Words in This Story
                </span>
                <span className="text-xs text-gray-500 font-mono">TF-IDF Importance</span>
              </div>
              <div style={{ width: '100%', height: 220 }}>
                {topKeywordsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={topKeywordsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#222' : '#e2e8f0'} />
                      <XAxis dataKey="word" stroke={isDark ? '#888' : '#64748b'} fontSize={10} interval={0} angle={-15} textAnchor="end" height={35} />
                      <YAxis stroke={isDark ? '#888' : '#64748b'} fontSize={10} unit="%" />
                      <Tooltip {...chartTooltipStyle} formatter={(val, name, item) => [`${val}% (${item.payload.tendency})`, 'Importance']} />
                      <Bar dataKey="weight" name="Word Importance %" radius={[4, 4, 0, 0]}>
                        {topKeywordsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-medium">
                    No data available
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>


        {/* Bottom Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
          <Link
            to="/"
            className="px-8 py-4 rounded-2xl bg-gray-100 hover:bg-gray-200 dark:bg-black/60 dark:hover:bg-white/10 border border-gray-300 dark:border-white/20 text-slate-800 dark:text-gray-300 hover:text-black dark:hover:text-white font-black text-sm uppercase tracking-wider transition-all cursor-pointer shadow-sm"
          >
            Back to Home
          </Link>
          <button
            onClick={handleAnalyzeAnother}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 hover:opacity-95 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(6,182,212,0.4)] inline-flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Check Another News Story</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
