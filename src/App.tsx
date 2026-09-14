import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { VideoBooth } from './components/VideoBooth';
import { SurprisePlayer } from './components/SurprisePlayer';
import { AdminPanel } from './components/AdminPanel';

function App() {
  return (
    <>
      <div className="bg-gradient" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/grabar" element={<VideoBooth />} />
        <Route path="/sorpresa" element={<SurprisePlayer />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </>
  );
}

export default App;
