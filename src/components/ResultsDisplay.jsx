import { useState, useEffect, useRef } from 'react';
import EscalationAlert from './EscalationAlert';
import { Download, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ResultsDisplay = ({ 
  imageSrc, 
  condition, 
  severity, 
  confidence, 
  explanation,
  flags
}) => {
  const { t } = useLanguage();
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Generate mock Grad-CAM heatmap over the image
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      // Set canvas size to match the image aspect ratio roughly
      canvas.width = 300;
      canvas.height = 300;
      
      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create radial gradient for heatmap hotspot
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      
      if (severity === 'severe' || severity === 'urgent') {
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.7)'); // Red center
        gradient.addColorStop(0.4, 'rgba(245, 158, 11, 0.5)'); // Orange mid
      } else {
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.6)'); // Green center
        gradient.addColorStop(0.4, 'rgba(20, 184, 166, 0.4)'); // Teal mid
      }
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add some 'noise' or secondary hotspots for realism
      const secondaryGradient = ctx.createRadialGradient(
        canvas.width * 0.7, canvas.height * 0.3, 0,
        canvas.width * 0.7, canvas.height * 0.3, canvas.width / 3
      );
      secondaryGradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
      secondaryGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = secondaryGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [severity, condition]);

  const handleExport = () => {
    setExporting(true);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // A4-ish ratio, standard width
    canvas.width = 800;
    canvas.height = 1000;
    
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Header
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(0, 0, canvas.width, 80);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('Luma Health Report', 40, 50);
    
    // Date
    ctx.fillStyle = '#64748b';
    ctx.font = '20px sans-serif';
    ctx.fillText(`Generated: ${new Date().toLocaleDateString()}`, 40, 130);

    const img = new Image();
    img.onload = () => {
      // Draw image
      ctx.drawImage(img, 40, 160, 300, 300);
      
      // Draw condition and details
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(condition, 380, 200);
      
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`Confidence: ${Math.round(confidence * 100)}% Match`, 380, 240);
      
      let sevColor = '#b45309';
      if (severity === 'mild') sevColor = '#047857';
      if (severity === 'severe' || severity === 'urgent') sevColor = '#b91c1c';
      
      ctx.fillStyle = sevColor;
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`Severity: ${severity.toUpperCase()}`, 380, 280);

      // Explanation (wrap text)
      ctx.fillStyle = '#334155';
      ctx.font = '20px sans-serif';
      const words = explanation.split(' ');
      let line = '';
      let y = 330;
      for(let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 380 && n > 0) {
          ctx.fillText(line, 380, y);
          line = words[n] + ' ';
          y += 30;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 380, y);

      // Flags
      if (flags && flags.length > 0) {
        y += 50;
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('FLAGGED FOR:', 380, y);
        ctx.fillStyle = '#334155';
        ctx.font = '18px sans-serif';
        flags.forEach((f, idx) => {
          ctx.fillText(`• ${f}`, 380, y + 25 + (idx * 25));
        });
      }

      // Disclaimer - Explicitly drawn at the bottom
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(40, canvas.height - 120, canvas.width - 80, 80);
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(40, canvas.height - 120, canvas.width - 80, 80);
      
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(t('disclaimer'), canvas.width / 2, canvas.height - 75);

      // Trigger download
      const link = document.createElement('a');
      link.download = `luma-scan-report-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      setExporting(false);
      setExported(true);
      setTimeout(() => setExported(false), 3000);
    };
    img.onerror = () => {
      console.error('Failed to load image for export');
      setExporting(false);
    };
    img.src = imageSrc;
  };

  return (
    <div className="flex flex-col gap-4">
      <div style={{ position: 'relative', borderRadius: '0.5rem', overflow: 'hidden' }}>
        <img src={imageSrc} alt="Scan Result" style={{ width: '100%', display: 'block' }} />
        {/* Canvas for XAI Heatmap */}
        <canvas 
          ref={canvasRef}
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            mixBlendMode: 'multiply', pointerEvents: 'none', filter: 'blur(10px)'
          }} 
        />
      </div>
      
      <div style={{ padding: '1.5rem', backgroundColor: '#10141D', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '1rem' }}>
        <div className="flex justify-between items-center mb-4">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>{condition}</h3>
          <span style={{ fontSize: '0.875rem', color: '#2dd4bf', fontWeight: 'bold' }}>
            {Math.round(confidence * 100)}% Match
          </span>
        </div>
        
        <p style={{ fontSize: '0.9rem', color: '#A6ADBB', marginBottom: '1rem' }}>
          {explanation}
        </p>

        {flags && flags.length > 0 && (
          <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#A6ADBB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Flagged For:</span>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', marginTop: '0.5rem', fontSize: '0.9rem', color: 'white' }}>
              {flags.map((flag, idx) => (
                <li key={idx}>{flag}</li>
              ))}
            </ul>
          </div>
        )}

        <EscalationAlert severity={severity} />
      </div>

      <div className="flex gap-2">
        <button 
          onClick={handleExport}
          disabled={exporting}
          className="btn" 
          style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'center', gap: '0.5rem', borderRadius: '100px', cursor: 'pointer' }}
        >
          {exported ? <Check size={20} style={{ color: '#10b981' }} /> : <Download size={20} />}
          {exported ? 'Saved to Device' : (exporting ? 'Generating...' : 'Save as Image')}
        </button>
      </div>

      <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem', fontSize: '0.75rem', color: '#A6ADBB', textAlign: 'center' }}>
        <strong>{t('disclaimer')}</strong>
      </div>
    </div>
  );
};

export default ResultsDisplay;
