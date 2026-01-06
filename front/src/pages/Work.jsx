import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Work() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // ================= ADMIN GUARD =================
  useEffect(() => {
    if (!token || !user || user.role !== "admin") {
      navigate("/login");
    }
  }, [navigate, token, user]);

  // ================= STATES =================
  const [form, setForm] = useState({
    title: "",
    description: "",
    reps: "",
    category: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [workouts, setWorkouts] = useState([]);
  const [showWorkouts, setShowWorkouts] = useState(false);
  const [loadingWorkouts, setLoadingWorkouts] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editImagesToRemove, setEditImagesToRemove] = useState([]);
  const [editNewImages, setEditNewImages] = useState([]);

  // ================= ADD WORKOUT =================
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    if (e.target.files.length > 10) {
      alert("Maximum 10 images allowed");
      return;
    }
    setImages(e.target.files);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description) {
      alert("Title and description are required");
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    Array.from(images).forEach((img) => formData.append("images", img));

    try {
      setLoading(true);

      await axios.post(`${API_URL}/api/workouts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Workout uploaded");
      setForm({ title: "", description: "", reps: "", category: "" });
      setImages([]);
      fetchWorkouts();
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH WORKOUTS =================
  const fetchWorkouts = async () => {
    try {
      setShowWorkouts(true);
      setLoadingWorkouts(true);

      const res = await axios.get(`${API_URL}/api/workouts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setWorkouts(res.data.data || []);
    } catch {
      alert("Failed to fetch workouts");
    } finally {
      setLoadingWorkouts(false);
    }
  };

  // ================= EDIT WORKOUT =================
  const startEdit = (workout) => {
    setEditingId(workout._id);
    setEditForm({ ...workout });
    setEditImagesToRemove([]);
    setEditNewImages([]);
  };

  const toggleRemoveImage = (img) => {
    setEditImagesToRemove((prev) =>
      prev.includes(img) ? prev.filter((i) => i !== img) : [...prev, img]
    );
  };

  const handleEditImageAdd = (e) => {
    if (e.target.files.length > 10) {
      alert("Maximum 10 images allowed");
      return;
    }
    setEditNewImages(e.target.files);
  };

  const saveEdit = async (id) => {
    try {
      const formData = new FormData();
      ["title", "description", "reps", "category"].forEach((k) =>
        formData.append(k, editForm[k])
      );

      editImagesToRemove.forEach((img) =>
        formData.append("removeImages", img)
      );

      Array.from(editNewImages).forEach((img) =>
        formData.append("images", img)
      );

      await axios.put(`${API_URL}/api/workouts/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setEditingId(null);
      fetchWorkouts();
    } catch {
      alert("Update failed");
    }
  };

  // ================= DELETE WORKOUT =================
  const deleteWorkout = async (id) => {
    if (!window.confirm("Delete this workout?")) return;

    try {
      await axios.delete(`${API_URL}/api/workouts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWorkouts();
    } catch {
      alert("Delete failed");
    }
  };

  // ================= STYLES =================
  const container = {
    minHeight: "100vh",
    background: "linear-gradient(to right, #141e30, #243b55)",
    padding: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const card = {
    background: "rgba(255,255,255,0.12)",
    padding: "30px",
    borderRadius: "14px",
    width: "100%",
    maxWidth: "800px",
    color: "white",
  };

  const input = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "none",
  };

  const button = {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  };

  // ================= JSX =================
  return (
    <div style={container}>
      <div style={card}>
        <h2>Add Workout</h2>

        <input style={input} name="title" placeholder="Title" onChange={handleChange} />
        <textarea style={input} name="description" placeholder="Description" onChange={handleChange} />
        <input style={input} name="reps" placeholder="Reps" onChange={handleChange} />
        <input style={input} name="category" placeholder="Category" onChange={handleChange} />
        <input type="file" multiple accept="image/*" onChange={handleImageChange} />

        <button style={{ ...button, background: "#ff5722", color: "white" }} onClick={handleSubmit}>
          {loading ? "Uploading..." : "Upload"}
        </button>

        <button
          style={{ ...button, background: "#2196f3", color: "white", marginLeft: 10 }}
          onClick={fetchWorkouts}
        >
          View Workouts
        </button>

        {showWorkouts && (
          <div style={{ marginTop: 20 }}>
            {loadingWorkouts ? (
              <p>Loading...</p>
            ) : workouts.length === 0 ? (
              <p>No workouts found</p>
            ) : (
              workouts.map((w) => (
                <div key={w._id} style={{ background: "#00000055", padding: 15, marginBottom: 15 }}>
                  {editingId === w._id ? (
                    <>
                      <input style={input} value={editForm.title || ""} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                      <textarea style={input} value={editForm.description || ""} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                      <input style={input} value={editForm.reps || ""} onChange={(e) => setEditForm({ ...editForm, reps: e.target.value })} />
                      <input style={input} value={editForm.category || ""} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} />

                      <strong>Existing Images</strong>
<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
  {editForm.images?.map((img) => (
    <div key={img}>
     {typeof img === "string" && img.startsWith("/uploads/workouts") && (
  <img
    src={`${API_URL}${img}`}
    alt="workout"
    style={{ width: 80, height: 80, objectFit: "cover" }}
    onError={(e) => {
      console.error("IMAGE FAILED TO LOAD:", e.currentTarget.src);
      e.currentTarget.style.display = "none";
    }}
  />
)}


      <div>
        <input
          type="checkbox"
          onChange={() => toggleRemoveImage(img)}
        />{" "}
        Remove
      </div>
    </div>
  ))}
</div>


                      <input type="file" multiple accept="image/*" onChange={handleEditImageAdd} />

                      <button style={{ ...button, background: "green", color: "white", marginTop: 10 }} onClick={() => saveEdit(w._id)}>
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <strong>{w.title}</strong>
                      <p>{w.description}</p>
                      <small>{w.category} | {w.reps}</small>

                      <div style={{ marginTop: 10 }}>
                        <button style={{ ...button, background: "orange", marginRight: 10 }} onClick={() => startEdit(w)}>
                          Edit
                        </button>
                        <button style={{ ...button, background: "red", color: "white" }} onClick={() => deleteWorkout(w._id)}>
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
