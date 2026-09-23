import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { config as defaultConfig, type AppConfig } from '../config';
import { supabase } from '../lib/supabase';

interface ConfigContextType {
  config: AppConfig;
  updateConfig: (newConfig: AppConfig) => void;
  localVideos: string[];
  addLocalVideo: (url: string) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [localVideos, setLocalVideos] = useState<string[]>([]);
  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('appConfig');
    return saved ? JSON.parse(saved) : defaultConfig;
  });

  // Cargar configuración de Supabase al iniciar
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('app_config')
          .select('config')
          .eq('id', 1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching config from Supabase:', error);
          return;
        }
        
        if (data && data.config) {
          setConfig(data.config as AppConfig);
          localStorage.setItem('appConfig', JSON.stringify(data.config));
        }
      } catch (err) {
        console.error('Unexpected error fetching config:', err);
      }
    };

    fetchConfig();
  }, []);

  useEffect(() => {
    // Inyectar variables CSS cuando la configuración cambie
    document.documentElement.style.setProperty('--primary-color', config.theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', config.theme.secondaryColor);
    document.documentElement.style.setProperty('--bg-color', config.theme.backgroundColor);
    document.documentElement.style.setProperty('--text-color', config.theme.textColor);
    document.documentElement.style.setProperty('--font-family', config.theme.fontFamily);
  }, [config]);

  const updateConfig = async (newConfig: AppConfig) => {
    // Actualizar localmente primero para UX rápida
    setConfig(newConfig);
    localStorage.setItem('appConfig', JSON.stringify(newConfig));

    // Guardar en Supabase
    try {
      const { error } = await supabase
        .from('app_config')
        .upsert({ id: 1, config: newConfig });
        
      if (error) throw error;
    } catch (err) {
      console.error('Error saving config to Supabase:', err);
    }
  };

  const addLocalVideo = (url: string) => {
    setLocalVideos(prev => [...prev, url]);
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, localVideos, addLocalVideo }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
