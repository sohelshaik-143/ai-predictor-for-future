import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

// API
import { getToken } from "./api/api";

// Global CSS (create index.css)
import "./index.css";

// ==============================
// Full working index.js / entry
// ==============================

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());

  // Listen to login/logout events or localStorage changes
  useEffect(() => {
    const updateAuth = () => setIsAuthenticated(!!getToken());

    window.addEventListener("auth-login", updateAuth);
    window.addEventListener("auth-logout", updateAuth);
    window.addEventListener("storage", updateAuth);

    return () => {
      window.removeEventListener("auth-login", updateAuth);
      window.removeEventListener("auth-logout", updateAuth);
      window.removeEventListener("storage", updateAuth);
    };
  }, []);

  // Protected and Public Routes
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  const PublicRoute = ({ children }) => {
    return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
  };

  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={<PublicRoute><Login /></PublicRoute>}
        />

        {/* Register */}
        <Route
          path="/register"
          element={<PublicRoute><Register /></PublicRoute>}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />

        {/* Default redirect */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
        />

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
};

// ==============================
// Render React App
// ==============================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);