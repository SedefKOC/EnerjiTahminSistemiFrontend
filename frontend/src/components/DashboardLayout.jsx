import { useMemo } from "react";
import Sidebar from "./Sidebar";
import "../styles/DashboardLayout.css";

const ROLE_LABELS = {
  TESIS_GOREVLISI: "Tesis Görevlisi",
  TESIS_YONETICISI: "Tesis Yöneticisi",
  BOLGE_YONETICISI: "Bölge Yöneticisi",
  UST_YONETICI: "Üst Yönetici",
};

function DashboardLayout({ children, pageTitle }) {
  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  }, []);

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const roleLabel = ROLE_LABELS[user.role] || user.role;
  const isGES = user.plantType === "GES";

  return (
    <div className={`dashboard-layout ${isGES ? "theme-ges" : "theme-hes"}`}>
      <Sidebar role={user.role} plantType={user.plantType} />

      <main className="dashboard-content">
        <div className="dashboard-content-top">
          <div>
            <h1>{pageTitle}</h1>
            <p className="dashboard-content-user">
              Hoş geldin, {fullName} — {roleLabel}
            </p>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
