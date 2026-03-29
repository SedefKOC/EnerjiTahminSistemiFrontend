import { useMemo } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import "../../styles/OperatorPages.css";

function OperatorDashboardPage() {
  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  }, []);

  const isGES = user.plantType === "GES";

  return (
    <DashboardLayout pageTitle="Ana Sayfa">
      <div className="page-subtitle">
        Genel üretim performansını ve sistem durumunu buradan takip edin.
      </div>

      <div className="top-cards-grid">
        <div className="metric-card light-card">
          <div className="metric-label">
            {isGES ? "BUGÜNKÜ ÜRETİM" : "HAFTALIK ÜRETİM"}
          </div>
          <div className="metric-value-row">
            <div className="metric-value">
              {isGES ? "2.8" : "18.4"} <span>MWh</span>
            </div>
            <div className="metric-icon green-icon">
              {isGES ? "▣" : "⚡"}
            </div>
          </div>
        </div>

        {isGES ? (
          <div className="metric-card green-feature-card">
            <div className="feature-card-title">İSTASYON HAVA DURUMU</div>
            <div className="feature-card-main">
              <div>
                <div className="feature-big-value">24°C</div>
                <div className="feature-subtext">Güneşli</div>
              </div>

              <div className="feature-side-info">
                <div className="sun-icon">☀</div>
                <div className="uv-label">UV ENDEKSİ</div>
                <div className="uv-value">6.2</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="metric-card light-card">
            <div className="metric-label">TAHMİN SAPMASI</div>
            <div className="metric-value-row">
              <div className="metric-value red-text">
                %12 <span>düşük</span>
              </div>
              <div className="metric-icon red-icon">⌁</div>
            </div>
          </div>
        )}

        {isGES ? (
          <div className="metric-card suggestion-card">
            <div className="suggestion-title">⚙ Öneriler</div>

            <div className="suggestion-item">🧼 Panel temizliği önerilir</div>
            <div className="suggestion-item">🔧 Periyodik bakım kontrolü önerilir</div>
            <div className="suggestion-item">📈 Sistem performansı gözlemleniyor</div>

            <button className="green-full-button">Tüm Önerileri Gör →</button>
          </div>
        ) : (
          <div className="metric-card light-card">
            <div className="metric-label">TAHMİN PERFORMANSI</div>
            <div className="metric-value-row performance-row">
              <div className="metric-value">%88</div>
              <div className="performance-bar">
                <div className="performance-fill" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="graph-card">
        <div className="graph-header">
          <div className="graph-title">Enerji Üretimi (Gerçekleşen vs Tahmin)</div>
          <div className="graph-legend">
            <span><span className="dot green"></span>Gerçekleşen</span>
            <span><span className="line gray"></span>Tahmin</span>
          </div>
        </div>

        {isGES ? (
          <div className="mock-chart">
            <div className="grid-lines" />
            <div className="anomaly-badge">ANOMALİ TESPİT EDİLDİ (CMT - PAZ)</div>

            <div className="chart-labels left-scale ges-scale">
              <span>500</span>
              <span>400</span>
              <span>300</span>
              <span>200</span>
              <span>100</span>
              <span>0</span>
            </div>

            <svg viewBox="0 0 760 280" className="chart-svg">
              <polyline
                points="50,160 140,162 230,156 320,160 410,154 500,122 590,182"
                fill="none"
                stroke="#16a34a"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="50,164 140,166 230,160 320,163 410,158 500,150 590,148"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="3"
                strokeDasharray="8 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="50" cy="160" r="6" fill="#16a34a" />
              <circle cx="140" cy="162" r="6" fill="#16a34a" />
              <circle cx="230" cy="156" r="6" fill="#16a34a" />
              <circle cx="320" cy="160" r="6" fill="#16a34a" />
              <circle cx="410" cy="154" r="6" fill="#16a34a" />
              <circle cx="500" cy="122" r="6" fill="#dc2626" />
              <circle cx="590" cy="182" r="6" fill="#dc2626" />
            </svg>

            <div className="chart-bottom-labels">
              <span>PZT</span>
              <span>SAL</span>
              <span>ÇAR</span>
              <span>PER</span>
              <span>CUM</span>
              <span className="red-day">CMT</span>
              <span className="red-day">PAZ</span>
            </div>
          </div>
        ) : (
          <div className="mock-chart">
            <div className="grid-lines" />

            <div className="chart-labels left-scale hes-scale">
              <span>250</span>
              <span>200</span>
              <span>150</span>
              <span>100</span>
              <span>50</span>
            </div>

            <svg viewBox="0 0 760 280" className="chart-svg">
              <polyline
                points="50,190 140,194 230,186 320,191 410,180 500,105 590,220"
                fill="none"
                stroke="#16a34a"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="50,192 140,190 230,188 320,190 410,184 500,170 590,168"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="3"
                strokeDasharray="8 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="50" cy="190" r="6" fill="#16a34a" />
              <circle cx="140" cy="194" r="6" fill="#16a34a" />
              <circle cx="230" cy="186" r="6" fill="#16a34a" />
              <circle cx="320" cy="191" r="6" fill="#16a34a" />
              <circle cx="410" cy="180" r="6" fill="#16a34a" />
              <circle cx="500" cy="105" r="6" fill="#dc2626" />
              <circle cx="590" cy="220" r="6" fill="#dc2626" />
            </svg>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default OperatorDashboardPage;