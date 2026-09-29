import { useState, useEffect } from 'react';
import { getHistory, clearHistory } from '../services/historyService';
import { getMapRecords, formatTimeAgo, riskColor } from '../lib/diseaseMap';
import { Calendar, Trash2, SplitSquareHorizontal, X, FileText, CheckCircle2, Shield, Download } from 'lucide-react';
import { FITZ_COLORS } from '../lib/fitzpatrick';

const History = () => {
  const [tab, setTab] = useState('personal'); // 'personal' or 'rural_triage'
  const [scans, setScans] = useState([]);
  const [ruralRecords, setRuralRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedScans, setSelectedScans] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = async () => {
    const history = await getHistory();
    setScans(history);
    try {
      const recs = await getMapRecords();
      setRuralRecords(recs || []);
    } catch {}
    setLoading(false);
  };

  const handleClear = async () => {
    if (window.confirm('Are you sure you want to delete all offline history?')) {
      await clearHistory();
      setScans([]);
      setCompareMode(false);
      setSelectedScans([]);
    }
  };

  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    setSelectedScans([]);
  };

  const handleSelectScan = (id) => {
    if (!compareMode) return;
    
    if (selectedScans.includes(id)) {
      setSelectedScans(selectedScans.filter(s => s !== id));
    } else if (selectedScans.length < 2) {
      setSelectedScans([...selectedScans, id]);
    }
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const selectedScanObjects = scans.filter(s => selectedScans.includes(s.id)).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="flex flex-col max-w-4xl mx-auto px-4 py-4 text-white">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 mb-6 p-1.5 rounded-2xl bg-white/5 border border-white/10 self-start">
        <button
          onClick={() => setTab('personal')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            tab === 'personal'
              ? 'bg-teal-400 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Personal Scan Timeline
        </button>
        <button
          onClick={() => setTab('rural_triage')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            tab === 'rural_triage'
              ? 'bg-teal-400 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Rural Triage Ledger ({ruralRecords.length})
        </button>
      </div>

      {tab === 'personal' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Scan Timeline</h2>
            {scans.length > 0 && (
              <div className="flex items-center gap-4">
                <button 
                  onClick={toggleCompareMode} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: compareMode ? '#2DD4BF' : '#94A3B8' }}
                  aria-label="Toggle compare mode"
                >
                  <SplitSquareHorizontal size={20} />
                </button>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    {scans.length}/30
                  </span>
                  <button onClick={handleClear} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }} aria-label="Clear history">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {compareMode && (
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(45, 212, 191, 0.1)', border: '1px solid rgba(45, 212, 191, 0.3)', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: '#2DD4BF' }}>
                Select 2 scans to compare ({selectedScans.length}/2)
              </span>
              {selectedScans.length === 2 && (
                <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', minHeight: 'auto', backgroundColor: '#2DD4BF', color: '#0B0F1A', border: 'none', borderRadius: '4px', fontWeight: 'bold' }} onClick={() => setShowComparison(true)}>
                  Compare
                </button>
              )}
            </div>
          )}

          {!compareMode && (
            <p style={{ color: '#94A3B8', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              Track your healing progress over time. All data is stored locally.
            </p>
          )}

          {loading ? (
            <p className="text-center" style={{ color: '#94A3B8' }}>Loading history...</p>
          ) : scans.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#10141D', borderRadius: '0.5rem', border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
              <p style={{ color: '#94A3B8' }}>No scans saved yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {scans.map(scan => {
                const isSelected = selectedScans.includes(scan.id);
                return (
                  <div 
                    key={scan.id} 
                    onClick={() => handleSelectScan(scan.id)}
                    style={{ 
                      display: 'flex', gap: '1rem', padding: '1rem', 
                      backgroundColor: '#10141D', 
                      border: isSelected ? '2px solid #2DD4BF' : '1px solid rgba(255, 255, 255, 0.1)', 
                      borderRadius: '0.75rem',
                      cursor: compareMode ? 'pointer' : 'default',
                      opacity: compareMode && selectedScans.length === 2 && !isSelected ? 0.5 : 1
                    }}
                  >
                    {scan.image && (
                      <div style={{ width: '80px', height: '80px', borderRadius: '0.5rem', overflow: 'hidden', flexShrink: 0, backgroundColor: '#000' }}>
                        <img src={scan.image} alt="Scan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div className="flex items-center gap-1 mb-1" style={{ color: '#94A3B8', fontSize: '0.75rem' }}>
                        <Calendar size={12} />
                        <span>{formatDate(scan.date)}</span>
                      </div>
                      <h4 style={{ fontWeight: '700', fontSize: '1rem', color: 'white' }}>{scan.condition}</h4>
                      <div style={{ marginTop: '0.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '600', padding: '0.1rem 0.4rem', borderRadius: '1rem', backgroundColor: scan.severity === 'mild' ? '#ecfdf5' : scan.severity === 'moderate' ? '#fffbeb' : '#fef2f2', color: scan.severity === 'mild' ? '#047857' : scan.severity === 'moderate' ? '#b45309' : '#b91c1c' }}>
                          {(scan.severity || 'mild').toUpperCase()}
                        </span>
                        {scan.tone && (
                          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                            Tone {scan.tone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Comparison Modal */}
          {showComparison && selectedScanObjects.length === 2 && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 50,
              display: 'flex', flexDirection: 'column', padding: '1rem', overflowY: 'auto'
            }}>
              <div style={{ backgroundColor: '#10141D', borderRadius: '1rem', padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '600px', margin: '0 auto', width: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex justify-between items-center mb-4">
                  <h3 style={{ fontWeight: '700', fontSize: '1.25rem', color: 'white' }}>Healing Progress</h3>
                  <button onClick={() => setShowComparison(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={24} /></button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {selectedScanObjects.map((scan, idx) => (
                    <div key={scan.id} className="flex flex-col gap-2">
                      <span style={{ fontWeight: '600', color: '#94A3B8', fontSize: '0.875rem', textAlign: 'center' }}>
                        {idx === 0 ? 'Earlier' : 'Later'} - {formatDate(scan.date)}
                      </span>
                      <div style={{ borderRadius: '0.5rem', overflow: 'hidden', aspectRatio: '1/1', backgroundColor: '#000' }}>
                        <img src={scan.image} alt="Scan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <h4 style={{ fontWeight: '700', fontSize: '0.875rem', color: 'white' }}>{scan.condition}</h4>
                        <span style={{ fontSize: '0.75rem', fontWeight: '600', padding: '0.1rem 0.4rem', borderRadius: '1rem', backgroundColor: scan.severity === 'mild' ? '#ecfdf5' : scan.severity === 'moderate' ? '#fffbeb' : '#fef2f2', color: scan.severity === 'mild' ? '#047857' : scan.severity === 'moderate' ? '#b45309' : '#b91c1c' }}>
                          {scan.severity.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', color: 'white' }}>Delta Summary</h4>
                  <p style={{ fontSize: '0.875rem', color: '#94A3B8' }}>
                    {selectedScanObjects[0].severity === selectedScanObjects[1].severity 
                      ? 'No change in detected severity tier between these dates.' 
                      : `Severity shifted from ${selectedScanObjects[0].severity} to ${selectedScanObjects[1].severity}.`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Rural Triage Ledger Tab */}
      {tab === 'rural_triage' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">Rural Triage & Outbreak Ledger</h2>
              <p className="text-xs text-slate-400">
                Anonymized local cache compliant with ABDM / NHA health facility standards.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-mono font-bold border border-teal-500/30">
              Offline Sync Ready
            </span>
          </div>

          <div className="space-y-3">
            {ruralRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="size-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: riskColor(rec.risk) }}
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      {rec.condition}
                    </h4>
                    <div className="text-slate-400 mt-0.5">
                      Village: <strong>{rec.village}</strong> · Fitzpatrick Type {rec.fitzpatrick}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span
                    className={`px-2.5 py-0.5 rounded font-bold uppercase ${
                      rec.risk === 'HIGH'
                        ? 'bg-red-500/20 text-red-300'
                        : rec.risk === 'MEDIUM'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {rec.risk}
                  </span>
                  <span className="text-slate-500">{formatTimeAgo(rec.date)}</span>
                  <span className="text-teal-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 size={13} /> Saved Locally
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
