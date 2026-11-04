/**
 * National Health Authority (NHA) Health Facility Registry (HFR)
 * Mappings for rural districts across Maharashtra and Central India.
 */

export const PHC_DIRECTORY = [
  {
    name: 'PHC Wardha Rural',
    code: 'HFR-MH-44213',
    district: 'Wardha, Maharashtra',
    facilityType: '24x7 Primary Health Centre',
    contact: '+91 93725 41123',
    emergencyHelpline: '108 / 102',
    medicalOfficer: 'Dr. P. Deshmukh, MBBS (Community Medicine)',
    villagesCovered: ['Wardha', 'Selu', 'Deoli', 'Hinganghat', 'Arvi'],
    distanceKm: 4.2
  },
  {
    name: 'PHC Bhandara Central',
    code: 'HFR-MH-44190',
    district: 'Bhandara, Maharashtra',
    facilityType: 'Sub-District Referral PHC',
    contact: '+91 94231 88920',
    emergencyHelpline: '108',
    medicalOfficer: 'Dr. S. Meshram, MD (Dermatology Consultant)',
    villagesCovered: ['Bhandara', 'Tumsar', 'Mohadi', 'Pauni', 'Lakhandur'],
    distanceKm: 3.8
  },
  {
    name: 'PHC Karjat Block',
    code: 'HFR-MH-31022',
    district: 'Karjat / Raigad, Maharashtra',
    facilityType: 'Tribal Sub-Centre PHC',
    contact: '+91 80552 18829',
    emergencyHelpline: '108',
    medicalOfficer: 'Dr. A. Kadam, MBBS',
    villagesCovered: ['Karjat', 'Neral', 'Kashele'],
    distanceKm: 6.5
  },
  {
    name: 'PHC Nagpur Rural Block',
    code: 'HFR-MH-44001',
    district: 'Nagpur Rural, Maharashtra',
    facilityType: 'Community Health Centre (CHC)',
    contact: '+91 98224 55190',
    emergencyHelpline: '108',
    medicalOfficer: 'Dr. V. Joshi, MD (Internal Medicine)',
    villagesCovered: ['Nagpur', 'Kamptee', 'Hingna', 'Katol', 'Kalmeshwar', 'Butibori'],
    distanceKm: 5.1
  },
  {
    name: 'PHC Ramtek Valley',
    code: 'HFR-MH-44110',
    district: 'Ramtek, Maharashtra',
    facilityType: 'Primary Health Centre',
    contact: '+91 97632 10984',
    emergencyHelpline: '108',
    medicalOfficer: 'Dr. M. Bawane, MBBS',
    villagesCovered: ['Ramtek', 'Parseoni', 'Mouda', 'Savner'],
    distanceKm: 7.0
  },
  {
    name: 'PHC Umred South',
    code: 'HFR-MH-44120',
    district: 'Umred / Kuhi, Maharashtra',
    facilityType: 'Primary Health Centre',
    contact: '+91 94228 77112',
    emergencyHelpline: '108',
    medicalOfficer: 'Dr. R. Thakre, MBBS',
    villagesCovered: ['Umred', 'Kuhi', 'Bhiwapur'],
    distanceKm: 4.8
  },
  {
    name: 'PHC Bhilwara South',
    code: 'HFR-RJ-11456',
    district: 'Bhilwara, Rajasthan',
    facilityType: 'Primary Health Centre',
    contact: '+91 70124 90087',
    emergencyHelpline: '108',
    medicalOfficer: 'Dr. K. Sharma, MBBS',
    villagesCovered: ['Bhilwara', 'Mandal', 'Asind'],
    distanceKm: 8.2
  },
  {
    name: 'PHC Salem Rural',
    code: 'HFR-TN-66291',
    district: 'Salem, Tamil Nadu',
    facilityType: 'Government Primary Health Centre',
    contact: '+91 84112 00451',
    emergencyHelpline: '108',
    medicalOfficer: 'Dr. R. Ramanathan, MD',
    villagesCovered: ['Salem', 'Omalur', 'Mettur'],
    distanceKm: 5.4
  }
];

export function findNearestPHC(villageName = '') {
  if (!villageName) return PHC_DIRECTORY[0];
  const query = villageName.trim().toLowerCase();

  // 1. Direct coverage match
  const directMatch = PHC_DIRECTORY.find((phc) =>
    phc.villagesCovered.some((v) => v.toLowerCase() === query)
  );
  if (directMatch) return directMatch;

  // 2. Partial match
  const partialMatch = PHC_DIRECTORY.find((phc) =>
    phc.district.toLowerCase().includes(query) ||
    phc.name.toLowerCase().includes(query)
  );
  if (partialMatch) return partialMatch;

  // 3. Deterministic hash fallback
  let hash = 0;
  for (let i = 0; i < villageName.length; i++) {
    hash = (hash * 31 + villageName.charCodeAt(i)) >>> 0;
  }
  return PHC_DIRECTORY[hash % PHC_DIRECTORY.length];
}
