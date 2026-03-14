import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8084/api";
// OAuth2 base is the server root (not /api)
const OAUTH2_BASE = API_BASE.replace(/\/api$/, "");

const Login = () => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [listening, setListening] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const navigate       = useNavigate();
  const recognitionRef = useRef(null);

  /* ── LOGIN ── */
  const handleLogin = async () => {
    if (!email || !password) { setError("Please enter email and password."); return; }
    setLoading(true); setError("");
    try {
      const res = await loginUser(email, password);
      if (!res?.token) {
        setError(res?.message || res?.error || "Invalid credentials. Please check your email and password.");
        return;
      }
      navigate("/dashboard");
    } catch (err) {
      setError(typeof err === "string" ? err : (err?.message || "Login failed. Please try again."));
    } finally { setLoading(false); }
  };

  /* ── VOICE ── */
  const handleVoiceLogin = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setError("Voice recognition not supported in this browser."); return; }
    const rec = new SR();
    rec.lang = "en-US"; rec.continuous = false;
    rec.onstart  = () => { setListening(true);  setError(""); };
    rec.onresult = (e) => {
      const text = e.results?.[0]?.[0]?.transcript?.toLowerCase() || "";
      if (text.includes("login")) handleLogin();
    };
    rec.onend    = () => setListening(false);
    rec.start();
    recognitionRef.current = rec;
  };

  /* ── Cleanup voice on unmount ── */
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, []);

  /* ── SOCIAL LOGIN ── */
  const handleGoogleLogin = () => {
    window.location.href = `${OAUTH2_BASE}/oauth2/authorize/google`;
  };
  const handleFacebookLogin = () =>
    setError("Facebook OAuth2 credentials not configured yet.");

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      background: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)",
    }}>
      {/* Card */}
      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: "448px",
        margin: "0 16px",
        borderRadius: "1.5rem",
        padding: "2rem",
        background: "rgba(255,255,255,0.13)",
        border: "1px solid rgba(255,255,255,0.3)",
        boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
        zIndex: 1,
        opacity: 1,
        visibility: "visible",
      }}>

        {/* Logo / Title */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>💹</div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 800, color: "#fff", margin: 0 }}>APS AI</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", marginTop: "0.25rem" }}>Sign in to your financial dashboard</p>
        </div>

        {/* Email */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.25rem" }}>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            data-gramm="false"
            data-gramm_editor="false"
            autoComplete="email"
            style={{
              width: "100%", boxSizing: "border-box",
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              fontSize: "0.95rem",
              outline: "none",
              marginBottom: 0,
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "1.5rem", position: "relative" }}>
          <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.25rem" }}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              data-gramm="false"
              data-gramm_editor="false"
              autoComplete="current-password"
              style={{
                width: "100%", boxSizing: "border-box",
                padding: "0.75rem 3rem 0.75rem 1rem",
                borderRadius: "0.75rem",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                fontSize: "0.95rem",
                outline: "none",
                marginBottom: 0,
              }}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "1rem", padding: 0 }}
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ marginBottom: "1rem", padding: "0.75rem 1rem", borderRadius: "0.75rem", fontSize: "0.875rem", fontWeight: 500, color: "#fca5a5", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%", padding: "0.875rem",
            borderRadius: "0.75rem",
            fontWeight: 700, color: "#fff", fontSize: "1rem",
            background: loading ? "rgba(99,102,241,0.5)" : "linear-gradient(90deg,#6366f1,#4f46e5)",
            boxShadow: "0 4px 20px rgba(99,102,241,0.5)",
            border: "none", cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* Voice Login */}
        <button
          onClick={handleVoiceLogin}
          style={{
            width: "100%", marginTop: "0.75rem", padding: "0.875rem",
            borderRadius: "0.75rem",
            fontWeight: 600, color: "#fff",
            background: listening ? "rgba(239,68,68,0.7)" : "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            cursor: "pointer",
          }}
        >
          {listening ? "🎙️ Listening... say 'login'" : "🎤 Voice Sign In"}
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", margin: "1.25rem 0" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
          <span style={{ margin: "0 0.75rem", color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>or continue with</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
        </div>

        {/* Social Buttons */}
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={handleGoogleLogin}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", borderRadius: "0.75rem", fontWeight: 600, color: "#fff", fontSize: "0.875rem", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M5.27 9.76A7.08 7.08 0 0 1 19.07 12v.01H12v3.53h7.89a7.08 7.08 0 0 1-7 5.46 7.08 7.08 0 0 1-6.99-6 7.08 7.08 0 0 1-.63-5.24z"/>
              <path fill="#4285F4" d="M12 4.92a7.07 7.07 0 0 1 4.61 1.7l2.64-2.63A11.97 11.97 0 0 0 12 0C7.39 0 3.36 2.7 1.34 6.67l3.3 2.56A7.1 7.1 0 0 1 12 4.92z"/>
            </svg>
            Google
          </button>
          <button
            onClick={handleFacebookLogin}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", borderRadius: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.4)", fontSize: "0.875rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", cursor: "not-allowed" }}
            title="Facebook OAuth2 not configured"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2" style={{ opacity: 0.4 }}>
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        {/* Register link */}
        <p style={{ marginTop: "1.5rem", textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: "0.875rem" }}>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ color: "#818cf8", fontWeight: 600, cursor: "pointer" }}
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
