import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function ViewFeedback() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= ADMIN GUARD =================
  useEffect(() => {
    if (!token || !user || user.role !== "admin") {
      navigate("/login");
    }
  }, [navigate, token, user]);

  // ================= FETCH FEEDBACKS =================
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/feedback`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks(res.data.data || []);
    } catch {
      alert("Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE FEEDBACK =================
  const deleteFeedback = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;

    try {
      await axios.delete(`${API_URL}/api/feedback/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks((prev) => prev.filter((f) => f._id !== id));
    } catch {
      alert("Failed to delete feedback");
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // ================= STYLES =================
  const container = {
    minHeight: "100vh",
    background: "linear-gradient(to right, #141e30, #243b55)",
    padding: "30px",
    color: "white",
  };

  const card = {
    background: "rgba(255,255,255,0.12)",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "15px",
    backdropFilter: "blur(10px)",
  };

  const badge = (rating = 0) => ({
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "6px",
    background:
      rating >= 4 ? "#22c55e" : rating === 3 ? "#eab308" : "#ef4444",
    color: "black",
    fontWeight: "bold",
    fontSize: "0.85rem",
  });

  const button = {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  };

  // ================= JSX =================
  return (
    <div style={container}>
      <h2 style={{ marginBottom: "25px" }}>Customer Feedbacks</h2>

      {loading ? (
        <p>Loading feedbacks...</p>
      ) : feedbacks.length === 0 ? (
        <p>No feedbacks available</p>
      ) : (
        feedbacks.map((f) => (
          <div key={f._id} style={card}>
            <div style={{ marginBottom: "8px" }}>
              <strong>{f.userId?.fullName || "Unknown User"}</strong>
              {f.userId?.email && (
                <span style={{ opacity: 0.7 }}>
                  {" "}
                  ({f.userId.email})
                </span>
              )}
            </div>

            <div style={{ marginBottom: "8px" }}>
              <span style={badge(f.rating)}>Rating: {f.rating || 0}/5</span>
            </div>

            <p style={{ marginBottom: "10px" }}>{f.message}</p>

            <small style={{ opacity: 0.7 }}>
              Submitted on{" "}
              {new Date(f.createdAt).toLocaleDateString()}{" "}
              {new Date(f.createdAt).toLocaleTimeString()}
            </small>

            <div style={{ marginTop: "12px" }}>
              <button
                style={{ ...button, background: "red", color: "white" }}
                onClick={() => deleteFeedback(f._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
