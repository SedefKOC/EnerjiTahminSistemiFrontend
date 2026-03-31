import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import "../../styles/OperatorPages.css";

function OperatorAlarmsPage() {
  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  }, []);

  const [alarms, setAlarms] = useState([]);
  const [activeFilter, setActiveFilter] = useState("TUMU");
  const [selectedAlarm, setSelectedAlarm] = useState(null);

  const fetchAlarms = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/alarms");
      const data = await response.json();

      const filteredByPlantType = data.filter(
        (alarm) => alarm.facility?.plantType === user.plantType
      );

      setAlarms(filteredByPlantType);
    } catch (error) {
      console.error("Alarmlar alınamadı:", error);
    }
  };

  useEffect(() => {
    fetchAlarms();
  }, [user.plantType]);

  const handleResolve = async (alarmId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/alarms/${alarmId}/resolve?userId=${user.userId}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        await fetchAlarms();

        if (selectedAlarm && selectedAlarm.id === alarmId) {
          setSelectedAlarm(null);
        }
      } else {
        console.error("Alarm çözülemedi");
      }
    } catch (error) {
      console.error("Resolve hatası:", error);
    }
  };

  const filteredAlarms = alarms.filter((alarm) => {
    if (activeFilter === "KRITIK") return alarm.severity === "KRITIK";
    if (activeFilter === "UYARI") return alarm.severity === "UYARI";
    if (activeFilter === "COZULDU") return alarm.status === "COZULDU";
    return true;
  });

  const criticalCount = alarms.filter((alarm) => alarm.severity === "KRITIK").length;
  const warningCount = alarms.filter((alarm) => alarm.severity === "UYARI").length;
  const resolvedCount = alarms.filter((alarm) => alarm.status === "COZULDU").length;

  return (
    <DashboardLayout pageTitle="Alarmlar">
      <div className="page-subtitle">
        {user.plantType === "GES"
          ? "Güneş enerji üretimine bağlı alarm kayıtlarını takip edin."
          : "Hidroelektrik üretime bağlı alarm kayıtlarını takip edin."}
      </div>

      <div className="alarm-top-summary">
        <div className="alarm-summary-card">
          <span>KRİTİK ALARMLAR</span>
          <strong>{criticalCount}</strong>
          <div className="alarm-mini-icon red">!</div>
        </div>

        <div className="alarm-summary-card">
          <span>UYARILAR</span>
          <strong>{warningCount}</strong>
          <div className="alarm-mini-icon yellow">△</div>
        </div>

        <div className="alarm-summary-card">
          <span>ÇÖZÜLEN</span>
          <strong>{resolvedCount}</strong>
          <div className="alarm-mini-icon green">✓</div>
        </div>
      </div>

      <div className="alarm-filter-row">
        <div className="alarm-tabs">
          <button
            className={`tab-button ${activeFilter === "TUMU" ? "active" : ""}`}
            onClick={() => setActiveFilter("TUMU")}
          >
            Tümü
          </button>
          <button
            className={`tab-button ${activeFilter === "KRITIK" ? "active" : ""}`}
            onClick={() => setActiveFilter("KRITIK")}
          >
            Kritik
          </button>
          <button
            className={`tab-button ${activeFilter === "UYARI" ? "active" : ""}`}
            onClick={() => setActiveFilter("UYARI")}
          >
            Uyarı
          </button>
          <button
            className={`tab-button ${activeFilter === "COZULDU" ? "active" : ""}`}
            onClick={() => setActiveFilter("COZULDU")}
          >
            Çözüldü
          </button>
        </div>

        <div className="alarm-period">{user.plantType}</div>
      </div>

      <div className="alarm-list-visual">
        {filteredAlarms.map((alarm) => (
          <div key={alarm.id} className="alarm-row-card">
            <div className="alarm-row-left">
              <div
                className={`alarm-dot ${
                  alarm.severity === "KRITIK" ? "critical" : "warning"
                }`}
              ></div>

              <div className="alarm-main-text">
                <div className="alarm-title-row">
                  <strong>{alarm.title}</strong>
                  <span
                    className={`severity-pill ${
                      alarm.severity === "KRITIK" ? "critical" : "warning"
                    }`}
                  >
                    {alarm.severity}
                  </span>
                </div>

                <p>{alarm.description}</p>
                <span className="alarm-facility">
                  ◉ {alarm.facility?.name || "Tesis"}
                </span>
              </div>
            </div>

            <div className="alarm-row-right">
              <span className="alarm-time">
                {alarm.createdAt
                  ? new Date(alarm.createdAt).toLocaleDateString("tr-TR")
                  : "Tarih yok"}
              </span>

              {alarm.status === "COZULDU" ? (
                <button className="resolved-static-button">Çözüldü</button>
              ) : (
                <button
                  className="resolve-button"
                  onClick={() => handleResolve(alarm.id)}
                >
                  Çözüldü olarak işaretle
                </button>
              )}

              <button
                className="detail-button"
                onClick={() => setSelectedAlarm(alarm)}
              >
                Detay
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedAlarm && (
        <div className="modal-overlay" onClick={() => setSelectedAlarm(null)}>
          <div className="alarm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="alarm-modal-header">
              <h2>{selectedAlarm.title}</h2>
              <button
                className="modal-close-button"
                onClick={() => setSelectedAlarm(null)}
              >
                ✕
              </button>
            </div>

            <div className="alarm-modal-body">
              {selectedAlarm.status === "COZULDU" && (
                <div className="resolved-info-box">
                  <div className="resolved-row">
                    <span>Çözen</span>
                    <strong>
                      {selectedAlarm.resolvedBy
                        ? `${selectedAlarm.resolvedBy.firstName} ${selectedAlarm.resolvedBy.lastName}`
                        : "Bilinmiyor"}
                    </strong>
                  </div>

                  <div className="resolved-row">
                    <span>Çözüm Tarihi</span>
                    <strong>
                      {selectedAlarm.resolvedAt
                        ? new Date(selectedAlarm.resolvedAt).toLocaleString("tr-TR")
                        : "Tarih yok"}
                    </strong>
                  </div>
                </div>
              )}

              <div className="modal-info-row">
                <span>Seviye</span>
                <strong>{selectedAlarm.severity}</strong>
              </div>

              <div className="modal-info-row">
                <span>Durum</span>
                <strong>{selectedAlarm.status}</strong>
              </div>

              <div className="modal-info-row">
                <span>Tesis</span>
                <strong>{selectedAlarm.facility?.name || "Tesis bilgisi yok"}</strong>
              </div>

              <div className="modal-info-row">
                <span>Tarih</span>
                <strong>
                  {selectedAlarm.createdAt
                    ? new Date(selectedAlarm.createdAt).toLocaleString("tr-TR")
                    : "Tarih bilgisi yok"}
                </strong>
              </div>

              <div className="modal-description-box">
                <span>Açıklama</span>
                <p>{selectedAlarm.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default OperatorAlarmsPage;