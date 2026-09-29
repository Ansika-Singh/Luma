import { Link, useLocation } from 'react-router-dom';
import { Home, Globe, Stethoscope, Map, Camera, Sparkles, History as HistoryIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Layout = ({ children }) => {
  const { lang, setLang, languages, t } = useLanguage();
  const location = useLocation();

  const navItems = [
    { path: '/dermai', label: 'DermAI', icon: <Stethoscope size={16} /> },
    { path: '/map', label: 'Map', icon: <Map size={16} /> },
    { path: '/skin', label: 'Skin', icon: <Camera size={16} /> },
    { path: '/skincare', label: 'Skincare', icon: <Sparkles size={16} /> },
    { path: '/history', label: 'Records', icon: <HistoryIcon size={16} /> },
  ];

  return (
    <div style={{ backgroundColor: '#060D14', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 100, padding: '0.75rem 1rem 0.25rem' }}>
        <header style={{ 
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0.65rem 1.25rem', 
          borderRadius: '100px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          backgroundColor: 'rgba(15, 26, 36, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
        }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.03em', margin: 0 }}>
              <span style={{ color: 'white' }}>Luma<span style={{ color: '#2DD4BF' }}>.</span></span>
            </h1>
            <span style={{ 
              fontSize: '0.65rem', 
              fontWeight: '700', 
              letterSpacing: '0.05em', 
              padding: '0.15rem 0.5rem', 
              borderRadius: '100px', 
              backgroundColor: 'rgba(45, 212, 191, 0.15)', 
              color: '#2DD4BF', 
              border: '1px solid rgba(45, 212, 191, 0.3)' 
            }}>
              DermAI 2.0
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '100px',
                    fontSize: '0.8rem',
                    fontWeight: active ? '700' : '600',
                    color: active ? '#FFFFFF' : '#94A3B8',
                    backgroundColor: active ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#94A3B8', backgroundColor: 'rgba(255,255,255,0.06)', padding: '0.25rem 0.6rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Globe size={14} style={{ color: '#2DD4BF' }} />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '0.8rem', 
                  fontWeight: '700', 
                  color: 'white', 
                  cursor: 'pointer', 
                  outline: 'none' 
                }}
                aria-label="Select Language"
              >
                {(languages || []).map((l) => (
                  <option key={l.code} value={l.code} style={{ backgroundColor: '#0B0F1A', color: 'white' }}>
                    {l.native} ({l.code.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', padding: '0.25rem' }}>
              <Home size={20} />
            </Link>
          </div>
        </header>

        {/* Mobile Quick Bar */}
        <div className="flex md:hidden justify-center gap-1.5 mt-2 overflow-x-auto py-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '100px',
                  fontSize: '0.75rem',
                  fontWeight: active ? '700' : '500',
                  color: active ? '#FFFFFF' : '#94A3B8',
                  backgroundColor: active ? 'rgba(45, 212, 191, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: active ? '1px solid rgba(45, 212, 191, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
      
      <main style={{ flex: 1, padding: '1rem 0' }}>
        {children}
      </main>
      
      <footer style={{ padding: '2rem 1rem', textAlign: 'center', fontSize: '0.8rem', color: '#64748B', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ fontWeight: '600', color: '#94A3B8' }}>Luma + DermAI · Offline Diagnostic Intelligence Platform</p>
        <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Fitzpatrick V/VI Calibrated · NHA HFR Integrated · 7 Indian Languages</p>
      </footer>
    </div>
  );
};

export default Layout;
