import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { logVisit, addTime } from "../utils/tracker";
import {
  CITY_DATA, MIGRATION_CITIES,
  CITY_JOB_LISTINGS, PART_TIME_JOBS,
} from "../data/indianJobs";

const bg = { background: "linear-gradient(135deg,#0a0618 0%,#130f2e 50%,#080e1f 100%)", minHeight: "100vh" };
const glass = (extra = {}) => ({
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(22px)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "1.25rem",
  ...extra,
});
const TABS = [
  { id: "wages",    icon: "💰", label: "My Wages" },
  { id: "find",     icon: "🏙️", label: "Find Work" },
  { id: "parttime", icon: "🎓", label: "Part-time Jobs" },
  { id: "apply",    icon: "📋", label: "Apply Now" },
];

// ─── Live jobs fetch via Adzuna API (free tier) ─────────────────────────────
const ADZUNA_APP_ID  = "guest";  // public demo endpoint fallback
const fetchLiveJobs = async (city) => {
  try {
    const q = encodeURIComponent(`daily wage worker ${city} India`);
    const res = await fetch(
      `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=demo&app_key=demo&results_per_page=6&what=${q}&where=${encodeURIComponent(city)}&content-type=application/json`
    );
    if (!res.ok) throw new Error("api fail");
    const data = await res.json();
    return (data.results || []).map(j => ({
      title: j.title,
      pay: j.salary_min ? `₹${Math.round(j.salary_min/12).toLocaleString()}/mo` : "Negotiable",
      company: j.company?.display_name || "Company",
      contact: null,
      hours: "Full-time",
      url: j.redirect_url,
    }));
  } catch {
    return null; // fall back to static data
  }
};

// ─── WAGES TAB ───────────────────────────────────────────────────────────────
function WagesTab({ onLowIncome }) {
  const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const [wages, setWages] = useState(Array(7).fill(""));
  const [done, setDone] = useState(false);

  const nums   = wages.map(w => parseFloat(w) || 0);
  const total  = nums.reduce((a,b) => a+b, 0);
  const avg    = total / 7;
  const best   = Math.max(...nums);
  const worst  = Math.min(...nums.filter(n => n > 0));
  const bestDay  = DAYS[nums.indexOf(best)];
  const worstDay = DAYS[nums.indexOf(worst)];

  const handle = () => {
    if (nums.every(n => n === 0)) return;
    setDone(true);
    if (avg < 500) onLowIncome(true);
  };

  if (!done) return (
    <div className="animate-slideUp" style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ ...glass(), padding: "2rem", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: "0.5rem" }}>
          📅 Enter Your Last 7 Days Wages
        </div>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
          Enter how much you earned each day (₹)
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {DAYS.map((day, i) => (
            <div key={day} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ width: 40, color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", fontWeight: 600 }}>{day}</span>
              <input
                type="number" min="0" placeholder="₹ 0"
                value={wages[i]}
                onChange={e => { const w=[...wages]; w[i]=e.target.value; setWages(w); }}
                style={{
                  flex: 1, background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.75rem",
                  padding: "0.6rem 1rem", color: "#fff", fontSize: "1rem",
                  outline: "none",
                }}
              />
              {wages[i] && <span style={{ color: "#10b981", fontWeight: 700, minWidth: 70 }}>₹{parseFloat(wages[i]).toLocaleString()}</span>}
            </div>
          ))}
        </div>
        <button onClick={handle} style={{
          marginTop: "1.5rem", width: "100%",
          background: "linear-gradient(90deg,#6366f1,#4f46e5)",
          border: "none", borderRadius: "0.875rem", padding: "0.9rem",
          color: "#fff", fontWeight: 700, fontSize: "1rem", cursor: "pointer",
          boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
        }}>
          Calculate My Earnings →
        </button>
      </div>
    </div>
  );

  return (
    <div className="animate-slideUp">
      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Daily Average", value: `₹${avg.toFixed(0)}`, color: avg >= 500 ? "#10b981" : "#ef4444", icon: "📊" },
          { label: "Total (7 days)", value: `₹${total.toLocaleString()}`, color: "#6366f1", icon: "💵" },
          { label: `Best Day (${bestDay})`, value: `₹${best}`, color: "#f59e0b", icon: "🏆" },
          { label: `Worst Day (${worstDay})`, value: `₹${worst || 0}`, color: "#ef4444", icon: "📉" },
        ].map((k, i) => (
          <div key={k.label} className="animate-cardEntry" style={{ ...glass(), padding: "1.25rem", animationDelay: `${i * 80}ms`, position: "relative", overflow: "hidden" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{k.icon}</div>
            <div className="animate-counterPop" style={{ fontSize: "1.6rem", fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem", marginTop: 2 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Low Income Alert */}
      {avg > 0 && avg < 500 && (
        <div className="animate-slideUp" style={{
          ...glass(),
          padding: "1.5rem",
          border: "1.5px solid rgba(239,68,68,0.5)",
          marginBottom: "1.5rem",
          background: "rgba(239,68,68,0.08)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <span style={{ fontSize: "1.75rem", animation: "waveFloat 2s ease-in-out infinite" }}>⚠️</span>
            <div>
              <div style={{ color: "#ef4444", fontWeight: 800, fontSize: "1.1rem" }}>Low Income Alert</div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem" }}>Your average ₹{avg.toFixed(0)}/day is below ₹500 — consider moving to a higher-paying city</div>
            </div>
          </div>
          <div style={{ fontWeight: 700, color: "#fff", marginBottom: "0.75rem" }}>🏙️ Suggested Cities for Better Pay</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "0.75rem" }}>
            {MIGRATION_CITIES.map(c => (
              <div key={c.city} style={{ ...glass({ borderRadius: "0.875rem" }), padding: "1rem" }}>
                <div style={{ fontSize: "1.5rem" }}>{c.icon}</div>
                <div style={{ color: "#fff", fontWeight: 700 }}>{c.city}, {c.state}</div>
                <div style={{ color: "#10b981", fontWeight: 700, fontSize: "0.9rem" }}>Avg ₹{c.avgWage}/day</div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem", marginTop: "0.3rem", lineHeight: 1.4 }}>{c.reason}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {avg >= 500 && (
        <div style={{ ...glass(), padding: "1.25rem", border: "1px solid rgba(16,185,129,0.4)", background: "rgba(16,185,129,0.07)", marginBottom: "1.5rem" }}>
          <span style={{ fontSize: "1.3rem" }}>✅</span>
          <span style={{ color: "#10b981", fontWeight: 700, marginLeft: "0.5rem" }}>
            Good earning! Your ₹{avg.toFixed(0)}/day average is above the ₹500 threshold.
          </span>
        </div>
      )}

      <button onClick={() => { setDone(false); setWages(Array(7).fill("")); onLowIncome(false); }} style={{
        background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "0.75rem", padding: "0.6rem 1.5rem",
        color: "rgba(255,255,255,0.6)", cursor: "pointer", fontWeight: 600,
      }}>
        ↩ Re-enter Wages
      </button>
    </div>
  );
}

// ─── FIND WORK TAB ──────────────────────────────────────────────────────────
function FindWorkTab() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [liveJobs, setLiveJobs] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadCity = async (city) => {
    setSelectedCity(city);
    setLiveJobs(null);
    setLoading(true);
    const jobs = await fetchLiveJobs(city);
    setLiveJobs(jobs && jobs.length > 0 ? jobs : CITY_JOB_LISTINGS[city] || []);
    setLoading(false);
  };

  const cityObj = CITY_DATA.find(c => c.city === selectedCity);

  if (!selectedCity) return (
    <div className="animate-slideUp">
      <div style={{ color: "rgba(255,255,255,0.55)", marginBottom: "1.25rem", fontSize: "0.92rem" }}>
        Select a city to see live jobs, average wages & directions 📍
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: "1rem" }}>
        {CITY_DATA.map((c, i) => (
          <button key={c.city} onClick={() => loadCity(c.city)} className="card-3d animate-cardEntry" style={{
            ...glass(), padding: "1.25rem", cursor: "pointer",
            border: `1px solid ${c.color}33`,
            animationDelay: `${i * 60}ms`,
            textAlign: "left", transition: "all 0.25s",
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.4rem", animation: "waveFloat 3s ease-in-out infinite" }}>{c.icon}</div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: "1rem" }}>{c.city}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem" }}>{c.state}</div>
            <div style={{ color: c.color, fontWeight: 700, margin: "0.5rem 0", fontSize: "0.9rem" }}>₹{c.avgPay}/day avg</div>
            <div style={{ fontSize: "0.75rem", color: "#fff", fontWeight: 600, marginBottom: "0.4rem" }}>
              <span style={{ background: `${c.color}33`, border: `1px solid ${c.color}66`, borderRadius: "999px", padding: "0.15rem 0.55rem" }}>
                {c.demandLevel} Demand
              </span>
            </div>
            {/* Demand bar */}
            <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, marginTop: "0.5rem", overflow: "hidden" }}>
              <div className="animate-fillBar" style={{ height: "100%", width: `${c.demandPct}%`, background: c.color, borderRadius: 2 }} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="animate-slideUp">
      <button onClick={() => setSelectedCity(null)} style={{
        background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "0.75rem", padding: "0.5rem 1.2rem",
        color: "rgba(255,255,255,0.7)", cursor: "pointer", marginBottom: "1.5rem",
      }}>
        ← Back to Cities
      </button>

      {/* City header */}
      <div style={{ ...glass(), padding: "1.5rem", marginBottom: "1.5rem", border: `1px solid ${cityObj?.color}44` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "2.5rem" }}>{cityObj?.icon}</span>
          <div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff" }}>{selectedCity}, {cityObj?.state}</div>
            <div style={{ color: cityObj?.color, fontWeight: 700 }}>Average ₹{cityObj?.avgPay}/day</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {cityObj?.jobTypes.map(jt => (
              <span key={jt} style={{ background: `${cityObj.color}22`, border: `1px solid ${cityObj.color}44`, borderRadius: "999px", padding: "0.25rem 0.7rem", color: "rgba(255,255,255,0.7)", fontSize: "0.75rem" }}>{jt}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Job listings */}
      <div style={{ fontWeight: 700, color: "#fff", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "liveBlink 1.2s ease-in-out infinite" }} />
        Live Job Listings — {selectedCity}
      </div>

      {loading ? (
        <div style={{ color: "rgba(255,255,255,0.4)", padding: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "2rem", animation: "rotateSlow 1.5s linear infinite", display: "inline-block" }}>⚙️</div>
          <div style={{ marginTop: "0.5rem" }}>Fetching live jobs...</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          {(liveJobs || []).map((job, i) => (
            <div key={i} className="card-3d animate-cardEntry" style={{ ...glass(), padding: "1.25rem", animationDelay: `${i*60}ms` }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "1rem", marginBottom: "0.3rem" }}>{job.title}</div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem" }}>{job.company}</div>
              <div style={{ color: "#10b981", fontWeight: 700, margin: "0.5rem 0" }}>{job.pay}</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", marginBottom: "0.75rem" }}>⏰ {job.hours}</div>
              <button onClick={() => {
                if (job.url) window.open(job.url, "_blank");
                else if (job.contact) window.open(`https://wa.me/${job.contact}?text=Hi, I am interested in the ${job.title} position at ${job.company}`, "_blank");
              }} style={{
                width: "100%", background: "linear-gradient(90deg,#10b981,#059669)",
                border: "none", borderRadius: "0.625rem", padding: "0.5rem",
                color: "#fff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
              }}>
                {job.url ? "Apply Online 🔗" : "Apply via WhatsApp 💬"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Google Maps */}
      <div style={{ ...glass(), padding: "1.25rem" }}>
        <div style={{ fontWeight: 700, color: "#fff", marginBottom: "0.75rem" }}>🗺️ Google Maps — {selectedCity}</div>
        <iframe
          title={`map-${selectedCity}`}
          src={`https://maps.google.com/maps?q=${cityObj?.mapQuery}&output=embed`}
          width="100%" height="280"
          style={{ border: 0, borderRadius: "0.875rem" }}
          allowFullScreen loading="lazy"
        />
        <button onClick={() => window.open(`https://www.google.com/maps/search/${cityObj?.mapQuery}`, "_blank")} style={{
          marginTop: "0.875rem", background: "linear-gradient(90deg,#4285f4,#1a73e8)",
          border: "none", borderRadius: "0.75rem", padding: "0.6rem 1.5rem",
          color: "#fff", fontWeight: 700, cursor: "pointer",
        }}>
          📍 Open in Google Maps
        </button>
      </div>
    </div>
  );
}

// ─── PART-TIME TAB ───────────────────────────────────────────────────────────
const CATEGORIES = ["all","delivery","tutoring","data-entry","bpo","other"];
const CAT_LABELS = { all: "All Jobs", delivery: "🛵 Delivery", tutoring: "📚 Tutoring", "data-entry": "⌨️ Data Entry", bpo: "📞 BPO", other: "✨ Other" };

function PartTimeTab() {
  const [cat, setCat] = useState("all");
  const filtered = cat === "all" ? PART_TIME_JOBS : PART_TIME_JOBS.filter(j => j.category === cat);

  return (
    <div className="animate-slideUp">
      {/* Filter row */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{
            background: cat === c ? "linear-gradient(90deg,#6366f1,#4f46e5)" : "rgba(255,255,255,0.06)",
            border: cat === c ? "none" : "1px solid rgba(255,255,255,0.12)",
            borderRadius: "999px", padding: "0.4rem 1rem",
            color: cat === c ? "#fff" : "rgba(255,255,255,0.55)",
            fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", transition: "all 0.2s",
          }}>{CAT_LABELS[c]}</button>
        ))}
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.82rem", marginLeft: "auto", alignSelf: "center" }}>{filtered.length} jobs</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "1rem" }}>
        {filtered.map((job, i) => (
          <div key={job.id} className="card-3d animate-cardEntry" style={{ ...glass(), padding: "1.25rem", animationDelay: `${i*60}ms`, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ fontSize: "2rem" }}>{job.icon}</span>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: "999px", background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.35)", color: "#a5b4fc" }}>{job.type}</span>
            </div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: "1rem" }}>{job.title}</div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem" }}>{job.company}</div>
            <div style={{ color: "#10b981", fontWeight: 700 }}>{job.pay}</div>
            <div style={{ color: "#f59e0b", fontSize: "0.82rem" }}>⏱ {job.hours}</div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem" }}>📍 {job.location}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", lineHeight: 1.4 }}>{job.desc}</div>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
              {job.tags.map(t => (
                <span key={t} style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem", borderRadius: "999px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)" }}>{t}</span>
              ))}
            </div>
            <button onClick={() => window.open(`https://wa.me/${job.applyWhatsApp}?text=Hi, I want to apply for: ${job.title}`, "_blank")} style={{
              marginTop: "auto", paddingTop: "0.25rem",
              background: "linear-gradient(90deg,#25d366,#128c7e)",
              border: "none", borderRadius: "0.625rem", padding: "0.55rem",
              color: "#fff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
            }}>
              💬 Apply via WhatsApp
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── APPLY TAB ───────────────────────────────────────────────────────────────
function ApplyTab() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", skill: "", city: "", experience: "" });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name required";
    if (!form.phone.match(/^[0-9]{10}$/)) e.phone = "Enter valid 10-digit number";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (!form.skill) e.skill = "Select a skill";
    if (!form.city) e.city = "Select a city";
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setDone(true);
  };

  if (done) return (
    <div className="animate-slideUp" style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
      <div style={{ ...glass({ border: "1.5px solid rgba(16,185,129,0.5)", background: "rgba(16,185,129,0.06)" }), padding: "2.5rem" }}>
        <div style={{ fontSize: "3.5rem", animation: "waveFloat 3s ease-in-out infinite", marginBottom: "1rem" }}>✅</div>
        <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#10b981", marginBottom: "0.5rem" }}>Application Submitted!</div>
        <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
          Thank you <strong style={{ color: "#fff" }}>{form.name}</strong>! We'll reach you at <strong style={{ color: "#fff" }}>{form.phone}</strong> within 24–48 hours.
        </p>
        <div style={{ ...glass({ borderRadius: "0.75rem" }), padding: "0.875rem", marginBottom: "1.5rem", color: "rgba(255,255,255,0.45)", fontSize: "0.85rem" }}>
          🔔 Our recruitment team reviews applications from <strong style={{ color: "#f59e0b" }}>{form.city}</strong> every weekday.
        </div>
        <button onClick={() => { setDone(false); setForm({ name:"",phone:"",email:"",skill:"",city:"",experience:"" }); }} style={{
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "0.75rem", padding: "0.6rem 1.5rem",
          color: "rgba(255,255,255,0.7)", cursor: "pointer", fontWeight: 600,
        }}>
          Submit Another Application
        </button>
      </div>
    </div>
  );

  const field = (label, key, type = "text", placeholder = "") => (
    <div>
      <label style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem", display: "block", marginBottom: "0.4rem" }}>{label}</label>
      <input type={type} placeholder={placeholder} value={form[key]}
        onChange={e => { set(key, e.target.value); setErrors(er => ({ ...er, [key]: "" })); }}
        style={{
          width: "100%", background: "rgba(255,255,255,0.06)",
          border: `1px solid ${errors[key] ? "#ef4444" : "rgba(255,255,255,0.12)"}`,
          borderRadius: "0.75rem", padding: "0.65rem 1rem",
          color: "#fff", fontSize: "0.95rem", outline: "none", boxSizing: "border-box",
        }}
      />
      {errors[key] && <div style={{ color: "#ef4444", fontSize: "0.78rem", marginTop: "0.25rem" }}>{errors[key]}</div>}
    </div>
  );

  return (
    <div className="animate-slideUp" style={{ maxWidth: 540, margin: "0 auto" }}>
      <div style={{ ...glass(), padding: "2rem" }}>
        <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", marginBottom: "1.5rem" }}>📋 Quick Job Application</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {field("Full Name", "name", "text", "Your full name")}
          {field("Phone Number", "phone", "tel", "10-digit mobile number")}
          {field("Email", "email", "email", "your@email.com")}

          <div>
            <label style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem", display: "block", marginBottom: "0.4rem" }}>Your Skill</label>
            <select value={form.skill} onChange={e => { set("skill", e.target.value); setErrors(er => ({...er, skill:""})); }} style={{
              width: "100%", background: "#1a1535", border: `1px solid ${errors.skill ? "#ef4444" : "rgba(255,255,255,0.12)"}`,
              borderRadius: "0.75rem", padding: "0.65rem 1rem", color: form.skill ? "#fff" : "rgba(255,255,255,0.35)", fontSize: "0.95rem",
            }}>
              <option value="">Select your skill</option>
              {["Construction / Masonry","Electrical Work","Plumbing","Driving / Transport","Cooking / Food Prep","Cleaning / Housekeeping","Security Guard","Factory / Machine Operation","Textile / Tailoring","Delivery / Logistics","IT Support / Data Entry","Other"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.skill && <div style={{ color: "#ef4444", fontSize: "0.78rem", marginTop: "0.25rem" }}>{errors.skill}</div>}
          </div>

          <div>
            <label style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem", display: "block", marginBottom: "0.4rem" }}>Preferred City</label>
            <select value={form.city} onChange={e => { set("city", e.target.value); setErrors(er => ({...er, city:""})); }} style={{
              width: "100%", background: "#1a1535", border: `1px solid ${errors.city ? "#ef4444" : "rgba(255,255,255,0.12)"}`,
              borderRadius: "0.75rem", padding: "0.65rem 1rem", color: form.city ? "#fff" : "rgba(255,255,255,0.35)", fontSize: "0.95rem",
            }}>
              <option value="">Select a city</option>
              {CITY_DATA.map(c => <option key={c.city} value={c.city}>{c.city}, {c.state}</option>)}
            </select>
            {errors.city && <div style={{ color: "#ef4444", fontSize: "0.78rem", marginTop: "0.25rem" }}>{errors.city}</div>}
          </div>

          <div>
            <label style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem", display: "block", marginBottom: "0.4rem" }}>Experience (optional)</label>
            <textarea value={form.experience} onChange={e => set("experience", e.target.value)}
              placeholder="e.g. 2 years construction work in Surat..." rows={3}
              style={{
                width: "100%", background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.75rem",
                padding: "0.65rem 1rem", color: "#fff", fontSize: "0.9rem",
                outline: "none", resize: "vertical", boxSizing: "border-box",
              }}
            />
          </div>

          <button onClick={submit} style={{
            background: "linear-gradient(90deg,#f59e0b,#d97706)",
            border: "none", borderRadius: "0.875rem", padding: "0.9rem",
            color: "#fff", fontWeight: 800, fontSize: "1rem", cursor: "pointer",
            boxShadow: "0 4px 20px rgba(245,158,11,0.4)", marginTop: "0.5rem",
          }}>
            Submit Application 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function WorkerHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("wages");
  const [lowIncome, setLowIncome] = useState(false);

  useEffect(() => {
    logVisit("Worker Hub");
    const t = setInterval(() => addTime(1), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={bg}>
      {/* Ambient blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 500, height: 500, background: "radial-gradient(circle,rgba(245,158,11,0.12) 0%,transparent 70%)", borderRadius: "50%", top: "-10%", right: "-10%", animation: "blobMorph 10s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: 400, height: 400, background: "radial-gradient(circle,rgba(16,185,129,0.1) 0%,transparent 70%)", borderRadius: "50%", bottom: "10%", left: "-5%", animation: "blobMorph 14s ease-in-out infinite reverse" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, padding: "1.5rem", maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/")} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.75rem", padding: "0.5rem 1rem", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontWeight: 600 }}>← Home</button>
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 900, margin: 0, background: "linear-gradient(90deg,#fbbf24,#f59e0b,#10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              👷 Worker Hub
            </h1>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>Jobs · Wages · Cities · Apply</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "liveBlink 1.2s ease-in-out infinite" }} />
            <span style={{ color: "#10b981", fontWeight: 700, fontSize: "0.8rem" }}>LIVE JOBS</span>
          </div>
        </div>

        {/* Low income banner */}
        {lowIncome && (
          <div className="animate-slideUp" style={{ ...glass({ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.4)" }), padding: "0.875rem 1.25rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ animation: "waveFloat 2s infinite" }}>⚠️</span>
            <span style={{ color: "#ef4444", fontWeight: 700 }}>Low income detected — check city suggestions in My Wages tab</span>
          </div>
        )}

        {/* Tab bar */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap", padding: "0.375rem", borderRadius: "1rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", width: "fit-content" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: "0.6rem 1.2rem", borderRadius: "0.75rem", border: "none",
              background: activeTab === t.id ? "linear-gradient(90deg,#6366f1,#4f46e5)" : "transparent",
              color: activeTab === t.id ? "#fff" : "rgba(255,255,255,0.45)",
              fontWeight: 700, fontSize: "0.88rem", cursor: "pointer",
              boxShadow: activeTab === t.id ? "0 2px 12px rgba(99,102,241,0.4)" : "none",
              transition: "all 0.2s",
              display: "flex", alignItems: "center", gap: "0.4rem",
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "wages"    && <WagesTab onLowIncome={setLowIncome} />}
        {activeTab === "find"     && <FindWorkTab />}
        {activeTab === "parttime" && <PartTimeTab />}
        {activeTab === "apply"    && <ApplyTab />}
      </div>
    </div>
  );
}
