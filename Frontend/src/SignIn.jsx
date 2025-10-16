import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./SignIn.css";

export default function SignIn() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // call backend login API
            const res = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Invalid credentials");
                return;
            }
            // save JWT token in localStorage
            localStorage.setItem("token", data.token);

            // optional: update context user
            login(formData.email,data.token);

            alert("Login successful!");
            navigate("/dashboard"); // redirect to protected page
        }
        catch (err) {
            console.error("Login error:", err);
            alert("Something went wrong!");
        }
        finally {
            setLoading(false);
        }
    };
    return (
        <div className="signin-container">
            <form className="signin-form" onSubmit={handleSubmit}>
                <h2 className="signin-title">Sign In</h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>

                <p className="signin-link">
                    Don’t have an account? {" "}
                    <span
                        style={{ color: "#2563eb", cursor: "pointer" }}
                        onClick={() => navigate("/signup")}
                    >
                        Sign Up
                    </span>
                </p>
            </form>
        </div>
    );
}