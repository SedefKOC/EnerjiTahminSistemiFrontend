import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "../../styles/OperatorPages.css";

function RegionalReportPage() {
  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  }, []);

  const [productionRecords, setProductionRecords] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [facilities, setFacilities] = useState([]);

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

        const regionalFacilities = facilityData.filter(
          (facility) => facility.region?.name === user.region?.name
        );

        const facilityIds = regionalFacilities.map((facility) => facility.id);

        setFacilities(regionalFacilities);
        setProductionRecords(
          prodData.filter((record) => facilityIds.includes(record.facility?.id))
        );
        setAlarms(
          alarmData.filter((alarm) => facilityIds.includes(alarm.facility?.id))
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [user]);

  const exportToExcel = () => {
    const productionSheet = productionRecords.map((r) => ({
      Tesis: r.facility?.name || "",
      Tarih: r.recordDate,
      Tahmin: r.predictedEnergy,
      Gerceklesen: r.actualEnergy,
    }));

    const alarmSheet = alarms.map((a) => ({
      Tesis: a.facility?.name || "",
      Baslik: a.title,
      Seviye: a.severity,
      Durum: a.status,
      Tarih: a.createdAt,
    }));

    const facilitySheet = facilities.map((f) => ({
      Tesis: f.name,
      TesisTipi: f.plantType,
      Bolge: f.region?.name || "",
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(facilitySheet), "Tesisler");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(productionSheet), "Uretim");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(alarmSheet), "Alarmlar");

    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, "Bolge_Raporu.xlsx");
  };

  return (
    <DashboardLayout pageTitle="Rapor">
      <div className="page-subtitle">
        Bölgeye bağlı tüm tesislerin toplu raporlarını dışa aktarın.
      </div>

      <div className="report-page-grid">
        <div className="report-box">
          <h3>Bölgesel Rapor</h3>
          <p>Tesisler, üretim kayıtları ve alarm geçmişi tek raporda toplanır.</p>
        </div>

        <div className="report-box">
          <h3>Kapsam</h3>
          <p>Bu rapor yalnızca bölgenize bağlı tesislerin bilgilerini içerir.</p>
        </div>

        <div className="report-box full">
          <button
            onClick={exportToExcel}
            style={{
              padding: "12px 18px",
              background: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            Bölge Excel Raporunu İndir
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default RegionalReportPage;