import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/api";

const Register = () => {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess]   = useState(false);

  const navigate = useNavigate();

  /* ── PASSWORD STRENGTH ── */
  const strength = !password ? 0
    : password.length < 6   ? 1
    : password.length < 10  ? 2
    : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#22c55e", "#10b981"];

  /* ── REGISTER ── */
  const handleRegister = async () => {
    if (!name || !email || !password) { setError("All fields are required."); return; }
    if (password.length < 6)          { setError("Password must be at least 6 characters."); return; }
    try {
      setLoading(true); setError("");
      await registerUser(name, email, password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError((typeof err === "string" ? err : err?.message) || "Registration failed. Try again.");
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    padding: "0.75rem 1rem",
    borderRadius: "0.75rem",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
    marginBottom: 0,
  };
  const labelStyle = {
    color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", fontWeight: 600,
    textTransform: "uppercase", letterSpacing: "0.05em",
    display: "block", marginBottom: "0.25rem",
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)",
    }}>
      {/* Card */}
      <div style={{
        width: "100%", maxWidth: "448px", margin: "0 16px",
        borderRadius: "1.5rem", padding: "2rem",
        background: "rgba(255,255,255,0.13)",
        border: "1px solid rgba(255,255,255,0.3)",
        boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
      }}>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🚀</div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 800, color: "#fff", margin: 0 }}>Create Account</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", marginTop: "0.25rem" }}>Join APS AI — your smart financial assistant</p>
        </div>

        {/* Success */}
        {success && (
          <div style={{ marginBottom: "1.5rem", padding: "1rem", borderRadius: "0.75rem", textAlign: "center", color: "#6ee7b7", fontWeight: 600, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
            ✅ Account created! Redirecting to login...
          </div>
        )}

        {/* Full Name */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>Full Name</label>
          <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
        </div>

        {/* Email */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>Email</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "0.5rem", position: "relative" }}>
          <label style={labelStyle}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              style={{ ...inputStyle, paddingRight: "3rem" }}
            />
            <button type="button" onClick={() => setShowPass(!showPass)}
              style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "1rem", padding: 0 }}>
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Strength bar */}
        {password && (
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ flex: 1, height: "4px", borderRadius: "9999px", background: i <= strength ? strengthColor[strength] : "rgba(255,255,255,0.1)" }} />
              ))}
            </div>
            <p style={{ fontSize: "0.75rem", marginTop: "4px", fontWeight: 600, color: strengthColor[strength] }}>{strengthLabel[strength]}</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ marginBottom: "1rem", padding: "0.75rem 1rem", borderRadius: "0.75rem", fontSize: "0.875rem", fontWeight: 500, color: "#fca5a5", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Register Button */}
        <button
          onClick={handleRegister}
          disabled={loading || success}
          style={{
            width: "100%", padding: "0.875rem",
            borderRadius: "0.75rem", fontWeight: 700, color: "#fff", fontSize: "1rem",
            background: loading ? "rgba(245,158,11,0.5)" : "linear-gradient(90deg,#f59e0b,#d97706)",
            boxShadow: "0 4px 20px rgba(245,158,11,0.4)",
            border: "none", cursor: loading || success ? "not-allowed" : "pointer",
            opacity: loading || success ? 0.7 : 1,
          }}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        {/* Login link */}
        <p style={{ marginTop: "1.5rem", textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: "0.875rem" }}>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} style={{ color: "#fbbf24", fontWeight: 600, cursor: "pointer" }}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
