import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import "../../styles/OperatorPages.css";

function ManagerAlarmsPage() {
  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  }, []);

  const [alarms, setAlarms] = useState([]);

  useEffect(() => {
    const fetchAlarms = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/alarms");
        const data = await response.json();

        const filteredByPlantType = data.filter(
          (alarm) => alarm.facility?.plantType === user.plantType
        );

        setAlarms(filteredByPlantType);
      } catch (error) {
        console.error("Manager alarm verileri alınamadı:", error);
      }
    };

    fetchAlarms();
  }, [user.plantType]);

  return (
    <DashboardLayout pageTitle="Alarm Yönetimi">
      <div className="page-subtitle">
        {user.plantType === "GES"
          ? "GES tesislerine ait alarm durumlarını yönetsel bakışla inceleyin."
          : "HES tesislerine ait alarm durumlarını yönetsel bakışla inceleyin."}
      </div>

      <div className="alarm-list-visual">
        {alarms.map((alarm) => (
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

              <button className="detail-button">
                {alarm.status === "COZULDU" ? "Çözüldü" : "İncele"}
              </button>

              <div style={{ fontSize: "12px", color: "#6b7280", textAlign: "right" }}>
                {alarm.resolvedBy
                  ? `${alarm.resolvedBy.firstName} ${alarm.resolvedBy.lastName}`
                  : "Henüz çözen yok"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default ManagerAlarmsPage;