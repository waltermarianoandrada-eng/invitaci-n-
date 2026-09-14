import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Square, Upload, ArrowLeft, RefreshCw } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

export function VideoBooth() {
  const { config, addLocalVideo } = useConfig();
  const navigate = useNavigate();
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Solicitar cámara al montar el componente
    async function enableStream() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error al acceder a la cámara:", err);
        setPermissionDenied(true);
      }
    }
    enableStream();

    // Limpiar cámara al desmontar
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startRecording = () => {
    if (!stream) return;
    
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedVideoUrl(url);
      
      // Detener los tracks de la cámara
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    };

    mediaRecorder.start();
    setIsRecording(true);
    mediaRecorderRef.current = mediaRecorder;
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const resetRecording = async () => {
    if (recordedVideoUrl) URL.revokeObjectURL(recordedVideoUrl);
    setRecordedVideoUrl(null);
    
    // Volver a pedir cámara
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = () => {
    if (recordedVideoUrl) {
      // Por ahora, solo lo guardamos localmente en memoria
      addLocalVideo(recordedVideoUrl);
      alert(config.texts.successMessage);
      navigate('/');
    }
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
          aspectRatio: '16/9', 
          backgroundColor: '#000', 
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {permissionDenied && (
            <div style={{ color: '#ff4444', textAlign: 'center', padding: '1rem' }}>
              No se pudo acceder a la cámara. Por favor, dale permisos al navegador y recarga la página.
            </div>
          )}

          {!recordedVideoUrl && !permissionDenied && (
            <video 
              ref={videoPreviewRef} 
              autoPlay 
              playsInline 
              muted 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          )}

          {recordedVideoUrl && (
            <video 
              src={recordedVideoUrl} 
              controls 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          )}
          
          {isRecording && (
            <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(255,0,0,0.8)', padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'white', animation: 'pulse 1s infinite' }} />
              REC
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          {!recordedVideoUrl && !permissionDenied && (
            <button 
              className="btn-primary" 
              onClick={isRecording ? stopRecording : startRecording}
              style={{ background: isRecording ? '#555' : 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))' }}
            >
              {isRecording ? <Square fill="currentColor" /> : <Camera />}
              {isRecording ? 'Detener' : 'Grabar'}
            </button>
          )}

          {recordedVideoUrl && (
            <>
              <button className="btn-primary" style={{ background: '#555' }} onClick={resetRecording}>
                <RefreshCw /> Repetir
              </button>
              <button className="btn-primary" style={{ background: '#28a745', boxShadow: '0 4px 15px rgba(40,167,69,0.3)' }} onClick={handleUpload}>
                <Upload /> Subir Mensaje
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
