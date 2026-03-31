import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/DashboardLayout.css";

function DashboardLayout({ children, pageTitle }) {
  const navigate = useNavigate();

  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  }, []);

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const isGES = user.plantType === "GES";

  return (
    <div className={`dashboard-layout ${isGES ? "theme-ges" : "theme-hes"}`}>
      <Sidebar role={user.role} plantType={user.plantType} />

      <main className="dashboard-content">
        <div className="dashboard-content-top">
          <div>
            <p className="dashboard-content-brand">Enerji Yönetim ve Karar Destek Sistemi</p>
            <h1>{pageTitle}</h1>
            <p className="dashboard-content-user">
              Hoş geldin, {fullName} | Rol: {user.role}
            </p>
          </div>

          <button
            className={`logout-button ${user.plantType === "HES" ? "hes-theme" : "ges-theme"}`}
            onClick={() => {
              localStorage.removeItem("loggedInUser");
              localStorage.removeItem("selectedPlantType");
              navigate("/tesis-secimi");
            }}
          >
            Çıkış Yap
          </button>
        </div>

        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
