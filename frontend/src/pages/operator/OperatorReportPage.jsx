import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function OperatorReportPage() {
  const [productionRecords, setProductionRecords] = useState([]);
  const [alarms, setAlarms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, alarmRes] = await Promise.all([
          fetch("http://localhost:8080/api/production-records"),
          fetch("http://localhost:8080/api/alarms"),
        ]);

        setProductionRecords(await prodRes.json());
        setAlarms(await alarmRes.json());
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const exportToExcel = () => {
    const productionSheet = productionRecords.map((r) => ({
      Tarih: r.recordDate,
      Tahmin: r.predictedEnergy,
      Gerceklesen: r.actualEnergy,
    }));

    const alarmSheet = alarms.map((a) => ({
      Baslik: a.title,
      Seviye: a.severity,
      Durum: a.status,
      Tarih: a.createdAt,
    }));

    const wb = XLSX.utils.book_new();

    const ws1 = XLSX.utils.json_to_sheet(productionSheet);
    const ws2 = XLSX.utils.json_to_sheet(alarmSheet);

    XLSX.utils.book_append_sheet(wb, ws1, "Uretim");
    XLSX.utils.book_append_sheet(wb, ws2, "Alarmlar");

    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, "Enerji_Raporu.xlsx");
  };

  return (
    <DashboardLayout pageTitle="Rapor">
      <h2>Rapor Oluştur</h2>

      <button
        onClick={exportToExcel}
        style={{
          padding: "12px 18px",
          background: "#16a34a",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
        Excel Raporu İndir
      </button>
    </DashboardLayout>
  );
}

export default OperatorReportPage;