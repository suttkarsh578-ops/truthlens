import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radio, RefreshCw, Search, ExternalLink, ShieldAlert, Sparkles,
  Clock, Globe, Newspaper, ArrowRight, AlertTriangle, CheckCircle2,
  SlidersHorizontal, ChevronRight
} from 'lucide-react';
import { useApi } from '../hooks/useApi';

const CATEGORIES = [
  { id: 'all', label: 'All', color: 'from-cyan-500 to-blue-600' },
  { id: 'general', label: 'General', color: 'from-blue-500 to-indigo-600' },
  { id: 'world', label: 'World', color: 'from-purple-500 to-pink-600' },
  { id: 'nation', label: 'Nation', color: 'from-pink-500 to-rose-600' },
  { id: 'business', label: 'Business', color: 'from-amber-500 to-orange-600' },
  { id: 'technology', label: 'Technology', color: 'from-cyan-400 to-teal-600' },
  { id: 'entertainment', label: 'Entertainment', color: 'from-fuchsia-500 to-purple-600' },
  { id: 'sports', label: 'Sports', color: 'from-lime-500 to-emerald-600' },
  { id: 'science', label: 'Science', color: 'from-emerald-400 to-teal-500' },
  { id: 'health', label: 'Health', color: 'from-rose-500 to-pink-500' },
];

export default function LiveNewsPage() {
  const navigate = useNavigate();
  const { fetchLiveNews } = useApi();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isCached, setIsCached] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch Live News function
  const loadLiveNews = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setErrorMsg(null);

    const params = {
      limit: 18,
      page: 1,
    };

    if (selectedCategory && selectedCategory !== 'all') {
      params.category = selectedCategory;
    }

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    const res = await fetchLiveNews(params);

    if (res.data && res.data.articles) {
      setArticles(res.data.articles);
      setIsCached(Boolean(res.data.is_cached));
      if (res.data.message && res.data.articles.length === 0) {
        setErrorMsg(res.data.message);
      }
      setLastUpdated(new Date());
    } else if (res.error) {
      setErrorMsg(res.error || 'Live news is temporarily unavailable. Please try again.');
    } else {
      setErrorMsg('No news articles returned from the provider.');
    }

    setLoading(false);
    setRefreshing(false);
  }, [fetchLiveNews, selectedCategory, debouncedSearch]);

  // Trigger load when category or debouncedSearch changes
  useEffect(() => {
    loadLiveNews();
  }, [loadLiveNews]);

  // Auto-refresh polling every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadLiveNews(true);
    }, 60000);
    return () => clearInterval(interval);
  }, [loadLiveNews]);

  // Navigate to Analyzer with pre-filled content
  const handleAnalyzeArticle = (art) => {
    navigate('/analyzer', {
      state: {
        headline: art.title || '',
        content: art.description || art.content || art.title || '',
        source: art.source_name || 'Live News Provider',
        url: art.url || '',
        publishedAt: art.published_at || '',
        category: art.category || selectedCategory
      }
    });
  };

  const formatTime = (dateObj) => {
    if (!dateObj) return '--:--';
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    try {
      const dt = new Date(dateStr);
      return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-gray-100 pt-36 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Neon Ambient Glows */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">

        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-black tracking-widest uppercase animate-pulse">
                <Radio className="w-3.5 h-3.5" />
                LIVE FEED
              </span>
              {isCached && (
                <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold">
                  Cached Feed
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              LIVE <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">NEWS</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base mt-1.5">
              Stay updated with the latest headlines from around the world.
            </p>
          </div>

          {/* Refresh and Timestamp Controls */}
          <div className="flex flex-wrap items-center gap-4 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                Last updated: <span className="text-white font-mono font-bold">{formatTime(lastUpdated)}</span>
              </span>
            </div>

            <button
              onClick={() => loadLiveNews(true)}
              disabled={refreshing || loading}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-bold transition-all cursor-pointer disabled:opacity-50 hover:scale-105 active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Updating...' : 'Refresh News'}</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Category Controls */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            
            {/* Search Input */}
            <div className="relative flex-grow">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search live news stories, topics, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm backdrop-blur-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white bg-white/10 px-2 py-0.5 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>

          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white shadow-[0_0_16px_rgba(6,182,212,0.4)] scale-105'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* News Feed Content Area */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(0,242,254,0.5)]" />
            <p className="text-gray-400 text-sm font-medium animate-pulse">
              Fetching latest headlines from live news network...
            </p>
          </div>
        ) : errorMsg && articles.length === 0 ? (
          <div className="py-16 px-6 rounded-3xl bg-white/5 border border-white/10 text-center max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Live News Status</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {errorMsg}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                loadLiveNews(true);
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 cursor-pointer"
            >
              Reset Filters & Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {articles.map((art, idx) => (
                <motion.article
                  key={art.url || art.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className="group bg-[#0e1322]/80 hover:bg-[#12182b] border border-white/10 hover:border-cyan-500/40 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] relative overflow-hidden backdrop-blur-xl"
                >
                  {/* Article Top Media */}
                  <div className="space-y-4">
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                      {art.image_url ? (
                        <img
                          src={art.image_url}
                          alt={art.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=80';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gradient-to-br from-white/5 to-white/0 p-4 text-center">
                          <Newspaper className="w-8 h-8 text-cyan-400/60 mb-2" />
                          <span className="text-xs font-semibold">Live News Story</span>
                        </div>
                      )}

                      {/* Category Badge on Image */}
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-cyan-300 border border-cyan-400/30">
                        {art.category || 'NEWS'}
                      </span>
                    </div>

                    {/* Metadata Row */}
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="font-bold text-gray-300 truncate max-w-[160px]">
                        {art.source_name || 'News Wire'}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {formatDate(art.published_at)}
                      </span>
                    </div>

                    {/* Headline */}
                    <h2 className="text-base sm:text-lg font-black text-white leading-snug group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {art.title}
                    </h2>

                    {/* Excerpt / Description */}
                    <p className="text-gray-400 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                      {art.description || art.content || 'Click below to read full coverage or run an NLP fake news authenticity analysis.'}
                    </p>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between gap-3">
                    
                    {/* External Link */}
                    {art.url ? (
                      <a
                        href={art.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
                      >
                        <span>Read Article</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-gray-600">Full Story</span>
                    )}

                    {/* Analyze with TruthLens CTA */}
                    <button
                      onClick={() => handleAnalyzeArticle(art)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 hover:opacity-95 text-white text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Analyze with TruthLens</span>
                    </button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
}
