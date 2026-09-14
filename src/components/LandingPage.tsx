import { Link } from 'react-router-dom';
import { Video, Calendar, MapPin, Settings } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

export function LandingPage() {
  const { config } = useConfig();
  return (
    <div className="page-container">
      <Link to="/admin" style={{ position: 'absolute', top: '2rem', right: '2rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>
        <Settings size={24} />
      </Link>
      <div className="glass" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', width: '100%' }}>
        <h3 style={{ color: 'var(--secondary-color)', marginBottom: '1rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>
          {config.texts.countdownPrefix} 15 días
        </h3>
        
        <h1>{config.texts.landingTitle}</h1>
        
        <p style={{ margin: '0 auto 2rem auto' }}>
          {config.texts.landingSubtitle}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3rem', opacity: 0.8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={24} />
            <span style={{ fontSize: '0.9rem' }}>{new Date(config.eventDate).toLocaleDateString()}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={24} />
            <span style={{ fontSize: '0.9rem' }}>Salón de Fiestas</span>
          </div>
        </div>

        <Link to="/grabar" style={{ textDecoration: 'none', display: 'inline-block' }}>
          <button className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.2rem' }}>
            <Video size={24} />
            {config.texts.recordButton}
          </button>
        </Link>
      </div>
    </div>
  );
}
