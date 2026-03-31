import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import "../../styles/OperatorPages.css";

function RegionalFacilitiesPage() {
  const navigate = useNavigate();

  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  }, []);

  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/facilities");
        const data = await response.json();

        const regionalFacilities = data.filter(
          (facility) =>
            facility.region?.name === user.region?.name &&
            facility.plantType === user.plantType
        );

        setFacilities(regionalFacilities);
      } catch (error) {
        console.error("Tesis listesi alınamadı:", error);
      }
    };

    fetchFacilities();
  }, [user]);

  return (
    <DashboardLayout pageTitle="Tesisler">
      <div className="page-subtitle">
        Bölgenize bağlı tüm tesisleri görüntüleyin ve detaylarına geçin.
      </div>

      <div className="facility-grid">
        {facilities.map((facility) => (
          <div
            key={facility.id}
            className="facility-card-box"
            onClick={() => navigate(`/regional/facilities/${facility.id}`)}
          >
            <h3>{facility.name}</h3>
            <p>Tesis Tipi: {facility.plantType}</p>
            <p>Bölge: {facility.region?.name}</p>
            <button className="detail-button">Detay Gör</button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default RegionalFacilitiesPage;