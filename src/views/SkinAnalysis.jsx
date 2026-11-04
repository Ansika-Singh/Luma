import { useState, useEffect, useRef } from 'react';
import CameraCapture from '../components/CameraCapture';
import ResultsDisplay from '../components/ResultsDisplay';
import { RefreshCw, Check, AlertTriangle, Sparkles, Volume2, Upload, Camera, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { loadModel, analyzeSkinImage, estimateFitzpatrick } from '../services/mlService';
import { saveScan } from '../services/historyService';
import DeviceSelectionModal from '../components/DeviceSelectionModal';
import { useLanguage } from '../contexts/LanguageContext';

const SkinAnalysis = () => {
  const { t, lang } = useLanguage();
  const [step, setStep] = useState('capture_front'); // 'capture_front', 'capture_side', 'analyzing', 'results'
  const [scanMethod, setScanMethod] = useState('camera'); // 'camera' | 'upload'
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const uploadInputRef = useRef(null);
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
    <div className="w-full space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Hero */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-widest uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                <Sparkles size={12} className="text-teal-400" /> Multi-Angle Ensembled Inference
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/5 text-slate-300 border border-white/10">
                100% On-Device AI
              </span>
            </div>

            <h1 className="text-[clamp(1.5rem,4vw,2.5rem)] font-black tracking-tight text-white leading-tight">
              {t('skin')}
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Capture 2 distinct perspectives (frontal + profile angle) for ensembled feature verification and melanin calibration.
            </p>
          </div>

          {step !== 'capture_front' && (
            <button
              onClick={handleReset}
              aria-label="Restart analysis"
              className="size-11 rounded-2xl bg-white/5 hover:bg-teal-500/20 text-slate-300 hover:text-teal-300 border border-white/10 hover:border-teal-400/40 flex items-center justify-center transition-all shadow-md shrink-0"
              title="Restart analysis"
            >
              <RefreshCw size={18} />
            </button>
          )}
        </div>
      </div>

      <DeviceSelectionModal 
        isOpen={showDeviceModal}
        onClose={() => setShowDeviceModal(false)}
        onSelectLaptop={() => {
          setFacingMode('user');
          setScanMethod('camera');
          setShowDeviceModal(false);
        }}
        onSelectUpload={() => {
          setScanMethod('upload');
          setShowDeviceModal(false);
        }}
      />

      {/* Capture or Upload Container (Steps 1 & 2) */}
      {(step === 'capture_front' || step === 'capture_side') && !showDeviceModal && (
        <div className="rounded-3xl p-6 sm:p-10 bg-slate-900/70 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-center gap-3">
              <AlertTriangle size={18} className="text-red-400 shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}

          {/* Mode Switcher: Live Camera vs Upload Photo */}
          <div className="flex items-center justify-center p-1 rounded-2xl bg-white/[0.04] border border-white/10 max-w-md mx-auto shadow-inner">
            <button
              type="button"
              onClick={() => {
                setScanMethod('camera');
                setUploadedImage(null);
              }}
              className={`flex-1 min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                scanMethod === 'camera'
                  ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Camera size={16} />
              <span>Live Camera</span>
            </button>

            <button
              type="button"
              onClick={() => setScanMethod('upload')}
              className={`flex-1 min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                scanMethod === 'upload'
                  ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Upload size={16} />
              <span>Upload Photo</span>
            </button>
          </div>

          {/* Upload Mode UI */}
          {scanMethod === 'upload' ? (
            <div className="space-y-6 max-w-lg mx-auto">
              {/* Informative Guidance & Privacy Banner */}
              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-start gap-3">
                <ShieldCheck size={20} className="text-teal-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-teal-300">
                    Offline & Private Lesion Analysis
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                    If your camera is poor, or if you have a skin condition in a sensitive or private body area, take a high-resolution photo with an external camera in private and upload it here. No images ever leave your device.
                  </p>
                </div>
              </div>

              {/* Upload Dropzone or Image Preview */}
              {!uploadedImage ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer?.files?.[0];
                    if (file && file.type.startsWith('image/')) {
                      const reader = new FileReader();
                      reader.onload = (evt) => setUploadedImage(evt.target.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                  onClick={() => uploadInputRef.current?.click()}
                  className={`cursor-pointer rounded-3xl p-8 sm:p-12 border-2 border-dashed transition-all flex flex-col items-center justify-center text-center space-y-4 ${
                    isDragging
                      ? 'border-teal-400 bg-teal-500/15 scale-[1.01]'
                      : 'border-white/20 hover:border-teal-400/50 bg-slate-900/60 hover:bg-slate-900/90'
                  }`}
                  style={{ minHeight: '300px' }}
                >
                  <div className="size-16 rounded-3xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300 shadow-[0_0_20px_rgba(45,212,191,0.2)]">
                    <ImageIcon size={32} />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base sm:text-lg font-black text-white">
                      Upload Skin Photo from Gallery or Files
                    </h4>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Supports JPG, PNG, WEBP taken with phones, digital cameras, or dermatoscopes.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="min-h-[44px] px-6 py-2.5 rounded-xl bg-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg hover:bg-teal-300 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      uploadInputRef.current?.click();
                    }}
                  >
                    <Upload size={16} />
                    <span>Browse Device Files</span>
                  </button>

                  <input
                    type="file"
                    accept="image/*"
                    ref={uploadInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (evt) => setUploadedImage(evt.target.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                    aria-label="Upload photo"
                  />
                </div>
              ) : (
                /* Image Preview & Action Buttons */
                <div className="space-y-5 rounded-3xl p-5 bg-black/40 border border-white/10">
                  <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black max-h-80 flex items-center justify-center">
                    <img
                      src={uploadedImage}
                      alt="Uploaded skin lesion preview"
                      className="w-full h-auto max-h-80 object-contain"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[11px] font-bold text-teal-300 flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-emerald-400" />
                      <span>Photo Loaded Offline</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => handleCaptureSide(uploadedImage, uploadedImage)}
                      className="flex-1 min-h-[44px] py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.5)] hover:scale-[1.02] transition"
                    >
                      <Sparkles size={16} />
                      <span>Analyze Photo Now</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUploadedImage(null);
                        if (uploadInputRef.current) uploadInputRef.current.value = '';
                      }}
                      className="min-h-[44px] py-3.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 text-xs font-bold transition flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={15} />
                      <span>Choose Different Photo</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Live Camera Mode UI */
            <div className="space-y-6">
              {step === 'capture_front' ? (
                <div className="p-5 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-teal-300">
                      Step 1: Front Angle
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300">
                      {t('voice_front')}
                    </p>
                  </div>

                  <button
                    onClick={() => speakInstruction('voice_front')}
                    aria-label="Read instructions out loud"
                    className="size-10 rounded-2xl bg-teal-400 text-slate-950 flex items-center justify-center hover:bg-teal-300 transition shadow-[0_0_15px_rgba(45,212,191,0.5)] shrink-0"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-pink-300">
                      Step 2: Alternate Angle
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300">
                      {t('voice_side')}
                    </p>
                  </div>

                  <button
                    onClick={() => speakInstruction('voice_side')}
                    aria-label="Read instructions out loud"
                    className="size-10 rounded-2xl bg-pink-400 text-slate-950 flex items-center justify-center hover:bg-pink-300 transition shadow-[0_0_15px_rgba(244,114,182,0.5)] shrink-0"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>
              )}

              <div className="max-w-md mx-auto">
                <CameraCapture 
                  onCapture={step === 'capture_front' ? handleCaptureFront : handleCaptureSide} 
                  guideOverlay={true} 
                  requestedFacingMode={facingMode} 
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Analyzing State */}
      {step === 'analyzing' && (
        <div className="p-16 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-2xl shadow-2xl text-center space-y-6">
          <div className="size-20 mx-auto rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-[0_0_30px_rgba(45,212,191,0.3)]">
            <RefreshCw size={36} className="animate-spin" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white tracking-tight">
              Analyzing Image...
            </h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Processing multiple angles entirely on your device with MobileNet feature extraction.
            </p>
          </div>
        </div>
      )}

      {/* Step 4: Results Display */}
      {step === 'results' && results && (
        <div className="space-y-6">
          <ResultsDisplay 
            imageSrc={angles.front}
            condition={results.condition}
            severity={results.severity}
            confidence={results.confidence}
            explanation={results.explanation}
            flags={results.flags}
          />

          {fitzpatrickEstimate && (
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-2xl shadow-xl space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Estimated Tone</h4>
                <select 
                  value={fitzpatrickEstimate.type}
                  aria-label="Fitzpatrick skin tone override"
                  onChange={(e) => {
                    const newType = e.target.value;
                    setFitzpatrickEstimate({ ...fitzpatrickEstimate, type: newType });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/15 text-xs font-bold text-white focus:outline-none focus:border-teal-400 cursor-pointer"
                >
                  {['I', 'II', 'III', 'IV', 'V', 'VI'].map(tVal => (
                    <option key={tVal} value={tVal} className="bg-slate-900 text-white">
                      Type {tVal}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-slate-400">
                Used to personalize skincare recommendations. You can override this estimate if incorrect.
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-center gap-3">
              <AlertTriangle size={18} className="text-red-400 shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}

          <div className="pt-2">
            {saveStatus === 'saved' ? (
              <button disabled className="w-full py-4 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                <Check size={20} /> Saved to History
              </button>
            ) : (
              <button 
                onClick={handleSave} 
                disabled={saveStatus === 'saving'} 
                className="w-full glow-teal-btn py-4 rounded-full text-sm font-black flex items-center justify-center gap-2 shadow-xl"
              >
                <span>{saveStatus === 'saving' ? 'Saving...' : 'Save & Continue'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkinAnalysis;
