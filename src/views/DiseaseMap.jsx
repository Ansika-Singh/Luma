import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Layers, Filter, PlusCircle, Volume2,
  MapPin, X
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  getMapRecords, detectClusters, computeDiseaseStats, 
  recordDiagnosisForMap, VILLAGES, formatTimeAgo, subscribeToMap 
} from '../lib/diseaseMap';
import { CONDITION_META } from '../lib/fitzpatrick';

export default function DiseaseMap() {
  const { lang, speak } = useLanguage();
  const isHi = lang === 'hi';
  const [records, setRecords] = useState([]);
  const [, setLoading] = useState(true);
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
    <div className="w-full space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-widest uppercase bg-red-500/15 text-red-300 border border-red-500/30">
                <span className="size-2 rounded-full bg-red-500 animate-ping" /> {isHi ? 'रियल-टाइम निगरानी' : 'Real-Time Surveillance'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/5 text-slate-300 border border-white/10">
                {isHi ? 'शून्य पीआईआई · सुरक्षित टेलीमेट्री' : 'Zero PII · Anonymized Telemetry'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/5 text-slate-300 border border-white/10">
                {isHi ? '72 घंटे क्लस्टर विंडो' : '72h Cluster Window'}
              </span>
            </div>

            <h1 className="text-[clamp(1.5rem,4vw,2.5rem)] font-black tracking-tight text-white leading-tight">
              {isHi ? 'महामारी विज्ञान ' : 'Epidemiological '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-400 to-teal-400">
                {isHi ? 'प्रकोप मानचित्र' : 'Outbreak Map'}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              {isHi 
                ? 'मध्य महाराष्ट्र ग्रामीण स्वास्थ्य गलियारों (वर्धा, भंडारा, नागपुर) में सामुदायिक संक्रामक क्लस्टर निगरानी।'
                : 'Community cluster surveillance across Central Maharashtra rural healthcare corridors (Wardha, Bhandara, Nagpur).'}
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto min-h-[44px] glow-teal-btn px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold shadow-lg shrink-0 self-start md:self-center"
          >
            <PlusCircle size={16} />
            <span>{isHi ? 'सिमुलेशन केस जोड़ें' : 'Simulate Diagnosis Case'}</span>
          </button>
        </div>
      </div>

      {/* 2. Active Cluster Alert Banner */}
      {clusters.length > 0 && (
        <div className="p-6 rounded-3xl bg-red-950/40 border-2 border-red-500/40 shadow-[0_0_35px_-5px_rgba(239,68,68,0.3)] backdrop-blur-xl animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                <ShieldAlert size={26} />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-black text-red-400 uppercase tracking-widest">
                    {isHi ? `सक्रिय क्लस्टर प्रकोप (${clusters.length} सक्रिय)` : `CLUSTER OUTBREAK DETECTED (${clusters.length} Active)`}
                  </span>
                  <span className="text-[11px] font-mono bg-red-500/20 text-red-200 px-2.5 py-0.5 rounded-full border border-red-500/30 font-bold">
                    {isHi ? '72 घंटे में ≥ 3 मामले' : '72h Threshold ≥ 3 Cases'}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {isHi 
                    ? `${clusters[0].village} में ${clusters[0].condition} का प्रकोप (${clusters[0].count} मामले)`
                    : `Active ${clusters[0].condition} Outbreak in ${clusters[0].village} (${clusters[0].count} Cases)`}
                </h3>
                <p className="text-xs text-red-200/80 max-w-2xl leading-relaxed">
                  {isHi
                    ? 'उच्च माध्यमिक पारिवारिक प्रसार दर। तत्काल संपर्क ट्रेसिंग, कीटाणुशोधन और प्राथमिक स्वास्थ्य केंद्र अधिसूचना अनुशंसित।'
                    : 'High secondary household attack rate. Immediate contact tracing, barrier prophylaxis distribution, and primary health centre notification recommended.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => speak(`Active ${clusters[0].condition} outbreak detected in ${clusters[0].village}. ${clusters[0].count} cases identified in 72 hours. Notify district health officer.`, lang)}
              className="w-full md:w-auto min-h-[44px] px-5 py-2.5 rounded-2xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs transition flex items-center justify-center gap-2 shrink-0 shadow-lg"
            >
              <Volume2 size={16} /> {isHi ? 'आवाज़ चेतावनी' : 'Audio Alert'}
            </button>
          </div>
        </div>
      )}

      {/* 3. KPI Telemetry Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl space-y-1 shadow-lg">
          <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            {isHi ? 'इस माह के कुल मामले' : 'Cases This Month'}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {stats.totalThisMonth}
          </div>
          <div className="text-[11px] text-slate-500">
            {isHi ? 'कुल रिकॉर्ड्स:' : 'Total records:'} {stats.totalRecords}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl space-y-1 shadow-lg">
          <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            {isHi ? 'सक्रिय प्रकोप' : 'Active Outbreaks'}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-400 font-mono">
            {stats.activeClusters}
          </div>
          <div className="text-[11px] text-red-300/80">
            {stats.activeClusters > 0 ? (isHi ? 'चेतावनी सक्रिय' : 'Surveillance Alert Active') : (isHi ? 'सामान्य स्तर' : 'Normal Baseline')}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl space-y-1 shadow-lg">
          <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            {isHi ? 'प्रमुख बीमारी' : 'Top Condition'}
          </div>
          <div className="text-base sm:text-lg font-bold text-teal-300 truncate">
            {stats.mostCommonCondition}
          </div>
          <div className="text-[11px] text-slate-500">
            {isHi ? 'सर्वाधिक घटना' : 'Highest cumulative incidence'}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl space-y-1 shadow-lg">
          <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            {isHi ? 'सर्वाधिक प्रभावित गाँव' : 'Most Affected Village'}
          </div>
          <div className="text-base sm:text-lg font-bold text-amber-300 truncate">
            {stats.mostAffectedVillage}
          </div>
          <div className="text-[11px] text-slate-500">
            {isHi ? 'निगरानी केंद्र' : 'Surveillance focus area'}
          </div>
        </div>
      </div>

      {/* 4. Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 shrink-0">
            <Filter size={14} className="text-teal-400" /> Filter:
          </div>

          <select
            value={selectedVillage}
            onChange={(e) => setSelectedVillage(e.target.value)}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-950 border border-white/15 text-xs font-semibold text-white outline-none focus:border-teal-400 cursor-pointer"
          >
            <option value="All">All Rural Villages ({VILLAGES.length})</option>
            {VILLAGES.map((v) => (
              <option key={v.name} value={v.name} className="bg-slate-900">
                {v.name}
              </option>
            ))}
          </select>

          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-950 border border-white/15 text-xs font-semibold text-white outline-none focus:border-teal-400 cursor-pointer"
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

        <span className="text-xs font-mono text-slate-400 self-end sm:self-center">
          Showing {filteredRecords.length} records
        </span>
      </div>

      {/* 5. Interactive Outbreak Map View (SVG GIS Rendering) */}
      <div className="relative rounded-3xl bg-slate-950/80 border border-white/10 overflow-hidden shadow-2xl p-4 sm:p-6 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-teal-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Wardha / Bhandara / Nagpur Healthcare Corridor Grid
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-red-400 font-semibold">
              <span className="size-2 rounded-full bg-red-500 animate-pulse" /> High Risk
            </span>
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <span className="size-2 rounded-full bg-amber-500" /> Medium Risk
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="size-2 rounded-full bg-emerald-500" /> Low Risk
            </span>
          </div>
        </div>

        <div className="relative w-full aspect-[16/10] min-h-[300px] max-h-[500px] bg-slate-900/90 rounded-2xl overflow-hidden border border-white/5">
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
                  stroke="rgba(20, 184, 166, 0.15)"
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
                  <circle
                    r={isCluster ? 10 : hasCases ? 7 : 4}
                    fill={isCluster ? '#EF4444' : hasCases ? '#14B8A6' : 'rgba(255,255,255,0.2)'}
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth="1.5"
                    filter={isCluster ? 'url(#glow)' : undefined}
                  />

                  {hasCases && (
                    <text
                      y="-12"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="bold"
                      className="font-mono"
                    >
                      {v.name} ({villageCases.length})
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Hover Tooltip */}
          {hoveredVillage && (
            <div className="absolute top-4 left-4 p-4 rounded-2xl bg-slate-950/95 border border-white/20 backdrop-blur-xl shadow-2xl space-y-1.5 text-xs max-w-xs animate-in fade-in duration-150">
              <div className="font-bold text-white text-sm flex items-center justify-between">
                <span>{hoveredVillage.name}</span>
                <span className="text-[10px] font-mono text-teal-300">
                  {hoveredVillage.district}
                </span>
              </div>
              <div className="text-slate-400 text-[11px]">
                Cases Recorded: {hoveredVillage.cases.length}
              </div>
              {hoveredVillage.cases.length > 0 && (
                <div className="pt-1 space-y-1">
                  {hoveredVillage.cases.slice(0, 3).map((c, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[10px] font-mono text-slate-300">
                      <span>{c.condition}</span>
                      <span className={c.risk === 'HIGH' ? 'text-red-400' : 'text-teal-300'}>
                        {c.risk}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 6. Recent Outbreak Ledger Grid */}
      <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/70 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="space-y-0.5">
            <h3 className="text-lg font-bold text-white">
              Recent Anonymized Outbreak Ledger
            </h3>
            <p className="text-xs text-slate-400">
              Zero PII logged · Timestamp, location coordinates, condition & Fitzpatrick phototype only
            </p>
          </div>
          <span className="text-xs font-mono text-teal-300 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
            Live Stream
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredRecords.slice(0, 9).map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/15 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white truncate">
                  {r.condition}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold"
                  style={{
                    backgroundColor: r.risk === 'HIGH' ? 'rgba(239,68,68,0.2)' : 'rgba(45,212,191,0.2)',
                    color: r.risk === 'HIGH' ? '#F87171' : '#2DD4BF'
                  }}
                >
                  {r.risk}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-teal-400" />
                  <span>{r.village}</span>
                </span>
                <span>{formatTimeAgo(r.date)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Simulation Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-white/20 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                Log Diagnostic Telemetry
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="size-8 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Target Village</label>
                <select
                  value={simVillage}
                  onChange={(e) => setSimVillage(e.target.value)}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-black border border-white/15 text-white text-base font-semibold"
                >
                  {VILLAGES.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name} ({v.district})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Diagnosed Condition</label>
                <select
                  value={simCondition}
                  onChange={(e) => setSimCondition(e.target.value)}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-black border border-white/15 text-white text-base font-semibold"
                >
                  <option value="Scabies">Scabies (Contagious Parasitic)</option>
                  <option value="Tinea Ringworm">Tinea Ringworm (Fungal)</option>
                  <option value="Eczema">Eczema (Atopic Dermatitis)</option>
                  <option value="Dermatitis">Contact Dermatitis</option>
                  <option value="Melanoma">Melanoma (Malignancy Alert)</option>
                  <option value="Basal Cell Carcinoma">Basal Cell Carcinoma</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 min-h-[44px] py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSimulateCase}
                className="flex-1 min-h-[44px] glow-teal-btn py-3 rounded-2xl text-xs font-bold shadow-lg"
              >
                Submit Incident
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
