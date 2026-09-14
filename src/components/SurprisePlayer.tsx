import { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

const MOCK_VIDEOS = [
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://www.w3schools.com/html/mov_bbb.mp4'
];

export function SurprisePlayer() {
  const { config } = useConfig();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = () => {
    if (currentIndex < MOCK_VIDEOS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
      alert('¡Feliz Cumpleaños ' + config.hostName + '! Fin de los mensajes.');
    }
  };

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.play().catch(e => console.error("Auto-play prevented", e));
    }
  }, [currentIndex, isPlaying]);

  return (
    <div className="page-container" style={{ padding: 0, justifyContent: 'flex-start', backgroundColor: '#000' }}>
      {!isPlaying ? (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
          <h1 style={{ color: '#fff' }}>¡Sorpresa, {config.hostName}!</h1>
          <p style={{ color: '#ccc' }}>Tus amigos te han dejado algunos mensajes.</p>
          <button className="btn-primary" onClick={() => setIsPlaying(true)} style={{ padding: '20px 40px', fontSize: '1.5rem' }}>
            <Play fill="currentColor" size={32} /> Reproducir
          </button>
        </div>
      ) : (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
          <video 
            ref={videoRef}
            src={MOCK_VIDEOS[currentIndex]} 
            onEnded={handleVideoEnd}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            autoPlay
            playsInline
          />
          
          {/* Stories Progress Bar */}
          <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', display: 'flex', gap: '5px', zIndex: 10 }}>
            {MOCK_VIDEOS.map((_, idx) => (
              <div key={idx} style={{ 
                flex: 1, 
                height: '4px', 
                backgroundColor: idx === currentIndex ? 'var(--primary-color)' : idx < currentIndex ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
                borderRadius: '2px',
                transition: 'background-color 0.3s'
              }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
