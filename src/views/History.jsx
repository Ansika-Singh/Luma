import { useState, useEffect } from 'react';
import { getHistory, clearHistory } from '../services/historyService';
import { getMapRecords, formatTimeAgo, riskColor } from '../lib/diseaseMap';
import { Calendar, Trash2, SplitSquareHorizontal, X, CheckCircle2, History as HistoryIcon, Sparkles } from 'lucide-react';
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
    <div className="w-full space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. Hero Header */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-widest uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                <Sparkles size={12} className="text-teal-400" /> IndexedDB Offline Storage
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/5 text-slate-300 border border-white/10">
                100% On-Device
              </span>
            </div>

            <h1 className="text-[clamp(1.5rem,4vw,2.5rem)] font-black tracking-tight text-white leading-tight">
              Patient <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-pink-500">Records & History</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Track longitudinal lesion evolution, compare healing milestones, and view anonymized village triage entries.
            </p>
          </div>

          {/* Tab Switcher Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 shrink-0 self-start md:self-center">
            <button
              onClick={() => setTab('personal')}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === 'personal'
                  ? 'bg-teal-400 text-slate-950 shadow-[0_0_15px_rgba(45,212,191,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Scan Timeline
            </button>
            <button
              onClick={() => setTab('rural_triage')}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === 'rural_triage'
                  ? 'bg-teal-400 text-slate-950 shadow-[0_0_15px_rgba(45,212,191,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Rural Triage Ledger ({ruralRecords.length})
            </button>
          </div>
        </div>
      </div>

      {tab === 'personal' && (
        <div className="space-y-6">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl">
            <div>
              <h2 className="text-lg font-bold text-white">Scan Timeline</h2>
              <p className="text-xs text-slate-400">
                Track your healing progress over time. All data is stored locally.
              </p>
            </div>

            {scans.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleCompareMode}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    compareMode
                      ? 'bg-teal-400 text-slate-950 shadow-[0_0_15px_rgba(45,212,191,0.5)]'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                  aria-label="Toggle compare mode"
                >
                  <SplitSquareHorizontal size={16} />
                  <span>{compareMode ? 'Exit Compare' : 'Compare Scans'}</span>
                </button>

                <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                  <span className="text-xs font-mono text-slate-400">
                    {scans.length}/30
                  </span>
                  <button
                    onClick={handleClear}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition"
                    aria-label="Clear history"
                    title="Clear offline records"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Compare Banner */}
          {compareMode && (
            <div className="p-4 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-between gap-4 text-xs">
              <span className="font-bold text-teal-200">
                Select 2 scans to compare ({selectedScans.length}/2)
              </span>
              {selectedScans.length === 2 && (
                <button
                  onClick={() => setShowComparison(true)}
                  className="glow-teal-btn px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Compare
                </button>
              )}
            </div>
          )}

          {/* Scans List */}
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              Loading history...
            </div>
          ) : scans.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-900/40 border border-dashed border-white/15 text-center space-y-2">
              <HistoryIcon size={36} className="mx-auto text-slate-500" />
              <p className="text-sm font-bold text-slate-300">No scans saved yet.</p>
              <p className="text-xs text-slate-500">
                Complete a clinical triage scan to populate your timeline.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scans.map((scan) => {
                const isSelected = selectedScans.includes(scan.id);
                return (
                  <div
                    key={scan.id}
                    onClick={() => handleSelectScan(scan.id)}
                    className={`p-5 rounded-3xl border transition-all flex items-center gap-4 ${
                      isSelected
                        ? 'bg-teal-500/10 border-teal-400 shadow-[0_0_25px_rgba(45,212,191,0.3)]'
                        : 'bg-slate-900/70 border-white/10 hover:border-white/25 backdrop-blur-xl'
                    } ${compareMode ? 'cursor-pointer' : ''}`}
                  >
                    {scan.image && (
                      <div className="size-20 rounded-2xl overflow-hidden shrink-0 bg-black border border-white/10">
                        <img
                          src={scan.image}
                          alt="Scan"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                        <Calendar size={12} className="text-teal-400" />
                        <span>{formatDate(scan.date)}</span>
                      </div>

                      <h4 className="text-base font-bold text-white truncate">
                        {scan.condition}
                      </h4>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            scan.severity === 'urgent' || scan.severity === 'severe' || scan.severity === 'HIGH'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : scan.severity === 'moderate' || scan.severity === 'MEDIUM'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {(scan.severity || 'mild').toUpperCase()}
                        </span>

                        {scan.tone && (
                          <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                            <span
                              className="size-2.5 rounded-full"
                              style={{ backgroundColor: FITZ_COLORS[scan.tone] || '#6E4327' }}
                            />
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
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-white/20 p-6 sm:p-8 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <h3 className="text-xl font-bold text-white">Healing Progress Delta</h3>
                  <button
                    onClick={() => setShowComparison(false)}
                    className="size-8 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {selectedScanObjects.map((scan, idx) => (
                    <div key={scan.id} className="space-y-2 text-center">
                      <span className="text-xs font-mono font-bold text-teal-300">
                        {idx === 0 ? 'Earlier' : 'Later'} · {formatDate(scan.date)}
                      </span>
                      <div className="aspect-square rounded-2xl overflow-hidden bg-black border border-white/10">
                        <img
                          src={scan.image}
                          alt="Scan"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-sm font-bold text-white">{scan.condition}</div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/10 text-slate-300">
                        {scan.severity.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-slate-300 space-y-1">
                  <h4 className="font-bold text-white">Delta Summary</h4>
                  <p>
                    {selectedScanObjects[0].severity === selectedScanObjects[1].severity
                      ? 'No change in detected severity tier between these dates.'
                      : `Severity shifted from ${selectedScanObjects[0].severity} to ${selectedScanObjects[1].severity}.`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Rural Triage Ledger Tab */}
      {tab === 'rural_triage' && (
        <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/70 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-xl font-bold text-white">Rural Triage & Outbreak Ledger</h2>
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
                className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-all"
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
