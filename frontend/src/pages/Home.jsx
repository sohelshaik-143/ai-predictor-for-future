import { useNavigate } from "react-router-dom";
import { getToken } from "../api/api";

const SECTIONS = [
  {
    id: "dashboard", icon: "📊",
    title: "AI Financial Predictor",
    headline: "Know your financial future before it arrives.",
    subtitle: "Enter your income once. Get AI-powered forecasts, investment strategies, risk scores, and live NSE/BSE market data — tailored to your earnings.",
    route: "/dashboard", color: "#818cf8", glow: "rgba(99,102,241,0.35)",
    gradient: "linear-gradient(135deg,rgba(99,102,241,0.18) 0%,rgba(30,27,75,0.6) 100%)",
    border: "rgba(99,102,241,0.35)",
    features: ["📈 Income Forecast","⚡ AI Risk Score","💡 Investment Plan","📉 Live Stock Market","🎯 Savings Targets"],
    badge: "AI Powered", badgeColor: "#818cf8",
    cta: "Open Dashboard →", protected: true,
  },
  {
    id: "jobs", icon: "💼",
    title: "WorkIndia Job Board",
    headline: "India's fastest way to find or post a job.",
    subtitle: "Browse thousands of live job listings across 12 major cities. Post a job for free and get applications via WhatsApp — no middlemen, no fees.",
    route: "/jobs", color: "#34d399", glow: "rgba(16,185,129,0.35)",
    gradient: "linear-gradient(135deg,rgba(16,185,129,0.18) 0%,rgba(5,46,22,0.6) 100%)",
    border: "rgba(16,185,129,0.35)",
    features: ["🔴 Live Listings","🏙️ 12 Cities","📤 Post Free","📱 WhatsApp Apply","🌐 6 Languages"],
    badge: "Free · No Login", badgeColor: "#34d399",
    cta: "Browse Jobs →", protected: false,
  },
  {
    id: "worker", icon: "👷",
    title: "Worker Hub",
    headline: "Built for those who work hardest.",
    subtitle: "Track your daily wages, spot when you're underpaid, and instantly discover higher-paying cities on Google Maps — with part-time gigs you can apply to right now.",
    route: "/worker", color: "#fbbf24", glow: "rgba(245,158,11,0.35)",
    gradient: "linear-gradient(135deg,rgba(245,158,11,0.18) 0%,rgba(78,52,0,0.6) 100%)",
    border: "rgba(245,158,11,0.35)",
    features: ["📅 7-Day Wages","⚠️ Income Alert","🗺️ City Migration","📍 Google Maps","💪 Part-time Gigs"],
    badge: "Workers & Students", badgeColor: "#fbbf24",
    cta: "Open Worker Hub →", protected: true,
  },
  {
    id: "chat", icon: "🤖",
    title: "AI Chat Assistant",
    headline: "Your 24/7 financial advisor, in your language.",
    subtitle: "Ask about SIP, tax, stocks, loans, job tips, or how to use any feature on this platform. Pre-trained on 50+ financial topics across 7 Indian languages.",
    route: "/chat", color: "#22d3ee", glow: "rgba(6,182,212,0.35)",
    gradient: "linear-gradient(135deg,rgba(6,182,212,0.18) 0%,rgba(8,51,68,0.6) 100%)",
    border: "rgba(6,182,212,0.35)",
    features: ["🌍 7 Languages","📚 50+ Topics","💰 Finance Help","💼 Job Guidance","🕐 Always Online"],
    badge: "Multilingual AI", badgeColor: "#22d3ee",
    cta: "Chat Now →", protected: false,
  },
];

const TRUST = [
  { icon: "🌍", value: "7", label: "Indian Languages" },
  { icon: "🏙️", value: "12+", label: "Major Cities" },
  { icon: "📂", value: "20+", label: "Job Categories" },
  { icon: "⚡", value: "Live", label: "Stock Market Data" },
  { icon: "🔒", value: "100%", label: "Free to Use" },
  { icon: "🤖", value: "AI", label: "Powered Insights" },
];

const TESTIMONIALS = [
  { name: "Ravi Kumar", city: "Mumbai", role: "Construction Worker", quote: "Found a better paying job in Pune within 2 days using Worker Hub. My daily wage went from ₹400 to ₹650.", color: "#fbbf24" },
  { name: "Priya Nair", city: "Bangalore", role: "Freelance Designer", quote: "The AI Predictor helped me plan my SIP investments. I saved ₹18,000 more this year than last year.", color: "#818cf8" },
  { name: "Mohammed Salim", city: "Hyderabad", role: "Delivery Partner", quote: "Posted a job on WorkIndia and got 8 WhatsApp applications the same day. Zero cost, instant results.", color: "#34d399" },
];

export default function Home() {
  const navigate = useNavigate();
  const isLoggedIn = !!getToken();

  const handleNav = (section) => {
    if (section.protected && !isLoggedIn) navigate("/login");
    else navigate(section.route);
  };

  return (
    <div style={{ background: "#050211", minHeight: "100vh", fontFamily: "'Inter',sans-serif", color: "#fff", overflowX: "hidden" }}>

      {/* ── AMBIENT BACKGROUND ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.09) 0%,transparent 65%)", top: "-30%", left: "-20%" }} />
        <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(16,185,129,0.07) 0%,transparent 65%)", bottom: "-10%", right: "-10%" }} />
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(245,158,11,0.06) 0%,transparent 65%)", top: "40%", left: "40%" }} />
        {/* Subtle grid overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ══════════════════════════════════════════
            NAVBAR
        ══════════════════════════════════════════ */}
        <nav style={{ background: "rgba(5,2,17,0.75)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 2rem", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: 1240, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Brand */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ width: 34, height: 34, borderRadius: "0.65rem", background: "linear-gradient(135deg,#6366f1,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>🧠</div>
              <div>
                <div style={{ fontWeight: 900, fontSize: "1rem", background: "linear-gradient(90deg,#c7d2fe,#6ee7b7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>APS AI Platform</div>
                <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", fontWeight: 600, letterSpacing: "0.08em", marginTop: -2 }}>FINANCIAL · JOBS · WORKERS · AI</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "999px", padding: "0.15rem 0.7rem", marginLeft: "0.25rem" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "liveBlink 1.3s ease-in-out infinite", display: "inline-block" }} />
                <span style={{ color: "#10b981", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.1em" }}>LIVE</span>
              </div>
            </div>
            {/* Nav actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <button onClick={() => navigate("/jobs")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>Jobs</button>
              <button onClick={() => navigate("/chat")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>AI Chat</button>
              {isLoggedIn ? (
                <button onClick={() => navigate("/my-dashboard")} style={{ background: "linear-gradient(90deg,#6366f1,#4f46e5)", border: "none", borderRadius: "0.7rem", padding: "0.5rem 1.2rem", color: "#fff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", boxShadow: "0 4px 20px rgba(99,102,241,0.4)" }}>
                  My Dashboard
                </button>
              ) : (
                <>
                  <button onClick={() => navigate("/login")} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.7rem", padding: "0.5rem 1.1rem", color: "rgba(255,255,255,0.65)", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>
                    Sign In
                  </button>
                  <button onClick={() => navigate("/register")} style={{ background: "linear-gradient(90deg,#6366f1,#4f46e5)", border: "none", borderRadius: "0.7rem", padding: "0.5rem 1.2rem", color: "#fff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", boxShadow: "0 4px 20px rgba(99,102,241,0.4)" }}>
                    Get Started Free
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* ══════════════════════════════════════════
            HERO
        ══════════════════════════════════════════ */}
        <section style={{ textAlign: "center", padding: "5rem 2rem 3rem", maxWidth: 900, margin: "0 auto" }}>
          {/* Pill badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.28)", borderRadius: "999px", padding: "0.3rem 1rem", marginBottom: "1.75rem" }}>
            <span style={{ fontSize: "0.9rem" }}>✨</span>
            <span style={{ color: "#c7d2fe", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.1em" }}>INDIA'S AI-FIRST FINANCIAL & CAREER PLATFORM</span>
          </div>

          {/* Main headline */}
          <h1 style={{ fontSize: "clamp(2.2rem,5.5vw,4rem)", fontWeight: 900, lineHeight: 1.12, margin: "0 0 1.25rem", letterSpacing: "-0.02em" }}>
            <span style={{ color: "#f0f0ff" }}>One Platform.</span><br />
            <span style={{ background: "linear-gradient(90deg,#818cf8 0%,#34d399 40%,#fbbf24 70%,#f87171 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Four Life-Changing Tools.
            </span>
          </h1>

          {/* Sub headline */}
          <p style={{ color: "rgba(255,255,255,0.48)", fontSize: "1.1rem", lineHeight: 1.7, maxWidth: 680, margin: "0 auto 2rem" }}>
            Whether you're a <strong style={{ color: "rgba(255,255,255,0.7)", fontWeight: 700 }}>daily wage worker</strong> looking for better pay,
            a <strong style={{ color: "rgba(255,255,255,0.7)", fontWeight: 700 }}>student</strong> hunting part-time gigs,
            or a <strong style={{ color: "rgba(255,255,255,0.7)", fontWeight: 700 }}>professional</strong> planning your financial future —
            APS gives you every tool you need, in your own language.
          </p>

          {/* CTA row */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3.5rem" }}>
            {isLoggedIn ? (
              <button onClick={() => navigate("/my-dashboard")}
                style={{ background: "linear-gradient(90deg,#6366f1,#4f46e5)", border: "none", borderRadius: "0.875rem", padding: "1rem 2.5rem", color: "#fff", fontWeight: 800, fontSize: "1rem", cursor: "pointer", boxShadow: "0 6px 32px rgba(99,102,241,0.5)" }}>
                Open My Dashboard →
              </button>
            ) : (
              <>
                <button onClick={() => navigate("/register")}
                  style={{ background: "linear-gradient(90deg,#6366f1,#4f46e5)", border: "none", borderRadius: "0.875rem", padding: "1rem 2.5rem", color: "#fff", fontWeight: 800, fontSize: "1rem", cursor: "pointer", boxShadow: "0 6px 32px rgba(99,102,241,0.5)" }}>
                  Start Free — No Credit Card 🚀
                </button>
                <button onClick={() => navigate("/jobs")}
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.13)", borderRadius: "0.875rem", padding: "1rem 2rem", color: "rgba(255,255,255,0.65)", fontWeight: 700, fontSize: "1rem", cursor: "pointer" }}>
                  Browse Jobs (No Login)
                </button>
              </>
            )}
          </div>

          {/* Trust bar */}
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            {TRUST.map(t => (
              <div key={t.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "1rem", padding: "0.9rem 1.1rem", minWidth: 90 }}>
                <span style={{ fontSize: "1.4rem", marginBottom: 2 }}>{t.icon}</span>
                <span style={{ color: "#fff", fontWeight: 900, fontSize: "1.1rem" }}>{t.value}</span>
                <span style={{ color: "rgba(255,255,255,0.33)", fontSize: "0.68rem", textAlign: "center", marginTop: 2 }}>{t.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION CARDS
        ══════════════════════════════════════════ */}
        <section style={{ maxWidth: 1240, margin: "0 auto", padding: "0 1.5rem 5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ color: "rgba(255,255,255,0.25)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.14em", marginBottom: "0.5rem" }}>EXPLORE THE PLATFORM</div>
            <h2 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(1.5rem,3vw,2.2rem)", margin: 0 }}>Everything you need, in one place</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: "1.5rem" }}>
            {SECTIONS.map(sec => (
              <div key={sec.id} onClick={() => handleNav(sec)}
                style={{ background: sec.gradient, border: `1px solid ${sec.border}`, borderRadius: "1.75rem", padding: "2rem", cursor: "pointer", transition: "transform 0.22s,box-shadow 0.22s", position: "relative", overflow: "hidden" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 24px 60px ${sec.glow}`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>

                {/* Top colour bar */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${sec.color},${sec.color}44)`, borderRadius: "1.75rem 1.75rem 0 0" }} />

                {/* Glow orb */}
                <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle,${sec.color}18 0%,transparent 70%)`, top: -60, right: -60, pointerEvents: "none" }} />

                {/* Badge */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", background: `${sec.badgeColor}15`, border: `1px solid ${sec.badgeColor}35`, borderRadius: "999px", padding: "0.2rem 0.75rem", fontSize: "0.7rem", fontWeight: 700, color: sec.badgeColor, marginBottom: "1.25rem" }}>
                  {sec.badge}
                </div>

                {/* Icon + title */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.6rem" }}>
                  <span style={{ fontSize: "2.4rem" }}>{sec.icon}</span>
                  <h3 style={{ color: "#fff", fontWeight: 900, fontSize: "1.15rem", margin: 0, lineHeight: 1.2 }}>{sec.title}</h3>
                </div>

                {/* Headline */}
                <p style={{ color: sec.color, fontWeight: 700, fontSize: "0.92rem", marginBottom: "0.5rem", lineHeight: 1.4 }}>{sec.headline}</p>

                {/* Subtitle */}
                <p style={{ color: "rgba(255,255,255,0.42)", fontSize: "0.84rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>{sec.subtitle}</p>

                {/* Feature pills */}
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                  {sec.features.map(f => (
                    <span key={f} style={{ background: `${sec.color}13`, border: `1px solid ${sec.color}28`, borderRadius: "999px", padding: "0.22rem 0.65rem", color: sec.color, fontSize: "0.71rem", fontWeight: 600 }}>{f}</span>
                  ))}
                </div>

                {/* CTA button */}
                <button style={{ width: "100%", background: `linear-gradient(90deg,${sec.color}dd,${sec.color}99)`, border: "none", borderRadius: "0.875rem", padding: "0.8rem", color: "#fff", fontWeight: 800, fontSize: "0.92rem", cursor: "pointer", boxShadow: `0 4px 18px ${sec.glow}` }}>
                  {sec.protected && !isLoggedIn ? "🔒 Login to Access →" : sec.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════════ */}
        <section style={{ background: "rgba(255,255,255,0.018)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "4rem 2rem" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div style={{ color: "#818cf8", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.14em", marginBottom: "0.5rem" }}>HOW IT WORKS</div>
              <h2 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(1.5rem,3vw,2rem)", margin: 0 }}>Built for three kinds of people</h2>
              <p style={{ color: "rgba(255,255,255,0.35)", marginTop: "0.75rem", fontSize: "0.92rem" }}>Different goals, one platform — pick your path below</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1.5rem" }}>
              {[
                { icon: "👷", title: "Daily Wage Worker", color: "#fbbf24", steps: [
                  "Enter your wages from the last 7 days",
                  "See if your daily earnings beat ₹500/day threshold",
                  "Get 5 high-paying city recommendations with Google Maps",
                  "Apply for better jobs via WhatsApp in seconds",
                ] },
                { icon: "🎓", title: "Student / Fresher", color: "#818cf8", steps: [
                  "Browse 12+ part-time categories: delivery, BPO, tutoring",
                  "Filter gigs that require zero prior experience",
                  "Apply directly on WhatsApp — no resume needed",
                  "Ask our AI chat for career guidance in Hindi or Telugu",
                ] },
                { icon: "💼", title: "Employer / Recruiter", color: "#34d399", steps: [
                  "Post a job in under 2 minutes — completely free",
                  "Goes live instantly across all 12 cities",
                  "Receive WhatsApp applications directly",
                  "Toggle listings on/off anytime from your account",
                ] },
              ].map(u => (
                <div key={u.title} style={{ background: `${u.color}09`, border: `1px solid ${u.color}22`, borderRadius: "1.5rem", padding: "1.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "1.25rem" }}>
                    <span style={{ fontSize: "2rem" }}>{u.icon}</span>
                    <span style={{ color: u.color, fontWeight: 800, fontSize: "1rem" }}>{u.title}</span>
                  </div>
                  <ol style={{ margin: 0, padding: "0 0 0 1.25rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {u.steps.map((s, i) => (
                      <li key={i} style={{ color: "rgba(255,255,255,0.52)", fontSize: "0.84rem", lineHeight: 1.5 }}>
                        <span style={{ color: u.color, fontWeight: 700 }}>Step {i + 1}:</span> {s}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            TESTIMONIALS
        ══════════════════════════════════════════ */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ color: "rgba(255,255,255,0.25)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.14em", marginBottom: "0.5rem" }}>REAL STORIES</div>
            <h2 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(1.4rem,2.8vw,2rem)", margin: 0 }}>Changing lives across India</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1.25rem" }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ background: `${t.color}0a`, border: `1px solid ${t.color}22`, borderRadius: "1.5rem", padding: "1.75rem" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "1rem", color: t.color }}>❝</div>
                <p style={{ color: "rgba(255,255,255,0.62)", fontSize: "0.88rem", lineHeight: 1.65, marginBottom: "1.25rem", fontStyle: "italic" }}>
                  "{t.quote}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${t.color},${t.color}66)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "0.9rem", color: "#fff" }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.88rem" }}>{t.name}</div>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem" }}>{t.role} · {t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FINAL CTA
        ══════════════════════════════════════════ */}
        {!isLoggedIn && (
          <section style={{ padding: "0 2rem 5rem" }}>
            <div style={{ maxWidth: 720, margin: "0 auto", background: "linear-gradient(135deg,rgba(99,102,241,0.18),rgba(16,185,129,0.1))", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "2rem", padding: "3rem 2rem", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚀</div>
              <h2 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(1.4rem,3vw,2rem)", marginBottom: "0.75rem" }}>
                Ready to take control?
              </h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.95rem", maxWidth: 480, margin: "0 auto 2rem", lineHeight: 1.65 }}>
                Join thousands of workers, students, and entrepreneurs who use APS to make smarter financial decisions every day — completely free.
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => navigate("/register")}
                  style={{ background: "linear-gradient(90deg,#6366f1,#4f46e5)", border: "none", borderRadius: "0.875rem", padding: "0.95rem 2.5rem", color: "#fff", fontWeight: 800, fontSize: "1rem", cursor: "pointer", boxShadow: "0 8px 30px rgba(99,102,241,0.5)" }}>
                  Create Free Account →
                </button>
                <button onClick={() => navigate("/jobs")}
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.13)", borderRadius: "0.875rem", padding: "0.95rem 2rem", color: "rgba(255,255,255,0.6)", fontWeight: 700, fontSize: "1rem", cursor: "pointer" }}>
                  Browse Jobs First
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════ */}
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "2rem 2rem 1.5rem" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                  <span style={{ fontSize: "1.1rem" }}>🧠</span>
                  <span style={{ fontWeight: 900, background: "linear-gradient(90deg,#c7d2fe,#6ee7b7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>APS AI Platform</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.78rem", margin: 0 }}>Financial intelligence & career tools for every Indian</p>
              </div>
              <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                {[
                  { label: "AI Dashboard", route: "/dashboard" },
                  { label: "Job Board", route: "/jobs" },
                  { label: "Worker Hub", route: "/worker" },
                  { label: "AI Chat", route: "/chat" },
                ].map(l => (
                  <button key={l.label} onClick={() => navigate(l.route)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.28)", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600, padding: 0 }}>{l.label}</button>
                ))}
              </div>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "1.25rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
              <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.75rem" }}>© 2026 APS AI Platform. Made with ❤️ for India.</span>
              <span style={{ color: "rgba(255,255,255,0.12)", fontSize: "0.75rem" }}>Free · Secure · Multilingual · AI Powered</span>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
