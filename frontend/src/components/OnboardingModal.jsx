import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ROLES = [
  { key: "worker", icon: "👷", label: "Daily Wage Worker", desc: "Track wages, find better-paying cities & apply for jobs" },
  { key: "student", icon: "🎓", label: "Student", desc: "Find part-time gigs, delivery work & internships near you" },
  { key: "other", icon: "📊", label: "Investor / Other", desc: "AI predictions, expense planning & financial analysis" },
];

export default function OnboardingModal() {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const seen = localStorage.getItem("aip_onboarding_seen");
    const token = localStorage.getItem("aip_token");
    if (!seen && token) setVisible(true);
  }, []);

  if (!visible) return null;

  const handleContinue = () => {
    if (!selected) return;
    setStep(2);
  };

  const handleStart = () => {
    localStorage.setItem("aip_onboarding_seen", "true");
    localStorage.setItem("aip_user_type", selected);
    setVisible(false);
    if (selected === "worker" || selected === "student") navigate("/worker");
  };

  const role = ROLES.find(r => r.key === selected);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.85)",
      backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1.5rem",
    }}>
      {/* Ambient blob */}
      <div style={{
        position: "absolute", width: 380, height: 380,
        background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)",
        borderRadius: "50%", top: "10%", left: "20%",
        animation: "blobMorph 8s ease-in-out infinite", pointerEvents: "none",
      }} />

      <div className="animate-popIn" style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(28px)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "1.5rem",
        padding: "2.5rem",
        maxWidth: 480,
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Top accent bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: "linear-gradient(90deg,#6366f1,#10b981,#f59e0b)",
          animation: "gradientFlow 4s ease-in-out infinite",
        }} />

        {step === 1 ? (
          <>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem", animation: "waveFloat 3s ease-in-out infinite" }}>🙏</div>
              <h2 style={{
                fontSize: "1.6rem", fontWeight: 800, marginBottom: "0.5rem",
                background: "linear-gradient(90deg,#a5b4fc,#34d399,#fbbf24)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                animation: "gradientText 4s ease-in-out infinite",
              }}>
                Welcome to APS AI
              </h2>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem" }}>
                Tell us about yourself for a personalised experience
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "2rem" }}>
              {ROLES.map((r, i) => (
                <button key={r.key} onClick={() => setSelected(r.key)} style={{
                  background: selected === r.key
                    ? "linear-gradient(135deg,rgba(99,102,241,0.3),rgba(16,185,129,0.15))"
                    : "rgba(255,255,255,0.04)",
                  border: selected === r.key
                    ? "1.5px solid rgba(99,102,241,0.7)"
                    : "1.5px solid rgba(255,255,255,0.1)",
                  borderRadius: "1rem",
                  padding: "1rem 1.25rem",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "1rem",
                  transition: "all 0.2s",
                  animation: `popIn 0.4s ease-out ${i * 80}ms both`,
                  textAlign: "left",
                }}>
                  <span style={{ fontSize: "2rem" }}>{r.icon}</span>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: "1rem" }}>{r.label}</div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", marginTop: 2 }}>{r.desc}</div>
                  </div>
                  {selected === r.key && (
                    <span style={{ marginLeft: "auto", color: "#6366f1", fontSize: "1.3rem" }}>✓</span>
                  )}
                </button>
              ))}
            </div>

            <button onClick={handleContinue} disabled={!selected} style={{
              width: "100%",
              background: selected ? "linear-gradient(90deg,#6366f1,#4f46e5)" : "rgba(255,255,255,0.08)",
              border: "none", borderRadius: "0.875rem",
              padding: "0.875rem",
              color: selected ? "#fff" : "rgba(255,255,255,0.3)",
              fontWeight: 700, fontSize: "1rem",
              cursor: selected ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              boxShadow: selected ? "0 4px 20px rgba(99,102,241,0.4)" : "none",
            }}>
              Continue →
            </button>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem", animation: "waveFloat 3s ease-in-out infinite" }}>
              {role?.icon}
            </div>
            <h2 style={{
              fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.75rem",
              background: "linear-gradient(90deg,#a5b4fc,#34d399)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              {selected === "worker" && "Worker Mode Activated!"}
              {selected === "student" && "Student Mode Activated!"}
              {selected === "other" && "Dashboard Ready!"}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: "2rem", fontSize: "0.95rem" }}>
              {selected === "worker" && "We've unlocked the Worker Hub for you. Track your 7-day wages, find better-paying cities across India, and apply for jobs — all in one place."}
              {selected === "student" && "Student mode activated! Browse part-time gigs, delivery work, tutoring & BPO jobs. Apply directly via WhatsApp."}
              {selected === "other" && "Your AI financial dashboard is ready. Explore income predictions, savings analysis, and investment insights tailored for you."}
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "2rem" }}>
              {selected === "worker" && ["💰 Wage Tracker", "🏙️ City Jobs", "🗺️ Google Maps", "📋 Apply Now"].map(t => (
                <span key={t} style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "999px", padding: "0.3rem 0.8rem", color: "#fbbf24", fontSize: "0.8rem", fontWeight: 600 }}>{t}</span>
              ))}
              {selected === "student" && ["🎓 Part-time Jobs", "🛵 Delivery Gigs", "📱 Apply via WhatsApp", "💻 Remote Work"].map(t => (
                <span key={t} style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "999px", padding: "0.3rem 0.8rem", color: "#a5b4fc", fontSize: "0.8rem", fontWeight: 600 }}>{t}</span>
              ))}
              {selected === "other" && ["📈 AI Predictions", "💹 Risk Score", "📊 Charts", "🤖 AI Chat"].map(t => (
                <span key={t} style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "999px", padding: "0.3rem 0.8rem", color: "#34d399", fontSize: "0.8rem", fontWeight: 600 }}>{t}</span>
              ))}
            </div>
            <button onClick={handleStart} style={{
              width: "100%",
              background: "linear-gradient(90deg,#10b981,#059669)",
              border: "none", borderRadius: "0.875rem",
              padding: "0.875rem",
              color: "#fff", fontWeight: 700, fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(16,185,129,0.4)",
              transition: "all 0.2s",
            }}>
              Get Started 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
