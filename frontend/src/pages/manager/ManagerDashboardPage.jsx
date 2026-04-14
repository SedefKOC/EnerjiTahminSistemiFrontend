import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import ProductionChart from "../../components/ProductionChart";
import "../../styles/OperatorPages.css";

function ManagerDashboardPage() {
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
        console.log("[ManagerDash] user.facility:", user.facility, "| facilityId:", facilityId);
        const requests = [
          fetch("http://localhost:8080/api/production-records"),
          fetch("http://localhost:8080/api/alarms"),
        ];
        if (facilityId) {
          requests.push(
            fetch(`http://localhost:8080/api/production-records/facility/${facilityId}/weekly`)
          );
        } else {
          console.warn("[ManagerDash] facilityId bulunamadı, grafik verisi çekilemiyor");
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
          const rawChart = await chartResponse.json();
          console.log("[ManagerDash] chart response:", rawChart);
          setChartData(rawChart);
        }
      } catch (error) {
        console.error("Manager dashboard verileri alınamadı:", error);
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

  const resolvedCount = alarms.filter((alarm) => alarm.status === "COZULDU").length;
  const activeCount = alarms.filter((alarm) => alarm.status === "AKTIF").length;
  const criticalCount = alarms.filter((alarm) => alarm.severity === "KRITIK").length;

  return (
    <DashboardLayout pageTitle="Tesis Yöneticisi Paneli">
      <div className="page-subtitle">
        {isGES
          ? "GES tesisinin yönetimsel üretim ve alarm özetini görüntüleyin."
          : "HES tesisinin yönetimsel üretim ve alarm özetini görüntüleyin."}
      </div>

      <div className="top-cards-grid">
        <div className="metric-card light-card">
          <div className="metric-label">TOPLAM TAHMİN EDİLEN ÜRETİM</div>
          <div className="metric-value-row">
            <div className="metric-value">
              {totalPredicted.toFixed(1)} <span>MWh</span>
            </div>
            <div className="metric-icon green-icon">▣</div>
          </div>
        </div>

        <div className="metric-card light-card">
          <div className="metric-label">TOPLAM GERÇEKLEŞEN ÜRETİM</div>
          <div className="metric-value-row">
            <div className="metric-value">
              {totalActual.toFixed(1)} <span>MWh</span>
            </div>
            <div className="metric-icon green-icon">⚡</div>
          </div>
        </div>

        <div className="metric-card light-card">
          <div className="metric-label">KRİTİK / AKTİF ALARM</div>
          <div className="metric-value-row">
            <div className="metric-value">
              {criticalCount} / {activeCount}
            </div>
            <div className="metric-icon red-icon">!</div>
          </div>
        </div>
      </div>

      <div className="report-box full" style={{ marginBottom: "14px" }}>
        <h3>{isGES ? "GES Yönetim Notu" : "HES Yönetim Notu"}</h3>
        <p>
          {isGES
            ? "Panel verimliliği, hava koşulları ve üretim-tahmin sapmaları yönetimsel olarak izlenmektedir."
            : "Su akış koşulları, türbin besleme dengesi ve üretim-tahmin sapmaları yönetimsel olarak izlenmektedir."}
        </p>
      </div>

      <div className="graph-card">
        <div className="graph-header">
          <div className="graph-title">
            {isGES ? "GES Üretim Performansı" : "HES Üretim Performansı"}
          </div>
          <div className="graph-legend-inline">
            <span><span className="dot green"></span>Gerçekleşen</span>
            <span><span className="line gray"></span>Tahmin</span>
          </div>
        </div>

        <ProductionChart data={chartData} plantType={user.plantType} />
      </div>

      <div className="operator-main-grid" style={{ marginTop: "14px" }}>
        <section className="content-panel">
          <div className="panel-header">
            <h2>Alarm Yönetim Özeti</h2>
            <p>Aktif, kritik ve çözülen alarm bilgileri</p>
          </div>

          <div className="simple-list">
            <div className="simple-list-card">
              <strong>Aktif Alarm Sayısı</strong>
              <p>{activeCount} alarm şu anda çözüm bekliyor.</p>
            </div>

            <div className="simple-list-card">
              <strong>Çözülen Alarm Sayısı</strong>
              <p>{resolvedCount} alarm personel tarafından çözüldü olarak işaretlendi.</p>
            </div>
          </div>
        </section>

        <section className="content-panel">
          <div className="panel-header">
            <h2>Son Çözülen Alarmlar</h2>
            <p>Kim tarafından çözüldüğü görülebilir</p>
          </div>

          <div className="simple-list">
            {alarms
              .filter((alarm) => alarm.status === "COZULDU")
              .slice(0, 3)
              .map((alarm) => (
                <div key={alarm.id} className="simple-list-card">
                  <strong>{alarm.title}</strong>
                  <p>
                    Çözen:{" "}
                    {alarm.resolvedBy
                      ? `${alarm.resolvedBy.firstName} ${alarm.resolvedBy.lastName}`
                      : "Bilinmiyor"}
                  </p>
                  <p>
                    Çözüm Zamanı:{" "}
                    {alarm.resolvedAt
                      ? new Date(alarm.resolvedAt).toLocaleString("tr-TR")
                      : "Tarih bilgisi yok"}
                  </p>
                </div>
              ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default ManagerDashboardPage;