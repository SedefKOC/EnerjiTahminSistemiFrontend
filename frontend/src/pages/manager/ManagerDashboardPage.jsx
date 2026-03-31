import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import ProductionChart from "../../components/ProductionChart";
import "../../styles/OperatorPages.css";

function ManagerDashboardPage() {
  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  }, []);

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

        setProductionRecords(productionData);
        setAlarms(alarmData);
      } catch (error) {
        console.error("Manager dashboard verileri alınamadı:", error);
      }
    };

    fetchData();
  }, []);

  const totalPredicted = productionRecords.reduce(
    (sum, item) => sum + item.predictedEnergy,
    0,
  );

  const totalActual = productionRecords.reduce(
    (sum, item) => sum + item.actualEnergy,
    0,
  );

  const resolvedCount = alarms.filter(
    (alarm) => alarm.status === "COZULDU",
  ).length;
  const activeCount = alarms.filter((alarm) => alarm.status === "AKTIF").length;
  const criticalCount = alarms.filter(
    (alarm) => alarm.severity === "KRITIK",
  ).length;

  return (
    <DashboardLayout pageTitle="Tesis Yöneticisi Paneli">
      <div className="page-subtitle">
        Tesisin genel performansını, alarm durumunu ve kullanıcı aksiyonlarını
        buradan izleyin.
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

      <div className="graph-card">
        <div className="graph-header">
          <div className="graph-title">
            Üretim Performansı (Gerçekleşen vs Tahmin)
          </div>
          <div className="graph-legend-inline">
            <span>
              <span className="dot green"></span>Gerçekleşen
            </span>
            <span>
              <span className="line gray"></span>Tahmin
            </span>
          </div>
        </div>

        <ProductionChart data={productionRecords} />
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
              <p>
                {resolvedCount} alarm personel tarafından çözüldü olarak
                işaretlendi.
              </p>
            </div>
          </div>
        </section>

        <section className="content-panel">
          <div className="panel-header">
            <h2>Son Çözülen Alarmlar</h2>
          </div>

          <div className="simple-list">
            {alarms
              .filter((alarm) => alarm.status === "COZULDU")
              .slice(0, 3)
              .map((alarm) => (
                <div key={alarm.id} className="simple-list-card">
                  <strong>{alarm.title}</strong>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
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

                    {alarm.resolvedBy && (
                      <>
                        <p>
                          İletişim: {alarm.resolvedBy.phone || "Telefon yok"}
                        </p>
                        <p>
                          E-posta: {alarm.resolvedBy.email || "E-posta yok"}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default ManagerDashboardPage;
