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
        color: '#047857',
        bgColor: '#ecfdf5',
        borderColor: '#a7f3d0',
        title: 'Tier 1: Routine Care',
        message: 'Condition can likely be managed with OTC and self-care tips.'
      };
      break;
    case 'moderate':
    case 'MEDIUM':
      config = {
        color: '#b45309',
        bgColor: '#fffbeb',
        borderColor: '#fde68a',
        title: 'Tier 2: Monitor',
        message: 'We recommend weekly monitoring and a dedicated care plan.'
      };
      break;
    case 'severe':
      config = {
        color: '#b91c1c',
        bgColor: '#fef2f2',
        borderColor: '#fecaca',
        title: 'Tier 3: Consult Required',
        message: 'Please visit a specialist for a professional opinion.'
      };
      break;
    case 'urgent':
    case 'HIGH':
      config = {
        color: '#7f1d1d',
        bgColor: '#fef2f2',
        borderColor: '#fca5a5',
        title: 'Tier 4: Immediate Action',
        message: 'Possible serious condition. Immediate professional care is highly recommended.'
      };
      break;
    default:
      config = {
        color: '#047857',
        bgColor: '#ecfdf5',
        borderColor: '#a7f3d0',
        title: 'Tier 1: Routine Care',
        message: 'Condition can likely be managed with OTC routines.'
      };
      break;
  }

  const isSevere = severity === 'severe' || severity === 'urgent' || severity === 'HIGH';

  return (
    <>
      <div style={{
        padding: '1rem',
        backgroundColor: config.bgColor,
        border: `1px solid ${config.borderColor}`,
        borderRadius: '0.5rem',
        color: config.color,
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        marginTop: '1rem'
      }}>
        <AlertTriangle size={24} style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <h4 style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '0.25rem' }}>{config.title}</h4>
          <p style={{ fontSize: '0.875rem', marginBottom: isSevere ? '0.75rem' : '0' }}>{config.message}</p>
          
          {isSevere && (
            <button 
              onClick={() => setShowClinics(true)}
              style={{
                backgroundColor: config.color,
                color: 'white',
                border: 'none',
                padding: '0.4rem 0.75rem',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <MapPin size={14} /> Find Nearest Clinic / PHC
            </button>
          )}
        </div>
      </div>

      {showClinics && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 50,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
        }}>
          <div style={{ backgroundColor: '#0F172A', color: '#F8FAFC', padding: '1.25rem', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem', maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontWeight: '700', fontSize: '1.125rem' }}>Nearby Primary Health Centres (NHA HFR)</h3>
              <button onClick={() => setShowClinics(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.75rem', color: '#FBBF24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <strong>NHA Health Facility Registry:</strong> Offline geocoded facilities with direct medical officer contact and ambulance helplines (108).
            </div>

            <div className="flex flex-col gap-3">
              {PHC_DIRECTORY.slice(0, 4).map((phc, idx) => (
                <div key={idx} style={{ padding: '0.85rem', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 style={{ fontWeight: '700', fontSize: '0.95rem', color: '#F1F5F9' }}>{phc.name}</h4>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#38BDF8' }}>~{phc.distanceKm} km</span>
                  </div>
                  <div className="flex flex-col gap-1 text-xs" style={{ color: '#94A3B8' }}>
                    <span>{phc.code} · {phc.district}</span>
                    <span>MO: {phc.medicalOfficer}</span>
                    <span style={{ color: '#4ADE80', fontWeight: '600' }}>Helpline: {phc.contact}</span>
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
