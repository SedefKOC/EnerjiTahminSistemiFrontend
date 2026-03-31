import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import ProductionChart from "../../components/ProductionChart";
import "../../styles/OperatorPages.css";

function ExecutiveDashboardPage() {
  const [productionRecords, setProductionRecords] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, alarmRes, facilityRes] = await Promise.all([
          fetch("http://localhost:8080/api/production-records"),
          fetch("http://localhost:8080/api/alarms"),
          fetch("http://localhost:8080/api/facilities"),
        ]);

        const prodData = await prodRes.json();
        const alarmData = await alarmRes.json();
        const facilityData = await facilityRes.json();

        const uniqueRegions = [
          ...new Set(facilityData.map((f) => f.region?.name)),
        ];

        setProductionRecords(prodData);
        setAlarms(alarmData);
        setFacilities(facilityData);
        setRegions(uniqueRegions);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const totalPredicted = productionRecords.reduce(
    (sum, item) => sum + item.predictedEnergy,
    0
  );

  const totalActual = productionRecords.reduce(
    (sum, item) => sum + item.actualEnergy,
    0
  );

  const activeAlarmCount = alarms.filter((a) => a.status === "AKTIF").length;
  const criticalAlarmCount = alarms.filter((a) => a.severity === "KRITIK").length;

  return (
    <DashboardLayout pageTitle="Üst Yönetici Paneli">
      <div className="page-subtitle">
        Tüm sistemin genel performansını izleyin.
      </div>

      <div className="top-cards-grid">
        <div className="metric-card light-card">
          <div className="metric-label">TOPLAM TAHMİN</div>
          <div className="metric-value">{totalPredicted.toFixed(1)} MWh</div>
        </div>

        <div className="metric-card light-card">
          <div className="metric-label">TOPLAM GERÇEKLEŞEN</div>
          <div className="metric-value">{totalActual.toFixed(1)} MWh</div>
        </div>

        <div className="metric-card light-card">
          <div className="metric-label">TESİS / BÖLGE</div>
          <div className="metric-value">
            {facilities.length} / {regions.length}
          </div>
        </div>

        <div className="metric-card light-card">
          <div className="metric-label">AKTİF / KRİTİK ALARM</div>
          <div className="metric-value">
            {activeAlarmCount} / {criticalAlarmCount}
          </div>
        </div>
      </div>

      <div className="graph-card">
        <div className="graph-title">Genel Üretim Grafiği</div>
        <ProductionChart data={productionRecords} />
      </div>
    </DashboardLayout>
  );
}

export default ExecutiveDashboardPage;