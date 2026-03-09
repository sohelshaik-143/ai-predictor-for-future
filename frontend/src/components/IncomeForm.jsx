import React, { useState, useRef } from "react";

export default function IncomeForm({ onAddIncome }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  /* =========================
     ADD INCOME
  ========================= */
  const handleAdd = async () => {
    const val = parseFloat(amount);

    if (!val || val <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await onAddIncome(val);
      setAmount("");
    } catch (err) {
      setError("Failed to add income.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     VOICE INPUT
  ========================= */
  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice input not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
      setError("");
    };

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      const num = parseFloat(transcript.replace(/[^0-9.]/g, ""));
      if (!isNaN(num)) {
        setAmount(num.toString()); // Fill input first
      } else {
        setError("Could not detect a valid number.");
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  /* =========================
     ENTER KEY SUPPORT
  ========================= */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-yellow-400 p-6 rounded-2xl mb-6 shadow-xl">

      <div className="flex flex-col md:flex-row gap-4 items-center">

        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter income amount"
          className="flex-1 p-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <button
          onClick={handleAdd}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white font-semibold disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Income"}
        </button>

        <button
          onClick={handleVoiceInput}
          className={`px-6 py-3 rounded-xl font-semibold text-white transition ${
            listening
              ? "bg-red-500 animate-pulse"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {listening ? "Listening..." : "🎤 Voice"}
        </button>

      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-400 mt-3 text-sm font-medium">
          {error}
        </div>
      )}

    </div>
  );
}