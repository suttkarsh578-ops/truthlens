import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Zap, CloudSun, Search, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApi } from '../hooks/useApi';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { fetchLiveNews } = useApi();
  const navigate = useNavigate();

  const [tickerHeadlines, setTickerHeadlines] = useState([
    { title: 'Middle East Oil Exports Rebound to 12.8 Million Bpd Amid Global Market Adjustments', category: 'BUSINESS' },
    { title: 'Sen Kennedy Proposes Ban on Naming Public Buildings After Living Officials', category: 'POLITICS' },
    { title: 'Scientists Develop Next-Generation Silicon Processors with 40% Lower Power Consumption', category: 'TECH' },
    { title: 'Forty-Two Nations Sign Landmark Climate Grid Connectivity Agreement in Geneva', category: 'WORLD' },
    { title: 'Universal Flu Vaccine Shows 94% Long-Lasting Protection in Global Clinical Trials', category: 'HEALTH' }
  ]);

  useEffect(() => {
    const loadTicker = async () => {
      try {
        const res = await fetchLiveNews({ limit: 15, country: 'in' });
        if (res?.data?.articles && res.data.articles.length > 0) {
          setTickerHeadlines(res.data.articles.map(a => ({
            title: a.title,
            category: (a.category || 'INDIA NEWS').toUpperCase(),
            content: a.content || a.description || a.title
          })));
        }
      } catch (e) {
        // keep default ticker
      }
    };
    loadTicker();
  }, [fetchLiveNews]);

  const handleTickerClick = (headline) => {
    navigate('/analyzer', {
      state: {
        headline: headline.title,
        content: headline.content || headline.title
      }
    });
  };

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all ${
      isActive
        ? 'text-red-600 dark:text-red-500 border-b-2 border-red-600 font-black'
        : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300 shadow-md">
      
      {/* ================= 1. TOP RUNNING MARQUEE HEADLINE BAR ================= */}
      <div className="bg-[#0b1021] text-gray-300 text-xs border-b border-white/10 py-1.5 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Breaking News Tag */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-red-600 text-white font-black text-[10px] tracking-widest uppercase flex-shrink-0 shadow-sm animate-pulse">
            <Zap className="w-3 h-3 fill-white" />
            <span>BREAKING NEWS</span>
          </div>

          {/* Continuous Left-to-Right / Marquee Running News Stream */}
          <div className="overflow-hidden flex-grow relative whitespace-nowrap mask-gradient">
            <div className="inline-flex items-center gap-10 animate-ticker hover:[animation-play-state:paused] cursor-pointer">
              {tickerHeadlines.map((h, i) => (
                <button
                  key={i}
                  onClick={() => handleTickerClick(h)}
                  className="inline-flex items-center gap-2 text-xs font-medium text-gray-200 hover:text-red-400 transition-colors cursor-pointer text-left"
                  title="Click to check credibility with TruthLens"
                >
                  <span className="text-[10px] font-bold text-red-500 uppercase">[{h.category}]</span>
                  <span className="hover:underline">{h.title}</span>
                  <span className="text-gray-600 ml-4">&bull;</span>
                </button>
              ))}
              {/* Duplicate for infinite marquee loop */}
              {tickerHeadlines.map((h, i) => (
                <button
                  key={'loop-' + i}
                  onClick={() => handleTickerClick(h)}
                  className="inline-flex items-center gap-2 text-xs font-medium text-gray-200 hover:text-red-400 transition-colors cursor-pointer text-left"
                  title="Click to check credibility with TruthLens"
                >
                  <span className="text-[10px] font-bold text-red-500 uppercase">[{h.category}]</span>
                  <span className="hover:underline">{h.title}</span>
                  <span className="text-gray-600 ml-4">&bull;</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Weather + Date + Day/Night Toggle */}
          <div className="flex items-center gap-3 flex-shrink-0 text-[11px] pl-2 border-l border-white/10">
            <div className="hidden md:flex items-center gap-1.5 text-gray-300 font-semibold">
              <CloudSun className="w-3.5 h-3.5 text-amber-400" />
              <span>New Delhi, India 28°C</span>
            </div>

            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              title={isDark ? "Switch to Day Mode (Pure White Background)" : "Switch to Night Mode (Deep Black Background)"}
              className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-yellow-300 hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-300 animate-pulse-slow" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-300" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* ================= 2. MAIN BRAND HEADER & NAVIGATION ================= */}
      <div className="bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 py-3.5 px-4 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Newspaper Editorial Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white font-serif font-black text-2xl shadow-md group-hover:scale-105 transition-transform">
              T
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-black text-2xl tracking-wider text-gray-900 dark:text-white leading-none">
                TRUTHLENS
              </span>
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-[0.25em] uppercase">
                NEWSPAPER & FACT CHECK DESK
              </span>
            </div>
          </Link>

          {/* Navigation Links: Strictly ONLY Home & News Analysis */}
          <nav className="flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            
            <NavLink
              to="/analyzer"
              className="px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>News Analysis</span>
            </NavLink>
          </nav>

        </div>
      </div>

    </header>
  );
}
