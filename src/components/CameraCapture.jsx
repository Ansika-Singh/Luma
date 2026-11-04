import { useRef, useState, useEffect } from 'react';
import { Camera, Upload, Image as ImageIcon, ShieldCheck } from 'lucide-react';

const CameraCapture = ({ onCapture, guideOverlay, requestedFacingMode }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const [useFallback, setUseFallback] = useState(false);
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'upload'
  const [isDragging, setIsDragging] = useState(false);

  const startCamera = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasVideo = devices.some(d => d.kind === 'videoinput');
      if (!hasVideo) {
        setUseFallback(true);
        setActiveTab('upload');
        return;
      }

      let mediaStream;
      try {
        if (requestedFacingMode === 'user') {
          // Explicitly request user camera (webcam)
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' }
          });
        } else {
          // Try environment (rear) camera first
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
          });
        }
      } catch (envError) {
        console.warn('Fallback to standard camera:', envError);
        // Fallback to any available camera (like laptop webcam)
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
      }
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error(err);
      setUseFallback(true);
      setActiveTab('upload');
      setError('Could not access camera. Please upload a photo instead.');
    }
  };

  useEffect(() => {
    if (!useFallback && activeTab === 'camera') {
      startCamera();
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [useFallback, activeTab]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth || 640;
      canvasRef.current.height = videoRef.current.videoHeight || 480;
      context.drawImage(videoRef.current, 0, 0);
      
      const imageData = canvasRef.current.toDataURL('image/jpeg', 0.9);
      onCapture(imageData);
    }
  };

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target.result;
        setPreviewImage(result);
        onCapture(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // If camera is explicitly broken/unavailable, show fallback upload
  if (useFallback) {
    return (
      <div 
        className="flex flex-col items-center justify-center p-6 text-center rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl"
        style={{ minHeight: '320px' }}
      >
        <div className="size-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
          <Upload size={28} />
        </div>
        <p style={{ color: 'var(--severe)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
          {error || 'Camera not available.'}
        </p>
        <p className="text-xs text-slate-300 max-w-sm mb-6">
          You can upload any photo taken with another phone, camera, or saved on your device.
        </p>
        
        <button 
          className="btn btn-secondary glow-teal-btn px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg" 
          onClick={() => fileInputRef.current?.click()}
          aria-label="Upload photo"
          style={{ minHeight: '44px' }}
        >
          <Upload size={18} />
          <span>Upload Photo</span>
        </button>

        <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>100% On-Device & Confidential · Zero Cloud Storage</span>
        </div>

        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          aria-label="File upload"
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {/* Tab Switcher: Live Camera vs Upload Photo */}
      <div className="flex items-center justify-center p-1 rounded-2xl bg-white/[0.04] border border-white/10 max-w-sm mx-auto shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab('camera')}
          className={`flex-1 min-h-[40px] px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'camera'
              ? 'bg-teal-500 text-slate-950 shadow-md font-black'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Camera size={14} />
          <span>Live Camera</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 min-h-[40px] px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'upload'
              ? 'bg-teal-500 text-slate-950 shadow-md font-black'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Upload size={14} />
          <span>Upload Photo</span>
        </button>
      </div>

      {/* Hidden File Input for both tabs */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        aria-label="File upload"
      />

      {/* TAB 1: Live Camera Viewfinder */}
      {activeTab === 'camera' && (
        <div style={{ position: 'relative', width: '100%', borderRadius: '1rem', overflow: 'hidden', backgroundColor: '#000', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            style={{ width: '100%', display: 'block', minHeight: '320px', objectFit: 'cover' }}
            aria-label="Camera viewfinder"
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          
          {/* Framing Guide Overlay */}
          {guideOverlay && (
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              border: '3px solid rgba(45, 212, 191, 0.6)',
              margin: '1.5rem',
              borderRadius: '1rem',
              pointerEvents: 'none',
              boxShadow: 'inset 0 0 20px rgba(45, 212, 191, 0.2)'
            }} />
          )}

          {/* Bottom Control Bar */}
          <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4 px-4 z-20">
            {/* Shutter Button */}
            <button 
              onClick={handleCapture}
              aria-label="Take photo"
              className="w-16 h-16 rounded-full bg-teal-400 hover:bg-teal-300 text-slate-950 border-4 border-white shadow-[0_0_25px_rgba(45,212,191,0.6)] cursor-pointer flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
            >
              <Camera size={28} />
            </button>

            {/* Quick Upload from Device Button right beside shutter */}
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload photo"
              title="Upload photo from device gallery"
              className="min-h-[44px] px-3.5 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg"
            >
              <Upload size={16} className="text-teal-400" />
              <span className="hidden sm:inline">Upload</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Upload Photo & Drag-and-Drop Zone */}
      {activeTab === 'upload' && (
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl p-8 sm:p-10 border-2 border-dashed transition-all flex flex-col items-center justify-center text-center space-y-4 ${
            isDragging 
              ? 'border-teal-400 bg-teal-500/10 scale-[1.01]' 
              : 'border-white/20 hover:border-teal-400/50 bg-slate-900/60 hover:bg-slate-900/90'
          }`}
          style={{ minHeight: '320px' }}
        >
          <div className="size-16 rounded-3xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300 shadow-[0_0_20px_rgba(45,212,191,0.2)]">
            <ImageIcon size={30} />
          </div>

          <div className="space-y-1.5">
            <h4 className="text-base sm:text-lg font-black text-white">
              Upload Skin or Lesion Photo
            </h4>
            <p className="text-xs text-slate-300 max-w-sm">
              Click to browse your device files or drag & drop high-resolution photos taken with any phone or external camera.
            </p>
          </div>

          <button 
            type="button"
            className="min-h-[44px] px-6 py-2.5 rounded-xl bg-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg hover:bg-teal-300 transition"
            aria-label="Upload photo"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            <Upload size={16} />
            <span>Select Image from Files</span>
          </button>

          {/* Clinical Sensitivity & Privacy Badge */}
          <div className="pt-2 border-t border-white/10 w-full max-w-xs space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-400">
              <ShieldCheck size={14} />
              <span>Safe for Private & Sensitive Areas</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              Take photos privately with an external camera or phone. Processed 100% in your browser. Never uploaded to the cloud.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
