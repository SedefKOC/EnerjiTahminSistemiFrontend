import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import ProductionChart from "../../components/ProductionChart";
import "../../styles/OperatorPages.css";

function RegionalDashboardPage() {
  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  }, []);

  const [productionRecords, setProductionRecords] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productionResponse, alarmResponse, facilityResponse] = await Promise.all([
          fetch("http://localhost:8080/api/production-records"),
          fetch("http://localhost:8080/api/alarms"),
          fetch("http://localhost:8080/api/facilities"),
        ]);

        const productionData = await productionResponse.json();
        const alarmData = await alarmResponse.json();
        const facilityData = await facilityResponse.json();

        const userRegionName = user.region?.name;

        const regionalFacilities = facilityData.filter(
          (facility) => facility.region?.name === userRegionName
        );

        const regionalFacilityIds = regionalFacilities.map((facility) => facility.id);

        const regionalProduction = productionData.filter((record) =>
          regionalFacilityIds.includes(record.facility?.id)
        );

        const regionalAlarms = alarmData.filter((alarm) =>
          regionalFacilityIds.includes(alarm.facility?.id)
        );

        setFacilities(regionalFacilities);
        setProductionRecords(regionalProduction);
        setAlarms(regionalAlarms);
      } catch (error) {
        console.error("Regional dashboard verileri alınamadı:", error);
      }
    };

    fetchData();
  }, [user]);

  const totalPredicted = productionRecords.reduce(
    (sum, item) => sum + item.predictedEnergy,
    0
  );

  const totalActual = productionRecords.reduce(
    (sum, item) => sum + item.actualEnergy,
    0
  );

  const activeAlarmCount = alarms.filter((alarm) => alarm.status === "AKTIF").length;
  const criticalAlarmCount = alarms.filter((alarm) => alarm.severity === "KRITIK").length;

  return (
    <DashboardLayout pageTitle="Bölge Yöneticisi Paneli">
      <div className="page-subtitle">
        Bölgenize bağlı tesislerin genel üretim ve alarm performansını buradan izleyin.
      </div>

      <div className="top-cards-grid">
        <div className="metric-card light-card">
          <div className="metric-label">BÖLGE TOPLAM TAHMİN</div>
          <div className="metric-value-row">
            <div className="metric-value">
              {totalPredicted.toFixed(1)} <span>MWh</span>
            </div>
            <div className="metric-icon green-icon">▣</div>
          </div>
        </div>

        <div className="metric-card light-card">
          <div className="metric-label">BÖLGE TOPLAM GERÇEKLEŞEN</div>
          <div className="metric-value-row">
            <div className="metric-value">
              {totalActual.toFixed(1)} <span>MWh</span>
            </div>
            <div className="metric-icon green-icon">⚡</div>
          </div>
        </div>

        <div className="metric-card light-card">
          <div className="metric-label">TESİS / AKTİF ALARM / KRİTİK</div>
          <div className="metric-value-row">
            <div className="metric-value">
              {facilities.length} / {activeAlarmCount} / {criticalAlarmCount}
            </div>
            <div className="metric-icon red-icon">!</div>
          </div>
        </div>
      </div>

      <div className="graph-card">
        <div className="graph-header">
          <div className="graph-title">Bölgesel Üretim Grafiği</div>
          <div className="graph-legend-inline">
            <span><span className="dot green"></span>Gerçekleşen</span>
            <span><span className="line gray"></span>Tahmin</span>
          </div>
        </div>

        <ProductionChart data={productionRecords} />
      </div>

      <div className="operator-main-grid" style={{ marginTop: "14px" }}>
        <section className="content-panel">
          <div className="panel-header">
            <h2>Bölge Özeti</h2>
            <p>Yönetilen tesislerin genel performans görünümü</p>
          </div>

          <div className="simple-list">
            <div className="simple-list-card">
              <strong>Yönetilen Tesis Sayısı</strong>
              <p>Bölgenizde toplam {facilities.length} tesis bulunmaktadır.</p>
            </div>

            <div className="simple-list-card">
              <strong>Aktif Alarm Yoğunluğu</strong>
              <p>Şu anda {activeAlarmCount} aktif alarm izlenmektedir.</p>
            </div>
          </div>
        </section>

        <section className="content-panel">
          <div className="panel-header">
            <h2>Son Alarm Hareketleri</h2>
            <p>Bölgedeki en güncel alarm kayıtları</p>
          </div>

          <div className="simple-list">
            {alarms.slice(0, 3).map((alarm) => (
              <div key={alarm.id} className="simple-list-card">
                <strong>{alarm.title}</strong>
                <p>{alarm.facility?.name || "Tesis"} | {alarm.status}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default RegionalDashboardPage;