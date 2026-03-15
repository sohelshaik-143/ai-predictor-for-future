import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, Component } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FinancialSetup from "./pages/FinancialSetup";
import InvestmentPlan from "./pages/InvestmentPlan";
import Profile from "./pages/Profile";
import WorkerHub from "./pages/WorkerHub";
import JobBoard from "./pages/JobBoard";
import Home from "./pages/Home";
import ChatPage from "./pages/ChatPage";
import OnboardingModal from "./components/OnboardingModal";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, retries: 0 };
    this.retryTimer = null;
  }

  static getDerivedStateFromError() { return { hasError: true }; }

  componentDidCatch() {
    // Auto-retry up to 2 times (handles transient extension timing issues)
    if (this.state.retries < 2) {
      this.retryTimer = setTimeout(() => {
        this.setState(s => ({ hasError: false, retries: s.retries + 1 }));
      }, 800);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.retryTimer);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#0f0c29,#302b63,#24243e)", color:"#fff", textAlign:"center", padding:"2rem" }}>
          <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>⚠️</div>
          <h2 style={{ fontWeight:700, marginBottom:"0.5rem", fontSize:"1.5rem" }}>Something went wrong</h2>
          <p style={{ color:"rgba(255,255,255,0.5)", marginBottom:"0.75rem" }}>A browser extension is interfering with the app.</p>
          <p style={{ color:"rgba(255,255,255,0.35)", fontSize:"0.8rem", marginBottom:"1.5rem" }}>
            Please open <strong style={{color:"rgba(255,255,255,0.6)"}}>chrome://extensions</strong> and disable Grammarly, ad-blockers, or vocabulary extensions, then reload.
          </p>
          <div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap", justifyContent:"center" }}>
            <button
              onClick={() => this.setState({ hasError: false, retries: 0 })}
              style={{ padding:"0.75rem 1.5rem", borderRadius:"0.75rem", background:"rgba(255,255,255,0.12)", color:"#fff", fontWeight:600, border:"1px solid rgba(255,255,255,0.2)", cursor:"pointer" }}
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{ padding:"0.75rem 1.5rem", borderRadius:"0.75rem", background:"linear-gradient(90deg,#6366f1,#4f46e5)", color:"#fff", fontWeight:700, border:"none", cursor:"pointer" }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lightweight boundary for individual pages — silently resets instead of full error screen
class PageBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch() {
    setTimeout(() => this.setState({ hasError: false }), 600);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#0f0c29,#302b63,#24243e)" }}>
          <div style={{ textAlign:"center", color:"#fff" }}>
            <div style={{ fontSize:"2rem", marginBottom:"0.5rem" }}>↺</div>
            <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"0.875rem" }}>Recovering...</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const checkAuth = () => !!localStorage.getItem("aip_token");

const ProtectedRoute = ({ auth, children }) =>
  auth ? children : <Navigate to="/login" replace />;

const PublicRoute = ({ auth, children }) =>
  !auth ? children : <Navigate to="/dashboard" replace />;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth);

  useEffect(() => {
    const update = () => setIsAuthenticated(checkAuth());
    window.addEventListener("auth-login",  update);
    window.addEventListener("auth-logout", update);
    window.addEventListener("storage",     update);
    return () => {
      window.removeEventListener("auth-login",  update);
      window.removeEventListener("auth-logout", update);
      window.removeEventListener("storage",     update);
    };
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <OnboardingModal />
        <Routes>
          <Route path="/login"           element={<PublicRoute    auth={isAuthenticated}><PageBoundary><Login          /></PageBoundary></PublicRoute>}    />
          <Route path="/register"        element={<PublicRoute    auth={isAuthenticated}><PageBoundary><Register       /></PageBoundary></PublicRoute>}    />
          <Route path="/dashboard"       element={<ProtectedRoute auth={isAuthenticated}><PageBoundary><Dashboard      /></PageBoundary></ProtectedRoute>} />
          <Route path="/financial-setup" element={<ProtectedRoute auth={isAuthenticated}><PageBoundary><FinancialSetup /></PageBoundary></ProtectedRoute>} />
          <Route path="/investment-plan" element={<ProtectedRoute auth={isAuthenticated}><PageBoundary><InvestmentPlan /></PageBoundary></ProtectedRoute>} />
          <Route path="/profile"         element={<ProtectedRoute auth={isAuthenticated}><PageBoundary><Profile        /></PageBoundary></ProtectedRoute>} />
          <Route path="/worker"          element={<ProtectedRoute auth={isAuthenticated}><PageBoundary><WorkerHub      /></PageBoundary></ProtectedRoute>} />
          <Route path="/jobs"            element={<PageBoundary><JobBoard /></PageBoundary>} />
          <Route path="/chat"            element={<PageBoundary><ChatPage /></PageBoundary>} />
          <Route path="/"  element={<PageBoundary><Home auth={isAuthenticated} /></PageBoundary>} />
          <Route path="*"  element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
