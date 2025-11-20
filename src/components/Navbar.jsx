import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar({ setSidebarOpen, user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    navigate("/login");
  };

  const toggleSidebar = () => {
  setSidebarOpen((prev) => !prev);
};


  return (
    <header className="navbar">
      {/* Left */}
      <div className="nav-left">

        {/*  Hamburger (visible only when logged in & below 1025px, handled in CSS) */}
        {user && (
        <button
  type="button"    // <-- IMPORTANT (stops refresh)
  className="menu-btn"
  onClick={toggleSidebar}
>
  ☰
</button>



        )}

        <h3 className="nav-title">Library Management</h3>
      </div>

      {/* Right */}
      <div className="nav-right">
        {user ? (
          <>
            <span className="username">Hi, {user.name}</span>
            {/* <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button> */}
          </>
        ) : (
          <>
            <Link to="/login" className="login-link">
              Login
            </Link>
            <Link to="/register" className="register-link">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
