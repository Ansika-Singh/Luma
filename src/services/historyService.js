import localforage from 'localforage';

if (localforage && typeof localforage.config === 'function') {
  localforage.config({
    name: 'LumaHealth',
    storeName: 'scans_history'
  });
}

const MAX_SCANS = 30;

// Downsample image to 480px max width/height to save IndexedDB space
const downsampleImage = async (base64Str) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_SIZE = 480;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        }
      } else {
        if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.8)); // compressed jpeg
    };
    img.src = base64Str;
  });
};

let memoryStore = [];

export const saveScan = async (scanData) => {
  try {
    const compressedImage = await downsampleImage(scanData.image);
    let history = (await localforage.getItem('scans')) || memoryStore || [];
    
    const newScan = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...scanData,
      image: compressedImage
    };
    
    history.unshift(newScan); // Add to beginning
    
    // Cap storage length
    if (history.length > MAX_SCANS) {
      history = history.slice(0, MAX_SCANS);
    }

    try {
      await localforage.setItem('scans', history);
      memoryStore = history;
    } catch (dbError) {
      if (dbError.name === 'QuotaExceededError' || dbError.code === 22) {
        const quotaErr = new Error('Quota exceeded: Unable to save scan.');
        quotaErr.code = 'QUOTA_EXCEEDED';
        throw quotaErr;
      }
      throw dbError;
    }
    
    return newScan;
  } catch (error) {
    console.error('Error saving scan to history:', error);
    throw error;
  }
};

export const getHistory = async () => {
  try {
    const items = await localforage.getItem('scans');
    if (items && Array.isArray(items)) return items;
    return memoryStore || [];
  } catch (error) {
    console.error('Error loading history:', error);
    return memoryStore || [];
  }
};

export const clearHistory = async () => {
  memoryStore = [];
  try {
    await localforage.removeItem('scans');
  } catch (error) {
    console.error('Error clearing history:', error);
  }
};
