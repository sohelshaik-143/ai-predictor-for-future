import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, LineElement, PointElement, ArcElement,
  Title, Tooltip, Legend, Filler,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale,
  BarElement, LineElement, PointElement, ArcElement,
  Title, Tooltip, Legend, Filler
);

/* ─────────── helpers ─────────── */
const inr = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

const MONTHS = ["Month 1","Month 2","Month 3","Month 4","Month 5"];

const ALLOCATION = {
  daily_wage: [
    { name: "Emergency Fund (FD / RD)", pct: 30, color: "#10b981", icon: "🏦",
      desc: "Recurring Deposit — safe, guaranteed 6-7% p.a. Build 3 months of expenses first." },
    { name: "Mutual Funds (SIP)",        pct: 30, color: "#6366f1", icon: "📊",
      desc: "Start SIP from ₹100/month. Nifty 50 Index Fund gives ~12% avg return long-term." },
    { name: "Gold (Sovereign Bond)",     pct: 20, color: "#f59e0b", icon: "🪙",
      desc: "Digital gold or RBI Sovereign Gold Bonds — inflation hedge, 8% pa interest." },
    { name: "PPF / NPS",                 pct: 15, color: "#3b82f6", icon: "🔐",
      desc: "Government-backed 7.1% tax-free. Best for long-term retirement corpus." },
    { name: "Stocks (when ready)",       pct:  5, color: "#ef4444", icon: "📈",
      desc: "Blue-chip: HDFC Bank, TCS, Reliance. Only invest what you can afford to lock for 5+ years." },
  ],
  employee: [
    { name: "Mutual Funds (SIP)",        pct: 35, color: "#6366f1", icon: "📊",
      desc: "Index + Flexi-cap funds. Auto SIP every month. Target 12-15% CAGR." },
    { name: "Stocks & ETF",              pct: 25, color: "#ef4444", icon: "📈",
      desc: "Nifty 50 ETF as core + 3-5 blue-chip stocks. Rebalance annually." },
    { name: "PPF / NPS / EPF",           pct: 20, color: "#3b82f6", icon: "🔐",
      desc: "Maximize EPF, top-up NPS for extra 80CCD(1B) tax benefit." },
    { name: "Gold (Sovereign Bond)",     pct: 10, color: "#f59e0b", icon: "🪙",
      desc: "5-10% allocation protects portfolio during equity downturns." },
    { name: "Real Estate / REITs",       pct: 10, color: "#10b981", icon: "🏘️",
      desc: "REITs give 7-9% yield without buying physical property." },
  ],
  business: [
    { name: "Stocks & ETF",              pct: 30, color: "#ef4444", icon: "📈",
      desc: "Large-cap diversified. Nifty 50 Index Fund as core. Add mid-cap for growth." },
    { name: "Mutual Funds (SIP)",        pct: 25, color: "#6366f1", icon: "📊",
      desc: "Diversify across mid-cap & small-cap for compounding wealth." },
    { name: "Real Estate / REITs",       pct: 20, color: "#10b981", icon: "🏘️",
      desc: "Physical property or REITs for passive monthly rental income." },
    { name: "Gold / Commodities",        pct: 15, color: "#f59e0b", icon: "🪙",
      desc: "Gold ETF + MCX Silver — protects against inflation & currency risk." },
    { name: "Fixed Income (Bonds)",      pct: 10, color: "#3b82f6", icon: "🔐",
      desc: "Corporate bonds / G-sec for stable 7-8% returns, low volatility." },
  ],
};

const USER_LABEL = {
  daily_wage: "Daily Wage Worker",
  employee:   "Salaried Employee",
  business:   "Business Owner",
};

/* ─────────── chart defaults ─────────── */
const chartOpts = (title) => ({
  responsive: true,
  plugins: {
    legend: { labels: { color: "#fff", font: { size: 11 } } },
    title:  { display: !!title, text: title, color: "#fff", font: { size: 14, weight: "bold" } },
    tooltip: { callbacks: { label: ctx => ` ₹${ctx.raw.toLocaleString("en-IN")}` } },
  },
  scales: {
    x: { ticks: { color: "rgba(255,255,255,0.6)" }, grid: { color: "rgba(255,255,255,0.07)" } },
    y: { ticks: { color: "rgba(255,255,255,0.6)" }, grid: { color: "rgba(255,255,255,0.07)" } },
  },
});

const pieOpts = {
  responsive: true,
  plugins: { legend: { labels: { color: "#fff", font: { size: 11 } }, position: "bottom" } },
};

/* ─────────── component ─────────── */
export default function InvestmentPlan() {
  const navigate = useNavigate();

  const profile = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("aps_financial_profile") || "{}"); }
    catch { return {}; }
  }, []);

  const {
    userType     = "daily_wage",
    knowsStocks  = false,
    dailyIncome  = 0,
    dailySpend   = 0,
    weeklySpend  = 0,
    monthlySpend = 0,
  } = profile;

  /* ── Calculations ── */
  const daily    = parseFloat(dailyIncome)  || 0;
  const dSpend   = parseFloat(dailySpend)   || 0;
  const wSpend   = parseFloat(weeklySpend)  || 0;
  const mSpend   = parseFloat(monthlySpend) || 0;

  const monthlyIncome   = daily * 26;
  const monthlyExpenses = dSpend * 26 + wSpend * 4 + mSpend;
  const monthlySavings  = Math.max(0, monthlyIncome - monthlyExpenses);
  const savingsRate     = monthlyIncome > 0
    ? ((monthlySavings / monthlyIncome) * 100).toFixed(1)
    : 0;

  const allocation = ALLOCATION[userType] || ALLOCATION.daily_wage;

  /* ── Projection: 5 months ── */
  const projSavings    = MONTHS.map((_, i) => Math.round(monthlySavings * (i + 1)));
  const projInvestment = MONTHS.map((_, i) => {
    const base = monthlySavings * (i + 1);
    return Math.round(base * Math.pow(1.01, i + 1)); // ~1% monthly compounding
  });

  /* ── Chart data ── */
  const flowData = {
    labels: ["Monthly Income", "Total Expenses", "Net Savings"],
    datasets: [{
      data: [monthlyIncome, monthlyExpenses, monthlySavings],
      backgroundColor: ["rgba(99,102,241,0.75)", "rgba(239,68,68,0.75)", "rgba(16,185,129,0.75)"],
      borderColor:     ["#6366f1","#ef4444","#10b981"],
      borderWidth: 2,
      borderRadius: 8,
    }],
  };

  const projData = {
    labels: MONTHS,
    datasets: [
      {
        label: "Savings Accumulated",
        data: projSavings,
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.12)",
        fill: true, tension: 0.4,
        pointBackgroundColor: "#10b981",
      },
      {
        label: "With Investment Returns",
        data: projInvestment,
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245,158,11,0.12)",
        fill: true, tension: 0.4,
        pointBackgroundColor: "#f59e0b",
      },
    ],
  };

  const pieData = {
    labels: allocation.map(a => `${a.icon} ${a.name}`),
    datasets: [{
      data: allocation.map(a => a.pct),
      backgroundColor: allocation.map(a => a.color + "CC"),
      borderColor:     allocation.map(a => a.color),
      borderWidth: 2,
    }],
  };

  /* ── Health status ── */
  const health =
    monthlySavings <= 0 ? "critical"
    : savingsRate < 20  ? "low"
    : savingsRate < 40  ? "moderate"
                        : "good";

  const HEALTH = {
    critical: { color: "#ef4444", label: "⚠️ Spending exceeds income! Cut expenses urgently." },
    low:      { color: "#f59e0b", label: "⚡ Low savings. Try cutting at least one expense category." },
    moderate: { color: "#3b82f6", label: "👍 Decent savings — keep building your emergency fund." },
    good:     { color: "#10b981", label: "🌟 Excellent! You're on track for financial freedom." },
  };

  /* ── Styles ── */
  const glass = {
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "1.5rem",
    padding: "1.5rem",
    marginBottom: "1.5rem",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)", padding: "2rem 1rem" }}
    >
      <div style={{ maxWidth: 920, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">📊 Your Personalised Investment Plan</h1>
            <p className="text-white/50 text-sm mt-1">
              {USER_LABEL[userType]} · Daily income {inr(daily)} · Savings rate {savingsRate}%
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/financial-setup")}
              className="px-4 py-2 rounded-xl text-white/60 text-sm border border-white/20 hover:bg-white/10 transition"
            >
              ← Retake Quiz
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 rounded-xl font-bold text-white text-sm hover:scale-105 transition"
              style={{ background: "linear-gradient(90deg,#f59e0b,#d97706)" }}
            >
              Dashboard
            </button>
          </div>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Monthly Income",   val: inr(monthlyIncome),   color: "#6366f1", icon: "💰" },
            { label: "Monthly Expenses", val: inr(monthlyExpenses), color: "#ef4444", icon: "🛒" },
            { label: "Monthly Savings",  val: inr(monthlySavings),  color: "#10b981", icon: "🏦" },
            { label: "Savings Rate",     val: `${savingsRate}%`,    color: HEALTH[health].color, icon: "📈" },
          ].map(c => (
            <div
              key={c.label}
              style={{ ...glass, borderColor: c.color + "40", padding: "1.2rem", marginBottom: 0 }}
            >
              <div className="text-2xl mb-1">{c.icon}</div>
              <div className="text-xs text-white/50 font-semibold uppercase tracking-wider">{c.label}</div>
              <div className="text-xl font-extrabold mt-1" style={{ color: c.color }}>{c.val}</div>
            </div>
          ))}
        </div>

        {/* ── Health Banner ── */}
        <div
          className="mb-6 p-4 rounded-2xl text-center font-semibold text-sm"
          style={{ background: HEALTH[health].color + "18", border: `1px solid ${HEALTH[health].color}40`, color: HEALTH[health].color }}
        >
          {HEALTH[health].label}
        </div>

        {/* ── Cash Flow Bar Chart ── */}
        <div style={glass}>
          <h3 className="text-xl font-bold text-white mb-4">💹 Monthly Cash Flow Analysis</h3>
          <Bar
            data={flowData}
            options={{ ...chartOpts(""), plugins: { ...chartOpts("").plugins, legend: { display: false } } }}
          />
        </div>

        {/* ── 5-Month Projection ── */}
        <div style={glass}>
          <h3 className="text-xl font-bold text-white mb-1">📅 5-Month Savings & Investment Projection</h3>
          <p className="text-white/40 text-xs mb-4">
            Saving {inr(monthlySavings)}/month and investing it at ~1% monthly growth
          </p>
          <Line data={projData} options={chartOpts("")} />
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[
              { label: "5-Month Savings",      val: inr(monthlySavings * 5), color: "#10b981" },
              { label: "With Returns (est.)",  val: inr(projInvestment[4]), color: "#f59e0b" },
            ].map(c => (
              <div key={c.label} className="p-3 rounded-xl text-center"
                   style={{ background: c.color + "18", border: `1px solid ${c.color}40` }}>
                <div className="text-xs font-semibold mb-1" style={{ color: c.color }}>{c.label}</div>
                <div className="text-white font-bold text-lg">{c.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Investment Allocation ── */}
        <div style={glass}>
          <h3 className="text-xl font-bold text-white mb-6">🎯 Recommended Investment Allocation</h3>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Pie */}
            <div style={{ width: 260, flexShrink: 0 }}>
              <Pie data={pieData} options={pieOpts} />
            </div>
            {/* Breakdown bars */}
            <div className="flex flex-col gap-3 flex-1 w-full">
              {allocation.map(a => (
                <div
                  key={a.name}
                  className="p-4 rounded-xl transition-all hover:scale-[1.015]"
                  style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${a.color}35` }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-semibold text-sm">{a.icon} {a.name}</span>
                    <span className="font-bold text-sm" style={{ color: a.color }}>{a.pct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: `${a.pct}%`, background: a.color }}
                    />
                  </div>
                  <p className="text-white/50 text-xs">{a.desc}</p>
                  <div className="mt-1 font-semibold text-xs" style={{ color: a.color }}>
                    → Invest {inr(monthlySavings * a.pct / 100)}/month
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Stock Market Tutorial (daily_wage + !knowsStocks) ── */}
        {userType === "daily_wage" && !knowsStocks && (
          <div style={{ ...glass, borderColor: "rgba(245,158,11,0.45)" }}>
            <h3 className="text-xl font-bold text-yellow-400 mb-2">📚 Stock Market Beginner's Guide</h3>
            <p className="text-white/50 text-sm mb-6">
              You don't need to be an expert to build wealth — start with the basics below.
            </p>

            {[
              {
                icon: "🏛️", q: "What is the Stock Market?",
                a: "A place where you buy tiny pieces ('shares') of big companies like Tata, Reliance, Infosys. When the company earns profit, your share value increases.",
              },
              {
                icon: "💡", q: "How can I start with small money?",
                a: "Start a SIP (Systematic Investment Plan) in a Mutual Fund — as low as ₹100/month. Apps like Groww, Zerodha, Paytm Money let you begin in 10 minutes.",
              },
              {
                icon: "🏦", q: "What is a Mutual Fund?",
                a: "A professional fund manager invests your money across many stocks, bonds, and gold — so you don't need to pick stocks yourself. Low risk, good returns.",
              },
              {
                icon: "📅", q: "What is SIP?",
                a: "Systematic Investment Plan = fixed amount auto-invested monthly. Like a recurring deposit but with 10-15% returns vs 6-7% from bank RD.",
              },
              {
                icon: "🛡️", q: "Safest investments for a beginner?",
                a: "1) Recurring Deposit (bank-guaranteed). 2) PPF – govt-backed 7.1% tax-free. 3) Nifty 50 Index Fund – tracks India's top 50 companies.",
              },
              {
                icon: "⏳", q: "When will I see profit?",
                a: "Investments work over the LONG TERM (3–10 years). Short-term prices go up and down, but historically Indian markets give 12–15% annual returns over 10 years.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="mb-4 last:mb-0 p-4 rounded-xl"
                style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}
              >
                <div className="flex gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="text-white font-bold text-sm mb-1">{item.q}</div>
                    <div className="text-white/60 text-sm leading-relaxed">{item.a}</div>
                  </div>
                </div>
              </div>
            ))}

            <div
              className="mt-6 p-4 rounded-xl text-center text-sm font-semibold text-green-400"
              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}
            >
              🚀 First step: Open a free account on <strong>Groww</strong> → search "Nifty 50 Index Fund" → start a ₹500/month SIP
            </div>
          </div>
        )}

        {/* ── 5-Step Action Plan ── */}
        <div style={{ ...glass, borderColor: "rgba(16,185,129,0.4)" }}>
          <h3 className="text-xl font-bold text-green-400 mb-5">✅ Your 5-Step Action Plan</h3>
          {[
            {
              n: "1", title: "Build an Emergency Fund",
              desc: `Save at least 3 months of expenses = ${inr(monthlyExpenses * 3)} in a bank FD / RD before investing anywhere.`,
            },
            {
              n: "2", title: "Start Your First SIP",
              desc: `Invest ${inr(monthlySavings * 0.3)}/month in a Nifty 50 Index Fund. Don't stop for at least 3 years — let it compound.`,
            },
            {
              n: "3", title: "Get Insurance First",
              desc: "Buy ₹50 lakh term insurance (₹500/month) and a health insurance policy. This protects your family before you invest.",
            },
            {
              n: "4", title: "Increase Your Income",
              desc: "Learn a new skill, take extra shifts, or start a small side hustle. Even ₹500 extra/month compounds to lakhs over 10 years.",
            },
            {
              n: "5", title: "Review Every 6 Months",
              desc: "Check your portfolio every 6 months. Increase SIP amount by 10% each year (called step-up SIP) as income grows.",
            },
          ].map(a => (
            <div key={a.n} className="flex gap-4 mb-4 last:mb-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                style={{ background: "rgba(16,185,129,0.18)", border: "1px solid rgba(16,185,129,0.5)", color: "#10b981" }}
              >
                {a.n}
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{a.title}</div>
                <div className="text-white/50 text-xs mt-0.5">{a.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-center text-white/30 text-xs mt-2 pb-8">
          ⚠️ Educational content only. Consult a SEBI-registered financial advisor before investing.
        </p>

      </div>
    </div>
  );
}
