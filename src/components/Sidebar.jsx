import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

export default function Sidebar({ open, setSidebarOpen }) {
  const navigate = useNavigate();
const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null); // update app state
    navigate("/login"); // redirect
  };

  
  //  Close sidebar only for screens ≤ 1025px
  const closeOnMobile = () => {
    if (window.innerWidth <= 1025) {
      setSidebarOpen(false);
    }
  };

  return (
   <aside className={`sidebar ${open ? "active" : ""}`}>
      <h2>Library</h2>
      <nav>
        <NavLink to="/" end onClick={closeOnMobile}>Dashboard</NavLink>
        <NavLink to="/books" onClick={closeOnMobile}>Books</NavLink>
        <NavLink to="/members" onClick={closeOnMobile}>Members</NavLink>
        <NavLink to="/issue" onClick={closeOnMobile}>Issue / Return</NavLink>
        <NavLink to="/reports" onClick={closeOnMobile}>Reports</NavLink>
        
      </nav>
      <button className="sidebar-logout-btn" onClick={handleLogout}>
  Logout
</button>

    </aside>
  );
}
