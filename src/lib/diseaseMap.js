/**
 * Disease Outbreak Map — Anonymized Surveillance Ledger + Real-Time Cluster Detection.
 *
 * Records ONLY: condition, village (+ lat/lon), date, Fitzpatrick type, risk.
 * NEVER patient name, age, sex, weight, or any other PII.
 *
 * Employs a 72-hour sliding window with threshold >= 3 cases to detect contagious
 * disease cluster outbreaks (e.g. Scabies / Tinea epidemics in rural blocks).
 */

export const VILLAGES = [
  { name: 'Bhandara', lat: 21.1667, lon: 79.65, district: 'Bhandara' },
  { name: 'Wardha', lat: 20.7453, lon: 78.6022, district: 'Wardha' },
  { name: 'Tumsar', lat: 21.3833, lon: 79.7333, district: 'Bhandara' },
  { name: 'Pauni', lat: 20.7833, lon: 79.6333, district: 'Bhandara' },
  { name: 'Lakhandur', lat: 21.25, lon: 79.9, district: 'Bhandara' },
  { name: 'Mohadi', lat: 21.1167, lon: 79.9333, district: 'Bhandara' },
  { name: 'Nagpur', lat: 21.1458, lon: 79.0882, district: 'Nagpur' },
  { name: 'Kamptee', lat: 21.2167, lon: 79.1833, district: 'Nagpur' },
  { name: 'Hingna', lat: 21.05, lon: 78.95, district: 'Nagpur' },
  { name: 'Katol', lat: 21.2667, lon: 78.5833, district: 'Nagpur' },
  { name: 'Narkhed', lat: 21.45, lon: 78.5833, district: 'Nagpur' },
  { name: 'Savner', lat: 21.35, lon: 79.05, district: 'Nagpur' },
  { name: 'Ramtek', lat: 21.3833, lon: 79.3167, district: 'Nagpur' },
  { name: 'Parseoni', lat: 21.3167, lon: 79.2, district: 'Nagpur' },
  { name: 'Mouda', lat: 21.25, lon: 79.2833, district: 'Nagpur' },
  { name: 'Kalmeshwar', lat: 21.2167, lon: 78.9333, district: 'Nagpur' },
  { name: 'Kuhi', lat: 21.0667, lon: 79.2667, district: 'Nagpur' },
  { name: 'Butibori', lat: 21.0167, lon: 79.0, district: 'Nagpur' },
  { name: 'Umred', lat: 20.85, lon: 79.3167, district: 'Nagpur' },
  { name: 'Bhiwapur', lat: 20.95, lon: 79.5, district: 'Nagpur' },
];

const VILLAGE_INDEX = VILLAGES.reduce((acc, v) => {
  acc[v.name.toLowerCase()] = v;
  return acc;
}, {});

export function lookupVillage(name) {
  if (!name) return null;
  return VILLAGE_INDEX[name.trim().toLowerCase()] || null;
}

const STORAGE_KEY = 'luma_disease_map_records_v1';
const SEED_FLAG_KEY = 'luma_disease_map_seeded_v1';
const CLUSTER_WINDOW_HOURS = 72;
const CLUSTER_THRESHOLD = 3;

const listeners = new Set();

export function subscribeToMap(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify(records) {
  for (const fn of listeners) {
    try {
      fn(records);
    } catch (e) {
      console.error(e);
    }
  }
}

let CACHE = null;

export function getMapRecordsSync() {
  if (CACHE) return CACHE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    CACHE = raw ? JSON.parse(raw) : [];
  } catch {
    CACHE = [];
  }
  return CACHE;
}

export async function getMapRecords() {
  await seedIfEmpty();
  return getMapRecordsSync();
}

export async function persistMapRecords(records) {
  CACHE = records;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {}
  notify(records);
}

function genId() {
  return `dx_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Append a single anonymized diagnosis record for epidemiology.
 * Resolves the village's lat/lon via lookup table, falling back to Nagpur centroid.
 */
export async function recordDiagnosisForMap(diagnosis, villageName) {
  const v = lookupVillage(villageName) || lookupVillage('Nagpur') || VILLAGES[0];
  const rec = {
    id: genId(),
    condition: diagnosis.condition,
    village: v.name,
    date: new Date().toISOString(),
    fitzpatrick: diagnosis.fitzpatrick || 'V',
    risk: diagnosis.risk || 'MEDIUM',
    lat: v.lat,
    lon: v.lon,
  };
  const all = getMapRecordsSync();
  const next = [rec, ...all];
  await persistMapRecords(next);
  return rec;
}

/** Detect active disease outbreaks */
export function detectClusters(records = []) {
  const now = Date.now();
  const cutoff = now - CLUSTER_WINDOW_HOURS * 60 * 60 * 1000;
  const buckets = new Map();

  for (const r of records) {
    const t = Date.parse(r.date);
    if (Number.isNaN(t) || t < cutoff) continue;
    const key = `${r.village}|||${r.condition}`;
    const arr = buckets.get(key) || [];
    arr.push(r);
    buckets.set(key, arr);
  }

  const out = [];
  for (const [key, arr] of buckets) {
    if (arr.length < CLUSTER_THRESHOLD) continue;
    const [village, condition] = key.split('|||');
    const v = lookupVillage(village);
    if (!v) continue;
    out.push({
      village,
      condition,
      count: arr.length,
      lat: v.lat,
      lon: v.lon,
      windowHours: CLUSTER_WINDOW_HOURS,
      recentCases: arr
    });
  }

  // Sort largest outbreak first
  out.sort((a, b) => b.count - a.count);
  return out;
}

/** Calculate summary epidemiological stats */
export function computeDiseaseStats(records = []) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const thisMonth = records.filter((r) => Date.parse(r.date) >= monthStart);

  const conditionCounts = new Map();
  const villageCounts = new Map();
  for (const r of records) {
    conditionCounts.set(r.condition, (conditionCounts.get(r.condition) || 0) + 1);
    villageCounts.set(r.village, (villageCounts.get(r.village) || 0) + 1);
  }

  const topKey = (m) => {
    let best = null;
    let bestN = 0;
    for (const [k, v] of m) {
      if (v > bestN) {
        bestN = v;
        best = k;
      }
    }
    return best;
  };

  return {
    totalThisMonth: thisMonth.length,
    totalRecords: records.length,
    activeClusters: detectClusters(records).length,
    mostCommonCondition: topKey(conditionCounts) || 'None Recorded',
    mostAffectedVillage: topKey(villageCounts) || 'None Recorded',
  };
}

export function riskColor(r) {
  if (r === 'HIGH' || r === 'urgent' || r === 'severe') return '#EF4444'; // Red
  if (r === 'MEDIUM' || r === 'moderate') return '#F59E0B'; // Amber
  return '#10B981'; // Green
}

/** Seed demo data including a live Scabies outbreak cluster in Bhandara */
function buildSeedRecords() {
  const out = [];
  const now = Date.now();

  // 3 Scabies cases in Bhandara inside 48h -> triggers active cluster alarm
  const bhandara = lookupVillage('Bhandara') || VILLAGES[0];
  const scabiesHours = [4, 16, 38];
  for (const h of scabiesHours) {
    out.push({
      id: genId(),
      condition: 'Scabies',
      village: bhandara.name,
      date: new Date(now - h * 3600 * 1000).toISOString(),
      fitzpatrick: 'V',
      risk: 'HIGH',
      lat: bhandara.lat,
      lon: bhandara.lon,
    });
  }

  // 15 scattered records across neighboring rural villages
  const scatterVillages = VILLAGES.filter((v) => v.name !== 'Bhandara');
  const conditions = [
    { c: 'Eczema', r: 'MEDIUM' },
    { c: 'Tinea Ringworm', r: 'LOW' },
    { c: 'Vitiligo', r: 'MEDIUM' },
    { c: 'Dermatitis', r: 'MEDIUM' },
    { c: 'Scabies', r: 'HIGH' },
    { c: 'Tinea Ringworm', r: 'LOW' },
  ];
  const fitzTypes = ['IV', 'V', 'V', 'VI', 'VI'];

  for (let i = 0; i < 15; i++) {
    const v = scatterVillages[i % scatterVillages.length];
    const cond = conditions[i % conditions.length];
    const ageDays = 1 + (i * 2);
    out.push({
      id: genId(),
      condition: cond.c,
      village: v.name,
      date: new Date(now - ageDays * 86400 * 1000).toISOString(),
      fitzpatrick: fitzTypes[i % fitzTypes.length],
      risk: cond.r,
      lat: v.lat,
      lon: v.lon,
    });
  }

  return out;
}

export async function seedIfEmpty() {
  try {
    const flagged = localStorage.getItem(SEED_FLAG_KEY);
    if (flagged) return;
    const existing = getMapRecordsSync();
    if (existing.length > 0) {
      localStorage.setItem(SEED_FLAG_KEY, '1');
      return;
    }
    await persistMapRecords(buildSeedRecords());
    localStorage.setItem(SEED_FLAG_KEY, '1');
  } catch {}
}

export function formatTimeAgo(isoString) {
  const t = Date.parse(isoString);
  if (Number.isNaN(t)) return isoString;
  const diff = Date.now() - t;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}
