/**
 * Procedural Dermatology Sample Lesion Generator for Offline Testing
 * Generates realistic high-contrast skin lesion canvases matching Fitzpatrick V/VI and standard phototypes.
 */

function createLesionDataUrl(type) {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');

  // Background base skin tone (Fitzpatrick V / IV)
  const baseTone = type === 'Vitiligo' ? '#5A351D' : '#6F4426';
  ctx.fillStyle = baseTone;
  ctx.fillRect(0, 0, 300, 300);

  // Subtle skin texture noise
  for (let i = 0; i < 1500; i++) {
    const x = Math.random() * 300;
    const y = Math.random() * 300;
    const alpha = Math.random() * 0.12;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // Draw specific pathology
  switch (type) {
    case 'Scabies': {
      // Linear burrows with inflammatory papules
      ctx.strokeStyle = '#991B1B';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(90, 130);
      ctx.bezierCurveTo(120, 110, 150, 160, 190, 130);
      ctx.bezierCurveTo(210, 115, 230, 140, 240, 135);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(110, 170);
      ctx.bezierCurveTo(140, 190, 170, 175, 210, 195);
      ctx.stroke();

      // Pruritic excoriations and tiny vesicles
      const papules = [[100, 125], [145, 140], [185, 128], [225, 132], [130, 180], [165, 172], [195, 190]];
      papules.forEach(([px, py]) => {
        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.arc(px - 1, py - 1, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    case 'Eczema': {
      // Dry lichenified inflamed irregular patch
      const grad = ctx.createRadialGradient(150, 150, 20, 150, 150, 95);
      grad.addColorStop(0, '#B91C1C');
      grad.addColorStop(0.6, '#991B1B');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(150, 150, 85, 65, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();

      // Flakes / scaling
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.45)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 40; i++) {
        const sx = 100 + Math.random() * 100;
        const sy = 110 + Math.random() * 80;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + (Math.random() * 10 - 5), sy + (Math.random() * 10 - 5));
        ctx.stroke();
      }
      break;
    }

    case 'Dermatitis': {
      // Acute contact erythematous vesicular plaque
      ctx.fillStyle = 'rgba(220, 38, 38, 0.75)';
      ctx.beginPath();
      ctx.ellipse(150, 150, 75, 75, 0, 0, Math.PI * 2);
      ctx.fill();

      // Multiple pinpoint microvesicles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      for (let i = 0; i < 60; i++) {
        const vx = 110 + Math.random() * 80;
        const vy = 110 + Math.random() * 80;
        ctx.beginPath();
        ctx.arc(vx, vy, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'Tinea Ringworm': {
      // Annular active border with central hypopigmentation
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#B91C1C';
      ctx.beginPath();
      ctx.arc(150, 150, 65, 0, Math.PI * 2);
      ctx.stroke();

      // Central clearing
      ctx.fillStyle = '#854D0E';
      ctx.beginPath();
      ctx.arc(150, 150, 56, 0, Math.PI * 2);
      ctx.fill();

      // Scaly ring edge
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(150, 150, 72, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'Vitiligo': {
      // Well-demarcated depigmented chalky white macule
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.moveTo(110, 120);
      ctx.bezierCurveTo(90, 160, 130, 210, 170, 200);
      ctx.bezierCurveTo(210, 190, 220, 140, 190, 110);
      ctx.bezierCurveTo(160, 90, 130, 100, 110, 120);
      ctx.fill();

      // Hyperpigmented active border margin
      ctx.strokeStyle = '#29180D';
      ctx.lineWidth = 3;
      ctx.stroke();
      break;
    }

    case 'Melanoma': {
      // Asymmetric, irregular notched border, color variegation (black, brown, red)
      ctx.fillStyle = '#171717'; // Deep black
      ctx.beginPath();
      ctx.moveTo(120, 110);
      ctx.bezierCurveTo(80, 130, 90, 190, 140, 210);
      ctx.bezierCurveTo(180, 220, 230, 180, 220, 140);
      ctx.bezierCurveTo(210, 90, 160, 80, 120, 110);
      ctx.fill();

      // Variegated reddish-brown nodular focus
      ctx.fillStyle = '#7F1D1D';
      ctx.beginPath();
      ctx.arc(140, 145, 18, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    default: {
      ctx.fillStyle = '#991B1B';
      ctx.beginPath();
      ctx.arc(150, 150, 50, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return canvas.toDataURL('image/jpeg', 0.85);
}

export const SAMPLE_LESIONS = [
  {
    id: 'scabies',
    name: 'Scabies',
    category: 'Parasitic / High Contagion',
    description: 'Interdigital and flexural burrows with severe nocturnal pruritus',
    risk: 'HIGH',
    getDataUrl: () => createLesionDataUrl('Scabies')
  },
  {
    id: 'eczema',
    name: 'Eczema',
    category: 'Inflammatory / Chronic',
    description: 'Dry lichenified excoriated patches with compromised skin barrier',
    risk: 'MEDIUM',
    getDataUrl: () => createLesionDataUrl('Eczema')
  },
  {
    id: 'dermatitis',
    name: 'Dermatitis',
    category: 'Contact Allergy',
    description: 'Acute vesicular plaques following localized allergen exposure',
    risk: 'MEDIUM',
    getDataUrl: () => createLesionDataUrl('Dermatitis')
  },
  {
    id: 'tinea',
    name: 'Tinea Ringworm',
    category: 'Fungal Infection',
    description: 'Annular plaque with active raised scaly border and central clearing',
    risk: 'LOW',
    getDataUrl: () => createLesionDataUrl('Tinea Ringworm')
  },
  {
    id: 'vitiligo',
    name: 'Vitiligo',
    category: 'Autoimmune Pigmentary',
    description: 'Well-demarcated amelanotic chalky white macules on dark skin',
    risk: 'MEDIUM',
    getDataUrl: () => createLesionDataUrl('Vitiligo')
  },
  {
    id: 'melanoma',
    name: 'Melanoma',
    category: 'Oncological Suspect',
    description: 'Asymmetric border irregularity with color variegation',
    risk: 'HIGH',
    getDataUrl: () => createLesionDataUrl('Melanoma')
  }
];
