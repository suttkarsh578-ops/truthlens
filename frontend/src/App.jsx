import React, { useEffect, Component } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import LoadingPage from './pages/LoadingPage';
import HomePage from './pages/HomePage';
import AnalyzerPage from './pages/AnalyzerPage';
import AnalyzingPage from './pages/AnalyzingPage';
import AnalysisResultPage from './pages/AnalysisResultPage';
import HistoryPage from './pages/HistoryPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';
import LiveNewsPage from './pages/LiveNewsPage';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("TruthLens UI Error Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto text-2xl font-black">
            !
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black font-serif">Something went wrong</h1>
            <p className="text-xs text-gray-400 max-w-md">
              {this.state.error?.message || "An unexpected error occurred while loading this page."}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.href = '/analyzer'}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider transition-all"
            >
              Go to News Analyzer
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const location = useLocation();

  const isFullScreenPage = location.pathname === '/analyzing';

  return (
    <ErrorBoundary>
      <div className="bg-slate-50 dark:bg-[#000000] text-gray-900 dark:text-white min-h-screen flex flex-col selection:bg-red-500 selection:text-white transition-colors duration-200">
        {!isFullScreenPage && <Navbar />}

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analyzer" element={<AnalyzerPage />} />
            <Route path="/analyzing" element={<AnalyzingPage />} />
            <Route path="/analysis-result" element={<AnalysisResultPage />} />
            <Route path="/live-news" element={<LiveNewsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/loading" element={<HomePage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>

        {!isFullScreenPage && <Footer />}
      </div>
    </ErrorBoundary>
  );
}

