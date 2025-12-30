import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    height: "",
    weight: "",
  });

  const [hover, setHover] = useState(false);

  // ================= AUTH GUARD =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  // ================= HANDLERS =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (!form.fullName || !form.email || !form.password) {
      alert("Fill all required fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/api/customers/register`,
        {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          age: form.age,
          height: form.height,
          weight: form.weight,
        }
      );

      if (res.data.success) {
        alert("Account created successfully");
        navigate("/login");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
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
    width: "360px",
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
        <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>Sign Up</h1>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          style={inputStyle}
          value={form.fullName}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          style={inputStyle}
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          style={inputStyle}
          value={form.age}
          onChange={handleChange}
        />

        <input
          type="number"
          name="height"
          placeholder="Height (cm)"
          style={inputStyle}
          value={form.height}
          onChange={handleChange}
        />

        <input
          type="number"
          name="weight"
          placeholder="Weight (kg)"
          style={inputStyle}
          value={form.weight}
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

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          style={inputStyle}
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <button
          style={buttonStyle}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={handleSignup}
        >
          Create Account
        </button>

        <p style={{ marginTop: "15px", fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <span style={linkStyle} onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
