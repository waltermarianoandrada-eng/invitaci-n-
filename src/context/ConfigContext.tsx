import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { config as defaultConfig, type AppConfig } from '../config';

interface ConfigContextType {
  config: AppConfig;
  updateConfig: (newConfig: AppConfig) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('appConfig');
    return saved ? JSON.parse(saved) : defaultConfig;
  });

  useEffect(() => {
    // Inyectar variables CSS cuando la configuración cambie
    document.documentElement.style.setProperty('--primary-color', config.theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', config.theme.secondaryColor);
    document.documentElement.style.setProperty('--bg-color', config.theme.backgroundColor);
    document.documentElement.style.setProperty('--text-color', config.theme.textColor);
    document.documentElement.style.setProperty('--font-family', config.theme.fontFamily);
  }, [config]);

  const updateConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    localStorage.setItem('appConfig', JSON.stringify(newConfig));
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig }}>
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
