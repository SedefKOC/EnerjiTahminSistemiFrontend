import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "../../styles/OperatorPages.css";

function ExecutiveReportPage() {
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

        setProductionRecords(await prodRes.json());
        setAlarms(await alarmRes.json());
        setFacilities(await facilityRes.json());
      } catch (err) {
        console.error("Executive report verileri alınamadı:", err);
      }
    };

    fetchData();
  }, []);

  const exportToExcel = () => {
    const facilitySheet = facilities.map((f) => ({
      Tesis: f.name,
      TesisTipi: f.plantType,
      Bolge: f.region?.name || "",
      AktifMi: f.active ? "Evet" : "Hayır",
    }));

    const productionSheet = productionRecords.map((r) => ({
      Tesis: r.facility?.name || "",
      Tarih: r.recordDate,
      Tahmin: r.predictedEnergy,
      Gerceklesen: r.actualEnergy,
    }));

    const alarmSheet = alarms.map((a) => ({
      Tesis: a.facility?.name || "",
      Baslik: a.title,
      AlarmTuru: a.alarmType,
      Seviye: a.severity,
      Durum: a.status,
      OlusturmaTarihi: a.createdAt,
      CozumTarihi: a.resolvedAt || "Yok",
      Cozen: a.resolvedBy
        ? `${a.resolvedBy.firstName} ${a.resolvedBy.lastName}`
        : "Yok",
    }));

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(facilitySheet),
      "Tesisler"
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(productionSheet),
      "Uretim"
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(alarmSheet),
      "Alarmlar"
    );

    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, "Ust_Yonetici_Genel_Rapor.xlsx");
  };

  return (
    <DashboardLayout pageTitle="Rapor">
      <div className="page-subtitle">
        Tüm sistemin tesis, üretim ve alarm verilerini tek raporda dışa aktarın.
      </div>

      <div className="report-page-grid">
        <div className="report-box">
          <h3>Genel Sistem Raporu</h3>
          <p>
            Bu rapor tüm bölgeleri, tesisleri, üretim kayıtlarını ve alarm
            geçmişini kapsar.
          </p>
        </div>

        <div className="report-box">
          <h3>Yönetimsel Kullanım</h3>
          <p>
            Üst yönetim için genel performans değerlendirmesi ve arşivleme amacıyla
            kullanılabilir.
          </p>
        </div>

        <div className="report-box full report-action-box">
          <button className="report-download-button" onClick={exportToExcel}>
            Genel Excel Raporunu İndir
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ExecutiveReportPage;
