import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Sparkles, History, HelpCircle, Info, Zap } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, color: 'text-purple-400' },
  { name: 'News Analyzer', path: '/analyzer', icon: Sparkles, color: 'text-cyan-400' },
  { name: 'History', path: '/history', icon: History, color: 'text-pink-400' },
  { name: 'How It Works', path: '/how-it-works', icon: HelpCircle, color: 'text-amber-400' },
  { name: 'About', path: '/about', icon: Info, color: 'text-emerald-400' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#030612] border-r border-white/10 flex flex-col justify-between p-5 min-h-screen fixed left-0 top-0 bottom-0 z-30 hidden lg:flex">
      {/* Brand Header */}
      <div>
        <NavLink to="/" className="flex items-center gap-3 pb-6 border-b border-white/10 group">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 p-[1.5px] shadow-[0_0_15px_rgba(0,242,254,0.5)]">
              <div className="w-full h-full bg-black rounded-full" />
            </div>
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-cyan-400 to-pink-500 shadow-[0_0_8px_#00f2fe]" />
          </div>
          <div>
            <div className="flex items-center tracking-wider font-black text-lg">
              <span className="text-white">TRUTH</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400">LENS</span>
            </div>
            <span className="text-[9px] font-bold tracking-widest text-cyan-400/80 uppercase">
              AI News Intelligence
            </span>
          </div>
        </NavLink>

        {/* Navigation Items */}
        <div className="mt-8 space-y-2">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-3 mb-2">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 via-purple-500/15 to-transparent text-cyan-300 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400 drop-shadow-[0_0_8px_#00f2fe]' : item.color}`} />
                    <span className="flex-1">{item.name}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Bottom Status Card */}
      <div className="p-4 rounded-2xl bg-black/80 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Engine State</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
        </div>
        <div className="text-xs font-black text-emerald-400 tracking-wide">
          SYSTEM ACTIVE
        </div>
        <p className="text-[10px] text-gray-400">
          FastAPI & PostgreSQL Connected
        </p>
      </div>
    </aside>
  );
}
