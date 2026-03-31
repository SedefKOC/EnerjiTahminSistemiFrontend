import { Routes, Route, Navigate } from "react-router-dom";
import FacilitySelectionPage from "./pages/FacilitySelectionPage";
import LoginPage from "./pages/LoginPage";
import OperatorDashboardPage from "./pages/operator/OperatorDashboardPage";
import OperatorAlarmsPage from "./pages/operator/OperatorAlarmsPage";
import OperatorReportPage from "./pages/operator/OperatorReportPage";
import ManagerDashboardPage from "./pages/manager/ManagerDashboardPage";
import ManagerAlarmsPage from "./pages/manager/ManagerAlarmsPage";
import ManagerReportPage from "./pages/manager/ManagerReportPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/tesis-secimi" replace />} />
      <Route path="/tesis-secimi" element={<FacilitySelectionPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/operator/dashboard" element={<OperatorDashboardPage />} />
      <Route path="/operator/alarms" element={<OperatorAlarmsPage />} />
      <Route path="/operator/rapor" element={<OperatorReportPage />} />

      <Route path="/manager/dashboard" element={<ManagerDashboardPage />} />
      <Route path="/manager/alarms" element={<ManagerAlarmsPage />} />
      <Route path="/manager/rapor" element={<ManagerReportPage />} />
    </Routes>
  );
}

export default App;