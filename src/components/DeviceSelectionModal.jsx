import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Monitor, Smartphone, X } from 'lucide-react';

const DeviceSelectionModal = ({ isOpen, onClose, onSelectLaptop }) => {
  const [showQR, setShowQR] = useState(false);
  const [mobileUrl, setMobileUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Create a URL pointing to the local IP if possible, or fallback to origin
      // In dev, window.location.origin is localhost, which won't work on mobile unless on same network and using IP
      // For demonstration, we'll use origin, but in production it's the real domain
      const baseUrl = window.location.hostname === 'localhost' 
        ? `http://${window.location.hostname}:${window.location.port}`
        : window.location.origin;
      setMobileUrl(`${baseUrl}/m/skin`);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#10141D', // matches Luma dark theme
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '1rem',
        padding: '2rem',
        maxWidth: '400px',
        width: '90%',
        color: '#F5F7FA',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem', right: '1rem',
            background: 'none', border: 'none',
            color: '#A6ADBB', cursor: 'pointer'
          }}
        >
          <X size={24} />
        </button>

        {!showQR ? (
          <>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
              How do you want to scan?
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button 
                onClick={onSelectLaptop}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem', borderRadius: '0.75rem',
                  backgroundColor: 'rgba(20, 184, 166, 0.1)',
                  border: '1px solid rgba(20, 184, 166, 0.3)',
                  color: 'white', cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ backgroundColor: 'rgba(20, 184, 166, 0.2)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                  <Monitor size={24} style={{ color: '#2dd4bf' }} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Use Laptop Camera</div>
                  <div style={{ fontSize: '0.85rem', color: '#A6ADBB' }}>Zoom your face into the webcam</div>
                </div>
              </button>

              <button 
                onClick={() => setShowQR(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem', borderRadius: '0.75rem',
                  backgroundColor: 'rgba(244, 114, 182, 0.1)',
                  border: '1px solid rgba(244, 114, 182, 0.3)',
                  color: 'white', cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ backgroundColor: 'rgba(244, 114, 182, 0.2)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                  <Smartphone size={24} style={{ color: '#f472b6' }} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Use Mobile Device</div>
                  <div style={{ fontSize: '0.85rem', color: '#A6ADBB' }}>Connect your phone to take photos</div>
                </div>
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Connect Mobile
            </h2>
            <p style={{ color: '#A6ADBB', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Scan this QR code with your phone's camera to open the dedicated mobile application.
            </p>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '1rem', 
              display: 'inline-block',
              marginBottom: '1.5rem'
            }}>
              <QRCodeSVG value={mobileUrl} size={200} />
            </div>
            <button 
              onClick={() => setShowQR(false)}
              style={{
                display: 'block', width: '100%',
                padding: '0.75rem', borderRadius: '0.5rem',
                backgroundColor: 'rgba(255,255,255,0.1)', border: 'none',
                color: 'white', cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceSelectionModal;
