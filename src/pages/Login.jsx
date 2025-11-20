import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  //  Auto-login if user is already stored
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (savedUser) {
      setUser(savedUser);
      navigate("/"); // Redirect to dashboard/home
    }
  }, [navigate, setUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Get all registered users
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if email exists
    const existingUser = users.find((u) => u.email === form.email);

    if (!existingUser) {
      setError("User not registered. Please register first.");
      return;
    }

    // Check password
    if (existingUser.password !== form.password) {
      setError("Incorrect password. Try again.");
      return;
    }

    //  Login successful
    localStorage.setItem("loggedInUser", JSON.stringify(existingUser)); 
    setUser(existingUser);
    navigate("/"); // Redirect to dashboard/home
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>

        <div style={{ marginTop: 12 }}>
          <small>
            Don’t have an account?{" "}
            <Link to="/register" className="auth-link">
              Register
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
