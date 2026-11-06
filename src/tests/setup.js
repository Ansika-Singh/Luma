import '@testing-library/jest-dom';

// Ensure localStorage is always defined in JSDOM environments
if (typeof window !== 'undefined') {
  if (!window.localStorage || typeof window.localStorage.clear !== 'function') {
    const store = new Map();
    const mockStorage = {
      getItem: (key) => store.get(String(key)) ?? null,
      setItem: (key, val) => { store.set(String(key), String(val)); },
      removeItem: (key) => { store.delete(String(key)); },
      clear: () => { store.clear(); },
      key: (i) => Array.from(store.keys())[i] ?? null,
      get length() { return store.size; }
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true,
      configurable: true
    });
    global.localStorage = mockStorage;
  }

  // Mock SpeechSynthesis
  if (!('speechSynthesis' in window)) {
    window.speechSynthesis = {
      speak: () => {},
      cancel: () => {},
      pause: () => {},
      resume: () => {},
      getVoices: () => []
    };
  }

  // Mock SpeechRecognition
  if (!('webkitSpeechRecognition' in window)) {
    class MockSpeechRecognition {
      constructor() {
        this.lang = 'en-IN';
        this.continuous = false;
        this.interimResults = false;
        this.onresult = null;
        this.onerror = null;
        this.onend = null;
      }
      start() {}
      stop() { if (this.onend) this.onend(); }
      abort() { if (this.onend) this.onend(); }
    }
    window.webkitSpeechRecognition = MockSpeechRecognition;
    window.SpeechRecognition = MockSpeechRecognition;
  }
}
