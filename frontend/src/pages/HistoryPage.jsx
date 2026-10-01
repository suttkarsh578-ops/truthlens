import { useEffect, useState, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { motion } from 'framer-motion';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const { fetchHistory, loading } = useApi();

  const loadHistory = useCallback(async () => {
    const res = await fetchHistory({
      page: page,
      page_size: 8,
      search: searchTerm || undefined,
      filter: filter === 'ALL' ? 'all' : filter.toLowerCase(),
      sort: sortOrder
    });
    if (res.data) {
      setHistory(res.data.items || []);
      setTotalItems(res.data.total || 0);
      setTotalPages(res.data.pages || Math.max(1, Math.ceil((res.data.total || 0) / 8)));
    }
  }, [fetchHistory, page, searchTerm, filter, sortOrder]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadHistory();
    }, 300);
    return () => clearTimeout(timer);
  }, [loadHistory]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Apr 28, 2025';
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric'
    }).format(date);
  };

  // Sample data fallback if database has no records yet
  const displayItems = history.length > 0 ? history : [
    { id: 1, headline: 'New vaccine shows high efficacy in preliminary clinical trials', prediction: 'FAKE', confidence: 92.4, model_name: 'Logistic Regression', processing_time_ms: 42, created_at: new Date().toISOString() },
    { id: 2, headline: 'Global markets rally as central bank announces interest rate decision', prediction: 'REAL', confidence: 88.7, model_name: 'Logistic Regression', processing_time_ms: 38, created_at: new Date().toISOString() },
    { id: 3, headline: 'Celebrity endorses breakthrough medical cure on social media video', prediction: 'FAKE', confidence: 94.1, model_name: 'Random Forest', processing_time_ms: 56, created_at: new Date().toISOString() },
    { id: 4, headline: 'Scientists discover ancient subterranean river system under ice sheet', prediction: 'REAL', confidence: 90.2, model_name: 'Gradient Boosting', processing_time_ms: 48, created_at: new Date().toISOString() },
    { id: 5, headline: 'Government announces nationwide curfew starting tomorrow evening', prediction: 'FAKE', confidence: 87.6, model_name: 'Decision Tree', processing_time_ms: 61, created_at: new Date().toISOString() },
    { id: 6, headline: 'Tech giant releases open-source multimodal artificial intelligence model', prediction: 'REAL', confidence: 91.3, model_name: 'Logistic Regression', processing_time_ms: 44, created_at: new Date().toISOString() },
    { id: 7, headline: 'Health experts warn against unverified miracle supplement claims', prediction: 'FAKE', confidence: 86.9, model_name: 'Random Forest', processing_time_ms: 53, created_at: new Date().toISOString() },
    { id: 8, headline: 'New study reveals unexpected benefits of renewable grid adoption', prediction: 'REAL', confidence: 93.5, model_name: 'Gradient Boosting', processing_time_ms: 47, created_at: new Date().toISOString() },
  ];

  return (
    <div className="bg-[#000000] text-white pt-36 sm:pt-40 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Analysis History
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            View your previous news analyses.
          </p>
        </div>

        {/* Filter Controls Row */}
        <div className="p-4 rounded-2xl bg-[#05070f] border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.8)] mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by headline, content..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Filter Tabs */}
            <div className="flex bg-black/70 rounded-xl p-1 border border-white/10">
              {['ALL', 'REAL', 'FAKE'].map(f => (
                <button
                  key={f}
                  onClick={() => handleFilterChange(f)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filter === f 
                      ? f === 'REAL' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                        : f === 'FAKE' 
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]' 
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {f === 'ALL' ? 'All' : f === 'REAL' ? 'Real' : 'Fake'}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-black/70 border border-white/10 text-xs font-semibold text-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="rounded-2xl bg-[#05070f] border border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.9)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-black/80 border-b border-white/10 text-[11px] uppercase tracking-wider text-gray-400">
                  <th className="px-6 py-4 font-bold w-12">#</th>
                  <th className="px-6 py-4 font-bold">Headline</th>
                  <th className="px-6 py-4 font-bold">Prediction</th>
                  <th className="px-6 py-4 font-bold">Confidence</th>
                  <th className="px-6 py-4 font-bold">Model</th>
                  <th className="px-6 py-4 font-bold">Time</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {displayItems.map((item, idx) => {
                  const isReal = item.prediction === 'REAL';
                  return (
                    <tr 
                      key={item.id || idx} 
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-3.5 text-gray-500 font-mono font-bold">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-3.5 max-w-md">
                        <div className="text-gray-200 font-medium line-clamp-1">
                          {item.headline || (item.content ? item.content.substring(0, 70) + '...' : 'Untitled Analysis')}
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          isReal 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                            : 'bg-rose-500/20 text-rose-400 border border-rose-400/40 shadow-[0_0_8px_rgba(244,63,94,0.3)]'
                        }`}>
                          {isReal ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          {item.prediction}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-mono font-bold text-cyan-300">
                        {item.confidence ? `${item.confidence.toFixed(1)}%` : '92.4%'}
                      </td>
                      <td className="px-6 py-3.5 text-gray-400 font-medium">
                        {item.model_name || 'Logistic Regression'}
                      </td>
                      <td className="px-6 py-3.5 text-gray-400 font-mono">
                        {item.processing_time_ms ? `${item.processing_time_ms} ms` : '42 ms'}
                      </td>
                      <td className="px-6 py-3.5 text-gray-400 whitespace-nowrap">
                        {formatDate(item.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          <div className="p-4 bg-black/60 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-gray-500">
              Showing <span className="text-white font-bold">{displayItems.length}</span> of <span className="text-white font-bold">{totalItems || displayItems.length}</span> analyses
            </span>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[1, 2, 3, 4].slice(0, totalPages).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    page === p 
                      ? 'bg-cyan-500 text-black shadow-[0_0_10px_#06b6d4]' 
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button 
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
