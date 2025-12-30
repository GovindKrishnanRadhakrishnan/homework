import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;


export default function ViewCustomers() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // ================= ADMIN GUARD =================
  useEffect(() => {
    if (!token || !user || user.role !== "admin") {
      navigate("/login");
    }
  }, [navigate, token, user]);

  // ================= FETCH CUSTOMERS =================
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/customers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(res.data.data || []);
    } catch {
      alert("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ================= EDIT =================
  const startEdit = (customer) => {
    setEditingId(customer._id);
    setEditForm({
      fullName: customer.fullName,
      email: customer.email,
      role: customer.role,
      age: customer.age,
      height: customer.height,
      weight: customer.weight,
    });
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(
        `${API_URL}/api/customers/${id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      fetchCustomers();
    } catch {
      alert("Update failed");
    }
  };

  // ================= DELETE =================
  const deleteCustomer = async (id) => {
    if (!window.confirm("Delete this customer?")) return;

    try {
      await axios.delete(`${API_URL}/api/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCustomers();
    } catch {
      alert("Delete failed");
    }
  };

  // ================= STYLES =================
  const container = {
    minHeight: "100vh",
    background: "linear-gradient(to right, #232526, #414345)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
  };

  const card = {
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(10px)",
    padding: "30px",
    borderRadius: "14px",
    width: "100%",
    maxWidth: "1000px",
    color: "white",
  };

  const row = {
    background: "#00000055",
    padding: "15px",
    marginBottom: "12px",
    borderRadius: "8px",
  };

  const input = {
    width: "100%",
    padding: "8px",
    marginBottom: "8px",
    borderRadius: "6px",
    border: "none",
  };

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
      <div style={card}>
        <h2 style={{ marginBottom: "20px" }}>Customers</h2>

        {loading ? (
          <p>Loading...</p>
        ) : customers.length === 0 ? (
          <p>No customers found</p>
        ) : (
          customers.map((c) => (
            <div key={c._id} style={row}>
              {editingId === c._id ? (
                <>
                  <input
                    style={input}
                    value={editForm.fullName || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, fullName: e.target.value })
                    }
                    placeholder="Full Name"
                  />

                  <input
                    style={input}
                    value={editForm.email || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    placeholder="Email"
                  />

                  <select
                    style={input}
                    value={editForm.role || "customer"}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role: e.target.value })
                    }
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>

                  <input
                    style={input}
                    type="number"
                    value={editForm.age || ""}
                    placeholder="Age"
                    onChange={(e) =>
                      setEditForm({ ...editForm, age: e.target.value })
                    }
                  />

                  <input
                    style={input}
                    type="number"
                    value={editForm.height || ""}
                    placeholder="Height (cm)"
                    onChange={(e) =>
                      setEditForm({ ...editForm, height: e.target.value })
                    }
                  />

                  <input
                    style={input}
                    type="number"
                    value={editForm.weight || ""}
                    placeholder="Weight (kg)"
                    onChange={(e) =>
                      setEditForm({ ...editForm, weight: e.target.value })
                    }
                  />

                  <button
                    style={{ ...button, background: "green", color: "white" }}
                    onClick={() => saveEdit(c._id)}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <strong>{c.fullName}</strong>
                  <p>{c.email}</p>
                  <small>
                    Role: {c.role} | Age: {c.age} | Height: {c.height}cm | Weight: {c.weight}kg
                  </small>

                  <div style={{ marginTop: "10px" }}>
                    <button
                      style={{ ...button, background: "orange", marginRight: 10 }}
                      onClick={() => startEdit(c)}
                    >
                      Edit
                    </button>

                    <button
                      style={{ ...button, background: "red", color: "white" }}
                      onClick={() => deleteCustomer(c._id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
