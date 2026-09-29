import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, ShieldAlert, Activity, MapPin, 
  Calendar, Layers, Filter, Search, PlusCircle, RefreshCw, Volume2 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  getMapRecords, detectClusters, computeDiseaseStats, 
  recordDiagnosisForMap, VILLAGES, riskColor, formatTimeAgo, subscribeToMap 
} from '../lib/diseaseMap';
import { CONDITION_META } from '../lib/fitzpatrick';

export default function DiseaseMap() {
  const { lang, t, speak } = useLanguage();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVillage, setSelectedVillage] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [hoveredVillage, setHoveredVillage] = useState(null);

  // New simulation entry modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [simVillage, setSimVillage] = useState('Bhandara');
  const [simCondition, setSimCondition] = useState('Scabies');

  // Load and subscribe to real-time ledger updates
  useEffect(() => {
    getMapRecords().then((recs) => {
      setRecords(recs);
      setLoading(false);
    });

    const unsubscribe = subscribeToMap((newRecs) => {
      setRecords([...newRecs]);
    });
    return unsubscribe;
  }, []);

  const clusters = detectClusters(records);
  const stats = computeDiseaseStats(records);

  // Filter records
  const filteredRecords = records.filter((r) => {
    const matchesVillage = selectedVillage === 'All' || r.village.toLowerCase() === selectedVillage.toLowerCase();
    const matchesCondition = selectedCondition === 'All' || r.condition.toLowerCase() === selectedCondition.toLowerCase();
    return matchesVillage && matchesCondition;
  });

  // Calculate coordinates projection for the SVG map
  // Maharashtra Central District bounds roughly: Lat: 20.6 - 21.6, Lon: 78.4 - 80.1
  const minLat = 20.6;
  const maxLat = 21.6;
  const minLon = 78.4;
  const maxLon = 80.1;

  const projectCoord = (lat, lon) => {
    const x = ((lon - minLon) / (maxLon - minLon)) * 600 + 40;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 360 + 40;
    return { x, y };
  };

  // Group records by village for map pins
  const villageGroups = new Map();
  for (const r of filteredRecords) {
    const arr = villageGroups.get(r.village) || [];
    arr.push(r);
    villageGroups.set(r.village, arr);
  }

  // Handle manual case simulation to test cluster triggering
  const handleSimulateCase = async () => {
    const meta = CONDITION_META[simCondition] || { risk: 'HIGH', fitzpatrick: 'V' };
    await recordDiagnosisForMap(
      {
        condition: simCondition,
        risk: meta.risk,
        fitzpatrick: 'V'
      },
      simVillage
    );
    setShowAddModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-red-500 animate-ping" /> Real-Time Surveillance
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-slate-300">
              Zero PII · Anonymized
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
            Epidemiological Disease Outbreak Map
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Community cluster surveillance across Central Maharashtra rural healthcare corridors
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-teal-400 text-slate-950 font-bold text-xs hover:bg-teal-300 transition"
        >
          <PlusCircle size={16} /> Log Diagnosis Case
        </button>
      </div>

      {/* ACTIVE CLUSTER OUTBREAK ALERT BANNER */}
      {clusters.length > 0 && (
        <div className="p-4 sm:p-5 mb-8 rounded-3xl bg-red-950/40 border-2 border-red-500/40 shadow-[0_0_35px_-5px_rgba(239,68,68,0.3)] backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="size-11 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
                <ShieldAlert size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-extrabold text-red-400 uppercase tracking-widest">
                    CLUSTER OUTBREAK DETECTED ({clusters.length} Active)
                  </span>
                  <span className="text-xs font-mono bg-red-500/30 text-red-200 px-2 py-0.5 rounded-full font-bold">
                    72h Threshold ≥ 3 Cases
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  Active {clusters[0].condition} Outbreak in {clusters[0].village} ({clusters[0].count} Cases)
                </h3>
                <p className="text-xs text-red-200/80 mt-1 max-w-2xl leading-relaxed">
                  High secondary household attack rate. Immediate contact tracing, permethrin / barrier prophylaxis distribution, and primary health centre notification recommended.
                </p>
              </div>
            </div>

            <button
              onClick={() => speak(`Active ${clusters[0].condition} outbreak detected in ${clusters[0].village}. ${clusters[0].count} cases identified in 72 hours. Notify district health officer.`, lang)}
              className="px-4 py-2 rounded-full bg-red-500 text-white font-bold text-xs hover:bg-red-400 transition flex items-center gap-1.5 shrink-0"
            >
              <Volume2 size={16} /> Audio Alert
            </button>
          </div>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Cases This Month
          </span>
          <span className="text-3xl font-extrabold text-white font-mono">
            {stats.totalThisMonth}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            Total records: {stats.totalRecords}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Active Outbreaks
          </span>
          <span className="text-3xl font-extrabold text-red-400 font-mono">
            {stats.activeClusters}
          </span>
          <span className="text-[11px] text-red-300/70 block mt-1">
            {stats.activeClusters > 0 ? 'Surveillance Alert Active' : 'Normal Baseline'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Top Condition
          </span>
          <span className="text-lg font-bold text-teal-300 truncate block">
            {stats.mostCommonCondition}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            Highest cumulative incidence
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Most Affected Village
          </span>
          <span className="text-lg font-bold text-amber-300 truncate block">
            {stats.mostAffectedVillage}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            Surveillance focus area
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-6 rounded-2xl bg-slate-900/60 border border-white/10">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Filter size={14} /> Filter Village:
          </div>
          <select
            value={selectedVillage}
            onChange={(e) => setSelectedVillage(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-semibold text-white outline-none"
          >
            <option value="All">All Rural Villages ({VILLAGES.length})</option>
            {VILLAGES.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 ml-2">
            Condition:
          </div>
          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-semibold text-white outline-none"
          >
            <option value="All">All Diagnosed Conditions</option>
            <option value="Scabies">Scabies</option>
            <option value="Eczema">Eczema</option>
            <option value="Dermatitis">Dermatitis</option>
            <option value="Tinea Ringworm">Tinea Ringworm</option>
            <option value="Vitiligo">Vitiligo</option>
            <option value="Melanoma">Melanoma</option>
          </select>
        </div>

        <span className="text-xs font-mono text-slate-400">
          Showing {filteredRecords.length} records
        </span>
      </div>

      {/* Interactive Outbreak Map View (SVG GIS Rendering) */}
      <div className="relative rounded-3xl bg-slate-950 border border-white/10 overflow-hidden shadow-2xl p-4 sm:p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-teal-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Wardha / Bhandara / Nagpur Healthcare Corridor Grid
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-red-400">
              <span className="size-2 rounded-full bg-red-500" /> High Risk / Outbreak
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="size-2 rounded-full bg-amber-500" /> Medium Risk
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-500" /> Low Risk
            </span>
          </div>
        </div>

        <div className="relative w-full aspect-[16/10] max-h-[460px] bg-slate-900/90 rounded-2xl overflow-hidden border border-white/5">
          <svg viewBox="0 0 680 440" className="w-full h-full">
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              </pattern>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Grid background */}
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Connecting corridor lines */}
            {VILLAGES.slice(0, 12).map((v, i) => {
              const p1 = projectCoord(v.lat, v.lon);
              const next = VILLAGES[(i + 1) % 12];
              const p2 = projectCoord(next.lat, next.lon);
              return (
                <line
                  key={i}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="rgba(20, 184, 166, 0.12)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Pulsing Outbreak Cluster Hotspots */}
            {clusters.map((c, idx) => {
              const pos = projectCoord(c.lat, c.lon);
              return (
                <g key={`cluster-${idx}`} className="cursor-pointer">
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="40"
                    fill="rgba(239, 68, 68, 0.2)"
                    className="animate-ping"
                    style={{ animationDuration: '2.5s' }}
                  />
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="24"
                    fill="rgba(239, 68, 68, 0.35)"
                  />
                </g>
              );
            })}

            {/* Village Markers */}
            {VILLAGES.map((v) => {
              const pos = projectCoord(v.lat, v.lon);
              const villageCases = villageGroups.get(v.name) || [];
              const hasCases = villageCases.length > 0;
              const isCluster = clusters.some((c) => c.village === v.name);

              return (
                <g
                  key={v.name}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onMouseEnter={() => setHoveredVillage({ ...v, cases: villageCases })}
                  onMouseLeave={() => setHoveredVillage(null)}
                  className="cursor-pointer"
                >
                  {/* Pin Circle */}
                  <circle
                    r={isCluster ? 10 : hasCases ? 7 : 4}
                    fill={isCluster ? '#EF4444' : hasCases ? '#14B8A6' : 'rgba(255,255,255,0.2)'}
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth="1.5"
                    filter={isCluster ? 'url(#glow)' : undefined}
                  />

                  {/* Case count badge */}
                  {hasCases && (
                    <text
                      y="-12"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {v.name} ({villageCases.length})
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Floating Hover Card */}
          {hoveredVillage && (
            <div className="absolute top-4 left-4 p-3 rounded-2xl bg-slate-900/95 border border-white/20 shadow-2xl backdrop-blur-md max-w-xs z-10 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white text-sm">
                  {hoveredVillage.name}
                </span>
                <span className="text-[10px] text-teal-300 font-mono">
                  {hoveredVillage.district} District
                </span>
              </div>
              <div className="text-slate-400 mt-1">
                Total cases logged: <strong>{hoveredVillage.cases.length}</strong>
              </div>
              {hoveredVillage.cases.length > 0 && (
                <div className="mt-2 pt-2 border-t border-white/10 flex flex-wrap gap-1">
                  {hoveredVillage.cases.slice(0, 3).map((c, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-bold"
                      style={{ backgroundColor: `${riskColor(c.risk)}22`, color: riskColor(c.risk) }}
                    >
                      {c.condition}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recent Surveillance Feed */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Activity size={18} className="text-teal-400" />
          Recent Diagnostic Submissions (Real-Time Ledger)
        </h3>

        <div className="space-y-3">
          {filteredRecords.slice(0, 8).map((r) => (
            <div
              key={r.id}
              className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span
                  className="size-3 rounded-full shrink-0"
                  style={{ backgroundColor: riskColor(r.risk) }}
                />
                <div>
                  <span className="font-bold text-sm text-white">
                    {r.condition}
                  </span>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Village: <strong>{r.village}</strong> · Fitzpatrick Type {r.fitzpatrick}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                <span
                  className={`px-2 py-0.5 rounded font-bold uppercase ${
                    r.risk === 'HIGH'
                      ? 'bg-red-500/20 text-red-300'
                      : r.risk === 'MEDIUM'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {r.risk} RISK
                </span>
                <span>{formatTimeAgo(r.date)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Simulation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="p-6 rounded-3xl bg-slate-900 border border-white/15 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold mb-2">Simulate New Field Diagnosis</h3>
            <p className="text-xs text-slate-400 mb-6">
              Add a diagnosis to test real-time cluster detection in rural villages.
            </p>

            <div className="space-y-4 mb-6 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Village
                </label>
                <select
                  value={simVillage}
                  onChange={(e) => setSimVillage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white"
                >
                  {VILLAGES.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Condition
                </label>
                <select
                  value={simCondition}
                  onChange={(e) => setSimCondition(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white"
                >
                  <option value="Scabies">Scabies (High Contagion)</option>
                  <option value="Eczema">Eczema</option>
                  <option value="Dermatitis">Dermatitis</option>
                  <option value="Tinea Ringworm">Tinea Ringworm</option>
                  <option value="Vitiligo">Vitiligo</option>
                  <option value="Melanoma">Melanoma</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSimulateCase}
                className="px-5 py-2 rounded-full bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold"
              >
                Submit Case
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
