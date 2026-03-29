import DashboardLayout from "../../components/DashboardLayout";
import "../../styles/OperatorPages.css";

function OperatorReportsPage() {
  return (
    <DashboardLayout pageTitle="Karar Destek">
      <div className="page-subtitle">
        Tesis performansı ve sistem çıktılarıyla ilgili raporları burada görüntüleyin.
      </div>

      <div className="report-page-grid">
        <div className="report-box">
          <h3>Haftalık Performans Özeti</h3>
          <p>
            Üretim verileri, alarm yoğunluğu ve tahmin doğruluğu üzerinden kısa bir
            değerlendirme alanı.
          </p>
        </div>

        <div className="report-box">
          <h3>Bakım ve Öneri Notları</h3>
          <p>
            Sistemin önerdiği bakım, temizlik ve performans iyileştirme tavsiyeleri
            bu bölümde toplanacak.
          </p>
        </div>

        <div className="report-box full">
          <h3>Karar Destek Çıktıları</h3>
          <p>
            Bu alan daha sonra grafik destekli analiz, PDF dışa aktarma ve dönemsel
            rapor özetleri için kullanılacak.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default OperatorReportsPage;