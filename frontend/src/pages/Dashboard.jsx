import React, { useEffect, useState, useMemo } from "react";
import { getIncome, addIncome, logoutUser, getPrediction } from "../api/api";
import DashboardCard from "../components/DashboardCard";
import IncomeChart from "../components/IncomeChart";
import IncomeForm from "../components/IncomeForm";

export default function Dashboard({ onLogout }) {
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiPrediction, setAiPrediction] = useState([]);

  // =========================
  // Load Income Data
  // =========================
  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getIncome();
      if (!Array.isArray(data)) throw new Error("Invalid income data");
      setIncomeData(data);

      // Fetch AI predicted data
      try {
        const predicted = await getPrediction();
        if (Array.isArray(predicted)) setAiPrediction(predicted);
      } catch (err) {
        console.warn("AI prediction error:", err);
        setAiPrediction([]);
      }

    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // =========================
  // Calculations
  // =========================
  const totalIncome = useMemo(
    () => incomeData.reduce((acc, d) => acc + (d.amount || 0), 0),
    [incomeData]
  );

  const averageIncome = useMemo(
    () => (incomeData.length ? Math.round(totalIncome / incomeData.length) : 0),
    [incomeData, totalIncome]
  );

  const growthRate = useMemo(() => {
    if (incomeData.length < 2) return 0;
    const last = incomeData[incomeData.length - 1].amount || 0;
    const prev = incomeData[incomeData.length - 2].amount || 0;
    if (prev === 0) return 0;
    return (((last - prev) / prev) * 100).toFixed(1);
  }, [incomeData]);

  // =========================
  // Handle Add Income
  // =========================
  const handleAddIncome = async (amount) => {
    try {
      await addIncome(amount);
      await loadDashboard();
    } catch (err) {
      alert(err.message || "Failed to add income");
    }
  };

  // =========================
  // Logout
  // =========================
  const handleLogout = () => {
    logoutUser();
    onLogout();
  };

  // =========================
  // Render
  // =========================
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 p-6 animate-fadeIn">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <h1 className="text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">
            APS AI Financial Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 transition transform hover:scale-105 px-6 py-3 rounded-xl text-white font-bold shadow-lg"
          >
            Logout
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6 shadow-lg">
            ⚠️ {error}
          </div>
        )}

        {/* Income Form */}
        <div className="glass p-6 rounded-2xl shadow-xl backdrop-blur-lg border border-white/20 mb-10">
          <IncomeForm onAddIncome={handleAddIncome} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <DashboardCard
            title="Total Income"
            value={totalIncome}
            icon="💰"
          />
          <DashboardCard
            title="Average Income"
            value={averageIncome}
            icon="📊"
          />
          <DashboardCard
            title="Growth Rate"
            value={`${growthRate}%`}
            icon={growthRate >= 0 ? "📈" : "📉"}
            growth={growthRate}
          />
        </div>

        {/* AI Prediction Section */}
        <div className="mt-12 glass p-6 rounded-2xl border border-yellow-400 shadow-2xl backdrop-blur-lg animate-fadeIn">
          <h3 className="text-3xl font-semibold text-yellow-300 mb-4">
            AI Trend Prediction
          </h3>
          <p className="text-white mb-4">
            Next cycle projected values based on AI trend:
          </p>
          <div className="flex flex-wrap gap-3">
            {aiPrediction.length
              ? aiPrediction.map((val, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 bg-green-500/40 text-white rounded-lg font-mono shadow-md hover:bg-green-500 transition transform hover:scale-105"
                  >
                    ₹ {val}
                  </div>
                ))
              : <p className="text-white/60">No predictions available</p>
            }
          </div>
        </div>

        {/* Chart Section */}
        <div className="mt-12 glass p-6 rounded-2xl shadow-2xl backdrop-blur-lg border border-yellow-300">
          <h3 className="text-3xl font-semibold mb-4 text-gray-100">Income Analytics</h3>
          <IncomeChart data={incomeData.map(d => d.amount)} prediction={aiPrediction} />
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-white mt-6 text-center text-xl animate-pulse">
            🔄 Loading dashboard data...
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-white/70 text-sm">
          © 2026 APS AI | All Rights Reserved
        </footer>
      </div>
    </div>
  );
}