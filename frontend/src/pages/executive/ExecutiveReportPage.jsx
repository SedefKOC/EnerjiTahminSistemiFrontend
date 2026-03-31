import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "../../styles/OperatorPages.css";

function ExecutiveReportPage() {
  const [productionRecords, setProductionRecords] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [facilities, setFacilities] = useState([]);

  // Selection panel state
  const [regionPanelOpen, setRegionPanelOpen] = useState(false);
  const [facilityPanelOpen, setFacilityPanelOpen] = useState(false);
  const [selectedRegionIds, setSelectedRegionIds] = useState(new Set());
  const [selectedFacilityIds, setSelectedFacilityIds] = useState(new Set());
  const [regionSearch, setRegionSearch] = useState("");
  const [facilitySearch, setFacilitySearch] = useState("");

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

  // Derive unique regions from the fetched facilities list
  const regions = useMemo(() => {
    const seen = new Set();
    const result = [];
    for (const f of facilities) {
      if (f.region?.id && !seen.has(f.region.id)) {
        seen.add(f.region.id);
        result.push(f.region);
      }
    }
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [facilities]);

  // Shared helper: build workbook and trigger download
  const buildAndDownload = (facilityList, productionList, alarmList, filename) => {
    const facilitySheet = facilityList.map((f) => ({
      Tesis: f.name,
      TesisTipi: f.plantType,
      Bolge: f.region?.name || "",
      AktifMi: f.active ? "Evet" : "Hayır",
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
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(facilitySheet), "Tesisler");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(productionSheet), "Uretim");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(alarmSheet), "Alarmlar");

    const blob = new Blob(
      [XLSX.write(wb, { bookType: "xlsx", type: "array" })],
      { type: "application/octet-stream" }
    );
    saveAs(blob, filename);
  };

  // A — All regions / all facilities
  const exportAllSummary = () => {
    buildAndDownload(facilities, productionRecords, alarms, "Ust_Yonetici_Genel_Rapor.xlsx");
  };

  // B — Selected regions only (resolve to facility IDs via the facilities list)
  const exportRegionSelection = () => {
    if (selectedRegionIds.size === 0) return;
    const facilityIds = new Set(
      facilities
        .filter((f) => selectedRegionIds.has(f.region?.id))
        .map((f) => f.id)
    );
    buildAndDownload(
      facilities.filter((f) => facilityIds.has(f.id)),
      productionRecords.filter((r) => facilityIds.has(r.facility?.id)),
      alarms.filter((a) => facilityIds.has(a.facility?.id)),
      "Bolge_Secimli_Rapor.xlsx"
    );
  };

  // C — Selected facilities only
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

  const toggleRegion = (id) => {
    setSelectedRegionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleFacility = (id) => {
    setSelectedFacilityIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredRegions = regions.filter((r) =>
    r.name.toLowerCase().includes(regionSearch.toLowerCase())
  );

  const filteredFacilities = facilities.filter((f) =>
    f.name.toLowerCase().includes(facilitySearch.toLowerCase())
  );

  return (
    <DashboardLayout pageTitle="Rapor">
      <div className="page-subtitle">
        Tüm sistemin tesis, üretim ve alarm verilerini rapor olarak dışa aktarın.
      </div>

      <div className="report-options-grid">
        {/* A — General summary */}
        <div className="report-option-card">
          <h3>Genel Özet Raporu</h3>
          <p>
            Tüm bölgeler ve tesislerin üretim kayıtları, alarm geçmişi ve tesis
            bilgileri tek dosyada toplanır.
          </p>
          <button className="report-download-button" onClick={exportAllSummary}>
            Genel Raporu İndir
          </button>
        </div>

        {/* B — Region selection */}
        <div className="report-option-card">
          <h3>Bölge Seçimli Rapor</h3>
          <p>
            Bir veya birden fazla bölge seçerek yalnızca o bölgelerin tesis ve
            üretim verilerini raporlayın.
          </p>
          <button
            className="report-download-button"
            onClick={() => {
              setRegionSearch("");
              setRegionPanelOpen(true);
            }}
          >
            Bölge Seç ve Rapor Al
          </button>
        </div>

        {/* C — Facility selection */}
        <div className="report-option-card">
          <h3>Tesis Seçimli Rapor</h3>
          <p>
            Tüm bölgelerden istediğiniz tesisleri seçerek yalnızca seçili
            tesislerin verilerini raporlayın.
          </p>
          <button
            className="report-download-button"
            onClick={() => {
              setFacilitySearch("");
              setFacilityPanelOpen(true);
            }}
          >
            Tesis Seç ve Rapor Al
          </button>
        </div>
      </div>

      {/* Region selection modal */}
      {regionPanelOpen && (
        <div
          className="modal-overlay"
          onClick={() => setRegionPanelOpen(false)}
        >
          <div
            className="alarm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="alarm-modal-header">
              <h2>Bölge Seçin</h2>
              <button
                className="modal-close-button"
                onClick={() => setRegionPanelOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="alarm-modal-body">
              <input
                className="selector-search"
                placeholder="Bölge ara..."
                value={regionSearch}
                onChange={(e) => setRegionSearch(e.target.value)}
              />

              <div className="selector-list">
                {filteredRegions.length === 0 ? (
                  <p style={{ padding: "12px", color: "#6b7280", fontSize: "14px" }}>
                    Sonuç bulunamadı.
                  </p>
                ) : (
                  filteredRegions.map((r) => (
                    <label key={r.id} className="selector-item">
                      <input
                        type="checkbox"
                        checked={selectedRegionIds.has(r.id)}
                        onChange={() => toggleRegion(r.id)}
                      />
                      <span>{r.name}</span>
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
                  {selectedRegionIds.size} bölge seçildi
                </span>
                <button
                  className="report-download-button"
                  style={{
                    opacity: selectedRegionIds.size === 0 ? 0.5 : 1,
                    cursor: selectedRegionIds.size === 0 ? "not-allowed" : "pointer",
                  }}
                  onClick={() => {
                    exportRegionSelection();
                    setRegionPanelOpen(false);
                  }}
                >
                  Seçili Bölgelerin Raporunu İndir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                {filteredFacilities.length === 0 ? (
                  <p style={{ padding: "12px", color: "#6b7280", fontSize: "14px" }}>
                    Sonuç bulunamadı.
                  </p>
                ) : (
                  filteredFacilities.map((f) => (
                    <label key={f.id} className="selector-item">
                      <input
                        type="checkbox"
                        checked={selectedFacilityIds.has(f.id)}
                        onChange={() => toggleFacility(f.id)}
                      />
                      <span>{f.name}</span>
                      <span className="selector-item-meta">{f.region?.name}</span>
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

export default ExecutiveReportPage;
