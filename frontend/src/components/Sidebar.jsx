import { NavLink, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import "../styles/Sidebar.css";

function Sidebar({ role, plantType }) {
  const navigate = useNavigate();

  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  }, []);

  const menuByRole = {
    TESIS_GOREVLISI: [
      { label: "⌂ Ana Sayfa", path: "/operator/dashboard" },
      { label: "⚠ Alarmlar", path: "/operator/alarms" },
      { label: "🗎 Rapor", path: "/operator/rapor" },
    ],
    TESIS_YONETICISI: [
      { label: "⌂ Ana Sayfa", path: "/manager/dashboard" },
      { label: "⚠ Alarmlar", path: "/manager/alarms" },
      { label: "🗎 Rapor", path: "/manager/rapor" },
    ],
    BOLGE_YONETICISI: [
      { label: "⌂ Ana Sayfa", path: "/regional/dashboard" },
      { label: "▣ Tesisler", path: "/regional/facilities" },
      { label: "🗎 Rapor", path: "/regional/rapor" },
    ],
    UST_YONETICI: [
      { label: "⌂ Ana Sayfa", path: "/executive/dashboard" },
      { label: "▣ Bölgeler", path: "/executive/regions" },
      { label: "🗎 Rapor", path: "/executive/rapor" },
    ],
  };

  const menuItems = menuByRole[role] || [];

  const roleLabel =
    role === "TESIS_GOREVLISI"
      ? "Tesis Görevlisi"
      : role === "TESIS_YONETICISI"
        ? "Tesis Yöneticisi"
        : role === "BOLGE_YONETICISI"
          ? "Bölge Yöneticisi"
          : role === "UST_YONETICI"
            ? "Üst Yönetici"
            : role;

  return (
    <aside
      className={`sidebar ${plantType === "HES" ? "hes-theme" : "ges-theme"}`}
    >
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <h2>Enerji Yönetim ve Karar Destek Sistemi</h2>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div
          className="sidebar-user-box"
          onClick={() => navigate("/profile")}
          style={{ cursor: "pointer" }}
        >
          <div className="sidebar-avatar">◔</div>
          <div className="sidebar-user-info">
            <strong>{roleLabel}</strong>
            <span>{user.username?.toUpperCase() || "ADMIN"}</span>
          </div>
        </div>

        <button
          className="sidebar-logout"
          onClick={() => {
            localStorage.removeItem("loggedInUser");
            localStorage.removeItem("selectedPlantType");
            navigate("/tesis-secimi");
          }}
        >
          ↩ Çıkış Yap
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
