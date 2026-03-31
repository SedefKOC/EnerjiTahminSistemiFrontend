import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import ProductionChart from "../../components/ProductionChart";

function RegionDetailPage() {
  const { name } = useParams();

  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [prodRes, facilityRes] = await Promise.all([
        fetch("http://localhost:8080/api/production-records"),
        fetch("http://localhost:8080/api/facilities"),
      ]);

      const prodData = await prodRes.json();
      const facilityData = await facilityRes.json();

      const facilities = facilityData.filter(
        (f) => f.region.name === name
      );

      const ids = facilities.map((f) => f.id);

      const filtered = prodData.filter((r) =>
        ids.includes(r.facility.id)
      );

      setRecords(filtered);
    };

    fetchData();
  }, [name]);

  return (
    <DashboardLayout pageTitle={`Bölge: ${name}`}>
      <ProductionChart data={records} />
    </DashboardLayout>
  );
}

export default RegionDetailPage;