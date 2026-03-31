import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";

function ExecutiveRegionsPage() {
  const navigate = useNavigate();
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:8080/api/facilities");
      const data = await res.json();

      const grouped = {};

      data.forEach((f) => {
        if (!grouped[f.region.name]) {
          grouped[f.region.name] = [];
        }
        grouped[f.region.name].push(f);
      });

      setRegions(grouped);
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout pageTitle="Bölgeler">
      <div className="facility-grid">
        {Object.keys(regions).map((regionName) => (
          <div
            key={regionName}
            className="facility-card-box"
            onClick={() => navigate(`/executive/regions/${regionName}`)}
          >
            <h3>{regionName}</h3>
            <p>Tesis Sayısı: {regions[regionName].length}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default ExecutiveRegionsPage;