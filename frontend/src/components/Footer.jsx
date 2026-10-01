import { NavLink, Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-[#000000] border-t border-gray-200 dark:border-white/10 py-10 mt-auto relative z-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Row: Logo + Publication Tagline + Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-gray-200 dark:border-white/10">
          {/* Logo & Description */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-serif font-black text-xl shadow-sm group-hover:scale-105 transition-transform">
                T
              </div>
              <div className="flex flex-col text-left">
                <span className="font-serif font-black text-lg tracking-wider text-gray-900 dark:text-white leading-none">
                  TRUTHLENS
                </span>
                <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 tracking-[0.2em] uppercase">
                  NEWSPAPER & AI DESK
                </span>
              </div>
            </Link>
            <span className="hidden md:inline text-gray-300 dark:text-gray-700">|</span>
            <p className="text-xs text-gray-600 dark:text-gray-400 max-w-md">
              Independent news intelligence, real-time reporting, and ML credibility verification.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs font-semibold text-gray-600 dark:text-gray-400">
            <NavLink to="/" end className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
              Home
            </NavLink>
            <NavLink to="/analyzer" className="hover:text-red-600 dark:hover:text-red-400 transition-colors font-bold text-gray-900 dark:text-gray-200">
              News Analysis
            </NavLink>
          </div>
        </div>

        {/* Bottom Row: Editorial Standards + Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-500">
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <span className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer">Editorial Standards</span>
            <span>&bull;</span>
            <span className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer">Fact-Checking Policy</span>
            <span>&bull;</span>
            <span className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer">Privacy Policy</span>
            <span>&bull;</span>
            <span className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer">Terms of Service</span>
          </div>

          <div className="text-[11px] text-gray-500 font-medium text-center">
            &copy; {currentYear} TruthLens Media Network. Powered by PostgreSQL & Machine Learning.
          </div>
        </div>

      </div>
    </footer>
  );
}

