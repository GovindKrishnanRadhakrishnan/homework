import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  // ================= ADMIN GUARD =================
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ================= STYLES =================
  const containerStyle = {
    height: "100vh",
    width: "100%",
    backgroundImage:
      "url('https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const overlayStyle = {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
  };

  const cardStyle = {
    position: "relative",
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(12px)",
    borderRadius: "16px",
    padding: "40px",
    width: "90%",
    maxWidth: "900px",
    color: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  };

  const titleStyle = {
    textAlign: "center",
    fontSize: "2.5rem",
    marginBottom: "30px",
    fontWeight: "bold",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  };

  const buttonStyle = (key) => ({
    padding: "20px",
    fontSize: "1.1rem",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    background: hovered === key ? "#e64a19" : "#ff5722",
    color: "white",
    fontWeight: "bold",
    transition: "0.3s ease",
  });

  // ================= JSX =================
  return (
    <div style={containerStyle}>
      <div style={overlayStyle}></div>

      <div style={cardStyle}>
        <h1 style={titleStyle}>Admin Dashboard</h1>

        <div style={gridStyle}>
          <button
            style={buttonStyle("customers")}
            onMouseEnter={() => setHovered("customers")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate("/admin/customers")}
          >
            View Customers
          </button>

          <button
            style={buttonStyle("workouts")}
            onMouseEnter={() => setHovered("workouts")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate("/admin/workouts")}
          >
            View Workouts
          </button>

          <button
            style={buttonStyle("feedbacks")}
            onMouseEnter={() => setHovered("feedbacks")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate("/admin/feedbacks")}
          >
            View Feedbacks
          </button>

          <button
            style={{
              ...buttonStyle("logout"),
              background: hovered === "logout" ? "#b91c1c" : "red",
            }}
            onMouseEnter={() => setHovered("logout")}
            onMouseLeave={() => setHovered(null)}
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
