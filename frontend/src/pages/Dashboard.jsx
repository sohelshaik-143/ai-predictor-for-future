import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getIncome, addIncome, logoutUser, getPrediction } from "../api/api";
import { logVisit, pushLog, addTime, getStats, fmtTime } from "../utils/tracker";
import T, { LANGUAGES } from "../i18n/translations";
import ChatBot from "../components/ChatBot";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, RadialLinearScale,
  Title, Tooltip, Legend, Filler,
} from "chart.js";
import { Bar, Line, Doughnut, Radar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, RadialLinearScale,
  Title, Tooltip, Legend, Filler
);

/* ─── Helpers ─────────────────────────────────── */
const inr = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

const compound = (monthly, annualRate, months) => {
  if (!monthly || monthly <= 0) return Array(months).fill(0);
  const r = annualRate / 12 / 100;
  return Array.from({ length: months }, (_, i) =>
    Math.round(monthly * ((Math.pow(1 + r, i + 1) - 1) / r) * (1 + r))
  );
};

const futureValue = (monthly, annualRate, years) => {
  if (!monthly || monthly <= 0) return 0;
  const r = annualRate / 12 / 100;
  const n = years * 12;
  return Math.round(monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r));
};

/* ─── Count-up hook ─────────────────────────────── */
const useCountUp = (target, duration = 900) => {
  const [val, setVal] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    if (!target || target <= 0) { setVal(0); return; }
    const start = Date.now();
    const from  = 0;
    const tick  = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(from + (target - from) * eased));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return val;
};

/* ─── Constants ────────────────────────────────── */
const ALLOCATION = [
  { name: "Mutual Funds (SIP)", pct: 30, color: "#6366f1", icon: "📊", rate: 12, risk: "Med",       returns: "12–15%", liquidity: "High",   minInvest: 500 },
  { name: "Emergency Fund (FD)", pct: 25, color: "#10b981", icon: "🏦", rate: 7,  risk: "Very Low",  returns: "6–7%",   liquidity: "High",   minInvest: 1000 },
  { name: "Gold / Bonds",        pct: 20, color: "#f59e0b", icon: "🪙", rate: 9,  risk: "Low",       returns: "8–10%",  liquidity: "Med",    minInvest: 500 },
  { name: "PPF / NPS",           pct: 15, color: "#3b82f6", icon: "🔐", rate: 7.5,risk: "Very Low",  returns: "7–8%",   liquidity: "Low",    minInvest: 500 },
  { name: "Stocks / ETF",        pct: 10, color: "#ef4444", icon: "📈", rate: 15, risk: "High",      returns: "15–20%", liquidity: "High",   minInvest: 100 },
];

const RADAR_ASSETS = [
  { label: "SIP",    color: "#6366f1", returns: 85, safety: 60, liquidity: 70, taxBenefit: 75, accessibility: 85 },
  { label: "FD",     color: "#10b981", returns: 40, safety: 95, liquidity: 85, taxBenefit: 55, accessibility: 90 },
  { label: "Gold",   color: "#f59e0b", returns: 60, safety: 75, liquidity: 60, taxBenefit: 40, accessibility: 70 },
  { label: "PPF",    color: "#3b82f6", returns: 50, safety: 95, liquidity: 20, taxBenefit: 95, accessibility: 65 },
  { label: "Stocks", color: "#ef4444", returns: 95, safety: 30, liquidity: 90, taxBenefit: 50, accessibility: 95 },
];

/* ─── NSE / BSE live market data ─────────── */
const NSE_STOCKS = [
  { symbol: "NIFTY 50",   open: 22420, color: "#6366f1", icon: "📊", type: "index",  sector: "Index"   },
  { symbol: "SENSEX",     open: 73750, color: "#f59e0b", icon: "📈", type: "index",  sector: "Index"   },
  { symbol: "BANK NIFTY", open: 48150, color: "#10b981", icon: "🏦", type: "index",  sector: "Banking" },
  { symbol: "RELIANCE",   open: 2840,  color: "#a78bfa", icon: "⚡", type: "stock",  sector: "Energy"  },
  { symbol: "TCS",        open: 3885,  color: "#06b6d4", icon: "💻", type: "stock",  sector: "IT"      },
  { symbol: "INFOSYS",    open: 1650,  color: "#f43f5e", icon: "🖥️", type: "stock",  sector: "IT"      },
  { symbol: "HDFC BANK",  open: 1594,  color: "#84cc16", icon: "🏦", type: "stock",  sector: "Banking" },
  { symbol: "ICICI BANK", open: 1085,  color: "#f97316", icon: "💳", type: "stock",  sector: "Banking" },
  { symbol: "WIPRO",      open: 485,   color: "#ec4899", icon: "🔧", type: "stock",  sector: "IT"      },
  { symbol: "SBI",        open: 810,   color: "#14b8a6", icon: "🏛️", type: "stock",  sector: "Banking" },
  { symbol: "BAJAJ FIN",  open: 6890,  color: "#fb923c", icon: "💰", type: "stock",  sector: "Finance" },
  { symbol: "ADANI ENT",  open: 2465,  color: "#a3e635", icon: "⚡", type: "stock",  sector: "Conglom" },
];

/* ─── Stock data hook (simulated real-time) ─ */
const useStockData = () => {
  const [stocks, setStocks] = useState(() =>
    NSE_STOCKS.map(s => {
      const noise = (Math.random() - 0.5) * s.open * 0.018;
      const price = +(s.open + noise).toFixed(2);
      return { ...s, price, prevPrice: price, change: +noise.toFixed(2), pct: +((noise / s.open) * 100).toFixed(2), history: [price] };
    })
  );
  useEffect(() => {
    const id = setInterval(() => {
      setStocks(prev => prev.map(s => {
        const delta = (Math.random() - 0.488) * s.price * 0.002;
        const newPrice = +Math.max(s.open * 0.85, s.price + delta).toFixed(2);
        const change = +(newPrice - s.open).toFixed(2);
        const pct = +((change / s.open) * 100).toFixed(2);
        return { ...s, prevPrice: s.price, price: newPrice, change, pct, history: [...(s.history || []).slice(-20), newPrice] };
      }));
    }, 2500);
    return () => clearInterval(id);
  }, []);
  return stocks;
};

/* ─── Tooltip default ──────────────────────────── */
const mkTooltip = (labelFn) => ({
  backgroundColor: "rgba(10,8,35,0.97)",
  titleColor: "#f59e0b",
  bodyColor: "#e5e7eb",
  borderColor: "rgba(245,158,11,0.3)",
  borderWidth: 1,
  padding: 12,
  callbacks: { label: labelFn || ((ctx) => ` ${inr(ctx.raw)}`) },
});

/* ─── Tick / Grid colours ────────────────────── */
const scales = (extra = {}) => ({
  x: { ticks: { color: "rgba(255,255,255,0.5)" }, grid: { color: "rgba(255,255,255,0.05)" }, ...extra.x },
  y: { ticks: { color: "rgba(255,255,255,0.5)" }, grid: { color: "rgba(255,255,255,0.05)" }, ...extra.y },
});

const legendWhite = { labels: { color: "#fff", font: { size: 11 } } };

/* ─── Glass style helper ─────────────────────── */
const glass = (opacity = "05", border = "rgba(255,255,255,0.10)") => ({
  background: `rgba(255,255,255,0.0${opacity})`,
  backdropFilter: "blur(22px)",
  border: `1px solid ${border}`,
  borderRadius: "1.5rem",
});

/* ═══════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════ */
export default function Dashboard() {
  const navigate = useNavigate();
  const [incomeData,   setIncomeData]   = useState([]);
  const [aiPrediction, setAiPrediction] = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [addLoading,   setAddLoading]   = useState(false);
  const [error,        setError]        = useState("");
  const [amount,       setAmount]       = useState("");
  const [inputError,   setInputError]   = useState("");
  const [justAdded,    setJustAdded]    = useState(false);
  const [listening,    setListening]    = useState(false);
  const [activeTab,    setActiveTab]    = useState("overview");
  const [lang,         setLang]         = useState(() => localStorage.getItem("aps_lang") || "en");
  const [celebration,  setCelebration]  = useState(false);
  const [coins,        setCoins]        = useState([]);
  const [animKey,      setAnimKey]      = useState(0);
  const [dismissWarn,  setDismissWarn]  = useState(false);
  const [activityStats, setActivityStats] = useState(() => getStats());
  const [sessionSecs,   setSessionSecs]   = useState(0);
  const addBtnRef = useRef(null);

  /* ── Live market data ─────────────────── */
  const stockData = useStockData();

  /* ── Profile avatar (read from localStorage) ── */
  const profileName  = localStorage.getItem("aps_name")    || "";
  const avatarColor  = localStorage.getItem("aps_avcolor") || "#6366f1";
  const profileInits = (profileName || "U").split(/[\s@.]+/).filter(Boolean).map(w => w[0]).join("").toUpperCase().slice(0, 2) || "U";

  const t = (key) => T[key]?.[lang] || T[key]?.en || key;
  const setLangPersist = (l) => { setLang(l); localStorage.setItem("aps_lang", l); };

  /* ── Load ─────────────────────────────────── */
  const load = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError("");
      const raw = await getIncome();
      // Backend returns {data:[...]} OR direct array — normalise both
      const list = Array.isArray(raw) ? raw
                 : Array.isArray(raw?.data) ? raw.data
                 : [];
      setIncomeData(list);
      try {
        const pred = await getPrediction();
        const predArr = Array.isArray(pred) ? pred
                      : Array.isArray(pred?.predicted_next_7d) ? pred.predicted_next_7d
                      : [];
        setAiPrediction(predArr);
      } catch { setAiPrediction([]); }
    } catch (err) {
      setError(err?.message || String(err) || "Failed to load data");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  /* ── Activity / time tracking ───────────────── */
  useEffect(() => {
    logVisit("AI Dashboard");
    const interval = setInterval(() => {
      addTime(1);
      setSessionSecs(s => s + 1);
    }, 1000);
    const sync = () => setActivityStats(getStats());
    window.addEventListener("storage", sync);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", sync);
    };
  }, []);

  /* ── Add income ───────────────────────────── */
  const handleAdd = async () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) { setInputError("Enter a valid positive amount."); return; }
    try {
      setAddLoading(true); setInputError("");
      await addIncome(val);
      pushLog("income", `Added income ₹${Math.round(val).toLocaleString("en-IN")}`);
      setActivityStats(getStats());
      setIncomeData((prev) => [...prev, { amount: val, date: new Date().toISOString().slice(0, 10), source: "manual" }]);
      setAmount("");
      setJustAdded(true);
      setAnimKey(k => k + 1);

      /* ── Spawn floating coin emojis ── */
      const rect = addBtnRef.current?.getBoundingClientRect();
      const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
      const cy = rect ? rect.top : window.innerHeight / 2;
      const newCoins = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: cx + (Math.random() - 0.5) * 120,
        y: cy,
        emoji: ["💰","₹","✨","🎉","💚","🤑","🪙","⭐"][i],
      }));
      setCoins(newCoins);
      setCelebration(true);
      setTimeout(() => { setCoins([]); setCelebration(false); }, 1400);
    } catch (err) {
      setInputError(err?.message || String(err) || "Failed to add income.");
    } finally { setAddLoading(false); }
  };

  /* ── Voice ────────────────────────────────── */
  const handleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setInputError("Voice not supported in this browser."); return; }
    const rec = new SR(); rec.lang = "en-US";
    rec.onstart  = () => setListening(true);
    rec.onend    = () => setListening(false);
    rec.onresult = (e) => {
      const n = parseFloat(e.results[0][0].transcript.replace(/[^0-9.]/g, ""));
      if (!isNaN(n)) setAmount(String(n));
      else setInputError("Could not detect a number.");
    };
    rec.start();
  };

  /* ── Core calculations ────────────────────── */
  const amounts       = useMemo(() => incomeData.map((d) => d.amount || 0), [incomeData]);
  const totalIncome   = useMemo(() => amounts.reduce((s, v) => s + v, 0), [amounts]);
  const avgDaily      = useMemo(() => amounts.length ? totalIncome / amounts.length : 0, [amounts, totalIncome]);
  const monthlyEst    = avgDaily * 26;
  const yearlyEst     = avgDaily * 312;
  const latestIncome  = amounts.length ? amounts[amounts.length - 1] : 0;
  const hasData       = amounts.length > 0;
  const lowIncome     = hasData && amounts.length >= 2 && latestIncome > 0 && latestIncome < avgDaily * 0.65;

  const growthRate = useMemo(() => {
    if (amounts.length < 2) return 0;
    const last = amounts[amounts.length - 1];
    const prev = amounts[amounts.length - 2];
    return prev ? +((last - prev) / prev * 100).toFixed(1) : 0;
  }, [amounts]);

  /* ── Derived financial metrics ────────────── */
  const monthlySavings   = monthlyEst * 0.30;            // assume 30% save
  const monthlyExpenses  = monthlyEst * 0.70;            // assume 70% spend

  /* ── Count-up animated values (must be after source vars are defined) ── */
  const animTotal   = useCountUp(totalIncome,    900);
  const animMonthly = useCountUp(monthlyEst,     900);
  const animYearly  = useCountUp(yearlyEst,      900);
  const animSavings = useCountUp(monthlySavings, 900);

  const savingsRate      = 30;                           // %
  const emergencyTarget  = monthlyExpenses * 6;
  const taxSavedEst      = monthlySavings * 12 * 0.15;   // ~15% tax saved on investments

  /* ── Financial health score (0–100) ─────── */
  const healthScore = useMemo(() => {
    let s = 40;
    if (amounts.length >= 3)     s += 10;
    if (amounts.length >= 7)     s += 10;
    if (growthRate > 0)          s += 15;
    if (growthRate > 5)          s += 5;
    if (avgDaily >= 1000)        s += 5;
    if (avgDaily >= 3000)        s += 5;
    if (avgDaily >= 7000)        s += 10;
    return Math.min(s, 100);
  }, [amounts, growthRate, avgDaily]);

  const healthLabel = healthScore >= 80 ? "Excellent" : healthScore >= 60 ? "Good" : healthScore >= 40 ? "Fair" : "Needs Work";
  const healthColor = healthScore >= 80 ? "#10b981" : healthScore >= 60 ? "#f59e0b" : healthScore >= 40 ? "#f97316" : "#ef4444";

  /* ── Income consistency score ─────────────── */
  const consistencyScore = useMemo(() => {
    if (amounts.length < 2) return 0;
    const mean = totalIncome / amounts.length;
    if (mean === 0) return 0; // guard divide-by-zero
    const variance = amounts.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / amounts.length;
    const cv = Math.sqrt(variance) / mean;  // coefficient of variation
    return Math.max(0, Math.round((1 - cv) * 100));
  }, [amounts, totalIncome]);

  /* ────────────────────────────────────────────
     CHART DATA
  ──────────────────────────────────────────── */
  const labels     = amounts.map((_, i) => `Day ${i + 1}`);
  const predLabels = aiPrediction.map((_, i) => `P${i + 1}`);

  /* 1. Income trend + AI prediction */
  const lineData = {
    labels: [...labels, ...predLabels],
    datasets: [
      {
        label: "Actual Income",
        data: [...amounts, ...new Array(aiPrediction.length).fill(null)],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.12)",
        fill: true, tension: 0.4,
        pointBackgroundColor: "#6366f1", pointRadius: 5, pointHoverRadius: 8,
      },
      {
        label: "AI Prediction",
        data: [...new Array(amounts.length).fill(null), ...aiPrediction],
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245,158,11,0.10)",
        fill: true, tension: 0.4,
        borderDash: [6, 4],
        pointBackgroundColor: "#f59e0b", pointRadius: 5, pointHoverRadius: 8,
      },
    ],
  };

  /* 2. Projections bar */
  const barData = {
    labels: ["Today", "Avg Daily", "Monthly Est.", "Yearly Est."],
    datasets: [{
      label: "Amount (₹)",
      data: [latestIncome, Math.round(avgDaily), Math.round(monthlyEst), Math.round(yearlyEst)],
      backgroundColor: ["rgba(99,102,241,0.8)","rgba(16,185,129,0.8)","rgba(245,158,11,0.8)","rgba(239,68,68,0.8)"],
      borderColor:     ["#6366f1","#10b981","#f59e0b","#ef4444"],
      borderWidth: 2, borderRadius: 10,
    }],
  };

  /* 3. Wealth accumulation — 12 months */
  const mo12 = Array.from({ length: 12 }, (_, i) => `M${i + 1}`);
  const wealthData = {
    labels: mo12,
    datasets: [
      { label: "SIP (12%)",  data: compound(monthlySavings * 0.30, 12, 12), borderColor: "#6366f1", backgroundColor: "rgba(99,102,241,0.08)",  fill: true, tension: 0.4, pointRadius: 3 },
      { label: "Gold (9%)",  data: compound(monthlySavings * 0.20, 9,  12), borderColor: "#f59e0b", backgroundColor: "rgba(245,158,11,0.07)",  fill: true, tension: 0.4, pointRadius: 3 },
      { label: "FD (7%)",    data: compound(monthlySavings * 0.25, 7,  12), borderColor: "#10b981", backgroundColor: "rgba(16,185,129,0.07)",  fill: true, tension: 0.4, pointRadius: 3 },
      { label: "PPF (7.5%)", data: compound(monthlySavings * 0.15, 7.5,12), borderColor: "#3b82f6", backgroundColor: "rgba(59,130,246,0.07)",  fill: true, tension: 0.4, pointRadius: 3 },
    ],
  };

  /* 4. Future value — 1 / 5 / 10 years */
  const returnsData = {
    labels: ["1 Year", "5 Years", "10 Years"],
    datasets: ALLOCATION.map((a) => ({
      label: `${a.icon} ${a.name}`,
      data: [1, 5, 10].map((y) => futureValue(monthlySavings * a.pct / 100, a.rate, y)),
      backgroundColor: a.color + "CC",
      borderColor: a.color,
      borderWidth: 2, borderRadius: 8,
    })),
  };

  /* 5. Doughnut — investment allocation */
  const doughnutData = {
    labels: ALLOCATION.map((a) => `${a.icon} ${a.name}`),
    datasets: [{
      data: ALLOCATION.map((a) => a.pct),
      backgroundColor: ALLOCATION.map((a) => a.color + "CC"),
      borderColor:     ALLOCATION.map((a) => a.color),
      borderWidth: 2, hoverOffset: 12,
    }],
  };

  /* 6. Doughnut — income vs savings */
  const budgetData = {
    labels: ["Expenses (70%)", "Savings (30%)"],
    datasets: [{
      data: [Math.round(monthlyExpenses), Math.round(monthlySavings)],
      backgroundColor: ["rgba(239,68,68,0.8)", "rgba(16,185,129,0.8)"],
      borderColor: ["#ef4444","#10b981"],
      borderWidth: 2, hoverOffset: 10,
    }],
  };

  /* 7. Radar — risk-return comparison */
  const radarData = {
    labels: ["Returns", "Safety", "Liquidity", "Tax Benefit", "Accessibility"],
    datasets: RADAR_ASSETS.map((a) => ({
      label: a.label,
      data: [a.returns, a.safety, a.liquidity, a.taxBenefit, a.accessibility],
      borderColor: a.color,
      backgroundColor: a.color + "22",
      pointBackgroundColor: a.color,
      borderWidth: 2,
    })),
  };

  /* 8. Income histogram — frequency distribution */
  const maxAmt = amounts.length ? Math.max(...amounts) : 1;
  const buckets = 5;
  const bucketSize = (maxAmt / buckets) || 1;
  const histLabels = Array.from({ length: buckets }, (_, i) =>
    `${inr(i * bucketSize)}–${inr((i + 1) * bucketSize)}`
  );
  const histCounts = Array.from({ length: buckets }, (_, i) => {
    const lo = i * bucketSize, hi = (i + 1) * bucketSize;
    // Last bucket uses <= to include the maximum value
    return amounts.filter((v) => i === buckets - 1 ? v >= lo && v <= hi : v >= lo && v < hi).length;
  });
  const histData = {
    labels: histLabels,
    datasets: [{
      label: "Frequency",
      data: histCounts,
      backgroundColor: "rgba(99,102,241,0.7)",
      borderColor: "#6366f1",
      borderWidth: 2, borderRadius: 8,
    }],
  };

  /* ── KPI cards — uses animated (count-up) values ── */
  const kpiCards = [
    { label: t("totalEarned"),      val: inr(animTotal),    raw: animTotal,    max: animTotal,    color: "#6366f1", icon: "💰", sub: `${incomeData.length} entries` },
    { label: t("avgDaily"),         val: inr(avgDaily),     raw: avgDaily,     max: avgDaily,     color: "#10b981", icon: "📅", sub: "per working day" },
    { label: t("monthlyEst"),       val: inr(animMonthly),  raw: animMonthly,  max: animMonthly,  color: "#f59e0b", icon: "📆", sub: "26 working days" },
    { label: t("yearlyEst"),        val: inr(animYearly),   raw: animYearly,   max: animYearly,   color: "#a78bfa", icon: "🗓️", sub: "312 working days" },
    { label: t("growthRate"),       val: `${growthRate > 0 ? "+" : ""}${growthRate}%`, raw: growthRate, max: 20, color: growthRate >= 0 ? "#10b981" : "#ef4444", icon: growthRate >= 0 ? "📈" : "📉", sub: "vs previous" },
    { label: t("savingsPotential"), val: inr(animSavings),  raw: animSavings,  max: animSavings,  color: "#f43f5e", icon: "🏦", sub: "30% of monthly" },
    { label: t("healthScore"),      val: `${healthScore}/100`, raw: healthScore, max: 100,        color: healthColor, icon: "❤️", sub: healthLabel },
    { label: t("consistency"),      val: `${consistencyScore}%`, raw: consistencyScore, max: 100, color: "#06b6d4", icon: "🎯", sub: "income stability" },
  ];

  /* ═══════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════ */
  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg,#0a0618 0%,#130f2e 40%,#080e1f 100%)", padding: "1.5rem 1rem" }}
    >
      {/* Ambient glow blobs — animated morph */}
      <div className="fixed top-[-150px] right-[-150px] w-[500px] h-[500px] pointer-events-none animate-blobMorph"
           style={{ background: "radial-gradient(circle,rgba(99,102,241,0.22),transparent)", filter: "blur(80px)" }} />
      <div className="fixed bottom-[-150px] left-[-100px] w-[500px] h-[500px] pointer-events-none animate-blobMorph"
           style={{ background: "radial-gradient(circle,rgba(245,158,11,0.15),transparent)", filter: "blur(80px)", animationDelay: "3s" }} />
      <div className="fixed top-[40%] left-[40%] w-96 h-96 pointer-events-none animate-blobMorph"
           style={{ background: "radial-gradient(circle,rgba(16,185,129,0.1),transparent)", filter: "blur(80px)", animationDelay: "6s" }} />

      {/* ══════════════════════════════════════
          LOW INCOME WARNING OVERLAY
      ══════════════════════════════════════ */}
      {lowIncome && !dismissWarn && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(12px)" }}>
          {/* pulsing red blob */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[600px] rounded-full animate-blobMorph" style={{ background: "radial-gradient(circle,rgba(239,68,68,0.18),transparent)", filter: "blur(80px)" }} />
          </div>
          <div className="relative max-w-lg w-full mx-4 p-8 rounded-3xl text-center animate-popIn"
               style={{ background: "linear-gradient(135deg,rgba(239,68,68,0.18),rgba(15,10,40,0.98))", border: "2px solid rgba(239,68,68,0.5)", boxShadow: "0 0 60px rgba(239,68,68,0.3)" }}>
            {/* animated warning icon */}
            <div className="animate-waveFloat inline-block text-7xl mb-4">⚠️</div>
            <div className="animate-gradientText text-3xl font-black mb-2" style={{ background: "linear-gradient(90deg,#ef4444,#f97316,#ef4444)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "gradientFlow 2s ease infinite" }}>
              Income Alert!
            </div>
            <p className="text-white/70 text-sm mb-6">Your latest entry is significantly below your average. Your future projections may be affected.</p>
            {/* comparison cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-2xl" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)" }}>
                <div className="text-red-400/60 text-xs font-bold mb-1">📉 TODAY EARNED</div>
                <div className="text-2xl font-black text-red-400">{inr(latestIncome)}</div>
              </div>
              <div className="p-4 rounded-2xl" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.35)" }}>
                <div className="text-green-400/60 text-xs font-bold mb-1">📊 YOUR AVERAGE</div>
                <div className="text-2xl font-black text-green-400">{inr(Math.round(avgDaily))}</div>
              </div>
            </div>
            {/* shortfall bar */}
            <div className="mb-5">
              <div className="flex justify-between text-xs text-white/50 mb-1.5">
                <span>Shortfall</span>
                <span className="text-red-400 font-bold">{inr(Math.round(avgDaily - latestIncome))} less than usual</span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div className="h-3 rounded-full animate-fillBar" style={{ width: `${Math.round((latestIncome / avgDaily) * 100)}%`, background: "linear-gradient(90deg,#ef4444,#f97316)" }} />
              </div>
              <div className="text-center text-xs text-red-400 mt-1 font-bold">
                {Math.round((latestIncome / avgDaily) * 100)}% of your usual daily income
              </div>
            </div>
            {/* tips */}
            <div className="text-left mb-5 p-4 rounded-2xl" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)" }}>
              <div className="text-yellow-400 font-bold text-xs mb-2">💡 What you can do:</div>
              {["Reduce expenses today to compensate", "Look for extra income sources this week", "Avoid big purchases until income recovers", "Focus on saving at least 10% of today's amount"].map((tip, i) => (
                <div key={i} className="text-white/60 text-xs flex items-start gap-2 mb-1">
                  <span className="text-yellow-400 mt-0.5">→</span>{tip}
                </div>
              ))}
            </div>
            <button onClick={() => setDismissWarn(true)}
              className="w-full py-3 rounded-2xl font-black text-white text-sm hover:scale-105 transition-all"
              style={{ background: "linear-gradient(90deg,#6366f1,#4f46e5)", boxShadow: "0 4px 20px rgba(99,102,241,0.4)" }}>
              I Understand — Show Dashboard ✓
            </button>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* ── HEADER ── */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
          <div>
            <button onClick={() => navigate("/my-dashboard")}
              className="mb-2 px-3 py-1.5 rounded-xl text-sm font-semibold hover:scale-105 transition-all"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.55)", cursor: "pointer" }}>
              ← My Dashboard
            </button>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-4xl font-extrabold tracking-tight animate-gradientText" style={{ margin: 0 }}>
                APS AI {lang === "en" ? "Dashboard" : t("dashboardTitle").replace("APS AI ", "")}
              </h1>
              {/* LIVE indicator */}
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                    style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)", color: "#34d399" }}>
                <span className="animate-liveBlink inline-block w-2 h-2 rounded-full bg-green-400" />
                LIVE
              </span>
            </div>
            <p className="text-white/40 text-sm mt-1">{t("dashboardSub")}</p>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            {/* Health badge */}
            {hasData && (
              <div className="px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                   style={{ background: healthColor + "20", border: `1px solid ${healthColor}50`, color: healthColor }}>
                ❤️ {healthLabel} · {healthScore}/100
              </div>
            )}
            {/* Language selector */}
            <div className="relative group">
              <button
                className="px-3 py-2.5 rounded-xl font-bold text-white text-sm flex items-center gap-1.5 hover:scale-105 transition-all"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                🌐 {LANGUAGES.find((l) => l.code === lang)?.native}
              </button>
              <div className="absolute right-0 top-12 rounded-2xl overflow-hidden shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-30"
                   style={{ background: "rgba(10,8,35,0.98)", border: "1px solid rgba(99,102,241,0.35)", minWidth: 150 }}>
                {LANGUAGES.map((l) => (
                  <button key={l.code} onClick={() => setLangPersist(l.code)}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-indigo-500/20 transition"
                    style={{ color: l.code === lang ? "#f59e0b" : "rgba(255,255,255,0.75)" }}>
                    {l.native} <span className="text-white/30 text-xs ml-1">{l.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => navigate("/financial-setup")}
              className="px-5 py-2.5 rounded-xl font-bold text-white text-sm hover:scale-105 transition-all"
              style={{ background: "linear-gradient(90deg,#6366f1,#4f46e5)", boxShadow: "0 4px 20px rgba(99,102,241,0.35)" }}
            >
              {t("fullPlan")}
            </button>
            {/* Profile avatar button */}
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-white text-sm hover:scale-105 transition-all"
              style={{ background: `${avatarColor}25`, border: `1px solid ${avatarColor}50` }}
              title="My Profile & Settings"
            >
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${avatarColor},${avatarColor}99)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 900, color: "#fff" }}>
                {profileInits}
              </div>
              <span style={{ color: avatarColor }}>Profile</span>
            </button>
            <button
              onClick={() => { logoutUser(); window.location.href = "/login"; }}
              className="px-5 py-2.5 rounded-xl font-bold text-white text-sm border border-red-500/40 hover:bg-red-500/20 transition-all"
            >
              {t("logout")}
            </button>
          </div>
        </div>

        {/* ══ LIVE STOCK MARKET TICKER ══ */}
        <div className="mb-2 overflow-hidden rounded-xl"
             style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(99,102,241,0.25)", height: 42, display: "flex", alignItems: "center", position: "relative" }}>
          {/* NSE label */}
          <div className="flex-shrink-0 px-3 h-full flex items-center gap-1.5 border-r border-white/10" style={{ background: "rgba(99,102,241,0.3)" }}>
            <span className="animate-liveBlink inline-block w-2 h-2 rounded-full bg-green-400" />
            <span className="text-white font-black text-xs tracking-widest">NSE/BSE</span>
          </div>
          <div className="animate-ticker overflow-hidden" style={{ display: "flex", whiteSpace: "nowrap", flex: 1 }}>
            {[...Array(2)].map((_, rep) => (
              <span key={rep} style={{ display: "inline-flex", alignItems: "center" }}>
                {stockData.map((s) => (
                  <span key={s.symbol + rep} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0 1.2rem", borderRight: "1px solid rgba(255,255,255,0.06)", fontSize: "0.73rem" }}>
                    <span>{s.icon}</span>
                    <span className="font-bold text-white/80">{s.symbol}</span>
                    <span style={{ color: s.pct >= 0 ? "#34d399" : "#f87171", fontWeight: 800 }}>
                      ₹{s.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </span>
                    <span style={{ color: s.pct >= 0 ? "#34d399" : "#f87171", fontSize: "0.68rem" }}>
                      {s.pct >= 0 ? "▲" : "▼"}{Math.abs(s.pct).toFixed(2)}%
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ── STATS TICKER BAR ── */}
        {hasData && (
          <div className="mb-6 overflow-hidden rounded-xl"
               style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", height: 36, display: "flex", alignItems: "center", position: "relative" }}>
            <div className="flex-shrink-0 px-3 h-full flex items-center border-r border-white/10" style={{ background: "rgba(16,185,129,0.2)" }}>
              <span className="text-green-400 font-black text-xs">MY STATS</span>
            </div>
            <div className="animate-scanLine" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.5),transparent)", pointerEvents: "none" }} />
            <div className="animate-ticker" style={{ display: "flex", whiteSpace: "nowrap", gap: 0 }}>
              {[...Array(2)].map((_, rep) => (
                <span key={rep} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                  {[
                    { icon: "💰", label: "Total Earned",   val: inr(totalIncome),   color: "#6366f1" },
                    { icon: "📆", label: "Monthly Est.",   val: inr(monthlyEst),    color: "#f59e0b" },
                    { icon: "🗓️", label: "Yearly Est.",    val: inr(yearlyEst),     color: "#a78bfa" },
                    { icon: "🏦", label: "Savings/mo",     val: inr(monthlySavings),color: "#10b981" },
                    { icon: "❤️", label: "Health",         val: `${healthScore}/100`, color: healthColor },
                    { icon: "🎯", label: "Consistency",    val: `${consistencyScore}%`, color: "#06b6d4" },
                    { icon: "📈", label: "Growth",         val: `${growthRate > 0 ? "+" : ""}${growthRate}%`, color: growthRate >= 0 ? "#10b981" : "#ef4444" },
                    { icon: "📊", label: "Entries",        val: incomeData.length,  color: "#f43f5e" },
                  ].map((item) => (
                    <span key={item.label} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0 1.4rem", borderRight: "1px solid rgba(255,255,255,0.07)", fontSize: "0.72rem" }}>
                      <span>{item.icon}</span>
                      <span style={{ color: "rgba(255,255,255,0.35)" }}>{item.label}:</span>
                      <span style={{ color: item.color, fontWeight: 700 }}>{item.val}</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── ERROR ── */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl text-red-300 text-sm font-medium"
               style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── FLOATING COINS (celebration) ── */}
        {coins.map((c) => (
          <div key={c.id} className="animate-floatCoin"
               style={{ position: "fixed", left: c.x, top: c.y, fontSize: "1.8rem", zIndex: 9999, pointerEvents: "none", userSelect: "none" }}>
            {c.emoji}
          </div>
        ))}

        {/* ── INCOME INPUT ── */}
        <div className={`mb-8 p-6 rounded-3xl transition-all duration-500 animate-slideUp ${celebration ? "animate-glowRing" : "animate-borderGlow"}`}
             style={{ ...glass("4", "rgba(255,255,255,0.1)"), border: celebration ? "1px solid rgba(16,185,129,0.6)" : "1px solid rgba(99,102,241,0.25)", position: "relative", overflow: "hidden" }}>
          {/* shimmer sweep overlay */}
          <div className="animate-shimmer pointer-events-none" style={{ position: "absolute", inset: 0, borderRadius: "1.5rem", zIndex: 0 }} />
          <div style={{ position: "relative", zIndex: 1 }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="animate-rotateSlow inline-block text-xl">💫</span>
            <h2 className="text-lg font-bold text-white">{t("addIncomeTitle")}</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold text-xl transition-all ${amount > 0 ? "text-green-400 scale-125" : "text-yellow-400"}`}
                    style={{ transform: `translateY(-50%) scale(${amount > 0 ? 1.2 : 1})` }}>₹</span>
              <input
                type="number" min="1" placeholder={t("amountPlaceholder")}
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setInputError(""); setJustAdded(false); }}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                className={`w-full pl-10 pr-4 py-3.5 rounded-xl text-white text-lg font-semibold placeholder-white/25 outline-none transition-all duration-300 ${inputError ? "animate-shake" : ""}`}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: inputError ? "2px solid #ef4444" : amount > 0 ? "2px solid rgba(16,185,129,0.7)" : "1px solid rgba(255,255,255,0.12)",
                  boxShadow: amount > 0 && !inputError ? "0 0 18px rgba(16,185,129,0.25)" : "none",
                }}
              />
              {amount > 0 && !inputError && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400 text-lg animate-popIn">✓</span>
              )}
            </div>
            <button ref={addBtnRef} onClick={handleAdd} disabled={addLoading}
              className={`px-8 py-3.5 rounded-xl font-bold text-white transition-all ${addLoading ? "opacity-60" : "hover:scale-105 active:scale-95"}`}
              style={{ background: "linear-gradient(90deg,#10b981,#059669)", boxShadow: "0 4px 18px rgba(16,185,129,0.45)", fontSize: "1rem" }}>
              {addLoading ? <span className="animate-pulse">⏳ {t("addingBtn")}</span> : <span>✅ {t("addBtn")}</span>}
            </button>
            <button onClick={handleVoice}
              className={`px-5 py-3.5 rounded-xl font-bold text-white transition-all ${listening ? "animate-pulse" : "hover:scale-105"}`}
              style={{ background: listening ? "rgba(239,68,68,0.7)" : "rgba(99,102,241,0.6)", border: "1px solid rgba(99,102,241,0.4)" }}>
              {listening ? `🎙️ ${t("listening")}` : `🎤 ${t("voiceBtn")}`}
            </button>
          </div>
          {inputError && (
            <div className="mt-3 p-3 rounded-xl text-red-400 text-sm font-semibold flex items-center gap-2 animate-slideUp"
                 style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}>
              ❌ {inputError}
            </div>
          )}
          {justAdded && (
            <div className="mt-3 p-4 rounded-xl text-green-400 font-bold text-center animate-popIn"
                 style={{ background: "linear-gradient(135deg,rgba(16,185,129,0.18),rgba(16,185,129,0.08))", border: "1px solid rgba(16,185,129,0.4)", fontSize: "1.05rem" }}>
              🎉 {t("incomeRecorded")} &nbsp;
              <span style={{ color: "#fff", fontWeight: 900 }}>{inr(incomeData[incomeData.length - 1]?.amount || 0)}</span>
              &nbsp; added!
            </div>
          )}
          </div>
        </div>

        {loading && (
          <div className="text-center text-white/50 text-sm py-10 animate-pulse">⏳ Loading your financial data…</div>
        )}

        {/* ═══════════════════════════════════
            FULL ANALYSIS (hasData)
        ═══════════════════════════════════ */}
        {hasData && !loading && (
          <>
            {/* ── INSTANT ANALYSIS BANNER ── */}
            <div className="mb-8 p-6 rounded-3xl animate-slideUp"
                 style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.18),rgba(245,158,11,0.12))", border: "1px solid rgba(245,158,11,0.3)", position: "relative", overflow: "hidden" }}>
              {/* animated top accent bar */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#6366f1,#f59e0b,#10b981,#ef4444)", backgroundSize: "300% auto", animation: "gradientFlow 3s ease infinite" }} />
              <div className="flex items-center gap-3 mb-1">
                <span className="animate-waveFloat inline-block text-2xl">⚡</span>
                <h3 className="text-yellow-400 font-bold text-xl">{t("instantAnalysis")} {inr(latestIncome)}</h3>
              </div>
              <p className="text-white/40 text-xs mb-4">All projections based on your latest income entry</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center mb-4">
                {[
                  { label: t("thisDay"),   val: inr(latestIncome),         color: "#6366f1" },
                  { label: t("thisWeek"),  val: inr(latestIncome * 6),   color: "#10b981" },
                  { label: t("thisMonth"), val: inr(latestIncome * 26),  color: "#f59e0b" },
                  { label: t("thisYear"),  val: inr(latestIncome * 312), color: "#ef4444" },
                ].map((r, i) => (
                  <div key={r.label} className="p-3 rounded-xl animate-popIn card-3d"
                       style={{ background: r.color + "18", border: `1px solid ${r.color}35`, animationDelay: `${i * 80}ms` }}>
                    <div className="text-xs text-white/50 font-semibold mb-1">{r.label}</div>
                    <div className="font-extrabold text-base" style={{ color: r.color }}>{r.val}</div>
                  </div>
                ))}
              </div>
              {/* Sub-metrics row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                {[
                  { label: "Save / Day (30%)",   val: inr(latestIncome * 0.30),       color: "#a78bfa" },
                  { label: "Save / Month",        val: inr(latestIncome * 26 * 0.30), color: "#06b6d4" },
                  { label: "Emergency Fund",      val: inr(emergencyTarget),           color: "#f43f5e" },
                  { label: "Est. Tax Saved / yr", val: inr(taxSavedEst),              color: "#84cc16" },
                ].map((r, i) => (
                  <div key={r.label} className="p-3 rounded-xl animate-popIn"
                       style={{ background: r.color + "14", border: `1px solid ${r.color}30`, animationDelay: `${320 + i * 80}ms` }}>
                    <div className="text-xs text-white/40 font-semibold mb-1">{r.label}</div>
                    <div className="font-bold text-sm" style={{ color: r.color }}>{r.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── 8 KPI CARDS ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {kpiCards.map((c, i) => (
                <div key={`${c.label}-${animKey}`}
                     className="p-5 rounded-2xl cursor-default animate-cardEntry card-3d"
                     style={{ ...glass("4"), border: `1px solid ${c.color}40`, animationDelay: `${i * 70}ms`, position: "relative", overflow: "hidden" }}>
                  {/* shimmer overlay on hover (CSS only) */}
                  <div className="animate-shimmer pointer-events-none" style={{ position: "absolute", inset: 0, borderRadius: "1rem", zIndex: 0, opacity: 0.6 }} />
                  {/* top accent bar per card color */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: c.color, opacity: 0.7, borderRadius: "1rem 1rem 0 0" }} />
                  <div style={{ position: "relative", zIndex: 1 }}>
                    {/* Icon with rotating ring */}
                    <div className="relative w-10 h-10 mb-3 flex items-center justify-center">
                      <div className="animate-rotateSlow absolute inset-0 rounded-full" style={{ border: `1.5px dashed ${c.color}55` }} />
                      <span className={`text-xl ${animKey > 0 ? "animate-bounceIcon" : ""}`}>{c.icon}</span>
                    </div>
                    <div className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">{c.label}</div>
                    {/* Animated value */}
                    <div className={`text-xl font-extrabold ${animKey > 0 ? "animate-counterPop" : ""}`}
                         style={{ color: c.color }}>{c.val}</div>
                    <div className="text-white/30 text-xs mt-1 mb-2">{c.sub}</div>
                    {/* Progress bar */}
                    {c.max > 0 && (
                      <div style={{ height: 4, borderRadius: 9999, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                        <div className="animate-fillBar" style={{
                          height: "100%", borderRadius: 9999,
                          background: `linear-gradient(90deg,${c.color},${c.color}99)`,
                          width: `${Math.min(100, c.raw > 0 ? 100 : 0)}%`,
                          boxShadow: `0 0 10px ${c.color}90`,
                        }} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ── TABS ── */}
            <div className="flex gap-2 mb-8 flex-wrap p-1.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", width: "fit-content" }}>
              {[
                { id: "overview",  label: t("tabOverview"), icon: "📊" },
                { id: "invest",    label: t("tabInvest"),   icon: "💹" },
                { id: "predict",   label: t("tabPredict"),  icon: "🤖" },
                { id: "activity",  label: "My Activity",    icon: "🕐" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 relative"
                  style={{
                    background: activeTab === tab.id ? "linear-gradient(90deg,#6366f1,#4f46e5)" : "transparent",
                    color: activeTab === tab.id ? "#fff" : "rgba(255,255,255,0.45)",
                    boxShadow: activeTab === tab.id ? "0 4px 18px rgba(99,102,241,0.45),0 0 0 1px rgba(99,102,241,0.3)" : "none",
                    transform: activeTab === tab.id ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  <span className="mr-1.5">{tab.icon}</span>{tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full animate-shimmer"
                          style={{ background: "linear-gradient(90deg,transparent,#fff,transparent)", backgroundSize: "200% auto" }} />
                  )}
                </button>
              ))}
            </div>

            {/* ════════════════════════════════
                TAB: OVERVIEW
            ════════════════════════════════ */}
            {activeTab === "overview" && (
              <>
                {/* ── LIVE MARKET WATCH ── */}
                <div className="mb-6 p-5 rounded-3xl animate-slideUp"
                     style={{ background: "rgba(0,0,0,0.45)", border: "1px solid rgba(99,102,241,0.3)", position: "relative", overflow: "hidden" }}>
                  {/* animated header bar */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#6366f1,#f59e0b,#10b981,#ef4444)", backgroundSize: "300% auto", animation: "gradientFlow 3s ease infinite" }} />
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span className="animate-liveBlink inline-block w-3 h-3 rounded-full bg-green-400" />
                      <h3 className="text-white font-black text-lg">📊 Live Market Watch</h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)", color: "#34d399" }}>NSE • BSE • LIVE</span>
                    </div>
                    <span className="text-white/30 text-xs">Simulated real-time · updates every 2.5s</span>
                  </div>
                  {/* Index highlight row */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {stockData.filter(s => s.type === "index").map(s => (
                      <div key={s.symbol} className="p-4 rounded-2xl card-3d text-center"
                           style={{ background: s.pct >= 0 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${s.pct >= 0 ? "rgba(16,185,129,0.35)" : "rgba(239,68,68,0.35)"}` }}>
                        <div className="text-xl mb-1">{s.icon}</div>
                        <div className="text-white/60 text-xs font-bold mb-1">{s.symbol}</div>
                        <div className="text-lg font-black" style={{ color: s.pct >= 0 ? "#34d399" : "#f87171" }}>
                          {s.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs font-bold mt-0.5" style={{ color: s.pct >= 0 ? "#34d399" : "#f87171" }}>
                          {s.pct >= 0 ? "▲" : "▼"} {Math.abs(s.pct).toFixed(2)}%
                          &nbsp;({s.change >= 0 ? "+" : ""}{s.change.toFixed(2)})
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Stocks grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {stockData.filter(s => s.type === "stock").map((s, i) => (
                      <div key={s.symbol} className="p-3 rounded-xl animate-popIn cursor-default"
                           style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${s.pct >= 0 ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`, animationDelay: `${i * 50}ms` }}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-base">{s.icon}</span>
                          <span className="text-white/70 text-xs font-bold truncate">{s.symbol}</span>
                        </div>
                        <div className="font-black text-sm" style={{ color: s.pct >= 0 ? "#34d399" : "#f87171" }}>
                          ₹{s.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span style={{ color: s.pct >= 0 ? "#34d399" : "#f87171", fontSize: "0.65rem" }}>
                            {s.pct >= 0 ? "▲" : "▼"}{Math.abs(s.pct).toFixed(2)}%
                          </span>
                          <span className="text-white/25 text-xs">{s.sector}</span>
                        </div>
                        {/* mini sparkline bar */}
                        <div className="mt-1.5 flex items-end gap-px h-6">
                          {(s.history || [s.price]).slice(-12).map((v, j, arr) => {
                            const min = Math.min(...arr), max = Math.max(...arr);
                            const h = max === min ? 50 : Math.round(((v - min) / (max - min)) * 100);
                            return <div key={j} style={{ flex: 1, height: `${Math.max(10, h)}%`, background: s.pct >= 0 ? "#34d399" : "#f87171", opacity: 0.5 + (j / arr.length) * 0.5, borderRadius: 2 }} />;
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Row 1: Income Trend + Projections Bar */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="p-6 rounded-3xl animate-slideUp" style={{ ...glass(), animationDelay: "0ms" }}>
                    <h3 className="text-white font-bold text-base mb-1">📈 Income Trend & AI Predictions</h3>
                    <p className="text-white/35 text-xs mb-4">Dashed = AI projected values</p>
                    <div style={{ height: 260 }}>
                      <Line data={lineData} options={{
                        responsive: true, maintainAspectRatio: false,
                        plugins: { legend: legendWhite, tooltip: mkTooltip() },
                        scales: scales(),
                        animation: { duration: 900, easing: "easeInOutQuart" },
                      }} />
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl animate-slideUp" style={{ ...glass(), animationDelay: "100ms" }}>
                    <h3 className="text-white font-bold text-base mb-1">💹 Income Projections</h3>
                    <p className="text-white/35 text-xs mb-4">Daily → yearly extrapolation</p>
                    <div style={{ height: 260 }}>
                      <Bar data={barData} options={{
                        responsive: true, maintainAspectRatio: false,
                        plugins: { legend: { display: false }, tooltip: mkTooltip() },
                        scales: scales(),
                        animation: { duration: 900 },
                      }} />
                    </div>
                  </div>
                </div>

                {/* Row 2: Budget split + Histogram */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="p-6 rounded-3xl animate-slideUp" style={{ ...glass(), animationDelay: "150ms" }}>
                    <h3 className="text-white font-bold text-base mb-1">🥧 Monthly Budget Split</h3>
                    <p className="text-white/35 text-xs mb-4">Income vs expenses vs savings ratio</p>
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div style={{ width: "min(200px, 100%)", flexShrink: 0 }}>
                        <Doughnut data={budgetData} options={{
                          responsive: true,
                          plugins: {
                            legend: { labels: { color: "#fff", font: { size: 11 } } },
                            tooltip: { ...mkTooltip(), callbacks: { label: (ctx) => ` ${ctx.label}: ${inr(ctx.raw)}` } },
                          },
                          cutout: "60%",
                          animation: { duration: 1000 },
                        }} />
                      </div>
                      <div className="flex-1 w-full flex flex-col gap-3">
                        {[
                          { label: "Monthly Income",   val: monthlyEst,      color: "#6366f1", pct: 100 },
                          { label: "Monthly Expenses", val: monthlyExpenses, color: "#ef4444", pct: 70 },
                          { label: "Monthly Savings",  val: monthlySavings,  color: "#10b981", pct: 30 },
                        ].map((r) => (
                          <div key={r.label} className="p-3 rounded-xl"
                               style={{ background: r.color + "14", border: `1px solid ${r.color}25` }}>
                            <div className="flex justify-between text-xs font-semibold mb-1.5">
                              <span style={{ color: r.color }}>{r.label}</span>
                              <span className="text-white/70">{inr(r.val)}</span>
                            </div>
                            <div className="w-full h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                              <div className="h-2 rounded-full"
                                   style={{ width: `${r.pct}%`, background: `linear-gradient(90deg,${r.color},${r.color}99)` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl animate-slideUp" style={{ ...glass(), animationDelay: "200ms" }}>
                    <h3 className="text-white font-bold text-base mb-1">📊 Income Distribution</h3>
                    <p className="text-white/35 text-xs mb-4">How often you earn in each range</p>
                    <div style={{ height: 230 }}>
                      <Bar data={histData} options={{
                        responsive: true, maintainAspectRatio: false,
                        plugins: { legend: { display: false }, tooltip: { ...mkTooltip(), callbacks: { label: (ctx) => ` ${ctx.raw} day(s)` } } },
                        scales: scales({ y: { ticks: { stepSize: 1, color: "rgba(255,255,255,0.5)" } } }),
                        animation: { duration: 900 },
                      }} />
                    </div>
                  </div>
                </div>

                {/* Row 3: Wealth accumulation 12-month */}
                <div className="p-6 rounded-3xl mb-6 animate-slideUp" style={{ ...glass(), animationDelay: "250ms" }}>
                  <h3 className="text-white font-bold text-base mb-1">📈 12-Month Wealth Accumulation</h3>
                  <p className="text-white/35 text-xs mb-4">
                    If you invest {inr(monthlySavings)}/month across all asset classes (compound growth)
                  </p>
                  <div style={{ height: 280 }}>
                    <Line data={wealthData} options={{
                      responsive: true, maintainAspectRatio: false,
                      plugins: { legend: legendWhite, tooltip: mkTooltip() },
                      scales: scales(),
                      animation: { duration: 1000, easing: "easeInOutQuart" },
                    }} />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    {[
                      { label: "SIP 12mo", val: compound(monthlySavings * 0.30, 12, 12)[11], color: "#6366f1" },
                      { label: "Gold 12mo", val: compound(monthlySavings * 0.20, 9, 12)[11], color: "#f59e0b" },
                      { label: "FD 12mo",  val: compound(monthlySavings * 0.25, 7, 12)[11], color: "#10b981" },
                      { label: "PPF 12mo", val: compound(monthlySavings * 0.15, 7.5, 12)[11], color: "#3b82f6" },
                    ].map((r) => (
                      <div key={r.label} className="p-3 rounded-xl text-center"
                           style={{ background: r.color + "18", border: `1px solid ${r.color}35` }}>
                        <div className="text-xs text-white/40 mb-1">{r.label}</div>
                        <div className="font-bold text-sm" style={{ color: r.color }}>{inr(r.val || 0)}</div>
                      </div>
                    ))}
                  </div>
                </div>


                {/* Worker Hub promo card */}
                <div className="animate-slideUp" style={{ animationDelay: "300ms", marginTop: "1.5rem", background: "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(16,185,129,0.08))", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "1.5rem", padding: "1.5rem", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#f59e0b,#10b981,#6366f1)", animation: "gradientFlow 4s ease-in-out infinite" }} />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "2rem", animation: "waveFloat 3s ease-in-out infinite" }}>👷</span>
                        <div>
                          <div style={{ color: "#fff", fontWeight: 800, fontSize: "1.1rem" }}>Worker Hub — Find Jobs & Track Wages</div>
                          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem" }}>Track daily wages · Find better-paying cities · Browse 20+ jobs · Apply now</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        {["💰 Wage Tracker","🏙️ City Jobs","🗺️ Google Maps","🎓 Part-time","📋 Apply Now"].map(t => (
                          <span key={t} style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "999px", padding: "0.2rem 0.7rem", color: "#fbbf24", fontSize: "0.75rem", fontWeight: 600 }}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => navigate("/worker")} style={{ background: "linear-gradient(90deg,#f59e0b,#d97706)", border: "none", borderRadius: "0.875rem", padding: "0.75rem 1.5rem", color: "#fff", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer", boxShadow: "0 4px 20px rgba(245,158,11,0.4)", whiteSpace: "nowrap" }}>
                      Open Worker Hub →
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ════════════════════════════════
                TAB: INVESTMENT ANALYTICS
            ════════════════════════════════ */}
            {activeTab === "invest" && (
              <>
                {/* Investment allocation doughnut + bars */}
                <div className="p-6 rounded-3xl mb-6" style={glass()}>
                  <h3 className="text-white font-bold text-xl mb-1">🎯 Smart Investment Allocation</h3>
                  <p className="text-white/40 text-sm mb-6">
                    30% savings ({inr(monthlySavings)}/month) distributed across 5 asset classes
                  </p>
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div style={{ width: 230, flexShrink: 0 }}>
                      <Doughnut data={doughnutData} options={{
                        responsive: true,
                        plugins: {
                          legend: { display: false },
                          tooltip: { ...mkTooltip(), callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw}%` } },
                        },
                        cutout: "65%",
                        animation: { duration: 1000 },
                      }} />
                    </div>
                    <div className="flex-1 w-full flex flex-col gap-3">
                      {ALLOCATION.map((a) => {
                        const monthly = monthlySavings * a.pct / 100;
                        return (
                          <div key={a.name} className="p-4 rounded-xl hover:scale-[1.015] transition-all"
                               style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${a.color}30` }}>
                            <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                              <span className="text-white font-semibold text-sm">{a.icon} {a.name}</span>
                              <div className="flex gap-2 text-xs">
                                <span className="px-2 py-0.5 rounded-md font-semibold" style={{ background: a.color + "25", color: a.color }}>{a.returns}</span>
                                <span className="px-2 py-0.5 rounded-md font-semibold text-white/50" style={{ background: "rgba(255,255,255,0.06)" }}>Risk: {a.risk}</span>
                                <span className="px-2 py-0.5 rounded-md font-semibold text-white/50" style={{ background: "rgba(255,255,255,0.06)" }}>Min ₹{a.minInvest}</span>
                              </div>
                            </div>
                            <div className="w-full h-2 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.06)" }}>
                              <div className="h-2 rounded-full transition-all duration-700"
                                   style={{ width: `${a.pct}%`, background: `linear-gradient(90deg,${a.color},${a.color}99)` }} />
                            </div>
                            <div className="flex justify-between text-xs">
                              <span style={{ color: a.color }}>→ {inr(monthly)}/month · {a.pct}% of savings</span>
                              <span className="text-white/30">Liquidity: {a.liquidity}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Future value simulator */}
                <div className="p-6 rounded-3xl mb-6" style={glass()}>
                  <h3 className="text-white font-bold text-xl mb-1">🔮 Investment Returns Simulator</h3>
                  <p className="text-white/40 text-sm mb-6">
                    What your {inr(monthlySavings)}/month becomes over 1, 5 & 10 years per asset class
                  </p>
                  <div style={{ height: 300 }}>
                    <Bar data={returnsData} options={{
                      responsive: true, maintainAspectRatio: false,
                      plugins: { legend: legendWhite, tooltip: mkTooltip() },
                      scales: scales(),
                      animation: { duration: 1000 },
                    }} />
                  </div>
                  {/* 10-year summary */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5">
                    {ALLOCATION.map((a) => (
                      <div key={a.name} className="p-3 rounded-xl text-center"
                           style={{ background: a.color + "14", border: `1px solid ${a.color}30` }}>
                        <div className="text-lg mb-1">{a.icon}</div>
                        <div className="text-xs text-white/40 mb-1">{a.name.split(" ")[0]}</div>
                        <div className="text-xs text-white/30 mb-1">10 yrs</div>
                        <div className="font-extrabold text-sm" style={{ color: a.color }}>
                          {inr(futureValue(monthlySavings * a.pct / 100, a.rate, 10))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Radar — risk vs return */}
                <div className="p-6 rounded-3xl mb-6" style={glass()}>
                  <h3 className="text-white font-bold text-xl mb-1">🕸️ Risk-Return Radar</h3>
                  <p className="text-white/40 text-sm mb-6">
                    Multi-dimensional comparison of all 5 asset classes (higher = better)
                  </p>
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div style={{ width: "100%", maxWidth: 380, height: 340, position: "relative", flexShrink: 0 }}>
                      <Radar data={radarData} options={{
                        responsive: true, maintainAspectRatio: false,
                        plugins: { legend: legendWhite, tooltip: { ...mkTooltip(), callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw}/100` } } },
                        scales: {
                          r: {
                            ticks: { color: "rgba(255,255,255,0.4)", backdropColor: "transparent", stepSize: 25 },
                            grid:  { color: "rgba(255,255,255,0.08)" },
                            pointLabels: { color: "rgba(255,255,255,0.6)", font: { size: 11 } },
                            min: 0, max: 100,
                          },
                        },
                        animation: { duration: 1000 },
                      }} />
                    </div>
                    <div className="flex-1 flex flex-col gap-2 text-sm">
                      {RADAR_ASSETS.map((a) => (
                        <div key={a.label} className="flex items-center gap-3 p-2 rounded-xl"
                             style={{ background: a.color + "12", border: `1px solid ${a.color}25` }}>
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: a.color }} />
                          <span className="text-white font-semibold w-16">{a.label}</span>
                          <div className="flex gap-2 flex-wrap text-xs">
                            <span className="text-white/50">Returns: <span style={{ color: a.color }}>{a.returns}</span></span>
                            <span className="text-white/50">Safety: <span style={{ color: a.color }}>{a.safety}</span></span>
                            <span className="text-white/50">Liquidity: <span style={{ color: a.color }}>{a.liquidity}</span></span>
                          </div>
                        </div>
                      ))}
                      <div className="mt-2 p-3 rounded-xl text-xs text-white/40"
                           style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        💡 Scores are relative benchmarks out of 100. Diversify across all 5 categories for optimum risk-adjusted returns.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advanced financial metrics */}
                <div className="p-6 rounded-3xl mb-6"
                     style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>
                  <h3 className="text-green-400 font-bold text-xl mb-4">📐 Advanced Financial Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        icon: "🎯", title: "FIRE Number",
                        tip: `To retire early (25× annual expenses): ${inr(monthlyExpenses * 12 * 25)}`,
                        color: "#6366f1",
                      },
                      {
                        icon: "📊", title: "Break-Even Days",
                        tip: `At ${inr(monthlyExpenses)}/mo expenses you need ${Math.ceil(monthlyExpenses / (avgDaily || 1))} working days/month to break even.`,
                        color: "#f59e0b",
                      },
                      {
                        icon: "💹", title: "Savings Rate",
                        tip: `You save ${savingsRate}% of income. Experts recommend 20–30%. Your target: ${inr(monthlySavings)}/month.`,
                        color: "#10b981",
                      },
                      {
                        icon: "🏦", title: "Emergency Fund",
                        tip: `Target: ${inr(emergencyTarget)} (6 months expenses). Monthly build: ${inr(monthlySavings * 0.25)}/mo → ready in ${Math.ceil(emergencyTarget / (monthlySavings * 0.25))} months.`,
                        color: "#ef4444",
                      },
                      {
                        icon: "🔐", title: "Tax Optimization",
                        tip: `PPF/ELSS can save up to ${inr(taxSavedEst)} in taxes annually. Max 80C deduction: ₹1,50,000/yr.`,
                        color: "#3b82f6",
                      },
                      {
                        icon: "📈", title: "Wealth Velocity",
                        tip: `At current savings rate, your net worth could double every ${Math.round(72 / 12)}–${Math.round(72 / 8)} years (Rule of 72 at 8–12% returns).`,
                        color: "#a78bfa",
                      },
                    ].map((t) => (
                      <div key={t.title} className="p-4 rounded-xl hover:scale-[1.02] transition-all"
                           style={{ background: t.color + "10", border: `1px solid ${t.color}25` }}>
                        <div className="text-2xl mb-2">{t.icon}</div>
                        <div className="font-bold text-sm mb-1" style={{ color: t.color }}>{t.title}</div>
                        <div className="text-white/50 text-xs leading-relaxed">{t.tip}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ════════════════════════════════
                TAB: AI PREDICTIONS
            ════════════════════════════════ */}
            {activeTab === "predict" && (
              <>
                {/* AI prediction badges */}
                {aiPrediction.length > 0 ? (
                  <div className="mb-6 p-6 rounded-3xl"
                       style={{ ...glass(), borderColor: "rgba(245,158,11,0.3)" }}>
                    <h3 className="text-yellow-400 font-bold text-xl mb-1">🤖 AI Income Predictions</h3>
                    <p className="text-white/40 text-sm mb-5">Next cycle projected values from your income pattern</p>
                    <div className="flex flex-wrap gap-3 mb-6">
                      {aiPrediction.map((val, i) => (
                        <div key={i}
                          className="px-5 py-4 rounded-xl font-bold text-white hover:scale-110 transition-all cursor-default"
                          style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.2),rgba(245,158,11,0.05))", border: "1px solid rgba(245,158,11,0.4)", boxShadow: "0 4px 16px rgba(245,158,11,0.15)" }}>
                          <div className="text-yellow-400/60 text-xs mb-0.5">Prediction {i + 1}</div>
                          <div className="text-lg">{inr(val)}</div>
                        </div>
                      ))}
                    </div>
                    {/* Prediction trend line */}
                    <div style={{ height: 250 }}>
                      <Line data={{
                        labels: aiPrediction.map((_, i) => `Pred ${i + 1}`),
                        datasets: [{
                          label: "AI Forecast",
                          data: aiPrediction,
                          borderColor: "#f59e0b",
                          backgroundColor: "rgba(245,158,11,0.12)",
                          fill: true, tension: 0.4,
                          pointBackgroundColor: "#f59e0b", pointRadius: 6, pointHoverRadius: 9,
                        }],
                      }} options={{
                        responsive: true, maintainAspectRatio: false,
                        plugins: { legend: { display: false }, tooltip: mkTooltip() },
                        scales: scales(),
                        animation: { duration: 900 },
                      }} />
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 p-8 rounded-3xl text-center"
                       style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
                    <div className="text-4xl mb-3">🤖</div>
                    <p className="text-yellow-400 font-bold">AI needs more data</p>
                    <p className="text-white/40 text-sm mt-1">Add at least 5–7 income entries for AI predictions to activate.</p>
                  </div>
                )}

                {/* Income consistency panel */}
                <div className="p-6 rounded-3xl mb-6" style={glass()}>
                  <h3 className="text-white font-bold text-xl mb-4">🎯 Income Consistency Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-4 rounded-xl text-center"
                         style={{ background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.3)" }}>
                      <div className="text-5xl font-extrabold mb-1" style={{ color: "#06b6d4" }}>{consistencyScore}%</div>
                      <div className="text-white/50 text-sm">Consistency Score</div>
                      <div className="w-full h-2 rounded-full mt-3" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div className="h-2 rounded-full" style={{ width: `${consistencyScore}%`, background: "linear-gradient(90deg,#06b6d4,#0891b2)" }} />
                      </div>
                    </div>
                    <div className="p-4 rounded-xl text-center"
                         style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)" }}>
                      <div className="text-5xl font-extrabold mb-1" style={{ color: "#6366f1" }}>{incomeData.length}</div>
                      <div className="text-white/50 text-sm">Total Entries</div>
                      <div className="text-xs text-white/30 mt-2">{incomeData.length >= 7 ? "✅ Enough for AI" : `Need ${7 - incomeData.length} more for AI`}</div>
                    </div>
                    <div className="p-4 rounded-xl text-center"
                         style={{ background: `${healthColor}18`, border: `1px solid ${healthColor}40` }}>
                      <div className="text-5xl font-extrabold mb-1" style={{ color: healthColor }}>{healthScore}</div>
                      <div className="text-white/50 text-sm">Health Score /100</div>
                      <div className="text-xs mt-2 font-semibold" style={{ color: healthColor }}>{healthLabel}</div>
                    </div>
                  </div>

                  {/* Progress bars for score components */}
                  <div className="mt-5 flex flex-col gap-3">
                    {[
                      { label: "Income Level",     val: Math.min(100, (avgDaily / 10000) * 100), color: "#6366f1" },
                      { label: "Data History",      val: Math.min(100, incomeData.length * 10),   color: "#10b981" },
                      { label: "Growth Momentum",   val: Math.min(100, 50 + parseFloat(growthRate || 0) * 3), color: "#f59e0b" },
                      { label: "Consistency",       val: consistencyScore,                          color: "#06b6d4" },
                    ].map((m) => (
                      <div key={m.label}>
                        <div className="flex justify-between text-xs text-white/50 mb-1">
                          <span>{m.label}</span>
                          <span style={{ color: m.color }}>{Math.round(m.val)}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div className="h-2 rounded-full transition-all duration-1000"
                               style={{ width: `${Math.round(m.val)}%`, background: `linear-gradient(90deg,${m.color},${m.color}88)` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Smart money tips */}
                <div className="p-6 rounded-3xl mb-6"
                     style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>
                  <h3 className="text-green-400 font-bold text-xl mb-4">💡 Personalised Smart Tips</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        icon: "🏦", title: "Save First (30%)",
                        tip: `Auto-transfer ${inr(latestIncome * 0.3)} the moment you receive income. "Pay yourself first" — Richest Man in Babylon.`,
                      },
                      {
                        icon: "📅", title: "Start SIP Today",
                        tip: `₹500/mo SIP in Nifty 50 Index Fund → ${inr(futureValue(500, 12, 10))} in 10 years at 12% CAGR.`,
                      },
                      {
                        icon: "🛡️", title: "Protect First",
                        tip: `₹50L term insurance ~₹500/mo. Health insurance ~₹700/mo. These protect your wealth before you build it.`,
                      },
                      {
                        icon: "📈", title: "Don't Try to Time",
                        tip: `Invest every month regardless of market. Rupee Cost Averaging beats timing for small investors.`,
                      },
                      {
                        icon: "🔐", title: "Max PPF Deduction",
                        tip: `Invest ${inr(12500)}/month in PPF → max ₹1.5L/yr → saves up to ₹${(150000 * 0.30 / 1000).toFixed(0)}K in taxes (30% slab).`,
                      },
                      {
                        icon: "🪙", title: "Digital Gold SIP",
                        tip: `Buy ₹100–₹500 of digital gold monthly on Paytm/PhonePe. Hedge against inflation, no storage cost.`,
                      },
                    ].map((t) => (
                      <div key={t.title} className="p-4 rounded-xl hover:scale-[1.02] transition-all"
                           style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
                        <div className="text-2xl mb-2">{t.icon}</div>
                        <div className="text-white font-bold text-sm mb-1">{t.title}</div>
                        <div className="text-white/50 text-xs leading-relaxed">{t.tip}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

          </>
        )}

        {/* ════════════════════════════════
            TAB: MY ACTIVITY
        ════════════════════════════════ */}
        {activeTab === "activity" && (() => {
          const stats = activityStats;
          const PAGE_ICONS = { "AI Dashboard": "📊", "Worker Hub": "👷", "Job Board": "💼", "AI Chat": "🤖", "Home": "🏠" };
          const LOG_ICONS  = { visit: "👁️", income: "💰", default: "📌" };
          const relTime = (iso) => {
            const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
            if (diff < 60)   return `${diff}s ago`;
            if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
            if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
            return new Date(iso).toLocaleDateString("en-IN", { day:"numeric", month:"short" });
          };
          const totalVisits = Object.values(stats.visits).reduce((a, b) => a + b, 0);
          return (
            <>
              {/* ── Time cards ── */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { icon: "⏱️", label: "This Session",  val: fmtTime(sessionSecs),          color: "#6366f1" },
                  { icon: "🕐", label: "Total Time",    val: fmtTime(stats.totalTime),       color: "#10b981" },
                  { icon: "📄", label: "Pages Visited", val: `${totalVisits} visits`,        color: "#f59e0b" },
                  { icon: "📋", label: "Activities",    val: `${stats.log.length} logged`,   color: "#06b6d4" },
                ].map(c => (
                  <div key={c.label} className="p-5 rounded-2xl text-center"
                    style={{ background: c.color + "14", border: `1px solid ${c.color}35` }}>
                    <div style={{ fontSize: "1.8rem", marginBottom: "0.3rem" }}>{c.icon}</div>
                    <div style={{ fontSize: "1.4rem", fontWeight: 900, color: c.color }}>{c.val}</div>
                    <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{c.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* ── Pages visited ── */}
                <div className="p-6 rounded-3xl" style={{ ...glass(), borderColor: "rgba(99,102,241,0.25)" }}>
                  <h3 className="text-white font-bold text-lg mb-4">📍 Pages Visited</h3>
                  {Object.keys(stats.visits).length === 0 ? (
                    <p className="text-white/30 text-sm">No visits logged yet.</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {Object.entries(stats.visits).sort((a,b) => b[1]-a[1]).map(([page, count]) => (
                        <div key={page} className="flex items-center gap-3">
                          <span style={{ fontSize: "1.2rem" }}>{PAGE_ICONS[page] || "🔗"}</span>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="text-white/80 text-sm font-semibold">{page}</span>
                              <span className="text-indigo-400 font-bold text-sm">{count}×</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
                              <div className="h-1.5 rounded-full" style={{ width: `${Math.min(100, (count / Math.max(...Object.values(stats.visits))) * 100)}%`, background: "linear-gradient(90deg,#6366f1,#4f46e5)" }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Income summary ── */}
                <div className="p-6 rounded-3xl" style={{ ...glass(), borderColor: "rgba(16,185,129,0.25)" }}>
                  <h3 className="text-white font-bold text-lg mb-4">💰 Income Summary</h3>
                  <div className="flex flex-col gap-3">
                    {[
                      { label: "Total Entries",   val: incomeData.length,     color: "#6366f1" },
                      { label: "Total Earned",    val: inr(totalIncome),      color: "#10b981" },
                      { label: "Average/Day",     val: inr(avgDaily),         color: "#f59e0b" },
                      { label: "Best Day",        val: inr(Math.max(0,...incomeData.map(d=>d.amount||0))), color: "#34d399" },
                      { label: "Monthly Est.",    val: inr(monthlyEst),       color: "#a78bfa" },
                      { label: "Yearly Est.",     val: inr(yearlyEst),        color: "#06b6d4" },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between items-center py-1.5 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                        <span className="text-white/50 text-sm">{r.label}</span>
                        <span className="font-bold text-sm" style={{ color: r.color }}>{r.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Activity log ── */}
              <div className="p-6 rounded-3xl mb-6" style={{ ...glass(), borderColor: "rgba(245,158,11,0.2)" }}>
                <h3 className="text-white font-bold text-lg mb-4">📋 Activity Log</h3>
                {stats.log.length === 0 ? (
                  <p className="text-white/30 text-sm">No activity yet — start using the app!</p>
                ) : (
                  <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>
                    {stats.log.map((entry, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <span style={{ fontSize: "1.1rem", marginTop: 1 }}>{LOG_ICONS[entry.type] || LOG_ICONS.default}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white/80 text-sm font-medium truncate">{entry.detail}</p>
                          <p className="text-white/25 text-xs mt-0.5">{relTime(entry.time)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          );
        })()}

        {/* ── EMPTY STATE ── */}
        {!hasData && !loading && (
          <div className="text-center py-24">
            <div className="text-7xl mb-5">💸</div>
            <h3 className="text-white font-bold text-2xl mb-2">{t("emptyTitle")}</h3>
            <p className="text-white/40 text-sm">{t("emptySub")}</p>
          </div>
        )}

        {/* ── FOOTER ── */}
        <footer className="text-center text-white/20 text-xs pt-8 pb-16">
          © 2026 APS AI · Real-time financial intelligence · For educational purposes only · Not SEBI-registered advice
        </footer>

      </div>

      {/* ── AI CHATBOT (floating) ── */}
      <ChatBot lang={lang} onLangChange={setLangPersist} />

    </div>
  );
}
