import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";

export default function Register({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if user already exists
    if (users.some((u) => u.email === form.email)) {
      setError("User already registered. Please login instead.");
      return;
    }

    //  Save new user
    const newUser = { ...form };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    //  Auto-login after registration (IMPORTANT FIX)
    localStorage.setItem("loggedUser", JSON.stringify(newUser));
    localStorage.setItem("loggedUserName", newUser.name);

    setUser(newUser);

    setSuccess("Registration successful! Logging you in...");

    setTimeout(() => navigate("/"), 800);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}
          {success && <p style={{ color: "green", marginTop: "5px" }}>{success}</p>}

          <button type="submit" className="auth-btn">
            Register
          </button>
        </form>

        <div style={{ marginTop: 12 }}>
          <small>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
