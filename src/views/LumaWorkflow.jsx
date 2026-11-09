import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, VolumeX, Mic, MicOff, Globe, Undo2, ArrowRight, ArrowLeft, Camera, RefreshCw, 
  MapPin, Send, CheckCircle2, AlertTriangle, 
  FileText, User, Sparkles, Check, X,
  Activity, Calendar, Scale, Shield, PhoneCall, Copy, HeartPulse, Upload
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGES } from '../lib/bhashini';
import { 
  CONDITION_META, FALLBACK_META, FITZ_COLORS, ILLUMINANTS, 
  estimateIlluminantFromCanvas, detectFitzpatrickFromCanvas, 
  calculateToneMetrics 
} from '../lib/fitzpatrick';
import { findNearestPHC } from '../lib/phc';
import { sendReferralSMS, formatReferralSlip } from '../lib/sms';
import { recordDiagnosisForMap, VILLAGES } from '../lib/diseaseMap';
import { SAMPLE_LESIONS } from '../lib/sampleLesions';
import { saveScan } from '../services/historyService';

const QUESTION_KEYS = [
  'question_1',
  'question_2',
  'question_3',
  'question_4',
  'question_5',
  'question_6',
  'question_7'
];

export default function LumaWorkflow() {
  const { 
    lang, setLang, 
    voiceLang, setVoiceLang, 
    t, speak, 
    speakStepGuidance, speakPlatformOverview, stopSpeaking, isSpeaking, 
    languages, voiceLanguages, startVoiceRecognition 
  } = useLanguage();

  // Workflow steps: 1 = Patient Intake, 2 = Clinical History, 3 = Guided Scan, 4 = Diagnosis & Referral
  const [step, setStep] = useState(1);

  // Patient Intake State
  const [patient, setPatient] = useState({
    fullName: '',
    age: '',
    sex: 'Male',
    weight: '',
    village: 'Bhandara'
  });

  // Undo Stack
  const [undoStack, setUndoStack] = useState([]);

  // 7-Point History
  const [historyAnswers, setHistoryAnswers] = useState(Array(7).fill(null));
  const [historyIdx, setHistoryIdx] = useState(0);
  const [customDetail, setCustomDetail] = useState('');

  // Camera & Scan State
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [fitzCycle, setFitzCycle] = useState('V');
  const [scanLocked, setScanLocked] = useState(false);
  const [illuminant, setIlluminant] = useState('daylight');
  const [scanError, setScanError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Diagnosis Result State
  const [diagnosis, setDiagnosis] = useState(null);
  const [smsSending, setSmsSending] = useState(false);
  const [smsResult, setSmsResult] = useState(null);
  const [copiedSlip, setCopiedSlip] = useState(false);

  // Voice Command & Dictation State
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceFeedback, setVoiceFeedback] = useState('');
  const [showVoiceTourCard, setShowVoiceTourCard] = useState(false);
  const recognitionRef = useRef(null);

  // Show voice tour card whenever audio is speaking so transcript is visible
  useEffect(() => {
    if (isSpeaking) {
      setShowVoiceTourCard(true);
    }
  }, [isSpeaking]);

  // Clean up camera stream and voice recognition on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
      stopSpeaking();
    };
  }, [stopSpeaking]);

  // Update patient field with undo registration
  const updatePatientField = (field, value) => {
    setUndoStack((prev) => [...prev, { type: 'patient', field, prevValue: patient[field] }]);
    setPatient((prev) => ({ ...prev, [field]: value }));
  };

  // Undo last action
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));

    if (last.type === 'patient') {
      setPatient((prev) => ({ ...prev, [last.field]: last.prevValue }));
    } else if (last.type === 'history') {
      setHistoryAnswers((prev) => {
        const next = [...prev];
        next[last.index] = last.prevValue;
        return next;
      });
      if (last.index !== historyIdx) setHistoryIdx(last.index);
    }
  };

  // Answer clinical question
  const handleAnswerQuestion = (val) => {
    setUndoStack((prev) => [
      ...prev,
      { type: 'history', index: historyIdx, prevValue: historyAnswers[historyIdx] }
    ]);
    const nextAnswers = [...historyAnswers];
    nextAnswers[historyIdx] = customDetail.trim() ? `${val} - ${customDetail.trim()}` : val;
    setHistoryAnswers(nextAnswers);
    setCustomDetail('');

    if (historyIdx < QUESTION_KEYS.length - 1) {
      setHistoryIdx(historyIdx + 1);
    } else {
      setStep(3);
    }
  };

  // Start Camera
  const startCamera = async () => {
    setScanError('');
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 720 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      setCapturedImage(null);
    } catch (err) {
      setScanError('Unable to open hardware camera. Please use file upload below or test benchmarks.');
      setCameraActive(false);
    }
  };

  // Capture Photo
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 640;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');

    // Colorimetric tone & illuminant calibration
    const detectedIlluminant = estimateIlluminantFromCanvas(canvas);
    const detectedTone = detectFitzpatrickFromCanvas(canvas);

    setIlluminant(detectedIlluminant);
    setFitzCycle(detectedTone);
    setScanLocked(true);
    setCapturedImage(dataUrl);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);

    analyzeLesion(dataUrl, detectedTone, detectedIlluminant);
  };

  // Handle uploaded file (macro or sensitive body areas)
  const handleFileUpload = (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setCapturedImage(dataUrl);
      setCameraActive(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 640;
        canvas.height = img.naturalHeight || 640;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const detectedIlluminant = estimateIlluminantFromCanvas(canvas);
        const detectedTone = detectFitzpatrickFromCanvas(canvas);

        setIlluminant(detectedIlluminant);
        setFitzCycle(detectedTone);
        setScanLocked(true);

        analyzeLesion(dataUrl, detectedTone, detectedIlluminant);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Evaluate Clinical Decision Support System (CDSS)
  const evaluateSyndromicRules = (answers, tone) => {
    const isYes = (idx) => {
      const val = answers[idx];
      return typeof val === 'string' && val.toLowerCase().startsWith('yes');
    };

    const hasDuration = isYes(0);
    const hasItching = isYes(1);
    const hasFamilyCluster = isYes(2);
    const hasPriorTreatment = isYes(3);
    const hasComorbidity = isYes(4);
    const hasMedication = isYes(5);
    const hasMorphologyChange = isYes(6);

    let chosenKey = 'Dermatitis';
    let baseConfidence = 85;

    if (hasItching && hasFamilyCluster) {
      chosenKey = 'Scabies';
      baseConfidence = 96;
    } else if (hasMorphologyChange && (hasPriorTreatment || hasDuration)) {
      chosenKey = 'Melanoma';
      baseConfidence = 88;
    } else if (hasItching && hasDuration && !hasFamilyCluster) {
      chosenKey = 'Eczema';
      baseConfidence = 91;
    } else if (hasDuration && !hasItching && !hasFamilyCluster) {
      chosenKey = 'Tinea Ringworm';
      baseConfidence = 89;
    } else if (hasComorbidity || hasMedication) {
      chosenKey = 'Vitiligo';
      baseConfidence = 86;
    }

    const meta = CONDITION_META[chosenKey] || FALLBACK_META;
    const tonePenalty = (tone === 'V' || tone === 'VI') ? 3 : 0;
    const finalConfidence = Math.max(70, Math.min(98, baseConfidence - tonePenalty));

    return {
      condition: meta.condition,
      conditionKey: chosenKey,
      directiveKey: meta.directiveKey,
      lesionType: meta.lesionType,
      risk: meta.risk,
      contagionRisk: meta.contagionRisk,
      directive: meta.directive,
      emergencyFlag: meta.emergencyFlag,
      icd10: meta.icd10,
      otcEligible: meta.otcEligible,
      recommendedReferral: meta.recommendedReferral,
      confidence: finalConfidence,
      rgbReliability: 96
    };
  };

  // Analyze Lesion (AI + Clinical Rules)
  const analyzeLesion = (imgSrc = capturedImage, tone = fitzCycle, ill = illuminant) => {
    setScanning(true);
    setScanError('');

    setTimeout(() => {
      const verdict = evaluateSyndromicRules(historyAnswers, tone);
      const toneMetrics = calculateToneMetrics(tone, ill);

      const completeResult = {
        ...verdict,
        fitzpatrickTone: tone,
        illuminant: ill,
        toneMetrics,
        patientDemographics: { ...patient },
        clinicalHistory: [...historyAnswers],
        timestamp: new Date().toISOString()
      };

      setDiagnosis(completeResult);
      setScanning(false);
      setStep(4);

      // Save to local secure database
      try {
        saveScan({
          condition: verdict.condition,
          severity: verdict.risk === 'HIGH' ? 'severe' : verdict.risk === 'MEDIUM' ? 'moderate' : 'mild',
          patientName: patient.fullName || 'Anonymous Patient',
          patientAge: patient.age,
          patientGender: patient.sex,
          fitzpatrickTone: tone,
          confidence: verdict.confidence / 100,
          explanation: verdict.directive,
          image: imgSrc
        });
      } catch (err) {
        console.warn('Could not save scan to IndexedDB:', err);
      }

      // Record in regional GIS ledger
      try {
        recordDiagnosisForMap({
          village: patient.village,
          condition: verdict.condition,
          risk: verdict.risk,
          fitzpatrickTone: tone
        });
      } catch (err) {
        console.warn('Could not record map stats:', err);
      }

      // Read out clinical directive
      setTimeout(() => {
        const localizedDirective = t(verdict.directiveKey) || verdict.directive;
        speak(`${t(verdict.condition) || verdict.condition}. ${localizedDirective}`, voiceLang);
      }, 400);

    }, 850);
  };

  // Select sample lesion for instant demo
  const handleSelectSample = (sample) => {
    const dataUrl = typeof sample.getDataUrl === 'function' ? sample.getDataUrl() : '';
    setCapturedImage(dataUrl);
    setFitzCycle('V');
    setIlluminant('daylight');
    setScanLocked(true);
    analyzeLesion(dataUrl, 'V', 'daylight');
  };

  // Send referral SMS via Fast2SMS
  const handleSendSMS = async () => {
    if (!diagnosis) return;
    setSmsSending(true);
    setSmsResult(null);

    const nearest = findNearestPHC(patient.village);
    const payload = {
      patientName: patient.fullName || 'Resident',
      village: patient.village,
      phcName: nearest?.name || 'Local PHC',
      condition: diagnosis.condition,
      risk: diagnosis.risk,
      icd10: diagnosis.icd10,
      referralPriority: diagnosis.recommendedReferral
    };

    const res = await sendReferralSMS(nearest?.contact || '9876543210', payload);
    setSmsSending(false);
    setSmsResult(res);
  };

  // Copy Digital ABDM Referral Slip
  const handleCopySlip = () => {
    if (!diagnosis) return;
    const nearest = findNearestPHC(patient.village);
    const slipText = formatReferralSlip({
      patient,
      diagnosis,
      phc: nearest
    });
    navigator.clipboard.writeText(slipText);
    setCopiedSlip(true);
    setTimeout(() => setCopiedSlip(false), 2500);
  };

  const [spokenGuideText, setSpokenGuideText] = useState('');

  // Voice Guidance: Dictate current step out loud
  const dictateCurrentStep = () => {
    setShowVoiceTourCard(true);
    let stepText = '';
    if (step === 1) {
      stepText = t('voice_step_1');
    } else if (step === 2) {
      stepText = t('voice_step_2');
    } else if (step === 3) {
      stepText = t('voice_step_3');
    } else if (step === 4) {
      stepText = t('voice_step_4');
    }
    setSpokenGuideText(stepText || t('platform_voice_overview'));
    speakStepGuidance(step, {
      questionKey: QUESTION_KEYS[historyIdx],
      questionIndex: historyIdx,
      condition: diagnosis ? (t(diagnosis.condition) || diagnosis.condition) : ''
    });
  };

  // Voice Guidance: Toggle full platform tour narration
  const handleToggleVoiceGuidance = () => {
    try {
      if (isSpeaking) {
        stopSpeaking();
      } else {
        setShowVoiceTourCard(true);
        const overviewText = t('platform_voice_overview');
        setSpokenGuideText(overviewText || 'Welcome to Luma Clinical Intelligence. An offline AI dermatology platform for rural health workers.');
        speakPlatformOverview(voiceLang || lang);
      }
    } catch (err) {
      console.warn('Voice guidance error:', err);
      // Even if TTS fails, still show the text card so user can read
      setShowVoiceTourCard(true);
      setSpokenGuideText(t('platform_voice_overview') || 'Welcome to Luma Clinical Intelligence. An offline AI dermatology platform for rural health workers.');
    }
  };

  // Safe language label lookup — can never throw in render
  const currentVoiceLangCode = voiceLang || lang || 'en';
  let currentVoiceLangNative = 'English';
  try {
    const allLangs = languages || LANGUAGES || [];
    const found = allLangs.find(l => l.code === currentVoiceLangCode);
    if (found && found.native) currentVoiceLangNative = found.native;
  } catch { /* safely default to English */ }

  // Handle Voice Command parsing
  const handleVoiceCommand = (cmd, transcript) => {
    setVoiceTranscript(transcript);

    if (cmd.type === 'NEXT_STEP') {
      if (step === 1) {
        setVoiceFeedback(voiceLang === 'hi' ? '✓ कमांड: अगला चरण' : '✓ Command: Next Step');
        setStep(2);
      } else if (step === 2) {
        setVoiceFeedback(voiceLang === 'hi' ? '✓ उत्तर: हाँ (अगला प्रश्न)' : '✓ Answer: Yes (Next)');
        handleAnswerQuestion('Yes');
      } else if (step === 3) {
        setVoiceFeedback(voiceLang === 'hi' ? '✓ कमांड: स्कैन विश्लेषण' : '✓ Command: Analyze Scan');
        if (capturedImage) analyzeLesion();
        else capturePhoto();
      }
    } else if (cmd.type === 'PREV_STEP') {
      setVoiceFeedback(voiceLang === 'hi' ? '✓ कमांड: पिछला चरण' : '✓ Command: Previous Step');
      if (step === 2) {
        if (historyIdx > 0) setHistoryIdx(historyIdx - 1);
        else setStep(1);
      } else if (step > 1) {
        setStep(step - 1);
      }
    } else if (cmd.type === 'ANSWER') {
      if (step === 2) {
        setVoiceFeedback(voiceLang === 'hi' ? `✓ उत्तर: ${cmd.value === 'Yes' ? 'हाँ' : 'नहीं'}` : `✓ Answer: ${cmd.value}`);
        handleAnswerQuestion(cmd.value);
      }
    } else if (cmd.type === 'SET_FIELD') {
      if (step === 1 && cmd.field === 'sex') {
        setVoiceFeedback(voiceLang === 'hi' ? `✓ लिंग चुना: ${cmd.value === 'Male' ? 'पुरुष' : cmd.value === 'Female' ? 'महिला' : 'अन्य'}` : `✓ Gender: ${cmd.value}`);
        updatePatientField('sex', cmd.value);
      }
    } else if (cmd.type === 'SCAN_ACTION') {
      if (step === 3) {
        if (!cameraActive && !capturedImage) {
          startCamera();
        } else if (cameraActive) {
          capturePhoto();
        } else if (capturedImage) {
          analyzeLesion();
        }
      } else {
        setStep(3);
      }
    } else if (cmd.type === 'SWITCH_LANG') {
      setLang(cmd.lang);
      setVoiceLang(cmd.lang);
      setVoiceFeedback(`✓ ${t('language')}: ${cmd.lang.toUpperCase()}`);
    } else if (cmd.type === 'DICTATE_HELP') {
      setShowVoiceTourCard(true);
      speakPlatformOverview(voiceLang || lang);
      setVoiceFeedback(voiceLang === 'hi' ? 'निर्देश बोले जा रहे हैं...' : 'Dictating platform tour...');
    } else if (cmd.type === 'STOP_SPEECH') {
      stopSpeaking();
      setVoiceFeedback(voiceLang === 'hi' ? 'ऑडियो रोक दिया गया' : 'Audio stopped');
    }
  };

  // Toggle Voice Command microphone listening
  const toggleVoiceCommand = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
      setIsListening(false);
      setVoiceFeedback('');
      return;
    }

    setIsListening(true);
    setVoiceTranscript('');
    setVoiceFeedback(voiceLang === 'hi' ? 'सुन रहा है... कमांड बोलें ("आगे", "पुरुष", "स्कैन")' : 'Listening... Say "Next", "Male", "Scan"');

    const rec = startVoiceRecognition({
      lang: voiceLang,
      onResult: (text) => setVoiceTranscript(text),
      onCommand: (cmd, text) => handleVoiceCommand(cmd, text),
      onError: (errCode) => {
        setIsListening(false);
        if (errCode === 'no-speech') {
          setVoiceFeedback(voiceLang === 'hi' ? 'कोई आवाज नहीं सुनी गई। पुनः प्रयास करें।' : 'No speech heard. Tap to speak again.');
        } else if (errCode === 'not-allowed' || errCode === 'permission-denied') {
          setVoiceFeedback(t('mic_denied') || 'Microphone access denied. Please allow mic.');
        } else if (errCode === 'not-supported') {
          setVoiceFeedback(t('speech_unsupported') || 'Voice recognition not supported in this browser.');
        } else {
          setVoiceFeedback(voiceLang === 'hi' ? `माइक सूचना: ${errCode}` : `Voice status: ${errCode}`);
        }
      },
      onEnd: () => {
        setIsListening(false);
      }
    });

    recognitionRef.current = rec;
  };

  // Reset to Step 1
  const handleReset = () => {
    setStep(1);
    setPatient({
      fullName: '',
      age: '',
      sex: 'Male',
      weight: '',
      village: 'Bhandara'
    });
    setHistoryAnswers(Array(7).fill(null));
    setHistoryIdx(0);
    setCapturedImage(null);
    setDiagnosis(null);
    setSmsResult(null);
    setUndoStack([]);
  };

  const nearestPHC = findNearestPHC(patient.village);

  const stepsMeta = [
    { num: 1, label: t('patient_details') || 'Patient Details', short: t('intake_short'), icon: <User size={15} /> },
    { num: 2, label: t('patient_history') || 'Clinical History', short: t('history_short'), icon: <FileText size={15} /> },
    { num: 3, label: t('camera_scan') || 'Guided Scan', short: t('scan_short'), icon: <Camera size={15} /> },
    { num: 4, label: t('diagnosis_report') || 'Referral Report', short: t('report_short'), icon: <HeartPulse size={15} /> }
  ];

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Banner & Hero Status */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-pink-500/8 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-widest uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                <Sparkles size={12} className="text-teal-400" /> {t('offline_intelligence')}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-pink-500/15 text-pink-300 border border-pink-500/30">
                {t('fitz_calibrated')}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/5 text-slate-300 border border-white/10">
                <Shield size={12} className="text-emerald-400" /> {t('nha_hfr_integrated')}
              </span>
            </div>

            <h1 className="text-[clamp(1.5rem,4vw,2.5rem)] font-black tracking-tight text-white leading-tight">
              <span className="sr-only">Luma Clinical Intelligence</span>
              <span aria-hidden="true">
                Luma <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-pink-500">
                  {t('clinical_intelligence_title') || 'Clinical Intelligence'}
                </span>
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              {t('app_tagline')} · {t('app_subtitle')}
            </p>
          </div>

          {/* Voice Guidance & Voice Command Control Hub */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 self-start md:self-center">
            {/* Voice Command Language Selector */}
            <div className="flex items-center gap-1.5 bg-black/40 border border-white/15 rounded-2xl px-3 py-2 text-xs text-slate-300 min-h-[44px]">
              <Globe size={14} className="text-teal-400 shrink-0" />
              <select
                value={voiceLang}
                onChange={(e) => {
                  setVoiceLang(e.target.value);
                }}
                className="bg-transparent text-white text-xs font-bold cursor-pointer focus:outline-none pr-1"
                title="Select language for audio dictation and voice commands"
                aria-label="Voice Language"
              >
                {(voiceLanguages || []).map((l) => (
                  <option 
                    key={l.code} 
                    value={l.code} 
                    className="bg-slate-900 text-white py-1"
                  >
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Dictate Full Platform Overview & Tour (TTS) */}
            <button
              onClick={handleToggleVoiceGuidance}
              title={isSpeaking ? t('stop_audio') : t('dictate_instructions')}
              className={`min-h-[44px] inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all shadow-md group shrink-0 ${
                isSpeaking
                  ? 'bg-amber-500/20 text-amber-200 border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-pulse'
                  : 'bg-teal-500/15 hover:bg-teal-500/25 text-teal-200 hover:text-white border-teal-400/30 hover:border-teal-400'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX size={16} className="text-amber-400 shrink-0" />
                  <span>{t('stop_audio')}</span>
                </>
              ) : (
                <>
                  <Volume2 size={16} className="text-teal-400 group-hover:scale-110 transition-transform shrink-0" />
                  <span>{t('dictate_instructions')}</span>
                </>
              )}
            </button>

            {/* Hands-Free Voice Command (Microphone) */}
            <button
              onClick={toggleVoiceCommand}
              title="Speak voice commands (e.g. Next, Back, Male, Female, Scan in English or Hindi)"
              className={`min-h-[44px] inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all shadow-md group shrink-0 ${
                isListening
                  ? 'bg-rose-500/20 text-rose-200 border-rose-400/50 shadow-[0_0_20px_rgba(244,63,94,0.5)] animate-pulse'
                  : 'bg-white/[0.06] hover:bg-white/10 text-slate-200 hover:text-white border-white/15 hover:border-teal-400/40'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff size={16} className="text-rose-400 shrink-0" />
                  <span>{t('listening')}</span>
                </>
              ) : (
                <>
                  <Mic size={16} className="text-teal-400 group-hover:scale-110 transition-transform shrink-0" />
                  <span>{t('voice_command')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Voice Feedback / Transcript Strip */}
        {(isListening || voiceTranscript || voiceFeedback) && (
          <div className="mt-4 pt-3 border-t border-white/10 space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-slate-300">
                <span className={`size-2 rounded-full ${isListening ? 'bg-rose-400 animate-ping' : 'bg-teal-400'}`} />
                <span className="font-mono text-teal-300 font-bold">
                  {voiceFeedback || t('voice_command_hint')}
                </span>
              </div>
              {voiceTranscript && (
                <span className="text-[11px] font-mono text-slate-200 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-400/30">
                  "{voiceTranscript}"
                </span>
              )}
            </div>

            {/* Quick Test Voice Command Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mr-1">
                {voiceLang === 'hi' ? 'त्वरित वॉयस टेस्ट:' : 'Quick Voice Test:'}
              </span>
              {[
                { label: voiceLang === 'hi' ? 'आगे (Next)' : 'Next', cmd: { type: 'NEXT_STEP', action: 'next' }, text: 'Next' },
                { label: voiceLang === 'hi' ? 'पीछे (Back)' : 'Back', cmd: { type: 'PREV_STEP', action: 'back' }, text: 'Back' },
                { label: voiceLang === 'hi' ? 'पुरुष (Male)' : 'Male', cmd: { type: 'SET_FIELD', field: 'sex', value: 'Male' }, text: 'Male' },
                { label: voiceLang === 'hi' ? 'महिला (Female)' : 'Female', cmd: { type: 'SET_FIELD', field: 'sex', value: 'Female' }, text: 'Female' },
                { label: voiceLang === 'hi' ? 'स्कैन (Scan)' : 'Scan', cmd: { type: 'SCAN_ACTION', action: 'capture' }, text: 'Scan' },
                { label: voiceLang === 'hi' ? 'मार्गदर्शन (Help)' : 'Help', cmd: { type: 'DICTATE_HELP' }, text: 'Help' },
              ].map((pill, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleVoiceCommand(pill.cmd, pill.text)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-teal-500/20 border border-white/10 hover:border-teal-400/40 text-[11px] font-mono text-slate-300 hover:text-white transition"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 1.5 Dedicated Live Voice Guidance Platform Tour Card */}
      {showVoiceTourCard && (
        <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-teal-950/80 via-slate-900/90 to-emerald-950/80 border-2 border-teal-400/40 backdrop-blur-2xl shadow-[0_0_40px_rgba(45,212,191,0.25)] space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-teal-400/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shadow-sm shrink-0">
                <Volume2 size={20} className={isSpeaking ? "animate-pulse" : ""} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-extrabold text-white tracking-wide">
                    {t('platform_tour_title')}
                  </span>
                  {isSpeaking && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      <span className="size-2 rounded-full bg-teal-400 animate-ping" />
                      {t('voice_guidance_active')}
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  Bhashini TTS · {currentVoiceLangNative} ({currentVoiceLangCode})
                </div>
              </div>
            </div>

            {/* Action Controls for Tour Card */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              {isSpeaking ? (
                <button
                  onClick={stopSpeaking}
                  className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <VolumeX size={14} />
                  <span>{t('stop_guidance')}</span>
                </button>
              ) : (
                <button
                  onClick={() => speakPlatformOverview(voiceLang || lang)}
                  className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/40 text-teal-200 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <RefreshCw size={13} />
                  <span>{t('replay_tour')}</span>
                </button>
              )}

              <button
                onClick={() => {
                  stopSpeaking();
                  setShowVoiceTourCard(false);
                }}
                className="size-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition"
                title={t('dismiss')}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Spoken Paragraph Transcript in the Selected Language */}
          <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {spokenGuideText || t('platform_voice_overview')}
            </p>
          </div>

          {/* Quick Step Guidance Shortcuts */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
            <span className="text-[11px] text-slate-400 font-mono">
              {t('voice_command_hint')}
            </span>
            <button
              onClick={dictateCurrentStep}
              className="text-[11px] font-bold text-teal-300 hover:text-teal-200 underline underline-offset-4 flex items-center gap-1"
            >
              <Volume2 size={12} />
              <span>{t('listen_step_guidance')} ({t('step_prefix')} {step})</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Responsive 4-Step Stepper Ribbon */}
      <div className="w-full">
        {/* Mobile View (< 768px): Number circles with progress bar + active step pill */}
        <div className="block md:hidden p-4 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-lg space-y-3">
          <div className="flex items-center justify-between relative px-2">
            {/* Connecting progress line behind circles */}
            <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-white/10 z-0">
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-300 shadow-[0_0_8px_rgba(45,212,191,0.5)]"
                style={{ width: `${((step - 1) / (stepsMeta.length - 1)) * 100}%` }}
              />
            </div>

            {stepsMeta.map((s) => {
              const isCurrent = step === s.num;
              const isDone = step > s.num;

              return (
                <div
                  key={s.num}
                  className={`relative z-10 size-8 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all ${
                    isCurrent
                      ? 'bg-teal-400 text-slate-950 ring-4 ring-teal-400/20 shadow-[0_0_15px_rgba(45,212,191,0.7)] scale-110'
                      : isDone
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-900 text-slate-500 border border-white/15'
                  }`}
                >
                  {isDone ? <Check size={14} className="stroke-[3]" /> : s.num}
                </div>
              );
            })}
          </div>

          {/* Active Step Title Pill for Mobile */}
          <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-bold text-white">
            <span className="flex items-center gap-2">
              <span className="text-teal-400 font-mono text-[11px] uppercase tracking-wider">
                {t('step_prefix')} {step} {t('of')} 4:
              </span>
              <span className="text-white">{stepsMeta[step - 1].label}</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              {stepsMeta[step - 1].short}
            </span>
          </div>
        </div>

        {/* Tablet & Desktop View (>= 768px): 4 steps in a single row */}
        <div className="hidden md:grid md:grid-cols-4 gap-2.5 lg:gap-3">
          {stepsMeta.map((s) => {
            const isCurrent = step === s.num;
            const isDone = step > s.num;

            return (
              <div
                key={s.num}
                className={`relative p-3 lg:p-4 rounded-2xl border transition-all flex items-center gap-2.5 lg:gap-3 min-w-0 ${
                  isCurrent
                    ? 'bg-gradient-to-br from-teal-500/20 via-emerald-500/10 to-transparent border-teal-400/60 shadow-[0_0_25px_-5px_rgba(45,212,191,0.35)] scale-[1.01]'
                    : isDone
                    ? 'bg-white/[0.04] border-emerald-500/30 text-slate-200'
                    : 'bg-black/20 border-white/5 text-slate-500'
                }`}
              >
                {/* Number Badge or Checkmark */}
                <div
                  className={`size-8 lg:size-9 rounded-xl flex items-center justify-center shrink-0 font-mono font-bold text-xs transition-all ${
                    isCurrent
                      ? 'bg-teal-400 text-slate-950 shadow-[0_0_15px_rgba(45,212,191,0.7)]'
                      : isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-white/5 text-slate-500 border border-white/5'
                  }`}
                >
                  {isDone ? <Check size={16} className="stroke-[3]" /> : `0${s.num}`}
                </div>

                <div className="min-w-0">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 leading-none mb-1">
                    {t('step_prefix')} {s.num}
                  </div>
                  <div
                    className={`text-xs lg:text-sm font-bold truncate ${isCurrent ? 'text-white' : ''}`}
                    title={s.label}
                  >
                    {s.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Undo Action Strip */}
      {undoStack.length > 0 && (
        <div className="flex items-center justify-between px-5 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-slate-300 backdrop-blur-md">
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-teal-400 animate-pulse" />
            {t('undo_available')}
          </span>
          <button
            onClick={handleUndo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/30 transition-all font-bold min-h-[44px]"
          >
            <Undo2 size={13} /> {t('undo')}
          </button>
        </div>
      )}

      {/* 3. Main Workstation 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start w-full">
        {/* Left Column (Active Step Workspace): 7 cols on lg, 8 cols on xl */}
        <div className="lg:col-span-7 xl:col-span-8 w-full min-w-0 space-y-6">

      {/* ================= STEP 1: PATIENT DETAILS ================= */}
      {step === 1 && (
        <div className="relative rounded-3xl p-6 sm:p-10 bg-slate-900/70 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-8 overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-3.5">
              <div className="size-12 rounded-2xl bg-gradient-to-br from-teal-400/20 to-emerald-400/10 border border-teal-400/30 flex items-center justify-center text-teal-300 shadow-[0_0_20px_rgba(45,212,191,0.2)]">
                <User size={22} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {t('patient_details')}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  {t('rural_intake_desc')}
                </p>
              </div>
            </div>

            <button
              onClick={dictateCurrentStep}
              title={t('dictate_instructions')}
              className="size-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition"
            >
              <Volume2 size={16} />
            </button>
          </div>

          {/* Form Fields Grid: Side-by-side from 640px (sm:) and stacked below that */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <User size={13} className="text-teal-400" /> {t('full_name_label')}
              </label>
              <input
                type="text"
                value={patient.fullName}
                onChange={(e) => updatePatientField('fullName', e.target.value)}
                placeholder={t('full_name_placeholder')}
                className="w-full min-h-[44px] px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/15 text-white placeholder-slate-500 text-base font-semibold focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all shadow-inner"
              />
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Calendar size={13} className="text-teal-400" /> {t('age')}
              </label>
              <input
                type="number"
                value={patient.age}
                onChange={(e) => updatePatientField('age', e.target.value)}
                placeholder={t('age_placeholder')}
                min="1"
                max="120"
                className="w-full min-h-[44px] px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/15 text-white placeholder-slate-500 text-base font-semibold focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all shadow-inner"
              />
            </div>

            {/* Sex Segmented Toggle (Full Width, 44px min touch target) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Activity size={13} className="text-teal-400" /> {t('sex')}
              </label>
              <div className="grid grid-cols-3 p-1 rounded-2xl bg-black/40 border border-white/10 gap-1 w-full min-h-[44px]">
                {['Male', 'Female', 'Other'].map((s) => {
                  const isSelected = patient.sex === s;
                  const displayLabel = s === 'Male' ? t('male') : s === 'Female' ? t('female') : t('other');
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => updatePatientField('sex', s)}
                      className={`min-h-[40px] px-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center ${
                        isSelected
                          ? 'bg-teal-400 text-slate-950 shadow-[0_0_15px_rgba(45,212,191,0.5)]'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {displayLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Scale size={13} className="text-teal-400" /> {t('weight')}
              </label>
              <input
                type="number"
                value={patient.weight}
                onChange={(e) => updatePatientField('weight', e.target.value)}
                placeholder={t('weight_placeholder')}
                className="w-full min-h-[44px] px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/15 text-white placeholder-slate-500 text-base font-semibold focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all shadow-inner"
              />
            </div>

            {/* Village / Town Dropdown (Spans full width from 640px) */}
            <div className="space-y-2 sm:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <MapPin size={13} className="text-teal-400" /> {t('village')}
                </label>
                {nearestPHC && (
                  <span className="text-[11px] font-mono text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                    {t('nearest_prefix')}: {nearestPHC.name} ({nearestPHC.distanceKm} km)
                  </span>
                )}
              </div>

              <select
                value={patient.village}
                onChange={(e) => updatePatientField('village', e.target.value)}
                className="w-full min-h-[44px] px-4 py-3 rounded-2xl bg-slate-950/90 border border-white/15 text-white text-base font-semibold focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all cursor-pointer"
              >
                {VILLAGES.map((v) => (
                  <option key={v.name} value={v.name} className="bg-slate-900 py-1">
                    {v.name} ({v.district} {t('district_suffix') || 'District'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Row: Full width button on mobile, right-aligned on desktop */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-white/10">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Shield size={14} className="text-emerald-400 shrink-0" />
              <span>{t('zero_cloud_uploads')}</span>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full sm:w-auto sm:ml-auto glow-teal-btn min-h-[44px] px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm sm:text-base font-bold shadow-xl"
            >
              <span>{t('next_step')}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 2: 7-QUESTION CLINICAL HISTORY ================= */}
      {step === 2 && (
        <div className="relative rounded-3xl p-6 sm:p-10 bg-slate-900/70 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-8 overflow-hidden">
          {/* Card Header & Progress */}
          <div className="space-y-4 pb-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {t('patient_history')}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    {t('question_prefix')} {historyIdx + 1} {t('of')} 7 · {t('essential_criteria')}
                  </p>
                </div>
              </div>

              <button
                onClick={dictateCurrentStep}
                title={t('dictate_instructions')}
                className="size-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition"
              >
                <Volume2 size={18} />
              </button>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/10">
              <div 
                className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(45,212,191,0.6)]"
                style={{ width: `${((historyIdx + 1) / 7) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Question Display */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/10 space-y-6 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
              {t('question_prefix')} #{historyIdx + 1}
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-relaxed">
              {t(QUESTION_KEYS[historyIdx])}
            </h3>

            {/* Custom Notes / Detail Input */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-slate-400">
                {t('answer_observations')}:
              </label>
              <input
                type="text"
                value={customDetail}
                onChange={(e) => setCustomDetail(e.target.value)}
                placeholder={t('optional_details_placeholder')}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-400 transition"
              />
            </div>
          </div>

          {/* Response Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <button
              onClick={() => handleAnswerQuestion('Yes')}
              className="group min-h-[48px] p-4 sm:p-5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 hover:border-emerald-400 text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)]"
            >
              <CheckCircle2 size={22} className="text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>{t('yes')}</span>
            </button>

            <button
              onClick={() => handleAnswerQuestion('No')}
              className="group min-h-[48px] p-4 sm:p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-200 font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
            >
              <X size={22} className="text-slate-400 group-hover:scale-110 transition-transform" />
              <span>{t('no')}</span>
            </button>

            <button
              onClick={() => handleAnswerQuestion('Unsure / Borderline')}
              className="group min-h-[48px] p-4 sm:p-5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 hover:border-amber-400/40 text-amber-200 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02]"
            >
              <AlertTriangle size={20} className="text-amber-400 group-hover:scale-110 transition-transform" />
              <span>{t('unsure')}</span>
            </button>
          </div>

          {/* Back Button */}
          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => {
                if (historyIdx > 0) setHistoryIdx(historyIdx - 1);
                else setStep(1);
              }}
              className="min-h-[44px] flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition"
            >
              <ArrowLeft size={16} /> {t('back')}
            </button>

            <span className="text-xs font-mono text-slate-500">
              {t('completed_answers')}: {historyAnswers.filter(Boolean).length}/7
            </span>
          </div>
        </div>
      )}

      {/* ================= STEP 3: GUIDED CAMERA SCAN ================= */}
      {step === 3 && (
        <div className="relative rounded-3xl p-6 sm:p-10 bg-slate-900/70 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-8 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3.5">
              <div className="size-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
                <Camera size={22} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {t('camera_scan')}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  {t('smart_lesion_framing')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/5 border border-white/10 text-slate-300">
                {t('ambient_light')}: {ILLUMINANTS[illuminant]?.label || illuminant}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {scanError && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-center gap-3">
              <AlertTriangle size={18} className="text-red-400 shrink-0" />
              <span>{scanError}</span>
            </div>
          )}

          {/* Macro & Sensitive Areas Privacy Guidance */}
          <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-start gap-3">
            <Shield size={18} className="text-teal-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-left">
              <div className="text-xs font-bold text-teal-300">
                {t('upload_lesion_photo')}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {t('upload_macro_desc')} — {t('zero_cloud_uploads')}
              </p>
            </div>
          </div>

          {/* Interactive Viewfinder */}
          <div 
            onDragOver={(e) => { e.preventDefault(); }}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer?.files?.[0];
              if (file) handleFileUpload({ target: { files: [file] } });
            }}
            className="relative w-full max-w-md mx-auto aspect-square rounded-3xl overflow-hidden bg-black border-2 border-white/15 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex items-center justify-center group"
          >
            {cameraActive ? (
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured Lesion"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-6 space-y-3">
                <div className="size-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-teal-400">
                  <Camera size={30} />
                </div>
                <div className="text-sm font-bold text-white">{t('camera_off_prompt')}</div>
                <p className="text-xs text-slate-400 max-w-xs">
                  {t('lesion_framing_instruction')}
                </p>
              </div>
            )}

            {/* Targeting Reticle & Brackets */}
            <div className="absolute inset-8 pointer-events-none flex flex-col justify-between">
              <div className="flex justify-between">
                <div className="size-6 border-t-2 border-l-2 border-teal-400" />
                <div className="size-6 border-t-2 border-r-2 border-teal-400" />
              </div>
              <div className="flex justify-between">
                <div className="size-6 border-b-2 border-l-2 border-teal-400" />
                <div className="size-6 border-b-2 border-r-2 border-teal-400" />
              </div>
            </div>

            {/* Live Tone HUD Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between px-4 py-2 rounded-2xl bg-black/75 backdrop-blur-md border border-white/15 text-xs text-white">
              <div className="flex items-center gap-2.5">
                <span
                  className="size-3.5 rounded-full border border-white/40 shadow-sm"
                  style={{ backgroundColor: FITZ_COLORS[fitzCycle] }}
                />
                <span className="font-mono font-bold text-xs">
                  Fitzpatrick Type {fitzCycle}
                </span>
              </div>
              <span className="text-xs font-mono text-teal-300">
                {scanLocked ? `✓ ${t('tone_calibrated')} (${ILLUMINANTS[illuminant]?.label || illuminant})` : t('calibrating')}
              </span>
            </div>

            {/* Scanning Overlay */}
            {scanning && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center gap-4">
                <RefreshCw size={36} className="text-teal-400 animate-spin" />
                <div className="text-sm font-bold text-white tracking-wide">
                  {t('neural_matching')}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {t('calibrating_melanin_erythema')}
                </div>
              </div>
            )}
          </div>

          {/* Camera Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {!cameraActive ? (
              <button
                onClick={startCamera}
                className="w-full sm:w-auto min-h-[44px] glow-teal-btn px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold shadow-lg"
              >
                <Camera size={18} />
                <span>{t('start_guided_camera')}</span>
              </button>
            ) : (
              <button
                onClick={capturePhoto}
                className="w-full sm:w-auto min-h-[44px] bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-black shadow-[0_0_30px_rgba(52,211,153,0.6)] hover:scale-105 transition"
              >
                <CheckCircle2 size={18} />
                <span>{t('analyze_generate_diagnosis')}</span>
              </button>
            )}

            {/* File Upload Trigger */}
            <label className="w-full sm:w-auto min-h-[44px] cursor-pointer px-6 py-3.5 rounded-2xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-400/40 text-teal-200 hover:text-white text-sm font-bold flex items-center justify-center gap-2 transition shadow-md group">
              <Upload size={18} className="text-teal-400 group-hover:scale-110 transition-transform" />
              <span>{t('upload_lesion_photo')}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Quick Clinical Test Benchmarks (Instant Verification) */}
          <div className="space-y-3 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={13} className="text-teal-400" /> {t('sample_lesions_label')}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {SAMPLE_LESIONS.map((s) => (
                <button
                  key={s.id || s.name}
                  onClick={() => handleSelectSample(s)}
                  className="min-h-[44px] p-3 rounded-2xl bg-white/[0.03] hover:bg-teal-500/10 border border-white/10 hover:border-teal-400/40 text-left transition-all hover:scale-[1.02] flex flex-col justify-between gap-1.5 group"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold text-white group-hover:text-teal-300 truncate">
                      {t(s.name) || s.name}
                    </span>
                    <span 
                      className={`size-2 rounded-full shrink-0 ${
                        s.risk === 'HIGH' ? 'bg-red-400' : s.risk === 'MEDIUM' ? 'bg-amber-400' : 'bg-emerald-400'
                      }`} 
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono truncate">
                    {s.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 4: DIAGNOSIS & REFERRAL REPORT ================= */}
      {step === 4 && diagnosis && (
        <div className="relative rounded-3xl p-6 sm:p-10 bg-slate-900/70 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-8 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3.5">
              <div className="size-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
                <HeartPulse size={22} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {t('clinical_triage_decision')}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  {t('syndromic_eval_protocol')}
                </p>
              </div>
            </div>

            <button
              onClick={dictateCurrentStep}
              title={t('dictate_instructions')}
              className="size-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition"
            >
              <Volume2 size={16} />
            </button>
          </div>

          {/* Condition Verdict & Priority Badge */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-teal-300 uppercase tracking-widest font-bold mb-1">
                  {t('primary_clinical_finding')}
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
                  {t(diagnosis.condition) || diagnosis.condition}
                </h3>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-1.5">
                <span className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black tracking-wide uppercase border shadow-lg ${
                  diagnosis.risk === 'HIGH'
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-rose-500/20'
                    : diagnosis.risk === 'MEDIUM'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-amber-500/20'
                    : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-emerald-500/20'
                }`}>
                  {diagnosis.risk === 'HIGH' ? t('priority_high') : diagnosis.risk === 'MEDIUM' ? t('priority_medium') : t('priority_low')}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  ICD-10: <strong className="text-white">{diagnosis.icd10}</strong>
                </span>
              </div>
            </div>

            {/* Key Clinical Attributes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">
                  {lang === 'hi' ? 'सिंड्रोमिक विश्वसनीयता' : 'Syndromic Confidence'}
                </div>
                <div className="text-xl sm:text-2xl font-black text-teal-300">
                  {diagnosis.confidence}%
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">
                  {lang === 'hi' ? 'घाव प्रकार' : 'Lesion Morphology'}
                </div>
                <div className="text-sm font-bold text-slate-200 truncate" title={diagnosis.lesionType}>
                  {diagnosis.lesionType}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">
                  {lang === 'hi' ? 'रंग स्थिरता' : 'RGB Reliability'}
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-300">
                  {diagnosis.rgbReliability}%
                </div>
              </div>
            </div>

            {/* Operator Clinical Directive */}
            <div className="p-6 rounded-2xl bg-teal-500/10 border border-teal-500/25 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={14} /> {t('recommended_action_directives')}
                </div>
                <button
                  onClick={() => speak(`${t(diagnosis.condition) || diagnosis.condition}. ${t(diagnosis.directiveKey) || diagnosis.directive}`, voiceLang)}
                  className="size-8 rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 flex items-center justify-center transition"
                  title={t('dictate_instructions')}
                >
                  <Volume2 size={16} />
                </button>
              </div>
              <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed">
                {t(diagnosis.directiveKey) || diagnosis.directive}
              </p>
            </div>

            {/* CDSS Assistive Screening Statutory Disclaimer */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-left">
              <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-amber-300">
                  {t('statutory_cdss_disclaimer')}
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {t('cdss_disclaimer_content')}
                </p>
              </div>
            </div>

            {/* Resolved NHA HFR Facility Card */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 min-w-0">
              <div className="space-y-1 min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  {t('assigned_health_facility')}
                </div>
                <div className="text-lg font-bold text-white flex flex-wrap items-center gap-2">
                  <MapPin size={16} className="text-teal-400 shrink-0" />
                  <span className="break-words">{nearestPHC.name}</span>
                  <span className="text-xs font-mono text-slate-400 shrink-0">({nearestPHC.code})</span>
                </div>
                <div className="text-xs text-slate-400 break-words">
                  {t('medical_officer')}: {nearestPHC.medicalOfficer} · {t('proximity')} ~{nearestPHC.distanceKm} km
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
                <a
                  href={`tel:${nearestPHC.contact}`}
                  className="min-h-[44px] flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition no-underline"
                >
                  <PhoneCall size={14} className="text-teal-400" />
                  <span>{t('call_prefix')} PHC</span>
                </a>

                <button
                  onClick={handleSendSMS}
                  disabled={smsSending}
                  className="min-h-[44px] flex-1 sm:flex-none glow-teal-btn px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Send size={14} />
                  <span>{smsSending ? t('sending_sms') : t('send_sms')}</span>
                </button>
              </div>
            </div>

            {/* SMS Dispatch Feedback */}
            {smsResult && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span className="break-words">
                    {t('sms_sent')} ({smsResult.recipient}).
                  </span>
                </div>
                <span className="font-mono text-[11px] text-emerald-400 shrink-0">{smsResult.messageId}</span>
              </div>
            )}

            {/* Copy Slip & Reset Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <button
                onClick={handleCopySlip}
                className="w-full sm:w-auto min-h-[44px] px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/15 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <Copy size={15} className="text-teal-400" />
                <span>{copiedSlip ? `✓ ${t('copied_to_clipboard')}` : t('copy_digital_slip')}</span>
              </button>

              <button
                onClick={handleReset}
                className="w-full sm:w-auto min-h-[44px] glow-teal-btn px-8 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <RefreshCw size={16} />
                <span>{t('new_patient')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

        </div>

        {/* Right Column (Live Session Telemetry & Health Center): 5 cols on lg, 4 cols on xl */}
        <div className="lg:col-span-5 xl:col-span-4 w-full space-y-6">
          {/* Active Triage Session Card */}
          <div className="rounded-3xl p-5 sm:p-6 bg-slate-900/80 border border-white/10 backdrop-blur-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={13} /> {t('active_triage_session')}
              </span>
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">{t('patient')}:</span>
                <span className="font-bold text-white truncate max-w-[170px]" title={patient.fullName}>
                  {patient.fullName.trim() || t('awaiting_intake')}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">{t('demographics')}:</span>
                <span className="font-semibold text-slate-200">
                  {patient.age ? `${patient.age}y` : '—'} · {patient.sex === 'Male' ? t('male') : patient.sex === 'Female' ? t('female') : t('other')} · {patient.weight ? `${patient.weight}kg` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">{t('corridor_village')}:</span>
                <span className="font-semibold text-teal-300">
                  {patient.village}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-white/5">
                <span className="text-slate-400">{t('clinical_history_status')}:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {historyAnswers.filter(Boolean).length}/7 {t('recorded')}
                </span>
              </div>
            </div>
          </div>

          {/* Assigned Rural PHC Corridor Card */}
          {nearestPHC && (
            <div className="rounded-3xl p-5 sm:p-6 bg-slate-900/80 border border-white/10 backdrop-blur-2xl shadow-xl space-y-4 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin size={13} /> {t('assigned_health_facility')}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {t('nha_hfr_registered')}
                </span>
              </div>

              <div className="min-w-0">
                <h4 className="text-base font-bold text-white tracking-tight break-words">{nearestPHC.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5 break-words">
                  {nearestPHC.district} {t('district_suffix') || 'District'} · <span className="font-mono">Code: {nearestPHC.code}</span>
                </p>
              </div>

              {/* Proximity and Medical Officer without clipping */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 min-w-0">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">{t('proximity')}</span>
                  <span className="font-mono font-bold text-teal-300">~{nearestPHC.distanceKm} km</span>
                </div>
                <div className="pt-1.5 border-t border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">{t('medical_officer')}</span>
                  <div
                    className="font-bold text-slate-100 text-xs sm:text-sm leading-snug break-words"
                    title={nearestPHC.medicalOfficer}
                  >
                    {nearestPHC.medicalOfficer}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                <a 
                  href={`tel:${nearestPHC.contact}`}
                  className="min-h-[44px] flex-1 min-w-[130px] px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold transition text-xs no-underline"
                >
                  <PhoneCall size={14} className="shrink-0" />
                  <span className="truncate">{t('call_prefix')} {nearestPHC.contact}</span>
                </a>
                <a 
                  href="tel:108" 
                  className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-extrabold transition flex items-center justify-center gap-1.5 text-xs no-underline shrink-0"
                >
                  <HeartPulse size={14} className="shrink-0" />
                  <span>{t('ambulance_108')}</span>
                </a>
              </div>
            </div>
          )}

          {/* Offline Intelligence Telemetry Specs */}
          <div className="rounded-3xl p-5 sm:p-6 bg-slate-900/80 border border-white/10 backdrop-blur-2xl shadow-xl space-y-3.5 text-xs">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Shield size={13} className="text-teal-400" /> {t('edge_ai_specifications')}
            </span>

            <div className="space-y-2 text-slate-400">
              <div className="flex items-center justify-between">
                <span>{t('inference_engine')}:</span>
                <span className="text-slate-200 font-medium">On-Device WASM / WebGL</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t('fitzpatrick_bias')}:</span>
                <span className="text-pink-300 font-semibold">{t('fitz_types_calibrated')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t('language_tts')}:</span>
                <span className="text-slate-200 font-medium">{t('bhashini_locales')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t('network_sandbox')}:</span>
                <span className="text-emerald-400 font-semibold">{t('offline_capable')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
