import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "../../styles/OperatorPages.css";

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
      <div className="page-subtitle">
        Üretim ve alarm kayıtlarını tek dosyada dışa aktarın.
      </div>

      <div className="report-page-grid">
        <div className="report-box">
          <h3>Operasyon Raporu</h3>
          <p>Güncel üretim kayıtları ve alarm başlıkları tek Excel dosyasında toplanır.</p>
        </div>

        <div className="report-box">
          <h3>Hazır Dışa Aktarım</h3>
          <p>İndirilen çıktı operasyon ekiplerinin hızlı inceleme ve paylaşımına uygundur.</p>
        </div>

        <div className="report-box full report-action-box">
          <button className="report-download-button" onClick={exportToExcel}>
            Excel Raporu İndir
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default OperatorReportPage;
