import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import ProductionChart from "../../components/ProductionChart";
import "../../styles/OperatorPages.css";

function ExecutiveDashboardPage() {
  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  }, []);

  const isGES = user.plantType === "GES";

  const [productionRecords, setProductionRecords] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [regions, setRegions] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, alarmRes, facilityRes, chartRes] = await Promise.all([
          fetch("http://localhost:8080/api/production-records"),
          fetch("http://localhost:8080/api/alarms"),
          fetch("http://localhost:8080/api/facilities"),
          fetch(`http://localhost:8080/api/production-records/executive/weekly?plantType=${user.plantType}`),
        ]);

        const prodData = await prodRes.json();
        const alarmData = await alarmRes.json();
        const facilityData = await facilityRes.json();
        const chartPoints = await chartRes.json();

        const filteredFacilities = facilityData.filter(
          (f) => f.plantType === user.plantType
        );
        const facilityIds = filteredFacilities.map((f) => f.id);

        const filteredProduction = prodData.filter((r) =>
          facilityIds.includes(r.facility?.id)
        );
        const filteredAlarms = alarmData.filter((a) =>
          facilityIds.includes(a.facility?.id)
        );

        const uniqueRegions = [
          ...new Set(filteredFacilities.map((f) => f.region?.name)),
        ];

        setProductionRecords(filteredProduction);
        setAlarms(filteredAlarms);
        setFacilities(filteredFacilities);
        setRegions(uniqueRegions);
        setChartData(chartPoints);
      } catch (err) {
        console.error(err);
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

  const activeAlarmCount = alarms.filter((a) => a.status === "AKTIF").length;
  const criticalAlarmCount = alarms.filter((a) => a.severity === "KRITIK").length;

  return (
    <DashboardLayout pageTitle="Üst Yönetici Paneli">
      <div className="page-subtitle">
        {isGES
          ? "Güneş enerji santrallerinin genel performansını üst yönetim seviyesinde izleyin."
          : "Hidroelektrik santrallerin genel performansını üst yönetim seviyesinde izleyin."}
      </div>

      <div className="report-box full" style={{ marginBottom: "14px" }}>
        <h3>{isGES ? "GES Üst Yönetim Özeti" : "HES Üst Yönetim Özeti"}</h3>
        <p>
          {isGES
            ? "Güneş enerji santrallerine ait genel üretim, alarm ve tesis dağılımı üst yönetim seviyesinde görüntülenmektedir."
            : "Hidroelektrik santrallere ait genel üretim, alarm ve tesis dağılımı üst yönetim seviyesinde görüntülenmektedir."}
        </p>
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
        <div className="graph-title">
          {isGES ? "GES Genel Üretim Grafiği" : "HES Genel Üretim Grafiği"}
        </div>
        <ProductionChart data={chartData} plantType={user.plantType} />
      </div>
    </DashboardLayout>
  );
}

export default ExecutiveDashboardPage;