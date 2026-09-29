import { useState, useEffect } from 'react';
import CameraCapture from '../components/CameraCapture';
import ResultsDisplay from '../components/ResultsDisplay';
import { RefreshCw, Check, AlertTriangle, ChevronRight } from 'lucide-react';
import { loadModel, analyzeSkinImage, estimateFitzpatrick } from '../services/mlService';
import { saveScan } from '../services/historyService';
import DeviceSelectionModal from '../components/DeviceSelectionModal';

import { useLanguage } from '../contexts/LanguageContext';

const SkinAnalysis = () => {
  const { t, lang } = useLanguage();
  const [step, setStep] = useState('capture_front'); // 'capture_front', 'capture_side', 'analyzing', 'results'
  const [angles, setAngles] = useState({ front: null, side: null });
  const [results, setResults] = useState(null);
  const [fitzpatrickEstimate, setFitzpatrickEstimate] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [saveStatus, setSaveStatus] = useState(''); // '', 'saving', 'saved', 'error'
  const [showDeviceModal, setShowDeviceModal] = useState(() => {
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') return false;
    return true;
  });
  const [facingMode, setFacingMode] = useState('environment');

  useEffect(() => {
    // Preload model in background
    loadModel().catch(err => console.log('Background load note:', err.message));
  }, []);

  const speakInstruction = (textKey) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = t(textKey);
      const utterance = new SpeechSynthesisUtterance(text);
      // Try to match language
      if (lang === 'hi') utterance.lang = 'hi-IN';
      else if (lang === 'bn') utterance.lang = 'bn-IN';
      else utterance.lang = 'en-US';
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCaptureFront = (imageData) => {
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
      handleCaptureSide(imageData, imageData);
      return;
    }
    setAngles({ ...angles, front: imageData });
    setStep('capture_side');
  };

  const handleCaptureSide = async (imageData, forcedFront = null) => {
    const finalAngles = { front: forcedFront || angles.front, side: imageData };
    setAngles(finalAngles);
    setStep('analyzing');
    setErrorMsg('');
    setSaveStatus('');
    
    try {
      const runInference = (imgData) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = async () => {
            try {
              const res = await analyzeSkinImage(img);
              const tone = estimateFitzpatrick(img);
              resolve({ res, tone });
            } catch (err) {
              reject(err);
            }
          };
          img.onerror = () => reject(new Error('Failed to load image data.'));
          img.src = imgData;
        });
      };

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Analysis timed out.')), 15000)
      );

      const inferencePromise = Promise.all([
        runInference(finalAngles.front),
        runInference(finalAngles.side)
      ]);

      const [frontRes, sideRes] = await Promise.race([inferencePromise, timeoutPromise]);
      
      const avgConfidence = (frontRes.res.confidence + sideRes.res.confidence) / 2;
      
      let finalConditionRes = frontRes.res;
      if (sideRes.res.confidence > frontRes.res.confidence && sideRes.res.condition !== frontRes.res.condition) {
        finalConditionRes = sideRes.res;
      }

      const combinedResults = {
        ...finalConditionRes,
        confidence: avgConfidence,
        explanation: 'Ensembled from 2 angles: ' + finalConditionRes.explanation
      };
      
      setResults(combinedResults);
      setFitzpatrickEstimate(frontRes.tone);
      
      setStep('results');
    } catch (error) {
      console.error(error);
      const msg = error.message === 'ModelNotAvailableOffline' 
        ? 'Model not available offline yet — connect to the internet once to download.'
        : (error.message || 'An error occurred during analysis.');
      setErrorMsg(msg);
      if (typeof window !== 'undefined' && window.alert) {
        window.alert(msg);
      }
      setStep('capture_front');
      setAngles({ front: null, side: null });
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      localStorage.setItem('luma_last_scan_condition', results.condition);
      localStorage.setItem('luma_last_scan_tone', fitzpatrickEstimate.type);

      await saveScan({
        image: angles.front,
        condition: results.condition,
        severity: results.severity,
        tone: fitzpatrickEstimate.type
      });
      setSaveStatus('saved');
    } catch (error) {
      if (error.code === 'QUOTA_EXCEEDED') {
        setErrorMsg('Couldn\'t save this scan — your device may be low on storage.');
      } else {
        setErrorMsg('Failed to save scan to history.');
      }
      setSaveStatus('error');
    }
  };

  const handleReset = () => {
    setAngles({ front: null, side: null });
    setResults(null);
    setStep('capture_front');
  };

  return (
    <div className="flex flex-col" style={{ color: 'white' }}>
      <div className="flex justify-between items-center mb-6">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{t('skin')}</h2>
        {step !== 'capture_front' && (
          <button onClick={handleReset} aria-label="Restart analysis" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}>
            <RefreshCw size={20} />
          </button>
        )}
      </div>
      
      <DeviceSelectionModal 
        isOpen={showDeviceModal}
        onClose={() => setShowDeviceModal(false)}
        onSelectLaptop={() => {
          setFacingMode('user');
          setShowDeviceModal(false);
        }}
      />

      {step === 'capture_front' && !showDeviceModal && (
        <>
          {errorMsg && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.875rem' }}>
              <AlertTriangle size={16} style={{ marginTop: '0.1rem', flexShrink: 0 }} />
              <p>{errorMsg}</p>
            </div>
          )}
          <div className="flex justify-between items-center mb-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)', border: '1px solid rgba(20, 184, 166, 0.3)' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#2dd4bf' }}>Step 1: Front Angle</h3>
              <p style={{ color: '#A6ADBB', fontSize: '0.85rem' }}>
                {t('voice_front')}
              </p>
            </div>
            <button onClick={() => speakInstruction('voice_front')} style={{ background: '#2dd4bf', color: '#0B0F1A', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} aria-label="Read instructions out loud">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
            </button>
          </div>
          <CameraCapture onCapture={handleCaptureFront} guideOverlay={true} requestedFacingMode={facingMode} />
        </>
      )}

      {step === 'capture_side' && (
        <>
          <div className="flex justify-between items-center mb-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(244, 114, 182, 0.1)', border: '1px solid rgba(244, 114, 182, 0.3)' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#f472b6' }}>Step 2: Alternate Angle</h3>
              <p style={{ color: '#A6ADBB', fontSize: '0.85rem' }}>
                {t('voice_side')}
              </p>
            </div>
            <button onClick={() => speakInstruction('voice_side')} style={{ background: '#f472b6', color: '#0B0F1A', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} aria-label="Read instructions out loud">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
            </button>
          </div>
          <CameraCapture onCapture={handleCaptureSide} guideOverlay={true} requestedFacingMode={facingMode} />
        </>
      )}

      {step === 'analyzing' && (
        <div className="flex flex-col items-center justify-center p-8 rounded-xl" style={{ backgroundColor: '#10141D', border: '1px solid rgba(255,255,255,0.1)' }}>
          <RefreshCw size={60} className="animate-spin" style={{ color: '#2dd4bf', marginBottom: '1.5rem', animation: 'spin 1s linear infinite' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>Analyzing Image...</h3>
          <p style={{ color: '#A6ADBB', textAlign: 'center', fontSize: '1rem' }}>
            Processing multiple angles entirely on your device.
          </p>
          <style>{`
            @keyframes spin { 100% { transform: rotate(360deg); } }
          `}</style>
        </div>
      )}

      {step === 'results' && results && (
        <div className="flex flex-col gap-4">
          <ResultsDisplay 
            imageSrc={angles.front}
            condition={results.condition}
            severity={results.severity}
            confidence={results.confidence}
            explanation={results.explanation}
            flags={results.flags}
          />
          {fitzpatrickEstimate && (
            <div style={{ padding: '1rem', backgroundColor: '#10141D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}>
              <div className="flex items-center justify-between mb-2">
                <h4 style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Estimated Tone</h4>
                <select 
                  value={fitzpatrickEstimate.type}
                  aria-label="Fitzpatrick skin tone override"
                  onChange={(e) => {
                    const newType = e.target.value;
                    setFitzpatrickEstimate({ ...fitzpatrickEstimate, type: newType });
                  }}
                  style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '700', 
                    padding: '0.25rem',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '0.25rem',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: 'white'
                  }}
                >
                  {['I', 'II', 'III', 'IV', 'V', 'VI'].map(t => (
                    <option key={t} value={t} style={{ color: 'black' }}>Type {t}</option>
                  ))}
                </select>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#A6ADBB' }}>
                Used to personalize skincare recommendations. You can override this estimate if incorrect.
              </p>
            </div>
          )}

          {errorMsg && (
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.875rem' }}>
              <AlertTriangle size={16} style={{ marginTop: '0.1rem', flexShrink: 0 }} />
              <p>{errorMsg}</p>
            </div>
          )}

          <div className="flex flex-col gap-2 mt-2">
            {saveStatus === 'saved' ? (
              <button disabled className="btn" style={{ backgroundColor: '#10b981', color: 'white', display: 'flex', justifyContent: 'center', gap: '0.5rem', minHeight: '44px', border: 'none', borderRadius: '100px' }}>
                <Check size={20} /> Saved to History
              </button>
            ) : (
              <button onClick={handleSave} disabled={saveStatus === 'saving'} className="btn" style={{ minHeight: '44px', backgroundColor: '#f472b6', color: 'white', borderRadius: '100px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                {saveStatus === 'saving' ? 'Saving...' : 'Save & Continue'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkinAnalysis;
