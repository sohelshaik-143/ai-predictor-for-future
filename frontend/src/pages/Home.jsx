import { useNavigate } from "react-router-dom";
import { getToken } from "../api/api";

const glass = (extra = {}) => ({
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "1.5rem",
  ...extra,
});

const SECTIONS = [
  {
    id: "dashboard",
    icon: "📊",
    title: "AI Financial Predictor",
    subtitle: "Predict your future income, track savings & get AI-powered financial advice",
    route: "/dashboard",
    color: "#6366f1",
    gradient: "linear-gradient(135deg,rgba(99,102,241,0.2),rgba(79,70,229,0.08))",
    border: "rgba(99,102,241,0.4)",
    features: ["Income Prediction","Risk Score","Investment Plan","AI Insights","Stock Market Live"],
    badge: "AI Powered",
    badgeColor: "#6366f1",
    cta: "Open Dashboard →",
    protected: true,
  },
  {
    id: "jobs",
    icon: "💼",
    title: "WorkIndia Job Board",
    subtitle: "Find daily wage jobs, part-time gigs & post job opportunities across India",
    route: "/jobs",
    color: "#10b981",
    gradient: "linear-gradient(135deg,rgba(16,185,129,0.2),rgba(5,150,105,0.08))",
    border: "rgba(16,185,129,0.4)",
    features: ["Live Job Listings","12+ Cities","Post a Job","WhatsApp Apply","6 Languages"],
    badge: "Public",
    badgeColor: "#10b981",
    cta: "Browse Jobs →",
    protected: false,
  },
  {
    id: "worker",
    icon: "👷",
    title: "Worker Hub",
    subtitle: "Track your 7-day wages, find better-paying cities & apply for part-time work",
    route: "/worker",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg,rgba(245,158,11,0.2),rgba(217,119,6,0.08))",
    border: "rgba(245,158,11,0.4)",
    features: ["Wage Tracker","Low Income Alert","City Migration Tips","Google Maps","Part-time Jobs"],
    badge: "Workers & Students",
    badgeColor: "#f59e0b",
    cta: "Open Worker Hub →",
    protected: true,
  },
  {
    id: "chat",
    icon: "🤖",
    title: "AI Financial Assistant",
    subtitle: "Ask anything — finance, jobs, wages, investments. Pre-trained in 7 Indian languages",
    route: "/chat",
    color: "#06b6d4",
    gradient: "linear-gradient(135deg,rgba(6,182,212,0.2),rgba(8,145,178,0.08))",
    border: "rgba(6,182,212,0.4)",
    features: ["7 Languages","50+ Topics","Job Advice","Investment Tips","Platform Help"],
    badge: "Multilingual AI",
    badgeColor: "#06b6d4",
    cta: "Chat Now →",
    protected: false,
  },
];

const STATS = [
  { value: "7", label: "Indian Languages", icon: "🌍" },
  { value: "20+", label: "Job Categories", icon: "💼" },
  { value: "12", label: "Major Cities", icon: "🏙️" },
  { value: "AI", label: "Powered Predictions", icon: "🤖" },
];

export default function Home() {
  const navigate = useNavigate();
  const isLoggedIn = !!getToken();

  const handleNav = (section) => {
    if (section.protected && !isLoggedIn) {
      navigate("/login");
    } else {
      navigate(section.route);
    }
  };

  return (
    <div style={{ background: "linear-gradient(135deg,#050210 0%,#0d0b1e 40%,#060e1c 100%)", minHeight: "100vh" }}>
      {/* Ambient blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 700, height: 700, background: "radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%)", borderRadius: "50%", top: "-20%", left: "-10%", animation: "blobMorph 12s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: 500, height: 500, background: "radial-gradient(circle,rgba(16,185,129,0.1) 0%,transparent 70%)", borderRadius: "50%", bottom: "5%", right: "-5%", animation: "blobMorph 16s ease-in-out infinite reverse" }} />
        <div style={{ position: "absolute", width: 400, height: 400, background: "radial-gradient(circle,rgba(245,158,11,0.08) 0%,transparent 70%)", borderRadius: "50%", top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: "blobMorph 20s ease-in-out infinite" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
        <nav style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 2rem", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "1.5rem" }}>🧠</span>
              <span style={{ fontWeight: 900, color: "#fff", fontSize: "1.2rem", background: "linear-gradient(90deg,#a5b4fc,#34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>APS AI Platform</span>
              <span style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: "999px", padding: "0.1rem 0.6rem", fontSize: "0.7rem", fontWeight: 700, color: "#10b981", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "liveBlink 1.2s ease-in-out infinite" }} /> LIVE
              </span>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {isLoggedIn ? (
                <button onClick={() => navigate("/my-dashboard")} style={{ background: "linear-gradient(90deg,#6366f1,#4f46e5)", border: "none", borderRadius: "0.75rem", padding: "0.5rem 1.25rem", color: "#fff", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer" }}>
                  My Dashboard
                </button>
              ) : (
                <>
                  <button onClick={() => navigate("/login")} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "0.75rem", padding: "0.5rem 1.25rem", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer" }}>
                    Login
                  </button>
                  <button onClick={() => navigate("/register")} style={{ background: "linear-gradient(90deg,#10b981,#059669)", border: "none", borderRadius: "0.75rem", padding: "0.5rem 1.25rem", color: "#fff", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer" }}>
                    Get Started Free
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
          {/* ── HERO ─────────────────────────────────────────────────────── */}
          <div className="animate-slideUp" style={{ textAlign: "center", padding: "3rem 1rem 2rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "999px", padding: "0.35rem 1rem", marginBottom: "1.5rem" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1", animation: "liveBlink 1.2s ease-in-out infinite" }} />
              <span style={{ color: "#a5b4fc", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.1em" }}>ONE PLATFORM — FOUR POWERFUL TOOLS</span>
            </div>

            <h1 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, color: "#fff", lineHeight: 1.15, marginBottom: "1rem" }}>
              Your Complete
              <br />
              <span style={{ background: "linear-gradient(90deg,#a5b4fc,#34d399,#fbbf24,#f87171)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "gradientText 5s ease-in-out infinite" }}>
                Financial & Career Hub
              </span>
            </h1>

            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.1rem", maxWidth: 580, margin: "0 auto 2rem", lineHeight: 1.6 }}>
              AI income prediction · Live job board · Worker wage tracker · Multilingual AI assistant — all in one platform built for every Indian
            </p>

            {/* Stats row */}
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3rem" }}>
              {STATS.map(s => (
                <div key={s.label} style={{ ...glass({ borderRadius: "0.875rem" }), padding: "0.75rem 1.25rem", textAlign: "center" }}>
                  <div style={{ fontSize: "1.4rem" }}>{s.icon}</div>
                  <div style={{ color: "#fff", fontWeight: 900, fontSize: "1.2rem" }}>{s.value}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── SECTION CARDS ─────────────────────────────────────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.5rem", marginBottom: "4rem" }}>
            {SECTIONS.map((sec, i) => (
              <div key={sec.id} className="card-3d animate-cardEntry" onClick={() => handleNav(sec)}
                style={{ ...glass({ background: sec.gradient, border: `1.5px solid ${sec.border}` }), padding: "2rem", cursor: "pointer", animationDelay: `${i * 100}ms`, position: "relative", overflow: "hidden", transition: "all 0.25s" }}>

                {/* Top accent */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${sec.color},transparent)` }} />

                {/* Badge */}
                <div style={{ position: "absolute", top: 16, right: 16, background: `${sec.badgeColor}22`, border: `1px solid ${sec.badgeColor}55`, borderRadius: "999px", padding: "0.2rem 0.7rem", fontSize: "0.7rem", fontWeight: 700, color: sec.badgeColor }}>
                  {sec.badge}
                </div>

                <div style={{ fontSize: "2.8rem", marginBottom: "1rem", animation: "waveFloat 3s ease-in-out infinite" }}>{sec.icon}</div>
                <h2 style={{ color: "#fff", fontWeight: 900, fontSize: "1.2rem", marginBottom: "0.5rem", lineHeight: 1.2 }}>{sec.title}</h2>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.88rem", lineHeight: 1.5, marginBottom: "1.25rem" }}>{sec.subtitle}</p>

                {/* Feature pills */}
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                  {sec.features.map(f => (
                    <span key={f} style={{ background: `${sec.color}18`, border: `1px solid ${sec.color}33`, borderRadius: "999px", padding: "0.2rem 0.6rem", color: sec.color, fontSize: "0.72rem", fontWeight: 600 }}>{f}</span>
                  ))}
                </div>

                <button style={{ width: "100%", background: `linear-gradient(90deg,${sec.color},${sec.color}cc)`, border: "none", borderRadius: "0.875rem", padding: "0.75rem", color: "#fff", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer", boxShadow: `0 4px 20px ${sec.color}44` }}>
                  {sec.protected && !isLoggedIn ? "Login to Access →" : sec.cta}
                </button>
              </div>
            ))}
          </div>

          {/* ── HOW IT WORKS ───────────────────────────────────────────────── */}
          <div className="animate-slideUp" style={{ ...glass({ background: "rgba(255,255,255,0.02)" }), padding: "2.5rem", marginBottom: "3rem", textAlign: "center" }}>
            <div style={{ color: "#a5b4fc", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.12em", marginBottom: "0.75rem" }}>HOW IT WORKS</div>
            <h2 style={{ color: "#fff", fontWeight: 900, fontSize: "1.5rem", marginBottom: "2rem" }}>Three types of users. One platform.</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1.5rem" }}>
              {[
                { icon: "👷", title: "Daily Wage Worker", steps: ["Enter your 7-day wages","See if you're earning enough","Get city suggestions for better pay","Apply for jobs via WhatsApp"] },
                { icon: "🎓", title: "Student", steps: ["Browse part-time gigs","Filter by delivery/BPO/tutoring","Apply directly on WhatsApp","No experience needed"] },
                { icon: "💼", title: "Employer / Recruiter", steps: ["Post a job for free","Goes live instantly","Workers apply via WhatsApp","Toggle on/off anytime"] },
              ].map(u => (
                <div key={u.title} style={{ ...glass({ borderRadius: "1rem" }), padding: "1.5rem", textAlign: "left" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{u.icon}</div>
                  <div style={{ color: "#fff", fontWeight: 800, marginBottom: "0.75rem" }}>{u.title}</div>
                  <ol style={{ margin: 0, padding: "0 0 0 1.25rem" }}>
                    {u.steps.map((s, i) => (
                      <li key={i} style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", marginBottom: "0.35rem", lineHeight: 1.4 }}>{s}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA ──────────────────────────────────────────────────────── */}
          {!isLoggedIn && (
            <div className="animate-slideUp" style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ color: "rgba(255,255,255,0.5)", marginBottom: "1rem" }}>Join thousands of users already using APS AI</div>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => navigate("/register")} style={{ background: "linear-gradient(90deg,#6366f1,#4f46e5)", border: "none", borderRadius: "0.875rem", padding: "0.875rem 2.5rem", color: "#fff", fontWeight: 800, fontSize: "1.05rem", cursor: "pointer", boxShadow: "0 4px 24px rgba(99,102,241,0.5)" }}>
                  Create Free Account 🚀
                </button>
                <button onClick={() => navigate("/jobs")} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "0.875rem", padding: "0.875rem 2rem", color: "rgba(255,255,255,0.7)", fontWeight: 700, fontSize: "1rem", cursor: "pointer" }}>
                  Browse Jobs (No Login)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", color: "rgba(255,255,255,0.25)", fontSize: "0.8rem" }}>
          <div>🧠 APS AI Platform — Built for every Indian</div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["AI Dashboard","Job Board","Worker Hub","AI Chat"].map((l,i) => (
              <button key={l} onClick={() => handleNav(SECTIONS[i])} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: "0.8rem" }}>{l}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
