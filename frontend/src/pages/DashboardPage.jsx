function DashboardPage() {
  const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>Dashboard</h1>
      <p>Hoş geldin: {user.firstName} {user.lastName}</p>
      <p>Rol: {user.role}</p>
      <p>Tesis Tipi: {user.plantType}</p>
    </div>
  );
}

export default DashboardPage;