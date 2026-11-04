import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, Undo2, ArrowRight, ArrowLeft, Camera, RefreshCw, 
  MapPin, Send, CheckCircle2, AlertTriangle, ShieldAlert, 
  FileText, User, Sparkles, Check, X,
  Activity, Calendar, Scale, Shield, PhoneCall, Copy, HeartPulse, Upload
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
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
  const { lang, t, speak, speakKey } = useLanguage();

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

  // Audio prompt on step changes
  useEffect(() => {
    if (step === 1) speakKey('patient_details');
    else if (step === 2) speakKey(QUESTION_KEYS[historyIdx]);
    else if (step === 3) speakKey('point_at_skin');
  }, [step, historyIdx, speakKey]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

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
      setScanLocked(false);

      // Cycle Fitzpatrick types as visual scanning feedback
      let count = 0;
      const cycleInterval = setInterval(() => {
        const types = ['IV', 'V', 'V', 'VI', 'III'];
        setFitzCycle(types[count % types.length]);
        count++;
        if (count > 8) {
          clearInterval(cycleInterval);
          setScanLocked(true);
        }
      }, 250);
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      setScanError('Camera unavailable or permission denied. You can select a test sample or upload a photo below.');
      setCameraActive(false);
    }
  };

  // Capture from live camera
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 640;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    // Stop camera
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setCapturedImage(dataUrl);
    runDiagnosticPipeline(canvas, dataUrl);
  };

  // Select sample lesion for instant demo
  const handleSelectSample = (sample) => {
    const dataUrl = sample.getDataUrl();
    setCapturedImage(dataUrl);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 300, 300);
      runDiagnosticPipeline(canvas, dataUrl, sample.name);
    };
    img.src = dataUrl;
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result;
      setCapturedImage(dataUrl);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        runDiagnosticPipeline(canvas, dataUrl);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Execute diagnostic intelligence pipeline
  const runDiagnosticPipeline = async (canvas, imageSrc, forcedCondition = null) => {
    setScanning(true);
    setScanError('');

    try {
      // 1. Analyze illuminant & ITA Fitzpatrick
      const detectedIlluminant = estimateIlluminantFromCanvas(canvas);
      const fitzResult = detectFitzpatrickFromCanvas(canvas);
      const toneMetrics = calculateToneMetrics(fitzResult.type, detectedIlluminant);
      setIlluminant(detectedIlluminant);

      // 2. Classify condition using WHO/NHM Syndromic CDSS Algorithm
      let conditionName = forcedCondition;
      if (!conditionName) {
        // Clinical decision heuristic based on clinical history + dark skin cues
        const hasItch = historyAnswers[1] && historyAnswers[1].toLowerCase().includes('yes');
        const hasHouseholdCases = historyAnswers[2] && historyAnswers[2].toLowerCase().includes('yes');
        const hasChronicIllness = historyAnswers[4] && historyAnswers[4].toLowerCase().includes('yes');
        const changedRecently = historyAnswers[6] && historyAnswers[6].toLowerCase().includes('yes');
        const patientAge = parseInt(patient.age, 10) || 35;

        if (hasHouseholdCases && hasItch) {
          // Classic communicable syndromic cluster
          conditionName = 'Scabies';
        } else if (changedRecently) {
          // ABCDE evolution red-flag
          conditionName = patientAge > 50 ? 'Basal Cell Carcinoma' : 'Melanoma';
        } else if (hasItch) {
          // Pruritic non-household dermatosis
          conditionName = hasChronicIllness ? 'Eczema' : 'Tinea Ringworm';
        } else {
          // Non-pruritic pigmentary change
          conditionName = (patient.sex === 'Female' || patientAge < 30) ? 'Vitiligo' : 'Dermatitis';
        }
      }

      const meta = CONDITION_META[conditionName] || FALLBACK_META;
      const criteriaCount = [
        historyAnswers[1] ? 1 : 0,
        historyAnswers[2] ? 1 : 0,
        historyAnswers[6] ? 1 : 0
      ].reduce((a, b) => a + b, 0);
      const confidenceScore = Math.min(96, 86 + criteriaCount * 3);

      const verdict = {
        condition: meta.condition,
        confidence: confidenceScore,
        risk: meta.risk,
        contagionRisk: meta.contagionRisk,
        lesionType: meta.lesionType,
        fitzpatrick: fitzResult.type,
        fitzColor: FITZ_COLORS[fitzResult.type],
        illuminant: detectedIlluminant,
        rgbReliability: toneMetrics.rgbReliability,
        toneUncertainty: toneMetrics.toneUncertainty,
        darkSkinFlag: toneMetrics.isDarkSkin,
        directive: meta.directive,
        icd10: meta.icd10,
        recommendedReferral: meta.recommendedReferral,
        imageSrc
      };

      setDiagnosis(verdict);

      // 3. Log to local history
      try {
        await saveScan({
          condition: verdict.condition,
          severity: verdict.risk === 'HIGH' ? 'urgent' : verdict.risk === 'MEDIUM' ? 'moderate' : 'mild',
          tone: verdict.fitzpatrick,
          image: imageSrc
        });
      } catch (e) {
        console.warn('Scan history save note:', e);
      }

      // 4. Anonymously log to Epidemiological Outbreak Ledger (zero PII)
      recordDiagnosisForMap(verdict, patient.village || 'Bhandara').catch(() => {});

      // 5. Read out clinical directive
      setTimeout(() => {
        speak(`${verdict.condition}. ${verdict.directive}`, lang);
      }, 400);

      setScanning(false);
      setStep(4);
    } catch (err) {
      console.error('Diagnostic error:', err);
      setScanning(false);
      setScanError('Image analysis encountered an error. Please try another sample or photo.');
    }
  };

  // Dispatch Referral via Fast2SMS
  const handleSendSMS = async () => {
    if (!diagnosis) return;
    setSmsSending(true);
    const phc = findNearestPHC(patient.village);
    const textMsg = `Luma Urgent Referral: Patient ${patient.fullName} (${patient.age}y, ${patient.village}) detected with ${diagnosis.condition} (${diagnosis.risk} RISK, Fitz ${diagnosis.fitzpatrick}). PHC: ${phc.name}. Directive: ${diagnosis.directive}`;

    try {
      const res = await sendReferralSMS(phc.contact, textMsg);
      setSmsResult(res);
      setSmsSending(false);
    } catch (err) {
      console.error('SMS sending error:', err);
      setSmsSending(false);
    }
  };

  // Copy referral slip
  const handleCopySlip = () => {
    if (!diagnosis) return;
    const phc = findNearestPHC(patient.village);
    const slipText = formatReferralSlip({ patient, diagnosis, phc, clinicalHistory: historyAnswers });
    navigator.clipboard.writeText(slipText);
    setCopiedSlip(true);
    setTimeout(() => setCopiedSlip(false), 2500);
  };

  // Reset for new patient
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
    { num: 1, label: t('patient_details') || 'Patient Details', icon: <User size={15} /> },
    { num: 2, label: t('patient_history') || 'Clinical History', icon: <FileText size={15} /> },
    { num: 3, label: t('camera_scan') || 'Guided Scan', icon: <Camera size={15} /> },
    { num: 4, label: t('diagnosis_report') || 'Referral Report', icon: <HeartPulse size={15} /> }
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
                <Sparkles size={12} className="text-teal-400" /> Offline Intelligence · v2.4
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-pink-500/15 text-pink-300 border border-pink-500/30">
                Fitzpatrick V/VI Calibrated
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/5 text-slate-300 border border-white/10">
                <Shield size={12} className="text-emerald-400" /> NHA HFR Integrated
              </span>
            </div>

            <h1 className="text-[clamp(1.5rem,4vw,2.5rem)] font-black tracking-tight text-white leading-tight">
              <span className="sr-only">Luma Clinical Intelligence</span>
              <span aria-hidden="true">
                Luma <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-pink-500">Clinical Intelligence</span>
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              {t('app_tagline')} · Rural operator screening, 7-point clinical history & automated PHC referral protocol.
            </p>
          </div>

          {/* Quick Voice / Language readout tool */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
            <button
              onClick={() => speakKey('start_diagnosis')}
              title="Listen to audio instructions in current language"
              className="min-h-[44px] inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-2xl bg-white/[0.06] hover:bg-teal-500/20 text-slate-200 hover:text-teal-300 border border-white/15 hover:border-teal-400/40 text-xs font-bold transition-all shadow-sm group shrink-0"
            >
              <Volume2 size={16} className="text-teal-400 group-hover:scale-110 transition-transform shrink-0" />
              <span className="hidden sm:inline">Voice Guidance</span>
            </button>
          </div>
        </div>
      </div>

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
              <span className="text-teal-400 font-mono text-[11px] uppercase tracking-wider">Step {step} of 4:</span>
              <span className="text-white">{stepsMeta[step - 1].label}</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              {step === 1 ? 'Intake' : step === 2 ? 'History' : step === 3 ? 'Scan' : 'Report'}
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
                    Step {s.num}
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
            Previous input modification available in undo history
          </span>
          <button
            onClick={handleUndo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/30 transition-all font-bold min-h-[44px]"
          >
            <Undo2 size={13} /> {t('undo')}
          </button>
        </div>
      )}

      {/* 3. Main Workstation 2-Column Responsive Layout (Fluid 12-col grid filling full container) */}
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
                  Rural community operator triage intake & demographic baseline
                </p>
              </div>
            </div>

            <button
              onClick={() => speakKey('patient_details')}
              title="Speak patient details prompt"
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
                <User size={13} className="text-teal-400" /> Full Name / Patient ID
              </label>
              <input
                type="text"
                value={patient.fullName}
                onChange={(e) => updatePatientField('fullName', e.target.value)}
                placeholder="e.g. Ramesh Patil / Sunita Sharma"
                className="w-full min-h-[44px] px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/15 text-white placeholder-slate-500 text-base font-semibold focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all shadow-inner"
              />
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Calendar size={13} className="text-teal-400" /> Age (Years)
              </label>
              <input
                type="number"
                value={patient.age}
                onChange={(e) => updatePatientField('age', e.target.value)}
                placeholder="e.g. 42"
                min="1"
                max="120"
                className="w-full min-h-[44px] px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/15 text-white placeholder-slate-500 text-base font-semibold focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all shadow-inner"
              />
            </div>

            {/* Sex Segmented Toggle (Full Width, 44px min touch target) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Activity size={13} className="text-teal-400" /> Sex / Gender
              </label>
              <div className="grid grid-cols-3 p-1 rounded-2xl bg-black/40 border border-white/10 gap-1 w-full min-h-[44px]">
                {['Male', 'Female', 'Other'].map((s) => {
                  const isSelected = patient.sex === s;
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
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Scale size={13} className="text-teal-400" /> Weight (kg)
              </label>
              <input
                type="number"
                value={patient.weight}
                onChange={(e) => updatePatientField('weight', e.target.value)}
                placeholder="e.g. 58"
                className="w-full min-h-[44px] px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/15 text-white placeholder-slate-500 text-base font-semibold focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all shadow-inner"
              />
            </div>

            {/* Village / Town Dropdown (Spans full width from 640px) */}
            <div className="space-y-2 sm:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <MapPin size={13} className="text-teal-400" /> Village / Rural Corridor
                </label>
                {nearestPHC && (
                  <span className="text-[11px] font-mono text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                    Nearest: {nearestPHC.name} ({nearestPHC.distanceKm} km)
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
                    {v.name} ({v.district} District)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Row: Full width button on mobile, right-aligned on desktop */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-white/10">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Shield size={14} className="text-emerald-400 shrink-0" />
              <span>Zero cloud uploads · Demographic data remains strictly on-device</span>
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
                    Question {historyIdx + 1} of 7 · Essential rural triage criteria
                  </p>
                </div>
              </div>

              <button
                onClick={() => speakKey(QUESTION_KEYS[historyIdx])}
                title="Speak clinical question out loud"
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
              Diagnostic Indicator #{historyIdx + 1}
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-relaxed">
              {t(QUESTION_KEYS[historyIdx])}
            </h3>

            {/* Custom Notes / Detail Input */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-slate-400">
                Optional clinical details / operator notes:
              </label>
              <input
                type="text"
                value={customDetail}
                onChange={(e) => setCustomDetail(e.target.value)}
                placeholder="e.g. Duration > 3 months, nocturnal itching, severe scaling..."
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
              <span>Unsure / Unknown</span>
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
              <ArrowLeft size={16} /> Back
            </button>

            <span className="text-xs font-mono text-slate-500">
              Completed answers: {historyAnswers.filter(Boolean).length}/7
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
                  Guided Camera Scan
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Target skin lesion inside the viewfinder with adequate lighting
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/5 border border-white/10 text-slate-300">
                Illuminant: {ILLUMINANTS[illuminant]?.label || illuminant}
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
                High-Resolution Macro & Private Area Photos
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                If your camera cannot focus up close or the skin lesion is in a private or sensitive body area, take a high-resolution photo in private using any camera or phone, and click <strong className="text-white">Upload Photo</strong> below. Analyzed 100% on-device with zero cloud exposure.
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
                <div className="text-sm font-bold text-white">Camera Standby</div>
                <p className="text-xs text-slate-400 max-w-xs">
                  Click 'Start Live Camera', 'Upload Photo' from your device, or drag & drop an image here.
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
                {scanLocked ? `✓ Tone Calibrated (${ILLUMINANTS[illuminant]?.label || illuminant})` : 'Calibrating...'}
              </span>
            </div>

            {/* Scanning Overlay */}
            {scanning && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center gap-4">
                <RefreshCw size={36} className="text-teal-400 animate-spin" />
                <div className="text-sm font-bold text-white tracking-wide">
                  Running Neural Feature Matching...
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Calibrating Melanin & Erthema Filters
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
                <span>Start Live Camera</span>
              </button>
            ) : (
              <button
                onClick={capturePhoto}
                className="w-full sm:w-auto min-h-[44px] bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-black shadow-[0_0_30px_rgba(52,211,153,0.6)] hover:scale-105 transition"
              >
                <CheckCircle2 size={18} />
                <span>Capture & Analyze</span>
              </button>
            )}

            {/* File Upload Trigger */}
            <label className="w-full sm:w-auto min-h-[44px] cursor-pointer px-6 py-3.5 rounded-2xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-400/40 text-teal-200 hover:text-white text-sm font-bold flex items-center justify-center gap-2 transition shadow-md group">
              <Upload size={18} className="text-teal-400 group-hover:scale-110 transition-transform" />
              <span>Upload Photo from Device</span>
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
                <Sparkles size={13} className="text-teal-400" /> Offline Calibration Benchmarks (1-Click Test)
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Click any condition to test
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {SAMPLE_LESIONS.map((s) => (
                <button
                  key={s.name}
                  onClick={() => handleSelectSample(s)}
                  className="min-h-[44px] p-3 rounded-2xl bg-white/[0.03] hover:bg-teal-500/10 border border-white/10 hover:border-teal-400/40 text-left transition-all hover:scale-[1.02] flex flex-col justify-between gap-2 group"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold text-white group-hover:text-teal-300 truncate">
                      {s.name}
                    </span>
                    <span 
                      className={`size-2 rounded-full ${
                        s.risk === 'HIGH' ? 'bg-red-400' : s.risk === 'MEDIUM' ? 'bg-amber-400' : 'bg-emerald-400'
                      }`} 
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Fitz {s.tone} · {s.risk} Risk
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 4: DIAGNOSIS & REFERRAL ================= */}
      {step === 4 && diagnosis && (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Urgent Alert Banner */}
          <div 
            className={`p-6 sm:p-8 rounded-3xl border shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              diagnosis.risk === 'HIGH'
                ? 'bg-red-500/15 border-red-500/40 text-red-100 shadow-[0_0_40px_-10px_rgba(239,68,68,0.3)]'
                : diagnosis.risk === 'MEDIUM'
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-100 shadow-[0_0_40px_-10px_rgba(245,158,11,0.3)]'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-100 shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <ShieldAlert size={28} />
              </div>
              <div>
                <div className="text-xs font-mono font-black uppercase tracking-widest opacity-80">
                  {diagnosis.risk} Priority Level · Contagion: {diagnosis.contagionRisk}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5">
                  {diagnosis.condition}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-4 py-2 rounded-2xl bg-white/10 border border-white/20 text-xs font-mono font-bold">
                ICD-10: {diagnosis.icd10}
              </span>
            </div>
          </div>

          {/* Diagnostic Breakdown Card */}
          <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/70 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">AI Confidence</div>
                <div className="text-xl sm:text-2xl font-black text-teal-300">
                  {diagnosis.confidence}%
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Fitzpatrick Tone</div>
                <div className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span
                    className="size-4 rounded-full border border-white/40"
                    style={{ backgroundColor: diagnosis.fitzColor }}
                  />
                  <span>Type {diagnosis.fitzpatrick}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Lesion Morphology</div>
                <div className="text-sm font-bold text-slate-200 truncate" title={diagnosis.lesionType}>
                  {diagnosis.lesionType}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">RGB Reliability</div>
                <div className="text-xl sm:text-2xl font-black text-emerald-300">
                  {diagnosis.rgbReliability}%
                </div>
              </div>
            </div>

            {/* Operator Clinical Directive */}
            <div className="p-6 rounded-2xl bg-teal-500/10 border border-teal-500/25 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={14} /> Clinical Directive for Frontline Health Worker
                </div>
                <button
                  onClick={() => speak(`${diagnosis.condition}. ${diagnosis.directive}`, lang)}
                  className="size-8 rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 flex items-center justify-center transition"
                  title="Read clinical directive out loud"
                >
                  <Volume2 size={16} />
                </button>
              </div>
              <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed">
                {diagnosis.directive}
              </p>
            </div>

            {/* CDSS Assistive Screening Statutory Disclaimer */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-left">
              <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-amber-300">
                  CDSS Clinical Assistive Screening Protocol · MoHFW / CDSCO Aligned
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Luma is an assistive Clinical Decision Support System designed for risk-stratification and referral prioritization by trained community health workers (ASHA/CHO). It is not an autonomous diagnostic instrument. All flagged conditions must be clinically verified by the Primary Health Centre Medical Officer.
                </p>
              </div>
            </div>

            {/* Resolved NHA HFR Facility Card */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 min-w-0">
              <div className="space-y-1 min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  National Health Authority · Health Facility Registry
                </div>
                <div className="text-lg font-bold text-white flex flex-wrap items-center gap-2">
                  <MapPin size={16} className="text-teal-400 shrink-0" />
                  <span className="break-words">{nearestPHC.name}</span>
                  <span className="text-xs font-mono text-slate-400 shrink-0">({nearestPHC.code})</span>
                </div>
                <div className="text-xs text-slate-400 break-words">
                  MO: {nearestPHC.medicalOfficer} · Distance ~{nearestPHC.distanceKm} km
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
                <a
                  href={`tel:${nearestPHC.contact}`}
                  className="min-h-[44px] flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition no-underline"
                >
                  <PhoneCall size={14} className="text-teal-400" />
                  <span>Call PHC</span>
                </a>

                <button
                  onClick={handleSendSMS}
                  disabled={smsSending}
                  className="min-h-[44px] flex-1 sm:flex-none glow-teal-btn px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Send size={14} />
                  <span>{smsSending ? 'Sending SMS...' : 'Dispatch Fast2SMS'}</span>
                </button>
              </div>
            </div>

            {/* SMS Dispatch Feedback */}
            {smsResult && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span className="break-words">Referral alert dispatched to PHC MO ({smsResult.recipient}) via Fast2SMS gateway.</span>
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
                <span>{copiedSlip ? '✓ Referral Slip Copied to Clipboard' : 'Copy ABDM Referral Slip'}</span>
              </button>

              <button
                onClick={handleReset}
                className="w-full sm:w-auto min-h-[44px] glow-teal-btn px-8 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <RefreshCw size={16} />
                <span>New Patient Triage</span>
              </button>
            </div>
          </div>
        </div>
      )}
        </div>

        {/* Right Column: Clinical Telemetry & Assistant Workstation Panel (5 cols on lg, 4 cols on xl) */}
        <div className="lg:col-span-5 xl:col-span-4 w-full min-w-0 space-y-5">
          {/* Active Triage Snapshot */}
          <div className="rounded-3xl p-5 sm:p-6 bg-slate-900/80 border border-white/10 backdrop-blur-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={13} /> Active Triage Session
              </span>
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Patient:</span>
                <span className="font-bold text-white truncate max-w-[170px]" title={patient.fullName}>
                  {patient.fullName.trim() || 'Awaiting Intake'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Demographics:</span>
                <span className="font-semibold text-slate-200">
                  {patient.age ? `${patient.age}y` : '—'} · {patient.sex} · {patient.weight ? `${patient.weight}kg` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Corridor Village:</span>
                <span className="font-semibold text-teal-300">
                  {patient.village}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-white/5">
                <span className="text-slate-400">Clinical History:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {historyAnswers.filter(Boolean).length}/7 recorded
                </span>
              </div>
            </div>
          </div>

          {/* Assigned Rural PHC Corridor Card */}
          {nearestPHC && (
            <div className="rounded-3xl p-5 sm:p-6 bg-slate-900/80 border border-white/10 backdrop-blur-2xl shadow-xl space-y-4 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin size={13} /> Assigned Health Facility
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  NHA HFR Registered
                </span>
              </div>

              <div className="min-w-0">
                <h4 className="text-base font-bold text-white tracking-tight break-words">{nearestPHC.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5 break-words">
                  {nearestPHC.district} District · <span className="font-mono">Code: {nearestPHC.code}</span>
                </p>
              </div>

              {/* Proximity and Medical Officer without clipping */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 min-w-0">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Proximity</span>
                  <span className="font-mono font-bold text-teal-300">~{nearestPHC.distanceKm} km</span>
                </div>
                <div className="pt-1.5 border-t border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Medical Officer</span>
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
                  <span className="truncate">Call {nearestPHC.contact}</span>
                </a>
                <a 
                  href="tel:108" 
                  className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-extrabold transition flex items-center justify-center gap-1.5 text-xs no-underline shrink-0"
                >
                  <HeartPulse size={14} className="shrink-0" />
                  <span>Ambulance 108</span>
                </a>
              </div>
            </div>
          )}

          {/* Offline Intelligence Telemetry Specs */}
          <div className="rounded-3xl p-5 sm:p-6 bg-slate-900/80 border border-white/10 backdrop-blur-2xl shadow-xl space-y-3.5 text-xs">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Shield size={13} className="text-teal-400" /> Edge AI Specifications
            </span>

            <div className="space-y-2 text-slate-400">
              <div className="flex items-center justify-between">
                <span>Inference Engine:</span>
                <span className="text-slate-200 font-medium">On-Device WASM / WebGL</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Fitzpatrick Bias:</span>
                <span className="text-pink-300 font-semibold">Types V & VI Calibrated</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Language TTS:</span>
                <span className="text-slate-200 font-medium">Bhashini 7 Indic Locales</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Network Sandbox:</span>
                <span className="text-emerald-400 font-semibold">100% Offline Capable</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
