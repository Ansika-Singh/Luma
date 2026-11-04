import * as tf from '@tensorflow/tfjs';

let model = null;

export const initSafeBackend = async () => {
  try {
    await tf.setBackend('webgl');
    await tf.ready();
  } catch (e) {
    console.warn("WebGL unavailable or crashed. Falling back to CPU/WASM.", e);
    await tf.setBackend('cpu');
    await tf.ready();
  }
};

// Initialize the model once (Singleton)
export const loadModel = async () => {
  if (!model) {
    console.log('Loading Clinical Dermatology Model (HAM10000)...');
    try {
      await initSafeBackend();
      model = await tf.loadLayersModel('/model/model.json');
      
      // Warm-up inference to compile WebGL shaders
      console.log('Running warm-up inference...');
      tf.tidy(() => {
        model.predict(tf.zeros([1, 224, 224, 3])).dispose();
      });
      
      localStorage.setItem('luma_model_cached', 'true');
      console.log('Dermatology Model loaded successfully.');
    } catch (error) {
      if (!navigator.onLine && !localStorage.getItem('luma_model_cached')) {
        throw new Error('ModelNotAvailableOffline');
      }
      throw error;
    }
  }
  return model;
};

const TARGET_CLASSES = {
  0: { condition: 'Actinic Keratoses', severity: 'severe', explanation: 'Detected patterns consistent with Actinic Keratoses (Solar Keratoses). This is a precancerous condition.', flags: ['rough patch', 'sun damage'] },
  1: { condition: 'Basal Cell Carcinoma', severity: 'severe', explanation: 'Detected signs of Basal Cell Carcinoma. This is a common type of skin cancer.', flags: ['pearly bump', 'lesion'] },
  2: { condition: 'Benign Keratosis', severity: 'mild', explanation: 'Detected a Benign Keratosis. This is a non-cancerous skin growth.', flags: ['waxy appearance', 'pigmentation'] },
  3: { condition: 'Dermatofibroma', severity: 'mild', explanation: 'Detected a Dermatofibroma, a common benign skin growth.', flags: ['firm nodule'] },
  4: { condition: 'Melanoma', severity: 'urgent', explanation: 'Detected patterns strongly associated with Melanoma. Immediate medical evaluation is recommended.', flags: ['asymmetry', 'irregular borders', 'color variation'] },
  5: { condition: 'Melanocytic Nevi', severity: 'mild', explanation: 'Detected a Melanocytic Nevi (common mole). It appears benign.', flags: ['symmetric', 'even borders'] },
  6: { condition: 'Vascular Lesion', severity: 'moderate', explanation: 'Detected a Vascular skin lesion, an abnormality in the blood vessels of the skin.', flags: ['redness', 'vascular structure'] }
};

const interpretSkinResults = (predictions) => {
  // predictions is an array of probabilities matching TARGET_CLASSES indices
  
  // Create an array of objects to sort easily
  const sortedPredictions = predictions.map((p, idx) => ({ prob: p, idx }))
                                       .sort((a, b) => b.prob - a.prob);
                                       
  const top1 = sortedPredictions[0];
  const top2 = sortedPredictions[1];

  // Entropy / Confidence Thresholding
  if (top1.prob < 0.45 || (top1.prob - top2.prob) < 0.08) {
    return {
      condition: 'Inconclusive / Retake Photo',
      severity: 'mild',
      explanation: 'The model could not make a confident classification. This might be due to poor lighting, blurry image, or an out-of-distribution input.',
      flags: ['low confidence', 'ambiguous features'],
      confidence: top1.prob
    };
  }

  const confidence = top1.prob;
  const classInfo = TARGET_CLASSES[top1.idx];

  return {
    ...classInfo,
    confidence
  };
};

export function validateImageQuality(canvas) {
  const ctx = canvas.getContext('2d');
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let totalBrightness = 0;
  for (let i = 0; i < data.length; i += 4) {
    totalBrightness += (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
  }
  const avgBrightness = totalBrightness / (data.length / 4);
  if (avgBrightness < 30) throw new Error("Image too dark. Please use adequate lighting.");
  if (avgBrightness > 235) throw new Error("Image overexposed. Glare detected.");
}

export const analyzeSkinImage = async (imageElement) => {
  try {
    // Validate image quality before processing
    const canvas = document.createElement('canvas');
    canvas.width = imageElement.width || imageElement.videoWidth;
    canvas.height = imageElement.height || imageElement.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    validateImageQuality(canvas);

    const loadedModel = await loadModel();
    
    // Wrap preprocessing and inference to prevent WebGL memory leaks
    const predictionsArray = tf.tidy(() => {
      let tensor = tf.browser.fromPixels(imageElement);
      
      // Center-crop to prevent anamorphic stretching
      const size = Math.min(tensor.shape[0], tensor.shape[1]);
      const startY = Math.floor((tensor.shape[0] - size) / 2);
      const startX = Math.floor((tensor.shape[1] - size) / 2);
      tensor = tf.slice(tensor, [startY, startX, 0], [size, size, 3]);
      
      tensor = tf.image.resizeBilinear(tensor, [224, 224]).toFloat();
        
      let offset = tf.scalar(127.5);
      tensor = tensor.sub(offset).div(offset).expandDims();
      
      return loadedModel.predict(tensor).dataSync();
    });
    
    console.log('Skin raw predictions:', predictionsArray);
    return interpretSkinResults(Array.from(predictionsArray));
  } catch (error) {
    console.error('Inference error:', error);
    throw error;
  }
};

// Convert RGB to HSV
const rgbToHsv = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max === min) h = 0;
  else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h, s, v];
};

export const estimateFitzpatrick = (imageElement) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Downsample to 100x100
  canvas.width = 100;
  canvas.height = 100;
  ctx.drawImage(imageElement, 0, 0, 100, 100);
  
  // Sample a 20x20 region from the center
  const imageData = ctx.getImageData(40, 40, 20, 20);
  const data = imageData.data;
  
  let rSum = 0, gSum = 0, bSum = 0;
  const pixelCount = 20 * 20;
  
  for (let i = 0; i < data.length; i += 4) {
    rSum += data[i];
    gSum += data[i+1];
    bSum += data[i+2];
  }
  
  const rAvg = rSum / pixelCount;
  const gAvg = gSum / pixelCount;
  const bAvg = bSum / pixelCount;
  
  const [, , v] = rgbToHsv(rAvg, gAvg, bAvg);
  const luminance = v * 255; // Use Value (brightness) from HSV
  
  let type = 'I';
  if (luminance < 60) type = 'VI';
  else if (luminance < 100) type = 'V';
  else if (luminance < 140) type = 'IV';
  else if (luminance < 180) type = 'III';
  else if (luminance < 210) type = 'II';
  
  return {
    type,
    hex: `#${Math.round(rAvg).toString(16).padStart(2, '0')}${Math.round(gAvg).toString(16).padStart(2, '0')}${Math.round(bAvg).toString(16).padStart(2, '0')}`
  };
};
