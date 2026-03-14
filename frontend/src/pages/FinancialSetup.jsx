import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TOTAL_STEPS = 4;

export default function FinancialSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    userType:     "",
    knowsStocks:  null,
    dailyIncome:  "",
    dailySpend:   "",
    weeklySpend:  "",
    monthlySpend: "",
  });

  const update = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const next = () => {
    if (step === 1 && form.userType !== "daily_wage") {
      update("knowsStocks", true);
      setStep(3);
    } else {
      setStep(s => Math.min(s + 1, TOTAL_STEPS));
    }
  };

  const back = () => {
    if (step === 3 && form.userType !== "daily_wage") {
      setStep(1);
    } else {
      setStep(s => Math.max(s - 1, 1));
    }
  };

  const submit = () => {
    localStorage.setItem("aps_financial_profile", JSON.stringify(form));
    navigate("/investment-plan");
  };

  const progress = step === 1 ? 0 : step === 2 ? 33 : step === 3 ? 66 : 100;

  const card = {
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.25)",
    boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
  };
  const inputStyle = {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
  };
  const btnBack = "px-6 py-3 rounded-xl text-white/60 text-sm border border-white/20 hover:bg-white/10 transition";
  const btnNext = "flex-1 py-3 rounded-xl font-bold text-white text-sm transition-all hover:scale-105 disabled:opacity-40 disabled:scale-100";

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{ background: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)", overflowX: "hidden" }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full opacity-20 blur-3xl"
           style={{ background: "radial-gradient(circle,#f59e0b,transparent)" }} />
      <div className="absolute bottom-[-80px] left-[-80px] w-96 h-96 rounded-full opacity-20 blur-3xl"
           style={{ background: "radial-gradient(circle,#6366f1,transparent)" }} />

      <div className="relative w-full max-w-lg mx-4">

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-white/40 text-xs mb-2">
            <span>Step {step} of {TOTAL_STEPS}</span>
            <span>{progress}% complete</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg,#f59e0b,#10b981)" }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8 shadow-2xl" style={card}>

          {/* ─── STEP 1: User Type ─── */}
          {step === 1 && (
            <div>
              <div className="text-5xl text-center mb-3">👋</div>
              <h2 className="text-2xl font-extrabold text-white text-center mb-1">What best describes you?</h2>
              <p className="text-white/50 text-sm text-center mb-8">This helps us tailor your investment advice</p>
              <div className="flex flex-col gap-4">
                {[
                  { key: "daily_wage", icon: "🔨", label: "Daily Wage Worker",  sub: "Construction, labour, driver, domestic work…" },
                  { key: "employee",   icon: "💼", label: "Salaried Employee",   sub: "Fixed monthly salary from a company" },
                  { key: "business",   icon: "🏪", label: "Business Owner",      sub: "Self-employed or running a business" },
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => update("userType", opt.key)}
                    className="p-4 rounded-2xl text-left transition-all duration-200"
                    style={{
                      background: form.userType === opt.key ? "rgba(245,158,11,0.18)" : "rgba(255,255,255,0.06)",
                      border: `1px solid ${form.userType === opt.key ? "rgba(245,158,11,0.6)" : "rgba(255,255,255,0.1)"}`,
                      outline: "none",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{opt.icon}</span>
                      <div>
                        <div className="text-white font-semibold">{opt.label}</div>
                        <div className="text-white/40 text-xs">{opt.sub}</div>
                      </div>
                      {form.userType === opt.key && <span className="ml-auto text-yellow-400 text-xl">✓</span>}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={next}
                disabled={!form.userType}
                className={`mt-8 w-full ${btnNext}`}
                style={{ background: "linear-gradient(90deg,#f59e0b,#d97706)" }}
              >
                Continue →
              </button>
            </div>
          )}

          {/* ─── STEP 2: Stock Market Knowledge (daily_wage only) ─── */}
          {step === 2 && (
            <div>
              <div className="text-5xl text-center mb-3">📈</div>
              <h2 className="text-2xl font-extrabold text-white text-center mb-1">Stock Market Knowledge</h2>
              <p className="text-white/50 text-sm text-center mb-8">There's no wrong answer — be honest!</p>
              <div className="flex flex-col gap-4">
                {[
                  { val: true,  icon: "✅", label: "Yes, I know about stocks",  sub: "I understand shares and how to invest" },
                  { val: false, icon: "🤷", label: "No, I'm not familiar yet",   sub: "I'd like to learn where to start" },
                ].map(opt => (
                  <button
                    key={String(opt.val)}
                    onClick={() => update("knowsStocks", opt.val)}
                    className="p-4 rounded-2xl text-left transition-all duration-200"
                    style={{
                      background: form.knowsStocks === opt.val ? "rgba(245,158,11,0.18)" : "rgba(255,255,255,0.06)",
                      border: `1px solid ${form.knowsStocks === opt.val ? "rgba(245,158,11,0.6)" : "rgba(255,255,255,0.1)"}`,
                      outline: "none",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{opt.icon}</span>
                      <div>
                        <div className="text-white font-semibold">{opt.label}</div>
                        <div className="text-white/40 text-xs">{opt.sub}</div>
                      </div>
                      {form.knowsStocks === opt.val && <span className="ml-auto text-yellow-400 text-xl">✓</span>}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={back} className={btnBack}>← Back</button>
                <button
                  onClick={next}
                  disabled={form.knowsStocks === null}
                  className={btnNext}
                  style={{ background: "linear-gradient(90deg,#f59e0b,#d97706)" }}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 3: Daily Income ─── */}
          {step === 3 && (
            <div>
              <div className="text-5xl text-center mb-3">💰</div>
              <h2 className="text-2xl font-extrabold text-white text-center mb-1">How much do you earn?</h2>
              <p className="text-white/50 text-sm text-center mb-8">Enter your approximate income per working day</p>

              <div className="mb-4">
                <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">Daily Income (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400 font-bold text-xl">₹</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 2000"
                    value={form.dailyIncome}
                    onChange={e => update("dailyIncome", e.target.value)}
                    className="w-full pl-11 pr-4 py-4 rounded-xl text-white text-lg font-semibold placeholder-white/20 outline-none focus:ring-2 focus:ring-yellow-400"
                    style={inputStyle}
                  />
                </div>
              </div>

              {form.dailyIncome > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "Weekly",  val: parseFloat(form.dailyIncome) * 6,  color: "#6366f1" },
                    { label: "Monthly", val: parseFloat(form.dailyIncome) * 26, color: "#10b981" },
                    { label: "Yearly",  val: parseFloat(form.dailyIncome) * 312,color: "#f59e0b" },
                  ].map(c => (
                    <div key={c.label} className="p-3 rounded-xl text-center"
                         style={{ background: c.color + "18", border: `1px solid ${c.color}40` }}>
                      <div className="text-xs font-semibold mb-1" style={{ color: c.color }}>{c.label}</div>
                      <div className="text-white font-bold text-sm">₹{c.val.toLocaleString("en-IN")}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3 mt-2">
                <button onClick={back} className={btnBack}>← Back</button>
                <button
                  onClick={next}
                  disabled={!form.dailyIncome || parseFloat(form.dailyIncome) <= 0}
                  className={btnNext}
                  style={{ background: "linear-gradient(90deg,#f59e0b,#d97706)" }}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 4: Spending ─── */}
          {step === 4 && (
            <div>
              <div className="text-5xl text-center mb-3">🛒</div>
              <h2 className="text-2xl font-extrabold text-white text-center mb-1">Your Spending Habits</h2>
              <p className="text-white/50 text-sm text-center mb-8">Include food, transport, rent, bills, and all other costs</p>

              {[
                { key: "dailySpend",   label: "Daily Spending (₹)",          placeholder: "e.g. 400" },
                { key: "weeklySpend",  label: "Weekly Spending (₹)",         placeholder: "e.g. 1200" },
                { key: "monthlySpend", label: "Monthly Fixed Expenses (₹)",  placeholder: "e.g. 8000 (rent, EMI, bills…)" },
              ].map(f => (
                <div key={f.key} className="mb-4">
                  <label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">{f.label}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400 font-bold">₹</span>
                    <input
                      type="number"
                      min="0"
                      placeholder={f.placeholder}
                      value={form[f.key]}
                      onChange={e => update(f.key, e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-yellow-400"
                      style={inputStyle}
                    />
                  </div>
                </div>
              ))}

              <div className="flex gap-3 mt-4">
                <button onClick={back} className={btnBack}>← Back</button>
                <button
                  onClick={submit}
                  disabled={!form.dailySpend || !form.weeklySpend || !form.monthlySpend}
                  className={btnNext}
                  style={{ background: "linear-gradient(90deg,#10b981,#059669)" }}
                >
                  Get My Plan 🚀
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
