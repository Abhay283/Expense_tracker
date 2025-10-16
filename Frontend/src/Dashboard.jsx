import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  // ✅ Verify JWT token from backend
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        logout();
        navigate("/signin");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setMessage(data.message); // backend says "Welcome user@email"
        } else {
          alert("Session expired. Please login again.");
          logout();
          navigate("/signin");
        }
      } catch (err) {
        console.error("Error verifying token:", err);
        logout();
        navigate("/signin");
      }
    };

    verifyToken();
  }, [logout, navigate]);

  const handleLogout = () => {
    logout();          // clear user from context
    localStorage.removeItem("token"); // ✅ clear token also
    navigate("/signin"); // redirect to login
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>{message || `Welcome, ${user?.email}!`}</h1>
      <p>This is your protected Dashboard page.</p>
      <button
        onClick={handleLogout}
        style={{
          marginTop: "1rem",
          padding: "0.8rem 1.2rem",
          backgroundColor: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}
