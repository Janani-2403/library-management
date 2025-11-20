import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Members from "./pages/Members";
import IssueReturn from "./pages/IssueReturn";
import Reports from "./pages/Reports";

export default function App() {
  //  Maintain Logged-in user
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("loggedInUser")) || null;
  });

  //  Sidebar toggle state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  //  Protect restricted pages
  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" replace />;
  };

  return (
      <div className="app-layout">

        {/*  Sidebar only when logged in */}
        {user && (
          <Sidebar open={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}

        {/* Overlay only when sidebar is open on small screens */}
        {user && sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        <div className="content-area">
          {/* Navbar only when logged in */}
          {user && (
           <Navbar setSidebarOpen={setSidebarOpen} user={user} setUser={setUser} />


          )}

          <main className="main-content">
            <Routes>
              {/* Auth pages */}
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/register" element={<Register setUser={setUser} />} />

              {/* Protected pages */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/books"
                element={
                  <ProtectedRoute>
                    <Books />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/members"
                element={
                  <ProtectedRoute>
                    <Members />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/issue"
                element={
                  <ProtectedRoute>
                    <IssueReturn />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
  );
}
