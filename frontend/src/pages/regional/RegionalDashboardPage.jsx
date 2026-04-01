import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import ProductionChart from "../../components/ProductionChart";
import "../../styles/OperatorPages.css";

function RegionalDashboardPage() {
  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  }, []);

  const isGES = user.plantType === "GES";

  const [productionRecords, setProductionRecords] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const regionId = user.region?.id;
        const requests = [
          fetch("http://localhost:8080/api/production-records"),
          fetch("http://localhost:8080/api/alarms"),
          fetch("http://localhost:8080/api/facilities"),
        ];
        if (regionId) {
          requests.push(
            fetch(`http://localhost:8080/api/production-records/region/${regionId}/weekly`)
          );
        }

        const [productionResponse, alarmResponse, facilityResponse, chartResponse] =
          await Promise.all(requests);

        const productionData = await productionResponse.json();
        const alarmData = await alarmResponse.json();
        const facilityData = await facilityResponse.json();

        const userRegionName = user.region?.name;

        const regionalFacilities = facilityData.filter(
          (facility) =>
            facility.region?.name === userRegionName &&
            facility.plantType === user.plantType
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

        if (chartResponse) {
          setChartData(await chartResponse.json());
        }
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
    <DashboardLayout pageTitle={user.region?.name ? `${user.region.name} Bölgesi Yönetici Paneli` : "Bölge Yöneticisi Paneli"}>
      <div className="page-subtitle">
        {isGES
          ? "Bölgenize bağlı güneş enerji santrallerinin genel performansını buradan izleyin."
          : "Bölgenize bağlı hidroelektrik santrallerinin genel performansını buradan izleyin."}
      </div>

      <div className="report-box full" style={{ marginBottom: "14px" }}>
        <h3>{isGES ? "GES Bölge Özeti" : "HES Bölge Özeti"}</h3>
        <p>
          {isGES
            ? "Bölgeye bağlı güneş enerji santrallerinin üretim ve alarm verileri toplu olarak izlenmektedir."
            : "Bölgeye bağlı hidroelektrik santrallerinin üretim ve alarm verileri toplu olarak izlenmektedir."}
        </p>
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
          <div className="metric-label">TESİS / AKTİF / KRİTİK</div>
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
          <div className="graph-title">
            {isGES ? "GES Bölgesel Üretim Grafiği" : "HES Bölgesel Üretim Grafiği"}
          </div>
          <div className="graph-legend-inline">
            <span><span className="dot green"></span>Gerçekleşen</span>
            <span><span className="line gray"></span>Tahmin</span>
          </div>
        </div>

        <ProductionChart data={chartData} plantType={user.plantType} />
      </div>
    </DashboardLayout>
  );
}

export default RegionalDashboardPage;