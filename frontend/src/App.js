import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

/* =========================
   AUTH CHECK FUNCTION
========================= */
const checkAuth = () => {
  return !!localStorage.getItem("aip_token");
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());

  /* =========================
     LISTEN TO STORAGE CHANGES
     (for login/logout updates)
  ========================= */
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(checkAuth());
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  /* =========================
     PROTECTED ROUTE
  ========================= */
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  /* =========================
     PUBLIC ROUTE
  ========================= */
  const PublicRoute = ({ children }) => {
    return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
  };

  return (
    <Router>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* DEFAULT REDIRECT */}
        <Route
          path="/"
          element={
            <Navigate
              to={isAuthenticated ? "/dashboard" : "/login"}
              replace
            />
          }
        />

        {/* UNKNOWN ROUTES */}
        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated ? "/dashboard" : "/login"}
              replace
            />
          }
        />

      </Routes>
    </Router>
  );
}

export default App;