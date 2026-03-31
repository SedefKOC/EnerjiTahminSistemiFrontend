import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import ProductionChart from "../../components/ProductionChart";
import "../../styles/OperatorPages.css";

function FacilityDetailPage() {
  const { id } = useParams();

  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  }, []);

  const [facility, setFacility] = useState(null);
  const [productionRecords, setProductionRecords] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facilityRes, productionRes, alarmRes, chartRes] = await Promise.all([
          fetch("http://localhost:8080/api/facilities"),
          fetch("http://localhost:8080/api/production-records"),
          fetch("http://localhost:8080/api/alarms"),
          fetch(`http://localhost:8080/api/production-records/facility/${id}/weekly`),
        ]);

        const facilityData = await facilityRes.json();
        const productionData = await productionRes.json();
        const alarmData = await alarmRes.json();
        const chartPoints = await chartRes.json();

        const selectedFacility = facilityData.find((f) => String(f.id) === id);
        setFacility(selectedFacility || null);

        const filteredProduction = productionData.filter(
          (record) => String(record.facility?.id) === id
        );
        const filteredAlarms = alarmData.filter(
          (alarm) => String(alarm.facility?.id) === id
        );

        setProductionRecords(filteredProduction);
        setAlarms(filteredAlarms);
        setChartData(chartPoints);
      } catch (error) {
        console.error("Tesis detay verileri alınamadı:", error);
      }
    };

    fetchData();
  }, [id, user]);

  const totalActual = productionRecords.reduce(
    (sum, item) => sum + item.actualEnergy,
    0
  );

  return (
    <DashboardLayout pageTitle="Tesis Detayı">
      <div className="page-subtitle">
        Seçilen tesisin detay üretim ve alarm bilgileri
      </div>

      {facility && (
        <div className="report-page-grid">
          <div className="report-box">
            <h3>{facility.name}</h3>
            <p>Tesis Tipi: {facility.plantType}</p>
            <p>Bölge: {facility.region?.name}</p>
          </div>

          <div className="report-box">
            <h3>Toplam Gerçekleşen Üretim</h3>
            <p>{totalActual.toFixed(1)} MWh</p>
          </div>

          <div className="report-box full">
            <h3>Son Alarmlar</h3>
            {alarms.length === 0 ? (
              <p>Bu tesise ait alarm bulunmuyor.</p>
            ) : (
              alarms.slice(0, 5).map((alarm) => (
                <p key={alarm.id}>
                  {alarm.title} - {alarm.status}
                </p>
              ))
            )}
          </div>
        </div>
      )}

      {facility && (
        <div className="graph-card" style={{ marginTop: "16px" }}>
          <div className="graph-header">
            <div className="graph-title">Son 7 Günlük Üretim Grafiği</div>
            <div className="graph-legend-inline">
              <span><span className="dot green"></span>Gerçekleşen</span>
              <span><span className="line gray"></span>Tahmin</span>
            </div>
          </div>
          <ProductionChart data={chartData} />
        </div>
      )}
    </DashboardLayout>
  );
}

export default FacilityDetailPage;