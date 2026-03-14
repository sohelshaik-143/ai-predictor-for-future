import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser, getIncome } from "../api/api";
import { LANGUAGES } from "../i18n/translations";

/* ─── Constants ──────────────────────────────── */
const AVATAR_COLORS = [
  "#6366f1","#10b981","#f59e0b","#ef4444",
  "#3b82f6","#8b5cf6","#f43f5e","#06b6d4",
  "#84cc16","#f97316","#ec4899","#14b8a6",
];

const RISK_OPTIONS = [
  { value: "conservative", label: "Conservative", icon: "🛡️", color: "#10b981", desc: "Low risk · stable returns" },
  { value: "moderate",     label: "Moderate",     icon: "⚖️", color: "#f59e0b", desc: "Balanced growth & safety" },
  { value: "aggressive",   label: "Aggressive",   icon: "🚀", color: "#ef4444", desc: "High risk · high reward"  },
];

const GOAL_OPTIONS = [
  { value: "emergency",  icon: "🛟", label: "Emergency Fund",   desc: "6-month safety net"    },
  { value: "wealth",     icon: "💰", label: "Wealth Building",  desc: "Long-term prosperity"  },
  { value: "retirement", icon: "🏖️", label: "Early Retirement", desc: "Financial freedom"      },
  { value: "house",      icon: "🏠", label: "Buy a Home",       desc: "Property investment"   },
  { value: "education",  icon: "🎓", label: "Education Fund",   desc: "Children's future"     },
  { value: "business",   icon: "🏢", label: "Start Business",   desc: "Entrepreneurship"      },
];

const ACHIEVEMENTS = [
  { icon: "🌱", title: "First Step",       desc: "Added first income entry",    key: "entries", threshold: 1   },
  { icon: "📅", title: "Week Warrior",     desc: "7+ income entries",           key: "entries", threshold: 7   },
  { icon: "🔥", title: "Month Master",     desc: "30+ income entries",          key: "entries", threshold: 30  },
  { icon: "🤖", title: "AI Unlocked",      desc: "5+ entries — AI activated",   key: "entries", threshold: 5   },
  { icon: "💰", title: "Lakh Club",        desc: "Total earnings ₹1,00,000+",  key: "total",   threshold: 100000 },
  { icon: "🏆", title: "Financial Pro",    desc: "Health score 80 / 100",       key: "health",  threshold: 80  },
  { icon: "🎯", title: "Consistency Star", desc: "90 %+ consistency score",     key: "consist", threshold: 90  },
  { icon: "📈", title: "Growth Chaser",    desc: "Positive income growth",      key: "growth",  threshold: 0.01 },
];

const NAV_ITEMS = [
  { id: "profile",      icon: "👤", label: "My Profile"        },
  { id: "financial",    icon: "💹", label: "Financial"         },
  { id: "goals",        icon: "🎯", label: "Goals"             },
  { id: "preferences",  icon: "⚙️",  label: "Preferences"      },
  { id: "security",     icon: "🔐", label: "Security"          },
  { id: "achievements", icon: "🏆", label: "Achievements"      },
];

const inr = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

/* ─── Style helpers ─────────────────────────── */
const glassCard = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "1.25rem",
  padding: "1.5rem",
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: "0.75rem",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "#fff",
  fontSize: "0.9rem",
  outline: "none",
  marginBottom: 0,
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const labelStyle = {
  fontSize: "0.72rem",
  color: "rgba(255,255,255,0.45)",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  display: "block",
  marginBottom: "0.4rem",
};

/* ─── Toggle switch ─────────────────────────── */
function Toggle({ value, onChange }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 46, height: 26, borderRadius: 13, flexShrink: 0, cursor: "pointer",
        background: value ? "#6366f1" : "rgba(255,255,255,0.15)",
        position: "relative", transition: "background 0.3s",
      }}
    >
      <div style={{
        position: "absolute", top: 3,
        left: value ? 24 : 3,
        width: 20, height: 20,
        borderRadius: "50%", background: "#fff",
        transition: "left 0.3s", boxShadow: "0 1px 5px rgba(0,0,0,0.35)",
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════ */
export default function Profile() {
  const navigate = useNavigate();
  const [section, setSection] = useState("profile");
  const [saved,   setSaved]   = useState(false);
  const [stats,   setStats]   = useState({ entries: 0, total: 0, health: 40, consist: 0, growth: 0 });

  /* ── Persisted prefs ── */
  const [name,        setName]        = useState(() => localStorage.getItem("aps_name")    || "");
  const [phone,       setPhone]       = useState(() => localStorage.getItem("aps_phone")   || "");
  const [bio,         setBio]         = useState(() => localStorage.getItem("aps_bio")     || "");
  const [avatarColor, setAvatarColor] = useState(() => localStorage.getItem("aps_avcolor") || "#6366f1");

  const [currency, setCurrency] = useState(() => localStorage.getItem("aps_currency") || "INR");
  const [risk,     setRisk]     = useState(() => localStorage.getItem("aps_risk")     || "moderate");
  const [freq,     setFreq]     = useState(() => localStorage.getItem("aps_freq")     || "daily");
  const [goal,     setGoal]     = useState(() => localStorage.getItem("aps_goal")     || "wealth");
  const [target,   setTarget]   = useState(() => localStorage.getItem("aps_target")   || "");

  const [lang,    setLang]    = useState(() => localStorage.getItem("aps_lang")         || "en");
  const [nWeekly, setNWeekly] = useState(() => localStorage.getItem("aps_notif_weekly") !== "false");
  const [nTips,   setNTips]   = useState(() => localStorage.getItem("aps_notif_tips")   !== "false");
  const [nGoals,  setNGoals]  = useState(() => localStorage.getItem("aps_notif_goals")  !== "false");

  const [twoFA, setTwoFA] = useState(() => localStorage.getItem("aps_2fa") === "true");

  const email    = localStorage.getItem("aps_email") || "user@example.com";
  const initials = (name || email).split(/[\s@.]+/).filter(Boolean).map(w => w[0]).join("").toUpperCase().slice(0, 2) || "U";

  /* ── Load live stats from API ── */
  useEffect(() => {
    getIncome().then(raw => {
      const arr     = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);
      const amounts = arr.map(d => d.amount || 0);
      const total   = amounts.reduce((s, v) => s + v, 0);
      const growth  = amounts.length >= 2 ? amounts[amounts.length - 1] - amounts[amounts.length - 2] : 0;
      let health    = 40;
      if (amounts.length >= 3) health += 10;
      if (amounts.length >= 7) health += 10;
      if (growth > 0)          health += 15;
      if (amounts.length >= 10) health += 10;
      health = Math.min(health, 100);
      const mean   = amounts.length ? total / amounts.length : 0;
      let consist  = 0;
      if (mean > 0 && amounts.length >= 2) {
        const variance = amounts.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / amounts.length;
        consist = Math.max(0, Math.round((1 - Math.sqrt(variance) / mean) * 100));
      }
      setStats({ entries: arr.length, total, health, consist, growth });
    }).catch(() => {});
  }, []);

  const handleSave = () => {
    localStorage.setItem("aps_name",         name);
    localStorage.setItem("aps_phone",        phone);
    localStorage.setItem("aps_bio",          bio);
    localStorage.setItem("aps_avcolor",      avatarColor);
    localStorage.setItem("aps_currency",     currency);
    localStorage.setItem("aps_risk",         risk);
    localStorage.setItem("aps_freq",         freq);
    localStorage.setItem("aps_goal",         goal);
    localStorage.setItem("aps_target",       target);
    localStorage.setItem("aps_lang",         lang);
    localStorage.setItem("aps_notif_weekly", nWeekly);
    localStorage.setItem("aps_notif_tips",   nTips);
    localStorage.setItem("aps_notif_goals",  nGoals);
    localStorage.setItem("aps_2fa",          twoFA);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const riskObj     = RISK_OPTIONS.find(r => r.value === risk)     || RISK_OPTIONS[1];
  const achEarned   = ACHIEVEMENTS.filter(a => stats[a.key] >= a.threshold).length;
  const healthColor = stats.health >= 80 ? "#10b981" : stats.health >= 60 ? "#f59e0b" : "#f97316";

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0618 0%,#130f2e 40%,#080e1f 100%)", padding: "1.5rem 1rem", color: "#fff" }}>

      {/* Ambient glow blobs */}
      <div className="animate-blobMorph" style={{ position: "fixed", top: -120, right: -120, width: 420, height: 420, background: `radial-gradient(circle,${avatarColor}30,transparent)`, filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -100, left: -80, width: 380, height: 380, background: "radial-gradient(circle,rgba(245,158,11,0.12),transparent)", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* ── Page header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button onClick={() => navigate("/dashboard")}
              style={{ padding: "0.6rem 1.1rem", borderRadius: "0.75rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}>
              ← Back
            </button>
            <div>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 900, margin: 0 }}
                  className="animate-gradientText">
                Account Settings
              </h1>
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.78rem", margin: 0 }}>
                Manage your profile, preferences &amp; security
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className={saved ? "animate-popIn" : ""}
            style={{
              padding: "0.75rem 2rem", borderRadius: "0.75rem", fontWeight: 700,
              border: "none", cursor: "pointer", fontSize: "0.9rem",
              background: saved ? "linear-gradient(90deg,#10b981,#059669)" : "linear-gradient(90deg,#6366f1,#4f46e5)",
              color: "#fff",
              boxShadow: saved ? "0 4px 20px rgba(16,185,129,0.5)" : "0 4px 20px rgba(99,102,241,0.4)",
              transition: "all 0.3s",
            }}>
            {saved ? "✅ Saved!" : "💾 Save Changes"}
          </button>
        </div>

        {/* ── Profile banner card ── */}
        <div style={{ ...glassCard, padding: 0, marginBottom: "1.5rem", overflow: "hidden", position: "relative" }}>
          {/* Cover gradient */}
          <div style={{ height: 110, background: `linear-gradient(135deg, ${avatarColor}50 0%, rgba(245,158,11,0.18) 60%, rgba(16,185,129,0.12) 100%)`, position: "relative", overflow: "hidden" }}>
            <div className="animate-blobMorph" style={{ position: "absolute", right: 30, top: 5, width: 100, height: 100, background: `${avatarColor}30`, borderRadius: "50%" }} />
            <div style={{ position: "absolute", left: "55%", top: -20, width: 160, height: 160, background: "rgba(245,158,11,0.08)", borderRadius: "50%", filter: "blur(24px)" }} />
            {/* Scan line effect */}
            <div className="animate-scanLine" style={{ position: "absolute", left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${avatarColor}60,transparent)` }} />
          </div>

          <div style={{ padding: "0 1.5rem 1.5rem", display: "flex", alignItems: "flex-end", gap: "1.5rem", flexWrap: "wrap", marginTop: -44 }}>
            {/* Avatar circle */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: 84, height: 84, borderRadius: "50%",
                background: `linear-gradient(135deg,${avatarColor},${avatarColor}99)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.9rem", fontWeight: 900, color: "#fff",
                border: "3px solid rgba(10,6,24,0.8)",
                boxShadow: `0 0 35px ${avatarColor}70, 0 8px 30px rgba(0,0,0,0.5)`,
              }}>
                {initials}
              </div>
              <div className="animate-liveBlink" style={{ position: "absolute", bottom: 5, right: 5, width: 14, height: 14, borderRadius: "50%", background: "#10b981", border: "2px solid #0a0618" }} />
            </div>

            {/* Name & email */}
            <div style={{ flex: 1, minWidth: 180, paddingBottom: "0.3rem" }}>
              <h2 style={{ fontWeight: 800, fontSize: "1.3rem", margin: "0 0 0.2rem" }}>{name || "Your Name"}</h2>
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.8rem", margin: "0 0 0.25rem" }}>{email}</p>
              <span style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: 9999, background: riskObj.color + "20", color: riskObj.color, fontWeight: 700, border: `1px solid ${riskObj.color}40` }}>
                {riskObj.icon} {riskObj.label} Investor
              </span>
            </div>

            {/* Live stats */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", paddingBottom: "0.3rem" }}>
              {[
                { label: "Entries",     val: stats.entries,                              color: "#6366f1",    icon: "📊" },
                { label: "Total",       val: stats.total > 0 ? inr(stats.total) : "—",  color: "#10b981",    icon: "💰" },
                { label: "Health",      val: `${stats.health}/100`,                      color: healthColor,  icon: "❤️" },
                { label: "Consistency", val: `${stats.consist}%`,                        color: "#06b6d4",    icon: "🎯" },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center", padding: "0.5rem 0.9rem", borderRadius: "0.75rem", background: `${s.color}14`, border: `1px solid ${s.color}30` }}>
                  <div style={{ fontSize: "0.85rem" }}>{s.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: "0.9rem", color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.38)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main layout: sidebar + content ── */}
        <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start", flexWrap: "wrap" }}>

          {/* Sidebar nav */}
          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.25rem", padding: "0.6rem", width: 195, flexShrink: 0 }}>
            {NAV_ITEMS.map(n => (
              <button key={n.id} onClick={() => setSection(n.id)}
                style={{
                  width: "100%", padding: "0.7rem 0.9rem", borderRadius: "0.75rem", cursor: "pointer",
                  background: section === n.id ? "linear-gradient(90deg,rgba(99,102,241,0.28),rgba(99,102,241,0.08))" : "transparent",
                  border: section === n.id ? "1px solid rgba(99,102,241,0.4)" : "1px solid transparent",
                  color: section === n.id ? "#a5b4fc" : "rgba(255,255,255,0.52)",
                  fontWeight: section === n.id ? 700 : 500,
                  display: "flex", alignItems: "center", gap: "0.6rem",
                  marginBottom: "0.2rem", transition: "all 0.2s", fontSize: "0.875rem",
                }}>
                <span>{n.icon}</span> {n.label}
              </button>
            ))}

            {/* Logout at bottom */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: "0.6rem", paddingTop: "0.6rem" }}>
              <button onClick={() => { logoutUser(); window.location.href = "/login"; }}
                style={{ width: "100%", padding: "0.7rem 0.9rem", borderRadius: "0.75rem", cursor: "pointer", background: "transparent", border: "1px solid rgba(239,68,68,0.3)", color: "rgba(239,68,68,0.7)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.875rem", transition: "all 0.2s" }}>
                🚪 Sign Out
              </button>
            </div>
          </div>

          {/* Content panel */}
          <div style={{ flex: 1, minWidth: 280 }}>

            {/* ══ MY PROFILE ══ */}
            {section === "profile" && (
              <div style={glassCard} className="animate-slideUp">
                <h3 style={{ fontWeight: 800, marginBottom: "1.25rem", fontSize: "1.05rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  👤 Personal Information
                </h3>

                {/* Avatar color picker */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={labelStyle}>Avatar Color</label>
                  <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
                    {AVATAR_COLORS.map(c => (
                      <button key={c} onClick={() => setAvatarColor(c)}
                        style={{
                          width: 30, height: 30, borderRadius: "50%", background: c, cursor: "pointer",
                          border: avatarColor === c ? "3px solid #fff" : "3px solid transparent",
                          transform: avatarColor === c ? "scale(1.25)" : "scale(1)",
                          transition: "all 0.2s",
                          boxShadow: avatarColor === c ? `0 0 14px ${c}` : "none",
                        }} />
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label style={labelStyle}>Display Name</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 9876543210" style={inputStyle} />
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={labelStyle}>Email (read-only)</label>
                  <input value={email} readOnly style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }} />
                </div>

                <div>
                  <label style={labelStyle}>Short Bio</label>
                  <textarea value={bio} onChange={e => setBio(e.target.value)}
                    placeholder="Your financial story or goals…" rows={3}
                    style={{ ...inputStyle, resize: "vertical", minHeight: 78 }} />
                </div>
              </div>
            )}

            {/* ══ FINANCIAL ══ */}
            {section === "financial" && (
              <div style={glassCard} className="animate-slideUp">
                <h3 style={{ fontWeight: 800, marginBottom: "1.25rem", fontSize: "1.05rem" }}>💹 Financial Profile</h3>

                {/* Risk tolerance */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={labelStyle}>Risk Tolerance</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                    {RISK_OPTIONS.map(r => (
                      <button key={r.value} onClick={() => setRisk(r.value)}
                        style={{
                          padding: "1rem 0.75rem", borderRadius: "1rem", cursor: "pointer", textAlign: "center",
                          background: risk === r.value ? `${r.color}20` : "rgba(255,255,255,0.04)",
                          border: `2px solid ${risk === r.value ? r.color : "rgba(255,255,255,0.1)"}`,
                          color: risk === r.value ? r.color : "rgba(255,255,255,0.55)",
                          transform: risk === r.value ? "scale(1.03)" : "scale(1)",
                          transition: "all 0.2s",
                        }}>
                        <div style={{ fontSize: "1.5rem", marginBottom: "0.35rem" }}>{r.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: "0.82rem", marginBottom: "0.2rem" }}>{r.label}</div>
                        <div style={{ fontSize: "0.68rem", opacity: 0.7 }}>{r.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label style={labelStyle}>Income Frequency</label>
                    <select value={freq} onChange={e => setFreq(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                      <option value="daily"    style={{ background: "#1a1a2e" }}>Daily</option>
                      <option value="weekly"   style={{ background: "#1a1a2e" }}>Weekly</option>
                      <option value="monthly"  style={{ background: "#1a1a2e" }}>Monthly</option>
                      <option value="irregular"style={{ background: "#1a1a2e" }}>Irregular</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Currency</label>
                    <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                      <option value="INR" style={{ background: "#1a1a2e" }}>₹ INR – Indian Rupee</option>
                      <option value="USD" style={{ background: "#1a1a2e" }}>$ USD – US Dollar</option>
                      <option value="EUR" style={{ background: "#1a1a2e" }}>€ EUR – Euro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Monthly Income Target (₹)</label>
                  <input type="number" value={target} onChange={e => setTarget(e.target.value)} placeholder="e.g. 50000" style={inputStyle} />
                </div>
              </div>
            )}

            {/* ══ GOALS ══ */}
            {section === "goals" && (
              <div style={glassCard} className="animate-slideUp">
                <h3 style={{ fontWeight: 800, marginBottom: "0.5rem", fontSize: "1.05rem" }}>🎯 Financial Goals</h3>
                <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.8rem", marginBottom: "1.25rem" }}>
                  Select your primary objective. This personalises your investment recommendations.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: "0.75rem" }}>
                  {GOAL_OPTIONS.map(g => (
                    <button key={g.value} onClick={() => setGoal(g.value)}
                      style={{
                        padding: "1.25rem 1rem", borderRadius: "1rem", cursor: "pointer", textAlign: "center",
                        background: goal === g.value ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
                        border: `2px solid ${goal === g.value ? "#6366f1" : "rgba(255,255,255,0.1)"}`,
                        color: "#fff",
                        transform: goal === g.value ? "scale(1.03)" : "scale(1)",
                        transition: "all 0.2s",
                        boxShadow: goal === g.value ? "0 0 20px rgba(99,102,241,0.25)" : "none",
                      }}>
                      <div style={{ fontSize: "2rem", marginBottom: "0.45rem" }}>{g.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: "0.82rem", marginBottom: "0.2rem", color: goal === g.value ? "#a5b4fc" : "#fff" }}>{g.label}</div>
                      <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.38)" }}>{g.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ══ PREFERENCES ══ */}
            {section === "preferences" && (
              <div style={glassCard} className="animate-slideUp">
                <h3 style={{ fontWeight: 800, marginBottom: "1.25rem", fontSize: "1.05rem" }}>⚙️ App Preferences</h3>

                {/* Language */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={labelStyle}>Language</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                    {LANGUAGES.map(l => (
                      <button key={l.code} onClick={() => setLang(l.code)}
                        style={{
                          padding: "0.45rem 0.9rem", borderRadius: "0.6rem", cursor: "pointer",
                          background: lang === l.code ? "rgba(99,102,241,0.22)" : "rgba(255,255,255,0.05)",
                          border: `1px solid ${lang === l.code ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.1)"}`,
                          color: lang === l.code ? "#a5b4fc" : "rgba(255,255,255,0.55)",
                          fontWeight: lang === l.code ? 700 : 400, fontSize: "0.82rem", transition: "all 0.2s",
                        }}>
                        {l.native}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notifications */}
                <div>
                  <label style={labelStyle}>Notifications</label>
                  {[
                    { label: "Weekly Summary",  desc: "Financial health report every week",     val: nWeekly, set: setNWeekly, icon: "📊" },
                    { label: "Smart AI Tips",   desc: "Personalised investment suggestions",    val: nTips,   set: setNTips,   icon: "💡" },
                    { label: "Goal Reminders",  desc: "Progress updates toward your goals",    val: nGoals,  set: setNGoals,  icon: "🎯" },
                  ].map(n => (
                    <div key={n.label}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.85rem 1rem", borderRadius: "0.85rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "0.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ fontSize: "1.2rem" }}>{n.icon}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{n.label}</div>
                          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.38)" }}>{n.desc}</div>
                        </div>
                      </div>
                      <Toggle value={n.val} onChange={n.set} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══ SECURITY ══ */}
            {section === "security" && (
              <div style={glassCard} className="animate-slideUp">
                <h3 style={{ fontWeight: 800, marginBottom: "1.25rem", fontSize: "1.05rem" }}>🔐 Security Settings</h3>

                {/* 2FA */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem", borderRadius: "1rem", background: twoFA ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${twoFA ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.1)"}`, marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ fontSize: "2rem" }}>🔐</div>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: "0.2rem" }}>Two-Factor Authentication</div>
                      <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Extra security layer for your account</div>
                    </div>
                  </div>
                  <Toggle value={twoFA} onChange={setTwoFA} />
                </div>

                {/* Password */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem", borderRadius: "1rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ fontSize: "2rem" }}>🔑</div>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: "0.2rem" }}>Password</div>
                      <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Last changed: managed by your provider</div>
                    </div>
                  </div>
                  <button style={{ padding: "0.45rem 1rem", borderRadius: "0.6rem", background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc", fontWeight: 600, cursor: "pointer", fontSize: "0.8rem" }}>
                    Change Password
                  </button>
                </div>

                {/* Session */}
                <div style={{ padding: "1.25rem", borderRadius: "1rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ fontWeight: 700, marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    💻 Active Session
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>
                        Current Browser · {new Date().toLocaleDateString("en-IN")}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>JWT session · expires on logout</div>
                    </div>
                    <button onClick={() => { logoutUser(); window.location.href = "/login"; }}
                      style={{ padding: "0.45rem 1rem", borderRadius: "0.6rem", background: "rgba(239,68,68,0.14)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", fontWeight: 600, cursor: "pointer", fontSize: "0.8rem" }}>
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ══ ACHIEVEMENTS ══ */}
            {section === "achievements" && (
              <div style={glassCard} className="animate-slideUp">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <h3 style={{ fontWeight: 800, fontSize: "1.05rem", margin: 0 }}>🏆 Your Achievements</h3>
                  <span style={{ fontSize: "0.8rem", color: "#a5b4fc", fontWeight: 700 }}>
                    {achEarned} / {ACHIEVEMENTS.length} earned
                  </span>
                </div>

                {/* Overall progress bar */}
                <div style={{ padding: "0.85rem 1rem", borderRadius: "0.85rem", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", marginBottom: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.8rem" }}>
                    <span style={{ color: "#a5b4fc", fontWeight: 600 }}>Overall Progress</span>
                    <span style={{ color: "#a5b4fc" }}>{Math.round((achEarned / ACHIEVEMENTS.length) * 100)}%</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 9999, background: "rgba(255,255,255,0.08)" }}>
                    <div className="animate-fillBar"
                      style={{ height: "100%", borderRadius: 9999, background: "linear-gradient(90deg,#6366f1,#a5b4fc)", width: `${(achEarned / ACHIEVEMENTS.length) * 100}%`, transition: "width 1s" }} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "0.75rem" }}>
                  {ACHIEVEMENTS.map(a => {
                    const earned = stats[a.key] >= a.threshold;
                    return (
                      <div key={a.title}
                        className={earned ? "animate-popIn card-3d" : ""}
                        style={{
                          padding: "1rem", borderRadius: "1rem", position: "relative", overflow: "hidden",
                          background: earned ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.03)",
                          border: `1px solid ${earned ? "rgba(99,102,241,0.35)" : "rgba(255,255,255,0.07)"}`,
                          opacity: earned ? 1 : 0.42,
                          transition: "all 0.3s",
                        }}>
                        {earned && (
                          <div style={{ position: "absolute", top: 7, right: 7, fontSize: "0.58rem", color: "#10b981", fontWeight: 700, background: "rgba(16,185,129,0.15)", padding: "2px 6px", borderRadius: 9999 }}>
                            ✓ EARNED
                          </div>
                        )}
                        {earned && <div className="animate-shimmer" style={{ position: "absolute", inset: 0, borderRadius: "1rem" }} />}
                        <div style={{ fontSize: "2rem", marginBottom: "0.45rem", filter: earned ? "none" : "grayscale(1)" }}>{a.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.2rem", color: earned ? "#a5b4fc" : "rgba(255,255,255,0.55)" }}>{a.title}</div>
                        <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.38)" }}>{a.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>

        <footer style={{ textAlign: "center", color: "rgba(255,255,255,0.18)", fontSize: "0.75rem", paddingTop: "2rem", paddingBottom: "3rem" }}>
          APS AI · Account Settings · All data stored locally
        </footer>
      </div>
    </div>
  );
}
