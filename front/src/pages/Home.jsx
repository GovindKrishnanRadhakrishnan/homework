import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const [previewImage, setPreviewImage] = useState(null);

  // ================= BUTTON STYLES =================
  const primaryButton = {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  const dangerButton = {
    ...primaryButton,
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
  };

  // ================= AUTH + LOAD =================
  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
      return;
    }

    const load = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/workouts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkouts(res.data.data || []);
      } catch {
        alert("Failed to load workouts");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, user, navigate]);

  if (!token || !user) return null;

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ================= FEEDBACK =================
  const submitFeedback = async () => {
    if (!feedbackText.trim()) return alert("Feedback cannot be empty");

    try {
      await axios.post(
        `${API_URL}/api/feedback`,
        { message: feedbackText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Feedback submitted");
      setFeedbackText("");
      setFeedbackOpen(false);
    } catch {
      alert("Feedback failed");
    }
  };

  // ================= UI =================
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "30px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1100,
          margin: "0 auto 30px",
        }}
      >
        <h2>Welcome, {user.fullName}</h2>
        <div>
          <button
            style={primaryButton}
            onClick={() => setFeedbackOpen(true)}
          >
            Feedback
          </button>

          <button
            style={{ ...dangerButton, marginLeft: 12 }}
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* WORKOUT LIST */}
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {loading ? (
          <p>Loading workouts...</p>
        ) : workouts.length === 0 ? (
          <p>No workouts available</p>
        ) : (
          workouts.map((w) => (
            <div
              key={w._id}
              style={{
                display: "flex",
                gap: 20,
                background: "#1e293b",
                padding: 16,
                borderRadius: 10,
                marginBottom: 18,
              }}
            >
              {/* IMAGE */}
{Array.isArray(w.images) &&
  typeof w.images[0] === "string" &&
  w.images[0].startsWith("/uploads/workouts") && (
    <img
      src={`${API_URL}${w.images[0]}`}
      alt={w.title}
      loading="lazy"
      onClick={() =>
        setPreviewImage(`${API_URL}${w.images[0]}`)
      }
      onError={(e) => {
        console.error(
          "IMAGE FAILED TO LOAD:",
          e.currentTarget.src
        );
        e.currentTarget.style.display = "none";
      }}
      style={{
        width: 160,
        height: 120,
        objectFit: "cover",
        borderRadius: 8,
        flexShrink: 0,
        cursor: "pointer",
      }}
    />
)}


              {/* CONTENT */}
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 6px" }}>{w.title}</h3>
                <p style={{ opacity: 0.8, marginBottom: 8 }}>
                  {w.description.length > 120
                    ? w.description.slice(0, 120) + "..."
                    : w.description}
                </p>
                <small style={{ opacity: 0.7 }}>
                  Category: {w.category} | Reps: {w.reps}
                </small>
              </div>
            </div>
          ))
        )}
      </div>

      {/* IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Workout Preview"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: 12,
              boxShadow: "0 0 30px rgba(0,0,0,0.8)",
            }}
          />
        </div>
      )}

      {/* FEEDBACK MODAL */}
      {feedbackOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setFeedbackOpen(false)}
        >
          <div
            style={{
              background: "#1e293b",
              padding: 20,
              width: "90%",
              maxWidth: 400,
              borderRadius: 10,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Submit Feedback</h3>

            <textarea
              rows={5}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              style={{ width: "100%", marginTop: 10 }}
            />

            <button
              style={{ ...primaryButton, marginTop: 12, width: "100%" }}
              onClick={submitFeedback}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
