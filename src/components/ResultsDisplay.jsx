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
    <div className="flex flex-col gap-4 w-full">
      <div className="relative rounded-2xl overflow-hidden min-h-[220px] bg-slate-900/60 border border-white/10 flex items-center justify-center shadow-inner">
        {imageSrc ? (
          <img src={imageSrc} alt="Scan Result" className="w-full object-cover max-h-80 rounded-2xl" />
        ) : (
          <div className="text-slate-400 text-sm p-6 text-center flex flex-col items-center gap-2">
            <span className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
              📸
            </span>
            <span>No scan image preview available</span>
          </div>
        )}
        {/* Canvas for XAI Heatmap */}
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen filter blur-md"
        />
      </div>
      
      <div className="glass-card p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
        <div className="flex justify-between items-center gap-3">
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">{condition}</h3>
          <span className="glass-pill px-3 py-1 rounded-full text-xs font-semibold text-teal-300 border border-teal-500/30 bg-teal-500/10 shadow-[0_0_12px_rgba(20,184,166,0.2)]">
            {Math.round(confidence * 100)}% Match
          </span>
        </div>
        
        <p className="text-sm text-slate-300 leading-relaxed">
          {explanation}
        </p>

        {flags && flags.length > 0 && (
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Flagged For:</span>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-200 space-y-1">
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
          className="flex-1 py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] active:scale-[0.99] border border-white/15 text-white text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-lg disabled:opacity-50"
        >
          {exported ? <Check size={18} className="text-emerald-400" /> : <Download size={18} className="text-teal-400" />}
          {exported ? 'Saved to Device' : (exporting ? 'Generating...' : 'Save as Image')}
        </button>
      </div>

      <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[11px] sm:text-xs text-amber-200/80 text-center leading-normal">
        <strong>{t('disclaimer')}</strong>
      </div>
    </div>
  );
};

export default ResultsDisplay;
