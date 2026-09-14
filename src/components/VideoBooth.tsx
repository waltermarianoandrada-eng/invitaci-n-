import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Square, Upload, ArrowLeft } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

export function VideoBooth() {
  const { config } = useConfig();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startSimulatedRecording = () => {
    setIsRecording(true);
    // En un caso real usaríamos navigator.mediaDevices.getUserMedia()
    setTimeout(() => {
      setIsRecording(false);
      setRecordedVideo('https://www.w3schools.com/html/mov_bbb.mp4'); // Video demo
    }, 3000);
  };

  return (
    <div className="page-container">
      <Link to="/" style={{ position: 'absolute', top: '2rem', left: '2rem', color: 'var(--text-color)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft /> Volver
      </Link>

      <div className="glass" style={{ padding: '2rem', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
        <h2>Graba tu mensaje para {config.hostName}</h2>
        
        <div style={{ 
          width: '100%', 
          aspectRatio: '9/16', 
          backgroundColor: '#000', 
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {recordedVideo ? (
            <video src={recordedVideo} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
              {isRecording ? "Grabando (simulado)..." : "Cámara (simulada)"}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          {!recordedVideo && (
            <button 
              className="btn-primary" 
              onClick={startSimulatedRecording}
              disabled={isRecording}
              style={{ background: isRecording ? '#555' : 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))' }}
            >
              {isRecording ? <Square fill="currentColor" /> : <Camera />}
              {isRecording ? 'Detener' : 'Grabar'}
            </button>
          )}

          {recordedVideo && (
            <button className="btn-primary" style={{ background: '#28a745', boxShadow: '0 4px 15px rgba(40,167,69,0.3)' }} onClick={() => alert(config.texts.successMessage)}>
              <Upload /> Subir Mensaje
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
