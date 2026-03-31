import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();

  const selectedPlantType = useMemo(() => {
    return localStorage.getItem("selectedPlantType");
  }, []);

  const [selectedRole, setSelectedRole] = useState("TESIS_GOREVLISI");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!selectedPlantType) {
      navigate("/tesis-secimi", { replace: true });
    }
  }, [selectedPlantType, navigate]);

  const roles = [
    { key: "TESIS_GOREVLISI", label: "Tesis Görevlisi", icon: "👤" },
    { key: "TESIS_YONETICISI", label: "Tesis Yöneticisi", icon: "▦" },
    { key: "BOLGE_YONETICISI", label: "Bölge Yöneticisi", icon: "⌂" },
    { key: "UST_YONETICI", label: "Üst Yönetici", icon: "▥" },
  ];

  const themeClass = selectedPlantType === "GES" ? "ges-theme" : "hes-theme";

  const handleLogin = async () => {
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          role: selectedRole,
          plantType: selectedPlantType,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("loggedInUser", JSON.stringify(data));

        if (data.role === "TESIS_GOREVLISI") {
          navigate("/operator/dashboard");
        } else if (data.role === "TESIS_YONETICISI") {
          navigate("/manager/dashboard");
        } else if (data.role === "BOLGE_YONETICISI") {
          navigate("/regional/dashboard");
        } else {
          navigate("/executive/dashboard");
        }
      } else {
        setErrorMessage(data.message || "Giriş başarısız");
      }
    } catch (error) {
      setErrorMessage("Sunucuya bağlanırken hata oluştu");
    }
  };

  return (
    <div className={`login-page ${themeClass}`}>
      <div className="login-top-brand">
        Enerji Yönetim ve Karar Destek Sistemi
      </div>

      <div className="login-wrapper">
        <div className="login-back-row">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/tesis-secimi")}
          >
            ← Geri
          </button>
        </div>

        <div className="selected-plant-text">
          {selectedPlantType === "GES"
            ? "Seçilen Tesis Tipi: GES"
            : "Seçilen Tesis Tipi: HES"}
        </div>

        <div className="login-card">
          <h1 className="login-title">Giriş Yap</h1>
          <p className="login-subtitle">
            Sistemi kullanmaya başlamak için bilgilerinizi girin.
          </p>

          <div className="form-group">
            <label>Kullanıcı Adı</label>
            <input
              type="text"
              placeholder="operator1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Şifre</label>
            <input
              type="password"
              placeholder="1234"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Rol Seçiniz</label>
            <div className="role-grid">
              {roles.map((role) => (
                <button
                  key={role.key}
                  type="button"
                  className={`role-box ${selectedRole === role.key ? "active" : ""}`}
                  onClick={() => setSelectedRole(role.key)}
                >
                  <span className="role-icon">{role.icon}</span>
                  <span className="role-label">{role.label}</span>
                </button>
              ))}
            </div>
          </div>

          {errorMessage && <p className="login-error">{errorMessage}</p>}

          <button type="button" className="submit-button" onClick={handleLogin}>
            Giriş →
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
