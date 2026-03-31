import { Routes, Route, Navigate } from "react-router-dom";
import FacilitySelectionPage from "./pages/FacilitySelectionPage";
import LoginPage from "./pages/LoginPage";
import OperatorDashboardPage from "./pages/operator/OperatorDashboardPage";
import OperatorAlarmsPage from "./pages/operator/OperatorAlarmsPage";
import OperatorReportPage from "./pages/operator/OperatorReportPage";
import ManagerDashboardPage from "./pages/manager/ManagerDashboardPage";
import ManagerAlarmsPage from "./pages/manager/ManagerAlarmsPage";
import ManagerReportPage from "./pages/manager/ManagerReportPage";
import RegionalDashboardPage from "./pages/regional/RegionalDashboardPage";
import RegionalFacilitiesPage from "./pages/regional/RegionalFacilitiesPage";
import FacilityDetailPage from "./pages/regional/FacilityDetailPage";
import RegionalReportPage from "./pages/regional/RegionalReportPage";

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

      <Route path="/regional/dashboard" element={<RegionalDashboardPage />} />
      <Route path="/regional/facilities" element={<RegionalFacilitiesPage />} />
      <Route path="/regional/facilities/:id" element={<FacilityDetailPage />} />
      <Route path="/regional/rapor" element={<RegionalReportPage />} />
    </Routes>
  );
}

export default App;