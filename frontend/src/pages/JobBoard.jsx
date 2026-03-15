import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { t, LANG_OPTIONS } from "../i18n/jobLang";
import { getToken } from "../api/api";

const API = process.env.REACT_APP_API_BASE || "http://localhost:8084/api";

const CATEGORIES = ["all","construction","delivery","textile","hospitality","it","security","domestic","manufacturing","other"];
const CAT_ICONS  = { all:"🌐", construction:"🏗️", delivery:"🛵", textile:"🧵", hospitality:"🏨", it:"💻", security:"🛡️", domestic:"🏠", manufacturing:"⚙️", other:"✨" };
const CAT_COLORS = { construction:"#f59e0b", delivery:"#10b981", textile:"#ec4899", hospitality:"#6366f1", it:"#06b6d4", security:"#ef4444", domestic:"#8b5cf6", manufacturing:"#f97316", other:"#94a3b8" };

const CITIES = ["All Cities","Mumbai","Pune","Surat","Delhi","Bangalore","Chennai","Hyderabad","Ahmedabad","Kolkata","Jaipur","Lucknow","Nagpur"];

const glass = (extra={}) => ({
  background:"rgba(255,255,255,0.05)",
  backdropFilter:"blur(20px)",
  border:"1px solid rgba(255,255,255,0.1)",
  borderRadius:"1.25rem",
  ...extra,
});

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job, lang, onToggle, onDelete, isOwner }) {
  const color = CAT_COLORS[job.category] || "#6366f1";
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card-3d animate-cardEntry" style={{
      ...glass(),
      padding:"1.25rem",
      border: job.featured ? `1.5px solid ${color}88` : `1px solid ${color}33`,
      position:"relative", overflow:"hidden",
      transition:"all 0.2s",
    }}>
      {/* Featured / Live badge */}
      <div style={{ position:"absolute", top:12, right:12, display:"flex", gap:"0.4rem" }}>
        {job.featured && (
          <span style={{ background:"linear-gradient(90deg,#f59e0b,#d97706)", borderRadius:"999px", padding:"0.15rem 0.6rem", fontSize:"0.7rem", fontWeight:700, color:"#fff" }}>⭐ {t(lang,"featured")}</span>
        )}
        <span style={{ background: job.active ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.15)", border:`1px solid ${job.active?"rgba(16,185,129,0.5)":"rgba(239,68,68,0.4)"}`, borderRadius:"999px", padding:"0.15rem 0.6rem", fontSize:"0.7rem", fontWeight:700, color: job.active?"#10b981":"#ef4444", display:"flex", alignItems:"center", gap:"0.3rem" }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background: job.active?"#10b981":"#ef4444", animation: job.active?"liveBlink 1.2s ease-in-out infinite":"none" }} />
          {job.active ? t(lang,"liveNow") : "Inactive"}
        </span>
      </div>

      {/* Category + icon */}
      <div style={{ display:"flex", alignItems:"flex-start", gap:"0.875rem", marginBottom:"0.75rem" }}>
        <div style={{ width:44, height:44, borderRadius:"0.75rem", background:`${color}22`, border:`1px solid ${color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.4rem", flexShrink:0 }}>
          {CAT_ICONS[job.category] || "💼"}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ color:"#fff", fontWeight:800, fontSize:"1rem", lineHeight:1.2, paddingRight:"5rem" }}>{job.title}</div>
          <div style={{ color:"rgba(255,255,255,0.5)", fontSize:"0.82rem", marginTop:2 }}>{job.company}</div>
          <div style={{ display:"flex", gap:"0.4rem", marginTop:"0.4rem", flexWrap:"wrap" }}>
            <span style={{ background:`${color}18`, border:`1px solid ${color}33`, borderRadius:"999px", padding:"0.15rem 0.5rem", fontSize:"0.7rem", color:color, fontWeight:600 }}>{job.category}</span>
            <span style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"999px", padding:"0.15rem 0.5rem", fontSize:"0.7rem", color:"rgba(255,255,255,0.55)" }}>📍 {job.city}{job.state ? `, ${job.state}` : ""}</span>
            {job.type && <span style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"999px", padding:"0.15rem 0.5rem", fontSize:"0.7rem", color:"rgba(255,255,255,0.55)" }}>{job.type}</span>}
          </div>
        </div>
      </div>

      {/* Pay + hours */}
      <div style={{ display:"flex", gap:"1.5rem", marginBottom:"0.75rem" }}>
        <div><div style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.72rem" }}>{t(lang,"pay")}</div><div style={{ color:"#10b981", fontWeight:800, fontSize:"0.95rem" }}>{job.pay}</div></div>
        {job.hours && <div><div style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.72rem" }}>{t(lang,"hours")}</div><div style={{ color:"#fff", fontWeight:600, fontSize:"0.88rem" }}>{job.hours}</div></div>}
        {job.experience && <div><div style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.72rem" }}>{t(lang,"experience")}</div><div style={{ color:"#f59e0b", fontWeight:600, fontSize:"0.88rem" }}>{job.experience}</div></div>}
      </div>

      {/* Description (expandable) */}
      {job.description && (
        <div style={{ color:"rgba(255,255,255,0.45)", fontSize:"0.82rem", lineHeight:1.5, marginBottom:"0.75rem" }}>
          {expanded ? job.description : job.description.slice(0,100) + (job.description.length > 100 ? "..." : "")}
          {job.description.length > 100 && (
            <button onClick={() => setExpanded(!expanded)} style={{ background:"none", border:"none", color:"#a5b4fc", cursor:"pointer", fontSize:"0.8rem", paddingLeft:"0.3rem" }}>
              {expanded ? "less" : "more"}
            </button>
          )}
        </div>
      )}

      {/* Skills */}
      {job.skills?.length > 0 && (
        <div style={{ display:"flex", gap:"0.3rem", flexWrap:"wrap", marginBottom:"0.75rem" }}>
          {job.skills.map(s => <span key={s} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"999px", padding:"0.1rem 0.5rem", fontSize:"0.7rem", color:"rgba(255,255,255,0.45)" }}>{s}</span>)}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap" }}>
        {job.contactWhatsapp && (
          <button onClick={() => window.open(`https://wa.me/${job.contactWhatsapp}?text=Hi, I want to apply for ${job.title} at ${job.company}`, "_blank")} style={{ flex:1, background:"linear-gradient(90deg,#25d366,#128c7e)", border:"none", borderRadius:"0.625rem", padding:"0.55rem 0.75rem", color:"#fff", fontWeight:700, fontSize:"0.82rem", cursor:"pointer", minWidth:120 }}>
            💬 {t(lang,"applyWhatsApp")}
          </button>
        )}
        {job.contactPhone && (
          <button onClick={() => window.open(`tel:${job.contactPhone}`, "_blank")} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:"0.625rem", padding:"0.55rem 0.75rem", color:"rgba(255,255,255,0.7)", fontWeight:700, fontSize:"0.82rem", cursor:"pointer" }}>
            📞 {t(lang,"callNow")}
          </button>
        )}
        <button onClick={() => {
          const url = window.location.href.split("?")[0] + `?job=${job.id}`;
          if (navigator.share) navigator.share({ title: job.title, url });
          else { navigator.clipboard.writeText(url); alert("Link copied!"); }
        }} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"0.625rem", padding:"0.55rem 0.6rem", color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:"0.82rem" }}>
          🔗 {t(lang,"shareJob")}
        </button>
      </div>

      {/* Owner controls */}
      {isOwner && (
        <div style={{ display:"flex", gap:"0.4rem", marginTop:"0.75rem", paddingTop:"0.75rem", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={() => onToggle(job.id)} style={{ flex:1, background: job.active ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)", border:`1px solid ${job.active?"rgba(239,68,68,0.4)":"rgba(16,185,129,0.4)"}`, borderRadius:"0.625rem", padding:"0.4rem", color: job.active?"#ef4444":"#10b981", fontWeight:700, fontSize:"0.78rem", cursor:"pointer" }}>
            {job.active ? `⏸ ${t(lang,"deactivate")}` : `▶ ${t(lang,"activate")}`}
          </button>
          <button onClick={() => onDelete(job.id)} style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:"0.625rem", padding:"0.4rem 0.75rem", color:"#ef4444", fontWeight:700, fontSize:"0.78rem", cursor:"pointer" }}>
            🗑
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Post Job Form ─────────────────────────────────────────────────────────────
function PostJobForm({ lang, onPosted }) {
  const [form, setForm] = useState({
    title:"", company:"", city:"", state:"", category:"construction",
    type:"full-time", pay:"", hours:"", description:"", contactPhone:"",
    contactEmail:"", contactWhatsapp:"", skills:"", experience:"", language: lang,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const validate = () => {
    const e = {};
    if (!form.title.trim())    e.title    = "Required";
    if (!form.company.trim())  e.company  = "Required";
    if (!form.city.trim())     e.city     = "Required";
    if (!form.pay.trim())      e.pay      = "Required";
    if (!form.description.trim()) e.description = "Required";
    if (!form.contactPhone.trim()) e.contactPhone = "Required";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const payload = {
        ...form,
        skills: form.skills ? form.skills.split(",").map(s=>s.trim()).filter(Boolean) : [],
      };
      const token = getToken();
      const res = await fetch(`${API}/jobs`, {
        method:"POST",
        headers:{ "Content-Type":"application/json", ...(token?{Authorization:`Bearer ${token}`}:{}) },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      setDone(true);
      onPosted();
    } catch(err) {
      setErrors({ _: err.message || "Failed to post job. Please try again." });
    } finally { setLoading(false); }
  };

  if (done) return (
    <div className="animate-slideUp" style={{ textAlign:"center", padding:"3rem 2rem" }}>
      <div style={{ ...glass({ border:"1.5px solid rgba(16,185,129,0.5)", background:"rgba(16,185,129,0.06)" }), padding:"2.5rem", maxWidth:480, margin:"0 auto" }}>
        <div style={{ fontSize:"4rem", animation:"waveFloat 3s ease-in-out infinite", marginBottom:"1rem" }}>🎉</div>
        <div style={{ fontSize:"1.5rem", fontWeight:800, color:"#10b981", marginBottom:"0.5rem" }}>{t(lang,"success")}</div>
        <p style={{ color:"rgba(255,255,255,0.55)", lineHeight:1.6 }}>{t(lang,"successSub")}</p>
        <div style={{ marginTop:"1.5rem", display:"flex", gap:"0.75rem", justifyContent:"center", flexWrap:"wrap" }}>
          <button onClick={() => { setDone(false); setForm({title:"",company:"",city:"",state:"",category:"construction",type:"full-time",pay:"",hours:"",description:"",contactPhone:"",contactEmail:"",contactWhatsapp:"",skills:"",experience:"",language:lang}); }} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:"0.75rem", padding:"0.6rem 1.25rem", color:"rgba(255,255,255,0.7)", cursor:"pointer", fontWeight:600 }}>Post Another Job</button>
        </div>
      </div>
    </div>
  );

  const inp = (label, key, type="text", placeholder="", required=false) => (
    <div>
      <label style={{ color:"rgba(255,255,255,0.55)", fontSize:"0.83rem", display:"block", marginBottom:"0.35rem" }}>{label}</label>
      <input type={type} placeholder={placeholder} value={form[key]}
        onChange={e=>{ set(key, e.target.value); setErrors(er=>({...er,[key]:""})); }}
        style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:`1px solid ${errors[key]?"#ef4444":"rgba(255,255,255,0.12)"}`, borderRadius:"0.75rem", padding:"0.65rem 1rem", color:"#fff", fontSize:"0.92rem", outline:"none", boxSizing:"border-box" }}
      />
      {errors[key] && <div style={{ color:"#ef4444", fontSize:"0.75rem", marginTop:"0.2rem" }}>{errors[key]}</div>}
    </div>
  );

  const sel = (label, key, options) => (
    <div>
      <label style={{ color:"rgba(255,255,255,0.55)", fontSize:"0.83rem", display:"block", marginBottom:"0.35rem" }}>{label}</label>
      <select value={form[key]} onChange={e=>set(key,e.target.value)} style={{ width:"100%", background:"#1a1535", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"0.75rem", padding:"0.65rem 1rem", color:"#fff", fontSize:"0.92rem" }}>
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );

  return (
    <div className="animate-slideUp" style={{ maxWidth:700, margin:"0 auto" }}>
      {/* Hero header */}
      <div style={{ ...glass({ background:"linear-gradient(135deg,rgba(99,102,241,0.15),rgba(16,185,129,0.08))", border:"1.5px solid rgba(99,102,241,0.3)" }), padding:"2rem", marginBottom:"1.5rem", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#6366f1,#10b981,#f59e0b)", animation:"gradientFlow 4s ease-in-out infinite" }} />
        <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
          <div style={{ fontSize:"2.5rem", animation:"waveFloat 3s ease-in-out infinite" }}>📢</div>
          <div>
            <div style={{ fontSize:"1.4rem", fontWeight:900, color:"#fff" }}>{t(lang,"postTitle")}</div>
            <div style={{ color:"rgba(255,255,255,0.5)", fontSize:"0.88rem" }}>{t(lang,"postSubtitle")}</div>
            <div style={{ display:"flex", gap:"0.5rem", marginTop:"0.5rem", flexWrap:"wrap" }}>
              {["✅ Free to Post","⚡ Goes Live Instantly","🌍 Pan-India Reach","📱 WhatsApp Apply"].map(b=>(
                <span key={b} style={{ fontSize:"0.72rem", padding:"0.2rem 0.6rem", borderRadius:"999px", background:"rgba(99,102,241,0.15)", border:"1px solid rgba(99,102,241,0.3)", color:"#a5b4fc" }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...glass(), padding:"2rem" }}>
        {errors._ && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.4)", borderRadius:"0.75rem", padding:"0.75rem 1rem", color:"#ef4444", marginBottom:"1rem", fontSize:"0.88rem" }}>{errors._}</div>}

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))", gap:"1rem" }}>
          {inp(t(lang,"jobTitle"),     "title",   "text", "e.g. Construction Helper")}
          {inp(t(lang,"company"),      "company", "text", "Company or your name")}
          <div>
            <label style={{ color:"rgba(255,255,255,0.55)", fontSize:"0.83rem", display:"block", marginBottom:"0.35rem" }}>{t(lang,"city")} *</label>
            <select value={form.city} onChange={e=>{set("city",e.target.value);setErrors(er=>({...er,city:""}));}} style={{ width:"100%", background:"#1a1535", border:`1px solid ${errors.city?"#ef4444":"rgba(255,255,255,0.12)"}`, borderRadius:"0.75rem", padding:"0.65rem 1rem", color:form.city?"#fff":"rgba(255,255,255,0.35)", fontSize:"0.92rem" }}>
              <option value="">Select city</option>
              {CITIES.slice(1).map(c=><option key={c} value={c}>{c}</option>)}
            </select>
            {errors.city && <div style={{ color:"#ef4444", fontSize:"0.75rem", marginTop:"0.2rem" }}>{errors.city}</div>}
          </div>
          {inp(t(lang,"state"),        "state",   "text", "e.g. Maharashtra")}
          {inp(t(lang,"payLabel"),     "pay",     "text", "e.g. ₹600/day or ₹15,000/mo")}
          {inp(t(lang,"hoursLabel"),   "hours",   "text", "e.g. 8 hrs/day, 6 days/week")}
          {sel(t(lang,"categoryLabel"),"category",[
            {v:"construction",l:"🏗️ Construction"},{v:"delivery",l:"🛵 Delivery"},{v:"textile",l:"🧵 Textile"},
            {v:"hospitality",l:"🏨 Hospitality"},{v:"it",l:"💻 IT Support"},{v:"security",l:"🛡️ Security"},
            {v:"domestic",l:"🏠 Domestic"},{v:"manufacturing",l:"⚙️ Manufacturing"},{v:"other",l:"✨ Other"},
          ])}
          {sel(t(lang,"typeLabel"),"type",[
            {v:"full-time",l:"Full-time"},{v:"part-time",l:"Part-time"},{v:"gig",l:"Gig / Daily"},
            {v:"contract",l:"Contract"},{v:"seasonal",l:"Seasonal"},
          ])}
          {inp(t(lang,"expLabel"),     "experience","text","e.g. 0-2 years / Freshers welcome")}
          {inp(t(lang,"skillsLabel"),  "skills",  "text", "e.g. Welding, Forklift, English")}
        </div>

        {/* Description full width */}
        <div style={{ marginTop:"1rem" }}>
          <label style={{ color:"rgba(255,255,255,0.55)", fontSize:"0.83rem", display:"block", marginBottom:"0.35rem" }}>{t(lang,"descLabel")}</label>
          <textarea value={form.description} onChange={e=>{set("description",e.target.value);setErrors(er=>({...er,description:""}));}} rows={4}
            placeholder="Describe the job role, responsibilities, requirements, location details..."
            style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:`1px solid ${errors.description?"#ef4444":"rgba(255,255,255,0.12)"}`, borderRadius:"0.75rem", padding:"0.65rem 1rem", color:"#fff", fontSize:"0.9rem", outline:"none", resize:"vertical", boxSizing:"border-box" }}
          />
          {errors.description && <div style={{ color:"#ef4444", fontSize:"0.75rem", marginTop:"0.2rem" }}>{errors.description}</div>}
        </div>

        {/* Contact */}
        <div style={{ marginTop:"1rem", padding:"1.25rem", ...glass({ borderRadius:"0.875rem", background:"rgba(16,185,129,0.04)", border:"1px solid rgba(16,185,129,0.2)" }) }}>
          <div style={{ color:"#10b981", fontWeight:700, marginBottom:"0.875rem", fontSize:"0.9rem" }}>📞 Contact Details (workers will reach you here)</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"0.875rem" }}>
            {inp(t(lang,"phoneLabel"),    "contactPhone",   "tel",   "10-digit number")}
            {inp(t(lang,"whatsappLabel"), "contactWhatsapp","tel",   "WhatsApp number (with country code)")}
            {inp(t(lang,"emailLabel"),    "contactEmail",   "email", "contact@company.com")}
          </div>
        </div>

        <button onClick={submit} disabled={loading} style={{
          marginTop:"1.5rem", width:"100%",
          background: loading ? "rgba(255,255,255,0.08)" : "linear-gradient(90deg,#6366f1,#4f46e5)",
          border:"none", borderRadius:"0.875rem", padding:"1rem",
          color:"#fff", fontWeight:800, fontSize:"1.05rem", cursor: loading ? "wait" : "pointer",
          boxShadow: loading ? "none" : "0 4px 24px rgba(99,102,241,0.5)",
          transition:"all 0.2s",
          display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem",
        }}>
          {loading ? <><span style={{ animation:"rotateSlow 1s linear infinite", display:"inline-block" }}>⚙️</span> Posting...</> : t(lang,"submit")}
        </button>
      </div>
    </div>
  );
}

// ─── MAIN JOB BOARD ──────────────────────────────────────────────────────────
export default function JobBoard() {
  const navigate = useNavigate();
  const [lang, setLang]          = useState(() => localStorage.getItem("aps_lang") || "en");
  const [view, setView]          = useState("find"); // "find" | "post" | "my"
  const [jobs, setJobs]          = useState([]);
  const [loading, setLoading]    = useState(true);
  const [search, setSearch]      = useState("");
  const [cityFilter, setCityFilter]  = useState("All Cities");
  const [catFilter, setCatFilter]    = useState("all");
  const token                    = getToken();

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      let url = `${API}/jobs`;
      if (cityFilter !== "All Cities") url += `?city=${encodeURIComponent(cityFilter)}`;
      else if (catFilter !== "all")    url += `?category=${encodeURIComponent(catFilter)}`;
      const res = await fetch(url);
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch {
      setJobs([]);
    } finally { setLoading(false); }
  }, [cityFilter, catFilter]);

  useEffect(() => { if (view === "find") fetchJobs(); }, [view, fetchJobs]);

  const fetchMyJobs = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/jobs/my`, { headers:{ Authorization:`Bearer ${token}` } });
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch { setJobs([]); } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { if (view === "my") fetchMyJobs(); }, [view, fetchMyJobs]);

  const handleToggle = async (id) => {
    try {
      await fetch(`${API}/jobs/${id}/toggle`, { method:"PATCH", headers:{ Authorization:`Bearer ${token}` } });
      view === "my" ? fetchMyJobs() : fetchJobs();
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await fetch(`${API}/jobs/${id}`, { method:"DELETE", headers:{ Authorization:`Bearer ${token}` } });
      view === "my" ? fetchMyJobs() : fetchJobs();
    } catch {}
  };

  const filtered = jobs.filter(j => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return j.title?.toLowerCase().includes(q) || j.company?.toLowerCase().includes(q) || j.city?.toLowerCase().includes(q) || j.description?.toLowerCase().includes(q);
  });

  return (
    <div style={{ background:"linear-gradient(135deg,#050310 0%,#0d1117 40%,#091022 100%)", minHeight:"100vh" }}>
      {/* Ambient */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
        <div style={{ position:"absolute", width:600, height:600, background:"radial-gradient(circle,rgba(16,185,129,0.1) 0%,transparent 70%)", borderRadius:"50%", top:"-15%", right:"-10%", animation:"blobMorph 12s ease-in-out infinite" }} />
        <div style={{ position:"absolute", width:500, height:500, background:"radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)", borderRadius:"50%", bottom:"5%", left:"-5%", animation:"blobMorph 16s ease-in-out infinite reverse" }} />
      </div>

      <div style={{ position:"relative", zIndex:1 }}>
        {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
        <nav style={{ background:"rgba(0,0,0,0.5)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"0 1.5rem", position:"sticky", top:0, zIndex:100 }}>
          <div style={{ maxWidth:1200, margin:"0 auto", height:64, display:"flex", alignItems:"center", gap:"1rem" }}>
            <button onClick={() => navigate("/")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:"0.5rem", color:"rgba(255,255,255,0.5)", fontSize:"0.85rem", padding:"0.3rem 0" }}>
              ← Home
            </button>
            <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
              <span style={{ fontSize:"1.4rem" }}>💼</span>
              <span style={{ fontWeight:900, color:"#fff", fontSize:"1.15rem" }}>WorkIndia</span>
              <span style={{ display:"flex", alignItems:"center", gap:"0.3rem", background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.4)", borderRadius:"999px", padding:"0.15rem 0.6rem", fontSize:"0.72rem", fontWeight:700, color:"#10b981" }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#10b981", animation:"liveBlink 1.2s ease-in-out infinite" }} /> LIVE
              </span>
            </div>

            <div style={{ flex:1, display:"flex", justifyContent:"center", gap:"0.25rem" }}>
              {[{id:"find",label:`🔍 ${t(lang,"findJob")}`},{id:"post",label:`📢 ${t(lang,"postJob")}`,auth:true},{id:"my",label:`📋 ${t(lang,"myJobs")}`,auth:true}].map(tab => (
                (!tab.auth || token) && (
                  <button key={tab.id} onClick={()=>setView(tab.id)} style={{ padding:"0.45rem 1rem", borderRadius:"0.625rem", border:"none", background: view===tab.id ? "linear-gradient(90deg,#10b981,#059669)" : "transparent", color: view===tab.id ? "#fff" : "rgba(255,255,255,0.45)", fontWeight:700, fontSize:"0.83rem", cursor:"pointer", transition:"all 0.2s" }}>
                    {tab.label}
                  </button>
                )
              ))}
            </div>

            {/* Language selector */}
            <select value={lang} onChange={e=>{setLang(e.target.value);localStorage.setItem("aps_lang",e.target.value);}} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"0.625rem", padding:"0.35rem 0.75rem", color:"#fff", fontSize:"0.82rem", cursor:"pointer" }}>
              {LANG_OPTIONS.map(l=><option key={l.code} value={l.code}>{l.label}</option>)}
            </select>

            {!token && (
              <button onClick={()=>navigate("/login")} style={{ background:"linear-gradient(90deg,#6366f1,#4f46e5)", border:"none", borderRadius:"0.75rem", padding:"0.5rem 1.1rem", color:"#fff", fontWeight:700, fontSize:"0.85rem", cursor:"pointer" }}>
                Login to Post
              </button>
            )}
          </div>
        </nav>

        <div style={{ maxWidth:1200, margin:"0 auto", padding:"1.5rem" }}>
          {/* ── HERO (find view only) ──────────────────────────────────────── */}
          {view === "find" && (
            <div className="animate-slideUp" style={{ textAlign:"center", padding:"2.5rem 1rem", marginBottom:"1.5rem" }}>
              <div style={{ fontSize:"1rem", color:"#10b981", fontWeight:700, letterSpacing:"0.12em", marginBottom:"0.5rem" }}>💼 WORKINDIA JOB BOARD</div>
              <h1 style={{ fontSize:"clamp(1.6rem,4vw,2.5rem)", fontWeight:900, color:"#fff", lineHeight:1.2, marginBottom:"0.75rem" }}>
                Find Real Jobs.<br />
                <span style={{ background:"linear-gradient(90deg,#10b981,#6366f1,#f59e0b)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", animation:"gradientText 4s ease-in-out infinite" }}>
                  Earn Better. Live Better.
                </span>
              </h1>
              <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"1rem", marginBottom:"1.5rem" }}>{t(lang,"tagline")}</p>

              {/* Search bar */}
              <div style={{ maxWidth:600, margin:"0 auto", position:"relative" }}>
                <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", fontSize:"1.1rem" }}>🔍</span>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t(lang,"searchPlaceholder")}
                  style={{ width:"100%", background:"rgba(255,255,255,0.08)", border:"1.5px solid rgba(255,255,255,0.15)", borderRadius:"999px", padding:"0.875rem 1rem 0.875rem 3rem", color:"#fff", fontSize:"1rem", outline:"none", boxSizing:"border-box", backdropFilter:"blur(12px)" }}
                />
              </div>
            </div>
          )}

          {/* ── FILTERS (find view) ────────────────────────────────────────── */}
          {view === "find" && (
            <div style={{ display:"flex", gap:"1rem", marginBottom:"1.5rem", flexWrap:"wrap" }}>
              <div style={{ flex:1, minWidth:180 }}>
                <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.78rem", marginBottom:"0.35rem" }}>{t(lang,"filterCity")}</div>
                <select value={cityFilter} onChange={e=>{setCityFilter(e.target.value);setCatFilter("all");}} style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"0.75rem", padding:"0.6rem 0.875rem", color:"#fff", fontSize:"0.88rem" }}>
                  {CITIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ flex:1, minWidth:180 }}>
                <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.78rem", marginBottom:"0.35rem" }}>{t(lang,"filterCategory")}</div>
                <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap" }}>
                  {CATEGORIES.map(c=>(
                    <button key={c} onClick={()=>{setCatFilter(c);setCityFilter("All Cities");}} style={{ padding:"0.35rem 0.75rem", borderRadius:"999px", border:"none", background: catFilter===c ? `${CAT_COLORS[c]||"#6366f1"}` : "rgba(255,255,255,0.06)", color: catFilter===c ? "#fff" : "rgba(255,255,255,0.5)", fontWeight:600, fontSize:"0.78rem", cursor:"pointer", transition:"all 0.2s" }}>
                      {CAT_ICONS[c]} {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── VIEWS ─────────────────────────────────────────────────────── */}
          {view === "post" && <PostJobForm lang={lang} onPosted={() => { setView("find"); fetchJobs(); }} />}

          {(view === "find" || view === "my") && (
            <>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1rem", flexWrap:"wrap", gap:"0.5rem" }}>
                <div style={{ color:"rgba(255,255,255,0.45)", fontSize:"0.85rem" }}>
                  {loading ? "Loading..." : `${filtered.length} ${filtered.length===1?"job":"jobs"} found`}
                </div>
                <button onClick={view==="my"?fetchMyJobs:fetchJobs} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"0.75rem", padding:"0.35rem 0.875rem", color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:"0.82rem" }}>
                  ↻ Refresh
                </button>
              </div>

              {loading ? (
                <div style={{ textAlign:"center", padding:"4rem", color:"rgba(255,255,255,0.3)" }}>
                  <div style={{ fontSize:"2.5rem", animation:"rotateSlow 1.5s linear infinite", display:"inline-block" }}>⚙️</div>
                  <div style={{ marginTop:"0.75rem" }}>Loading live jobs...</div>
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign:"center", padding:"4rem", color:"rgba(255,255,255,0.3)" }}>
                  <div style={{ fontSize:"3rem", marginBottom:"0.75rem" }}>🔍</div>
                  <div style={{ fontSize:"1.1rem" }}>{t(lang,"noJobs")}</div>
                  {view==="my" && token && <div style={{ marginTop:"1rem", fontSize:"0.85rem" }}>Post your first job to see it here!</div>}
                </div>
              ) : (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1rem" }}>
                  {filtered.map((job,i) => (
                    <JobCard key={job.id} job={job} lang={lang}
                      onToggle={handleToggle} onDelete={handleDelete}
                      isOwner={view==="my"}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.05)", padding:"1.5rem", textAlign:"center", color:"rgba(255,255,255,0.25)", fontSize:"0.8rem", marginTop:"3rem" }}>
          WorkIndia Job Board — Part of APS AI Financial Platform · Jobs stay live until admin deactivates
        </div>
      </div>
    </div>
  );
}
