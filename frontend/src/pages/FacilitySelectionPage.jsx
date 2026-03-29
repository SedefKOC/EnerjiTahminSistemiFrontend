import { useNavigate } from "react-router-dom";
import "../styles/FacilitySelectionPage.css";

function FacilitySelectionPage() {
  const navigate = useNavigate();

  const handleSelect = (plantType) => {
    localStorage.setItem("selectedPlantType", plantType);
    navigate("/login");
  };

  return (
    <div className="facility-page">
      <div className="top-brand">Enerji Yönetim ve Karar Destek Sistemi</div>

      <div className="facility-content">
        <h1 className="facility-title">Santral Seçimi Yapın</h1>
        <p className="facility-description">
          Yönetmek ve enerji üretim tahminlerini analiz etmek istediğiniz santrali
          seçerek devam edin.
        </p>

        <div className="facility-card-grid">
          <button
            type="button"
            className="facility-card"
            onClick={() => handleSelect("GES")}
          >
            <div className="icon-box">☀</div>
            <h2>GES (Güneş Enerji Santrali)</h2>
          </button>

          <button
            type="button"
            className="facility-card"
            onClick={() => handleSelect("HES")}
          >
            <div className="icon-box">💧</div>
            <h2>HES (Hidroelektrik Santrali)</h2>
          </button>
        </div>
      </div>
    </div>
  );
}

export default FacilitySelectionPage;