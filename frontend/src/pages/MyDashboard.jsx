import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/api";
import { getStats, fmtTime, logVisit, addTime } from "../utils/tracker";

const TOOLS = [
  {
    icon: "📊", title: "AI Financial Predictor",
    desc: "Income predictions, investment plan, risk score & live stock market",
    route: "/dashboard", color: "#6366f1",
    grad: "linear-gradient(135deg,rgba(99,102,241,0.22),rgba(79,70,229,0.07))",
    border: "rgba(99,102,241,0.4)", features: ["Income Forecast","AI Risk Score","Investment Plan","Stock Ticker"],
  },
  {
    icon: "💼", title: "WorkIndia Job Board",
    desc: "Find & post jobs across India in 6 languages — no login needed to browse",
    route: "/jobs", color: "#10b981",
    grad: "linear-gradient(135deg,rgba(16,185,129,0.22),rgba(5,150,105,0.07))",
    border: "rgba(16,185,129,0.4)", features: ["Live Listings","12 Cities","Post Free","WhatsApp Apply"],
  },
  {
    icon: "👷", title: "Worker Hub",
    desc: "Track daily wages, find better-paying cities & apply for part-time gigs",
    route: "/worker", color: "#f59e0b",
    grad: "linear-gradient(135deg,rgba(245,158,11,0.22),rgba(217,119,6,0.07))",
    border: "rgba(245,158,11,0.4)", features: ["Wage Tracker","City Tips","Google Maps","Part-time Jobs"],
  },
  {
    icon: "🤖", title: "AI Chat Assistant",
    desc: "Ask anything about finance, jobs & wages in 7 Indian languages",
    route: "/chat", color: "#06b6d4",
    grad: "linear-gradient(135deg,rgba(6,182,212,0.22),rgba(8,145,178,0.07))",
    border: "rgba(6,182,212,0.4)", features: ["7 Languages","50+ Topics","Finance Help","Job Guidance"],
  },
];

const PAGE_ICONS = { "AI Dashboard": "📊", "Worker Hub": "👷", "Job Board": "💼", "AI Chat": "🤖", "Home": "🏠" };
const LOG_ICONS  = { visit: "👁️", income: "💰", default: "📌" };

export default function MyDashboard() {
  const navigate = useNavigate();
  const [stats, setStats]       = useState(getStats);
  const [session, setSession]   = useState(0);
  const name = localStorage.getItem("aps_name") || "";
  const avatarColor = localStorage.getItem("aps_avcolor") || "#6366f1";
  const initials = (name || "U").split(/[\s@.]+/).filter(Boolean).map(w => w[0]).join("").toUpperCase().slice(0,2) || "U";

  useEffect(() => {
    logVisit("My Dashboard");
    const ti = setInterval(() => { addTime(1); setSession(s => s + 1); }, 1000);
    const sync = () => setStats(getStats());
    window.addEventListener("storage", sync);
    return () => { clearInterval(ti); window.removeEventListener("storage", sync); };
  }, []);

  const relTime = (iso) => {
    const d = Math.floor((Date.now() - new Date(iso)) / 1000);
    if (d < 60)    return `${d}s ago`;
    if (d < 3600)  return `${Math.floor(d/60)}m ago`;
    if (d < 86400) return `${Math.floor(d/3600)}h ago`;
    return new Date(iso).toLocaleDateString("en-IN", { day:"numeric", month:"short" });
  };

  const totalVisits = Object.values(stats.visits).reduce((a,b)=>a+b, 0);

  return (
    <div style={{ background: "linear-gradient(135deg,#050210,#0d0b1e,#060e1c)", minHeight: "100vh", color: "#fff" }}>
      {/* Ambient blobs */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
        <div style={{ position:"absolute", width:600, height:600, background:"radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%)", borderRadius:"50%", top:"-15%", left:"-10%" }} />
        <div style={{ position:"absolute", width:500, height:500, background:"radial-gradient(circle,rgba(16,185,129,0.09) 0%,transparent 70%)", borderRadius:"50%", bottom:"5%", right:"-5%" }} />
      </div>

      <div style={{ position:"relative", zIndex:1 }}>
        {/* ── NAVBAR ── */}
        <nav style={{ background:"rgba(0,0,0,0.45)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.07)", padding:"0 1.5rem", position:"sticky", top:0, zIndex:100 }}>
          <div style={{ maxWidth:1200, margin:"0 auto", height:60, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
              <button onClick={() => navigate("/")} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.45)", fontSize:"0.85rem", fontWeight:600 }}>← Home</button>
              <span style={{ color:"rgba(255,255,255,0.15)" }}>|</span>
              <span style={{ fontSize:"1.2rem" }}>🧠</span>
              <span style={{ fontWeight:900, fontSize:"1.1rem", background:"linear-gradient(90deg,#a5b4fc,#34d399)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>My Dashboard</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
              <span style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.8rem" }}>⏱ {fmtTime(session)}</span>
              <div style={{ width:34, height:34, borderRadius:"50%", background:`linear-gradient(135deg,${avatarColor},${avatarColor}88)`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:"0.75rem", cursor:"pointer" }}
                   onClick={() => navigate("/profile")}>
                {initials}
              </div>
              <button onClick={() => { logoutUser(); window.location.href = "/login"; }}
                style={{ background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:"0.65rem", padding:"0.4rem 0.9rem", color:"#f87171", fontWeight:700, fontSize:"0.8rem", cursor:"pointer" }}>
                Logout
              </button>
            </div>
          </div>
        </nav>

        <div style={{ maxWidth:1200, margin:"0 auto", padding:"2rem 1.5rem" }}>

          {/* ── WELCOME ── */}
          <div style={{ marginBottom:"2rem" }}>
            <h1 style={{ fontSize:"2rem", fontWeight:900, margin:0, background:"linear-gradient(90deg,#a5b4fc,#34d399,#fbbf24)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              Welcome back{name ? `, ${name.split(" ")[0]}` : ""}! 👋
            </h1>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.9rem", marginTop:"0.3rem" }}>
              Choose a tool below or check your activity summary
            </p>
          </div>

          {/* ── QUICK STATS ── */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:"1rem", marginBottom:"2rem" }}>
            {[
              { icon:"⏱️", label:"This Session",  val: fmtTime(session),           color:"#6366f1" },
              { icon:"🕐", label:"Total Time",    val: fmtTime(stats.totalTime),   color:"#10b981" },
              { icon:"📄", label:"Pages Visited", val:`${totalVisits} visits`,     color:"#f59e0b" },
              { icon:"📋", label:"Activities",    val:`${stats.log.length} logged`, color:"#06b6d4" },
            ].map(c => (
              <div key={c.label} style={{ background: c.color+"14", border:`1px solid ${c.color}30`, borderRadius:"1.25rem", padding:"1.25rem", textAlign:"center" }}>
                <div style={{ fontSize:"1.6rem", marginBottom:"0.2rem" }}>{c.icon}</div>
                <div style={{ fontSize:"1.3rem", fontWeight:900, color:c.color }}>{c.val}</div>
                <div style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.38)", marginTop:2 }}>{c.label}</div>
              </div>
            ))}
          </div>

          {/* ── TOOLS GRID ── */}
          <h2 style={{ fontWeight:800, fontSize:"1.1rem", color:"rgba(255,255,255,0.7)", marginBottom:"1rem", letterSpacing:"0.05em" }}>TOOLS</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))", gap:"1.25rem", marginBottom:"2rem" }}>
            {TOOLS.map(tool => (
              <div key={tool.route}
                onClick={() => navigate(tool.route)}
                style={{ background:tool.grad, border:`1px solid ${tool.border}`, borderRadius:"1.5rem", padding:"1.5rem", cursor:"pointer", transition:"transform 0.18s,box-shadow 0.18s", position:"relative", overflow:"hidden" }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 16px 40px ${tool.color}25`; }}
                onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}>
                {/* top accent */}
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${tool.color},${tool.color}44)`, borderRadius:"1.5rem 1.5rem 0 0" }} />
                <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"0.75rem" }}>
                  <span style={{ fontSize:"2rem" }}>{tool.icon}</span>
                  <span style={{ fontWeight:800, fontSize:"1rem", color:"#fff" }}>{tool.title}</span>
                </div>
                <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"0.83rem", marginBottom:"1rem", lineHeight:1.5 }}>{tool.desc}</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem", marginBottom:"1rem" }}>
                  {tool.features.map(f => (
                    <span key={f} style={{ background:`${tool.color}18`, border:`1px solid ${tool.color}35`, borderRadius:"999px", padding:"0.18rem 0.65rem", fontSize:"0.72rem", fontWeight:600, color:tool.color }}>{f}</span>
                  ))}
                </div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end" }}>
                  <span style={{ background:tool.color, borderRadius:"0.65rem", padding:"0.4rem 1rem", fontWeight:700, fontSize:"0.82rem", color:"#fff" }}>Open →</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── BOTTOM ROW: pages visited + activity log ── */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"1.25rem", marginBottom:"2rem" }}>
            {/* Pages visited */}
            <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:"1.5rem", padding:"1.5rem" }}>
              <h3 style={{ fontWeight:800, color:"#fff", marginBottom:"1rem", fontSize:"1rem" }}>📍 Pages Visited</h3>
              {Object.keys(stats.visits).length === 0 ? (
                <p style={{ color:"rgba(255,255,255,0.28)", fontSize:"0.83rem" }}>Navigate around to see your page stats.</p>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
                  {Object.entries(stats.visits).sort((a,b)=>b[1]-a[1]).map(([page, count]) => (
                    <div key={page} style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                      <span style={{ fontSize:"1.1rem" }}>{PAGE_ICONS[page]||"🔗"}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                          <span style={{ color:"rgba(255,255,255,0.75)", fontSize:"0.83rem", fontWeight:600 }}>{page}</span>
                          <span style={{ color:"#6366f1", fontWeight:700, fontSize:"0.83rem" }}>{count}×</span>
                        </div>
                        <div style={{ height:4, borderRadius:999, background:"rgba(255,255,255,0.07)" }}>
                          <div style={{ height:4, borderRadius:999, background:"linear-gradient(90deg,#6366f1,#4f46e5)", width:`${Math.min(100,(count/Math.max(...Object.values(stats.visits)))*100)}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Activity log */}
            <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:"1.5rem", padding:"1.5rem" }}>
              <h3 style={{ fontWeight:800, color:"#fff", marginBottom:"1rem", fontSize:"1rem" }}>📋 Recent Activity</h3>
              {stats.log.length === 0 ? (
                <p style={{ color:"rgba(255,255,255,0.28)", fontSize:"0.83rem" }}>Your activity will appear here as you use the app.</p>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem", maxHeight:260, overflowY:"auto" }}>
                  {stats.log.map((entry, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"0.6rem", padding:"0.6rem 0.75rem", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:"0.75rem" }}>
                      <span style={{ fontSize:"1rem", marginTop:1 }}>{LOG_ICONS[entry.type]||LOG_ICONS.default}</span>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ color:"rgba(255,255,255,0.78)", fontSize:"0.82rem", fontWeight:500, margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{entry.detail}</p>
                        <p style={{ color:"rgba(255,255,255,0.25)", fontSize:"0.72rem", margin:0, marginTop:2 }}>{relTime(entry.time)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        <footer style={{ textAlign:"center", color:"rgba(255,255,255,0.18)", fontSize:"0.75rem", padding:"1.5rem", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
          © 2026 APS AI Platform · All your tools in one place
        </footer>
      </div>
    </div>
  );
}
