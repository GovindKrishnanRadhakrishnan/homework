import { useNavigate } from "react-router-dom";

const heroImage =
  "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg";

export default function Index() {
  const navigate = useNavigate();

  const containerStyle = {
    position: "relative",
    width: "100%",
    height: "100vh",
    backgroundImage: `url(${heroImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const overlayStyle = {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
  };

  const contentStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    color: "white",
  };

  return (
    <div style={containerStyle}>
      <div style={overlayStyle}></div>

      <div style={contentStyle}>
        <h1 style={{ fontSize: "3.2rem", fontWeight: "bold" }}>
          HomeWork Fitness App
        </h1>
        <p>Build discipline. Track progress. Transform your body.</p>

        <button
          style={{
            padding: "14px 32px",
            background: "#ff5722",
            border: "none",
            borderRadius: "10px",
            color: "white",
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
          onClick={() => navigate("/login")}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
