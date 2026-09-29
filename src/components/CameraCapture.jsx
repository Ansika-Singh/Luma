import { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Upload } from 'lucide-react';

const CameraCapture = ({ onCapture, guideOverlay, requestedFacingMode }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const [useFallback, setUseFallback] = useState(false);

  const startCamera = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasVideo = devices.some(d => d.kind === 'videoinput');
      if (!hasVideo) {
        setUseFallback(true);
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
      setError('Could not access camera. Please upload a photo instead.');
    }
  };

  useEffect(() => {
    if (!useFallback) {
      startCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [useFallback]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      
      const imageData = canvasRef.current.toDataURL('image/jpeg');
      onCapture(imageData);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => onCapture(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  if (useFallback) {
    return (
      <div className="flex flex-col items-center justify-center p-4" style={{ backgroundColor: 'var(--border)', borderRadius: '0.5rem', height: '300px' }}>
        <p style={{ color: 'var(--severe)', marginBottom: '1rem', textAlign: 'center' }}>{error || 'Camera not available.'}</p>
        <button 
          className="btn btn-secondary" 
          onClick={() => fileInputRef.current?.click()}
          aria-label="Upload photo"
          style={{ minHeight: '44px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Upload size={20} /> Upload Photo
        </button>
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
    <div style={{ position: 'relative', width: '100%', borderRadius: '0.5rem', overflow: 'hidden', backgroundColor: '#000' }}>
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        style={{ width: '100%', display: 'block', minHeight: '300px' }}
        aria-label="Camera viewfinder"
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {/* Framing Guide Overlay */}
      {guideOverlay && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          border: '4px solid rgba(255,255,255,0.4)',
          margin: '2rem',
          borderRadius: '1rem',
          pointerEvents: 'none'
        }} />
      )}
      
      <div style={{ position: 'absolute', bottom: '1rem', left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <button 
          onClick={handleCapture}
          aria-label="Take photo"
          style={{
            width: '64px', height: '64px', borderRadius: '50%',
            backgroundColor: 'var(--primary)', border: '4px solid white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
          }}
        >
          <Camera size={28} />
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;
