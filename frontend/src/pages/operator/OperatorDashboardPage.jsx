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
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const facilityId = user.facility?.id;
        const requests = [
          fetch("http://localhost:8080/api/production-records"),
          fetch("http://localhost:8080/api/alarms"),
        ];
        if (facilityId) {
          requests.push(
            fetch(`http://localhost:8080/api/production-records/facility/${facilityId}/weekly`)
          );
        }

        const [productionResponse, alarmResponse, chartResponse] = await Promise.all(requests);

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

        if (chartResponse) {
          setChartData(await chartResponse.json());
        }
      } catch (error) {
        console.error("Dashboard verileri alınamadı:", error);
      }
    };

    fetchData();
  }, [user.facility?.id, user.plantType]);

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
      <div
        className={`operator-dashboard ${isGES ? "theme-ges" : "theme-hes"}`}
      >
        <div className="top-cards-grid operator-top-cards-grid">
          <div className="metric-card operator-metric-card">
            <div className="metric-label">
              {isGES ? "BUGÜNKÜ ÜRETİM" : "HAFTALIK ÜRETİM"}
            </div>
            <div className="metric-value-row">
              <div className="metric-value">
                {totalActual.toFixed(1)}{" "}
                <span className="metric-unit">MWh</span>
              </div>
              <div
                className={`metric-icon-box ${isGES ? "ges-icon-box" : "hes-icon-box"}`}
              >
                ⚡
              </div>
            </div>
          </div>

          {isGES ? (
            <div className="metric-card solid-feature-card ges-solid">
              <div className="feature-card-title">İSTASYON HAVA DURUMU</div>
              <div className="feature-card-main">
                <div className="feature-main-info">
                  <div className="feature-big-value">24°C</div>
                  <div className="feature-subtext">Güneşli</div>
                </div>
                <div className="feature-side-info">
                  <div className="feature-icon-box">
                    <div className="feature-icon">☀</div>
                  </div>
                  <div className="feature-label">UV ENDEKSİ</div>
                  <div className="feature-small-value">6.2</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="metric-card solid-feature-card hes-solid">
              <div className="feature-card-title">SU AKIŞ DURUMU</div>
              <div className="feature-card-main">
                <div className="feature-main-info">
                  <div className="feature-big-value">148 m³/s</div>
                  <div className="feature-subtext">Stabil Akış</div>
                </div>
                <div className="feature-side-info">
                  <div className="feature-icon-box">
                    <div className="feature-icon">💧</div>
                  </div>
                  <div className="feature-label">REZERV SEVİYE</div>
                  <div className="feature-small-value">%82</div>
                </div>
              </div>
            </div>
          )}

          <div className="metric-card suggestion-card operator-metric-card">
            <div className="suggestion-title">
              <span className="suggestion-title-icon">⚙</span> Öneriler
            </div>
            <div className="suggestion-list">
              {isGES ? (
                <>
                  <div className="suggestion-item">
                    <span className="sug-icon ges-text">📋</span> Panel temizliği
                    önerilir
                  </div>
                  <div className="suggestion-item">
                    <span className="sug-icon ges-text">🔧</span> Periyodik bakım
                    kontrolü önerilir
                  </div>
                  <div className="suggestion-item">
                    <span className="sug-icon ges-text">📈</span> Sistem performansı
                    gözlemleniyor
                  </div>
                </>
              ) : (
                <>
                  <div className="suggestion-item">
                    <span className="sug-icon hes-text">📋</span> Su akış seviyesi
                    izlenmeli
                  </div>
                  <div className="suggestion-item">
                    <span className="sug-icon hes-text">🔧</span> Türbin bakım planı
                    kontrol edilmeli
                  </div>
                  <div className="suggestion-item">
                    <span className="sug-icon hes-text">📈</span> Üretim dalgalanması
                    takip ediliyor
                  </div>
                </>
              )}
            </div>
            <button className={`action-button ${isGES ? "btn-ges" : "btn-hes"}`}>
              Tüm Önerileri Gör →
            </button>
          </div>
        </div>

        <div className="graph-card operator-graph-card">
          <div className="graph-header">
            <div className="graph-title-row">
              <div className="graph-title">
                {isGES
                  ? "Enerji Üretimi (Gerçekleşen vs Tahmin)"
                  : "Enerji Üretimi (Gerçekleşen vs Tahmin)"}
              </div>
              <div className="graph-legend-inline">
                <div className="legend-item">
                  <span className={`dot ${isGES ? "dot-ges" : "dot-hes"}`}></span>
                  Gerçekleşen
                </div>
                <div className="legend-item">
                  <span className="line dashed gray"></span>
                  Tahmin
                </div>
              </div>
            </div>
          </div>
          <div className="graph-container">
            <ProductionChart data={chartData} plantType={user.plantType} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default OperatorDashboardPage;
