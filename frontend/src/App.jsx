import { Routes, Route, Navigate } from 'react-router-dom';
import FacilitySelectionPage from './pages/FacilitySelectionPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/tesis-secimi" replace />} />
      <Route path="/tesis-secimi" element={<FacilitySelectionPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;