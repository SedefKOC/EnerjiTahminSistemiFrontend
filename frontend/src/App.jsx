import { Routes, Route, Navigate } from "react-router-dom";
import FacilitySelectionPage from "./pages/FacilitySelectionPage";
import LoginPage from "./pages/LoginPage";
import OperatorDashboardPage from "./pages/operator/OperatorDashboardPage";
import OperatorAlarmsPage from "./pages/operator/OperatorAlarmsPage";
import OperatorReportsPage from "./pages/operator/OperatorReportsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/tesis-secimi" replace />} />
      <Route path="/tesis-secimi" element={<FacilitySelectionPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/operator/dashboard" element={<OperatorDashboardPage />} />
      <Route path="/operator/alarms" element={<OperatorAlarmsPage />} />
      <Route path="/operator/reports" element={<OperatorReportsPage />} />
    </Routes>
  );
}

export default App;