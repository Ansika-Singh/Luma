import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './views/Home';
import DermAIWorkflow from './views/DermAIWorkflow';
import DiseaseMap from './views/DiseaseMap';
import SkinAnalysis from './views/SkinAnalysis';
import MobileSkinAnalysis from './views/MobileSkinAnalysis';
import SkincareEngine from './views/SkincareEngine';
import History from './views/History';
import { Download } from 'lucide-react';

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <Router>
      {deferredPrompt && (
        <div style={{ backgroundColor: '#eff6ff', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #bfdbfe' }}>
          <span style={{ fontSize: '0.875rem', color: '#1e3a8a', fontWeight: '500' }}>Install Luma for offline use</span>
          <button onClick={handleInstallClick} className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', minHeight: 'auto', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
            <Download size={16} /> Install
          </button>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Home onInstall={handleInstallClick} canInstall={!!deferredPrompt} />} />
        <Route path="/dermai" element={<Layout><DermAIWorkflow /></Layout>} />
        <Route path="/map" element={<Layout><DiseaseMap /></Layout>} />
        <Route path="/skin" element={<Layout><SkinAnalysis /></Layout>} />
        <Route path="/m/skin" element={<MobileSkinAnalysis />} />
        <Route path="/skincare" element={<Layout><SkincareEngine /></Layout>} />
        <Route path="/history" element={<Layout><History /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
