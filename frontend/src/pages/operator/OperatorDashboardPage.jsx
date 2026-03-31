import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import ProductionChart from "../../components/ProductionChart";
import "../../styles/OperatorPages.css";

function OperatorDashboardPage() {
  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  }, []);

  const isGES = user.plantType === "GES";

  const [productionRecords, setProductionRecords] = useState([]);
  const [alarms, setAlarms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productionResponse, alarmResponse] = await Promise.all([
          fetch("http://localhost:8080/api/production-records"),
          fetch("http://localhost:8080/api/alarms"),
        ]);

        const productionData = await productionResponse.json();
        const alarmData = await alarmResponse.json();

        const filteredProduction = productionData.filter(
          (record) => record.facility?.plantType === user.plantType
        );

        const filteredAlarms = alarmData.filter(
          (alarm) => alarm.facility?.plantType === user.plantType
        );

        setProductionRecords(filteredProduction);
        setAlarms(filteredAlarms);
      } catch (error) {
        console.error("Dashboard verileri alınamadı:", error);
      }
    };

    fetchData();
  }, [user.plantType]);

  const totalPredicted = productionRecords.reduce(
    (sum, item) => sum + item.predictedEnergy,
    0
  );

  const totalActual = productionRecords.reduce(
    (sum, item) => sum + item.actualEnergy,
    0
  );

  const activeAlarmCount = alarms.filter(
    (alarm) => alarm.status === "AKTIF"
  ).length;

  return (
    <DashboardLayout pageTitle="Ana Sayfa">
      <div className="page-subtitle">
        {isGES
          ? "Güneş enerji tesisinin üretim performansını ve sistem durumunu buradan takip edin."
          : "Hidroelektrik tesisinin üretim performansını ve sistem durumunu buradan takip edin."}
      </div>

      <div className="top-cards-grid">
        <div className="metric-card light-card">
          <div className="metric-label">
            {isGES ? "BUGÜNKÜ ÜRETİM" : "HAFTALIK ÜRETİM"}
          </div>
          <div className="metric-value-row">
            <div className="metric-value">
              {totalActual.toFixed(1)} <span>MWh</span>
            </div>
            <div className="metric-icon green-icon">
              {isGES ? "▣" : "⚡"}
            </div>
          </div>
        </div>

        {isGES ? (
          <div className="metric-card green-feature-card">
            <div className="feature-card-title">İSTASYON HAVA DURUMU</div>
            <div className="feature-card-main">
              <div>
                <div className="feature-big-value">24°C</div>
                <div className="feature-subtext">Güneşli</div>
              </div>

              <div className="feature-side-info">
                <div className="sun-icon">☀</div>
                <div className="uv-label">UV ENDEKSİ</div>
                <div className="uv-value">6.2</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="metric-card green-feature-card">
            <div className="feature-card-title">SU AKIŞ DURUMU</div>
            <div className="feature-card-main">
              <div>
                <div className="feature-big-value">148 m³/s</div>
                <div className="feature-subtext">Stabil Akış</div>
              </div>

              <div className="feature-side-info">
                <div className="sun-icon">💧</div>
                <div className="uv-label">REZERV SEVİYE</div>
                <div className="uv-value">%82</div>
              </div>
            </div>
          </div>
        )}

        {isGES ? (
          <div className="metric-card suggestion-card">
            <div className="suggestion-title">⚙ Öneriler</div>
            <div className="suggestion-item">🧼 Panel temizliği önerilir</div>
            <div className="suggestion-item">🔧 Periyodik bakım kontrolü önerilir</div>
            <div className="suggestion-item">📈 Sistem performansı gözlemleniyor</div>
            <button className="green-full-button">Tüm Önerileri Gör →</button>
          </div>
        ) : (
          <div className="metric-card suggestion-card">
            <div className="suggestion-title">⚙ Öneriler</div>
            <div className="suggestion-item">💧 Su akış seviyesi izlenmeli</div>
            <div className="suggestion-item">⚙ Türbin bakım planı kontrol edilmeli</div>
            <div className="suggestion-item">📈 Üretim dalgalanması takip ediliyor</div>
            <button className="green-full-button">Tüm Önerileri Gör →</button>
          </div>
        )}
      </div>

      <div className="graph-card">
        <div className="graph-header">
          <div className="graph-title">
            {isGES
              ? "GES Enerji Üretimi (Gerçekleşen vs Tahmin)"
              : "HES Enerji Üretimi (Gerçekleşen vs Tahmin)"}
          </div>
          <div className="graph-legend-inline">
            <span><span className="dot green"></span>Gerçekleşen</span>
            <span><span className="line gray"></span>Tahmin</span>
          </div>
        </div>

        <ProductionChart data={productionRecords} />
      </div>
    </DashboardLayout>
  );
}

export default OperatorDashboardPage;