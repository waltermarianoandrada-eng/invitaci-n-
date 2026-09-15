export interface AppConfig {
  eventName: string;
  eventType: 'birthday' | 'wedding' | 'party' | 'other';
  eventDate: string;
  hostName: string;
  hostAge?: number;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
  };
  texts: {
    landingTitle: string;
    landingSubtitle: string;
    recordButton: string;
    countdownPrefix: string;
    successMessage: string;
  };
}

export const config: AppConfig = {
  eventName: "Cumpleaños Sorpresa",
  eventType: "birthday",
  eventDate: "2026-10-15T20:00:00",
  hostName: "Tomás",
  hostAge: 30,
  theme: {
    primaryColor: "#FF4785",
    secondaryColor: "#FFA07A",
    backgroundColor: "#1A1A2E",
    textColor: "#FFFFFF",
    fontFamily: "'Inter', sans-serif"
  },
  texts: {
    landingTitle: "¡Celebramos a Tomás!",
    landingSubtitle: "Ayúdanos a darle una sorpresa inolvidable dejando tu mensaje en video.",
    recordButton: "Dejar un mensaje sorpresa",
    countdownPrefix: "Faltan",
    successMessage: "¡Gracias! Tu mensaje ha sido guardado."
  }
};
