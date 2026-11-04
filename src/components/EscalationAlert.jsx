import { useState } from 'react';
import { AlertTriangle, MapPin, X } from 'lucide-react';
import { PHC_DIRECTORY } from '../lib/phc';

const EscalationAlert = ({ severity, condition = '' }) => {
  const [showClinics, setShowClinics] = useState(false);

  let config = {
    color: 'var(--text-main)',
    bgColor: 'var(--surface)',
    borderColor: 'var(--border)',
    title: 'Unknown Status',
    message: ''
  };

  switch (severity) {
    case 'mild':
    case 'LOW':
      config = {
        color: '#34d399',
        bgColor: 'rgba(16, 185, 129, 0.08)',
        borderColor: 'rgba(16, 185, 129, 0.25)',
        title: 'Tier 1: Routine Care',
        message: 'Condition can likely be managed with OTC and self-care tips.'
      };
      break;
    case 'moderate':
    case 'MEDIUM':
      config = {
        color: '#fbbf24',
        bgColor: 'rgba(245, 158, 11, 0.08)',
        borderColor: 'rgba(245, 158, 11, 0.25)',
        title: 'Tier 2: Monitor',
        message: 'We recommend weekly monitoring and a dedicated care plan.'
      };
      break;
    case 'severe':
      config = {
        color: '#f87171',
        bgColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'rgba(239, 68, 68, 0.35)',
        title: 'Tier 3: Consult Required',
        message: 'Please visit a specialist for a professional opinion.'
      };
      break;
    case 'urgent':
    case 'HIGH':
      config = {
        color: '#f43f5e',
        bgColor: 'rgba(244, 63, 94, 0.12)',
        borderColor: 'rgba(244, 63, 94, 0.45)',
        title: 'Tier 4: Immediate Action',
        message: 'Possible serious condition. Immediate professional care is highly recommended.'
      };
      break;
    default:
      config = {
        color: '#34d399',
        bgColor: 'rgba(16, 185, 129, 0.08)',
        borderColor: 'rgba(16, 185, 129, 0.25)',
        title: 'Tier 1: Routine Care',
        message: 'Condition can likely be managed with OTC and self-care tips.'
      };
      break;
  }

  const isSevere = severity === 'severe' || severity === 'urgent' || severity === 'HIGH';

  return (
    <>
      <div 
        className="p-4 rounded-xl border backdrop-blur-md flex items-start gap-3 mt-3 shadow-lg"
        style={{
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
          color: config.color,
        }}
      >
        <AlertTriangle size={22} className="shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm sm:text-base mb-1">{config.title}</h4>
          {condition && (
            <div className="text-xs font-semibold opacity-90 mb-1 text-slate-300">
              Condition: <span className="text-white font-medium">{condition}</span>
            </div>
          )}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2">{config.message}</p>
          
          {isSevere && (
            <button 
              onClick={() => setShowClinics(true)}
              className="mt-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              style={{ backgroundColor: config.color }}
            >
              <MapPin size={13} /> Find Nearest Clinic / PHC
            </button>
          )}
        </div>
      </div>

      {showClinics && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col justify-end sm:justify-center sm:items-center sm:p-4 animate-in fade-in duration-200">
          <div className="w-full sm:max-w-lg bg-[#0c121e] border border-white/10 text-slate-100 p-5 rounded-t-2xl sm:rounded-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base sm:text-lg text-white">Nearby Primary Health Centres (NHA HFR)</h3>
              <button 
                onClick={() => setShowClinics(false)} 
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-3 bg-amber-500/10 rounded-xl mb-4 text-xs text-amber-300 border border-amber-500/25">
              <strong className="text-amber-200">NHA Health Facility Registry:</strong> Offline geocoded facilities with direct medical officer contact and ambulance helplines (108).
            </div>

            <div className="flex flex-col gap-2.5">
              {PHC_DIRECTORY.slice(0, 4).map((phc, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition">
                  <div className="flex justify-between items-start mb-1.5">
                    <h4 className="font-bold text-sm text-white">{phc.name}</h4>
                    <span className="text-xs font-semibold text-teal-300 px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20">
                      ~{phc.distanceKm} km
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-xs text-slate-400">
                    <span>{phc.code} · {phc.district}</span>
                    <span>MO: <span className="text-slate-300 font-medium">{phc.medicalOfficer}</span></span>
                    <span className="text-emerald-400 font-semibold">Helpline: {phc.contact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EscalationAlert;
