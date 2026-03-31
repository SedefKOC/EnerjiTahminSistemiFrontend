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

  // Facility selection panel state
  const [facilityPanelOpen, setFacilityPanelOpen] = useState(false);
  const [selectedFacilityIds, setSelectedFacilityIds] = useState(new Set());
  const [facilitySearch, setFacilitySearch] = useState("");

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

  // Shared helper: build workbook and trigger download
  const buildAndDownload = (facilityList, productionList, alarmList, filename) => {
    const facilitySheet = facilityList.map((f) => ({
      Tesis: f.name,
      TesisTipi: f.plantType,
      Bolge: f.region?.name || "",
    }));

    const productionSheet = productionList.map((r) => ({
      Tesis: r.facility?.name || "",
      Tarih: r.recordDate,
      Tahmin: r.predictedEnergy,
      Gerceklesen: r.actualEnergy,
    }));

    const alarmSheet = alarmList.map((a) => ({
      Tesis: a.facility?.name || "",
      Baslik: a.title,
      Seviye: a.severity,
      Durum: a.status,
      Tarih: a.createdAt,
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(facilitySheet), "Tesisler");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(productionSheet), "Uretim");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(alarmSheet), "Alarmlar");

    const blob = new Blob(
      [XLSX.write(wb, { bookType: "xlsx", type: "array" })],
      { type: "application/octet-stream" }
    );
    saveAs(blob, filename);
  };

  // A — All facilities in the region
  const exportRegionSummary = () => {
    buildAndDownload(facilities, productionRecords, alarms, "Bolge_Ozet_Raporu.xlsx");
  };

  // B — Only selected facilities
  const exportFacilitySelection = () => {
    if (selectedFacilityIds.size === 0) return;
    const ids = selectedFacilityIds;
    buildAndDownload(
      facilities.filter((f) => ids.has(f.id)),
      productionRecords.filter((r) => ids.has(r.facility?.id)),
      alarms.filter((a) => ids.has(a.facility?.id)),
      "Tesis_Secimli_Rapor.xlsx"
    );
  };

  const toggleFacility = (id) => {
    setSelectedFacilityIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredForPanel = facilities.filter((f) =>
    f.name.toLowerCase().includes(facilitySearch.toLowerCase())
  );

  return (
    <DashboardLayout pageTitle="Rapor">
      <div className="page-subtitle">
        Bölgeye bağlı tesislerin raporlarını dışa aktarın.
      </div>

      <div className="report-page-grid">
        {/* A — Region summary */}
        <div className="report-box">
          <h3>Bölge Özet Raporu</h3>
          <p>
            Bölgenize bağlı tüm tesislerin üretim kayıtları ve alarm geçmişi tek
            Excel dosyasında toplanır.
          </p>
          <button
            className="report-download-button"
            style={{ marginTop: "20px" }}
            onClick={exportRegionSummary}
          >
            Bölge Özet Raporunu İndir
          </button>
        </div>

        {/* B — Facility selection */}
        <div className="report-box">
          <h3>Tesis Seçimli Rapor</h3>
          <p>
            Bölgenizden bir veya birden fazla tesis seçerek yalnızca seçili
            tesislerin üretim ve alarm raporunu alın.
          </p>
          <button
            className="report-download-button"
            style={{ marginTop: "20px" }}
            onClick={() => {
              setFacilitySearch("");
              setFacilityPanelOpen(true);
            }}
          >
            Tesis Seç ve Rapor Al
          </button>
        </div>
      </div>

      {/* Facility selection modal */}
      {facilityPanelOpen && (
        <div
          className="modal-overlay"
          onClick={() => setFacilityPanelOpen(false)}
        >
          <div
            className="alarm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="alarm-modal-header">
              <h2>Tesis Seçin</h2>
              <button
                className="modal-close-button"
                onClick={() => setFacilityPanelOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="alarm-modal-body">
              <input
                className="selector-search"
                placeholder="Tesis ara..."
                value={facilitySearch}
                onChange={(e) => setFacilitySearch(e.target.value)}
              />

              <div className="selector-list">
                {filteredForPanel.length === 0 ? (
                  <p style={{ padding: "12px", color: "#6b7280", fontSize: "14px" }}>
                    Sonuç bulunamadı.
                  </p>
                ) : (
                  filteredForPanel.map((f) => (
                    <label key={f.id} className="selector-item">
                      <input
                        type="checkbox"
                        checked={selectedFacilityIds.has(f.id)}
                        onChange={() => toggleFacility(f.id)}
                      />
                      <span>{f.name}</span>
                      <span className="selector-item-meta">{f.plantType}</span>
                    </label>
                  ))
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span style={{ fontSize: "13px", color: "#6b7280", fontWeight: 600 }}>
                  {selectedFacilityIds.size} tesis seçildi
                </span>
                <button
                  className="report-download-button"
                  style={{
                    opacity: selectedFacilityIds.size === 0 ? 0.5 : 1,
                    cursor: selectedFacilityIds.size === 0 ? "not-allowed" : "pointer",
                  }}
                  onClick={() => {
                    exportFacilitySelection();
                    setFacilityPanelOpen(false);
                  }}
                >
                  Seçili Tesislerin Raporunu İndir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default RegionalReportPage;
