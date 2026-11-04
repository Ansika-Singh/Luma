import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Globe, Stethoscope, Map, Camera, Sparkles, 
  History as HistoryIcon 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Layout = ({ children }) => {
  const { lang, setLang, languages, t } = useLanguage();
  const location = useLocation();

  const navItems = [
    { 
      path: '/triage', 
      label: t('triage_title') || t('dermai_title') || 'Clinical Triage', 
      shortLabel: 'Triage',
      icon: <Stethoscope size={17} /> 
    },
    { 
      path: '/map', 
      label: t('outbreak_map') || 'Outbreak Map', 
      shortLabel: 'Map',
      icon: <Map size={17} /> 
    },
    { 
      path: '/skin', 
      label: t('skin') || 'Skin Analysis', 
      shortLabel: 'Skin',
      icon: <Camera size={17} /> 
    },
    { 
      path: '/skincare', 
      label: t('skincare') || 'Skincare Engine', 
      shortLabel: 'Skincare',
      icon: <Sparkles size={17} /> 
    },
    { 
      path: '/history', 
      label: t('history') || 'Patient Records', 
      shortLabel: 'Records',
      icon: <HistoryIcon size={17} /> 
    },
  ];

  const isNavActive = (path) => {
    if (path === '/triage') {
      return location.pathname === '/triage' || location.pathname === '/dermai';
    }
    return location.pathname === path;
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#060A11] text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 overflow-x-hidden relative">
      {/* Global Fixed Video Background (Matches Landing Page) */}
      <div className="fixed inset-0 z-0 bg-black pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20"
          src="https://ik.imagekit.io/lrigu76hy/tailark/dna-video.mp4?updatedAt=1745736251477"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060A11]/85 via-[#060A11]/92 to-[#060A11] pointer-events-none" />
      </div>

      {/* Ambient Lighting Cones */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-teal-500/15 via-emerald-500/5 to-transparent blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[50vw] max-w-[800px] h-[450px] bg-pink-500/10 blur-[160px] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none z-0 opacity-50" />

      {/* Top Navigation Bar: sticky, full width with centered max-w-7xl inner row */}
      <header className="sticky top-0 z-50 w-full bg-[#060A11]/80 backdrop-blur-2xl border-b border-white/10 py-3.5 transition-all shadow-xl">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group no-underline shrink-0 min-w-0">
            <svg 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              className="animate-[spin_12s_linear_infinite] group-hover:scale-110 transition-transform shrink-0"
            >
              <path 
                d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12" 
                stroke="url(#layout-luma-logo-grad)" 
                strokeWidth="3" 
                strokeLinecap="round"
              />
              <circle cx="21" cy="12" r="1.5" fill="#F472B6" />
              <defs>
                <linearGradient id="layout-luma-logo-grad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#34D399" />
                  <stop offset="1" stopColor="#F472B6" />
                </linearGradient>
              </defs>
            </svg>

            <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-baseline">
              Luma<span className="text-pink-500">.</span>
            </span>

            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-widest uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30 shrink-0 shadow-[0_0_12px_rgba(45,212,191,0.25)]">
              Clinical 2.0
            </span>
          </Link>

          {/* Desktop Navigation Links (From 768px+) */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] p-1.5 rounded-full border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            {navItems.map((item) => {
              const active = isNavActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all no-underline ${
                    active
                      ? 'bg-teal-400 text-slate-950 shadow-[0_0_20px_rgba(45,212,191,0.65)] scale-[1.02]'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className={active ? 'text-slate-950' : 'text-teal-400'}>
                    {item.icon}
                  </span>
                  <span>{item.shortLabel}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Tools: Language + Home */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Language Selector Pill */}
            <div className="flex items-center gap-1.5 bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 hover:border-teal-400/40 rounded-full px-3 py-1.5 text-xs text-slate-300 transition-all shadow-sm min-h-[44px]">
              <Globe size={14} className="text-teal-400 shrink-0" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-white text-xs sm:text-sm font-bold cursor-pointer focus:outline-none pr-1 min-h-[44px]"
                aria-label="Select Language"
              >
                {(languages || []).map((l) => (
                  <option key={l.code} value={l.code} className="bg-slate-900 text-white py-1">
                    {l.native} ({l.code.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* Back to Home Button */}
            <Link
              to="/"
              title="Return to Home"
              className="size-11 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/15 hover:border-teal-400/30 transition-all no-underline shrink-0 min-h-[44px] min-w-[44px] shadow-sm"
            >
              <Home size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Page Container: Centered max-w-7xl with fluid padding */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 pb-32 md:pb-16 relative z-10">
        {children}
      </main>

      {/* Fixed Bottom Tab Bar (Under 768px) */}
      <nav 
        aria-label="Mobile Navigation Dock" 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#060A11]/95 backdrop-blur-2xl border-t border-white/15 px-3 py-2 flex items-center justify-around shadow-[0_-10px_30px_rgba(0,0,0,0.85)]"
        style={{ paddingBottom: 'calc(0.6rem + env(safe-area-inset-bottom, 0px))' }}
      >
        {navItems.map((item) => {
          const active = isNavActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-bold transition-all no-underline min-h-[44px] ${
                active
                  ? 'bg-teal-400 text-slate-950 shadow-[0_0_15px_rgba(45,212,191,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className={active ? 'text-slate-950' : 'text-slate-300'}>
                {item.icon}
              </span>
              <span className="mt-0.5 leading-none">{item.shortLabel}</span>
            </Link>
          );
        })}
      </nav>

      {/* Centered High-Tech Futuristic Footer */}
      <footer className="relative z-10 w-full border-t border-white/10 bg-[#060A11]/80 backdrop-blur-xl py-6 text-center mt-auto shadow-2xl">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-white font-extrabold tracking-tight">Luma Health</span>
            <span>·</span>
            <span className="text-teal-300 font-medium">100% On-Device Clinical Triage</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 font-mono text-[11px] text-slate-400">
            <span className="px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
              Fitzpatrick V/VI
            </span>
            <span className="px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
              NHA HFR Registered
            </span>
            <span className="px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
              Bhashini TTS (7 Lang)
            </span>
          </div>

          <div className="text-[11px] font-mono text-slate-500">
            Offline Decision Support System · v2.4
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
