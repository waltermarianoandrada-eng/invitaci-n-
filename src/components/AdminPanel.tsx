import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import type { AppConfig } from '../config';

export function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const { config, updateConfig } = useConfig();
  const [formData, setFormData] = useState<AppConfig>(config);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '1234') {
      setIsAuthenticated(true);
    } else {
      alert('Credenciales incorrectas');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
    alert('Configuración guardada exitosamente.');
    navigate('/');
  };

  const handleChange = (section: keyof AppConfig, field: string, value: string) => {
    if (section === 'theme' || section === 'texts') {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: value
      }));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="page-container">
        <div className="glass" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}>
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            <input 
              type="text" 
              placeholder="Usuario" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: 'none' }}
            />
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: 'none' }}
            />
            <button className="btn-primary" type="submit">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ alignItems: 'flex-start', paddingTop: '2rem' }}>
      <div className="glass" style={{ padding: '2rem', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
        <h2>Panel de Configuración</h2>
        
        <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Acciones Rápidas</h3>
          <button 
            type="button" 
            className="btn-primary" 
            style={{ background: 'linear-gradient(135deg, #ff4444, #ff8888)', boxShadow: '0 4px 15px rgba(255,68,68,0.3)' }}
            onClick={() => navigate('/sorpresa')}
          >
            🎬 Ir a ver los Videos Sorpresa
          </button>
        </div>
        
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3>General</h3>
            <label>Nombre del Cumpleañero/a:
              <input type="text" value={formData.hostName} onChange={e => handleChange('hostName', '', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', color: '#000' }} />
            </label>
            <label>Fecha del Evento:
              <input type="datetime-local" value={formData.eventDate.slice(0, 16)} onChange={e => handleChange('eventDate', '', e.target.value + ':00')} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', color: '#000' }} />
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3>Textos (Landing)</h3>
            <label>Título principal:
              <input type="text" value={formData.texts.landingTitle} onChange={e => handleChange('texts', 'landingTitle', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', color: '#000' }} />
            </label>
            <label>Mensaje/Subtítulo:
              <input type="text" value={formData.texts.landingSubtitle} onChange={e => handleChange('texts', 'landingSubtitle', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', color: '#000' }} />
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3>Colores (Tema)</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>Primario:
                <input type="color" value={formData.theme.primaryColor} onChange={e => handleChange('theme', 'primaryColor', e.target.value)} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>Secundario:
                <input type="color" value={formData.theme.secondaryColor} onChange={e => handleChange('theme', 'secondaryColor', e.target.value)} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>Fondo de la web:
                <input type="color" value={formData.theme.backgroundColor} onChange={e => handleChange('theme', 'backgroundColor', e.target.value)} />
              </label>
            </div>
          </div>

          <button className="btn-primary" type="submit" style={{ marginTop: '1rem' }}>Guardar y Aplicar Cambios</button>
        </form>
      </div>
    </div>
  );
}
