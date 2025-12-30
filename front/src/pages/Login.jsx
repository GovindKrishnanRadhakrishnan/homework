import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [hover, setHover] = useState(false);

  // ================= AUTH GUARD (ROLE-AWARE) =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    }
  }, [navigate]);

  // ================= HANDLERS =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      alert("Fill all fields");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/customers/login`, {
        email: form.email,
        password: form.password,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        if (res.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  // ================= STYLES =================
  const containerStyle = {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage:
      "url('https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  };

  const overlayStyle = {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
  };

  const cardStyle = {
    position: "relative",
    background: "rgba(255,255,255,0.1)",
    padding: "40px",
    borderRadius: "12px",
    width: "350px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
    color: "white",
    textAlign: "center",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "none",
    fontSize: "1rem",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    background: hover ? "#e64a19" : "#ff5722",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "0.3s ease",
  };

  const linkStyle = {
    color: "#ff5722",
    cursor: "pointer",
    fontWeight: "bold",
  };

  // ================= JSX =================
  return (
    <div style={containerStyle}>
      <div style={overlayStyle}></div>

      <div style={cardStyle}>
        <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>Login</h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          style={inputStyle}
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          style={inputStyle}
          value={form.password}
          onChange={handleChange}
        />

        <button
          style={buttonStyle}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={handleLogin}
        >
          Login
        </button>

        <p style={{ marginTop: "15px", fontSize: "0.9rem" }}>
          Don&apos;t have an account?{" "}
          <span style={linkStyle} onClick={() => navigate("/signup")}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
