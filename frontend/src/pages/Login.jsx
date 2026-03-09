import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  /* =========================
     HANDLE LOGIN
  ========================= */
  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await loginUser(email, password);

      localStorage.setItem("aip_token", res.token);
      navigate("/dashboard");

    } catch (err) {
      setError(err || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     VOICE LOGIN CONTROL
  ========================= */
  const handleVoiceLogin = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
      setError("");
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript.toLowerCase().trim();

      if (transcript.includes("login")) {
        handleLogin();
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  /* =========================
     SOCIAL LOGIN
  ========================= */
  const handleSocialLogin = (provider) => {
    window.location.href = `http://localhost:8080/oauth2/authorize/${provider}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-teal-800 to-green-700">

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-96 border-4 border-yellow-400">

        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          APS AI Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-300 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          onClick={handleVoiceLogin}
          className={`w-full mt-3 py-3 rounded-xl text-white font-semibold transition ${
            listening
              ? "bg-red-500 animate-pulse"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {listening ? "Listening..." : "🎤 Voice Login"}
        </button>

        {error && (
          <div className="text-red-500 text-sm mt-3 text-center">
            {error}
          </div>
        )}

        <p className="my-4 text-gray-500 text-center">Or login with</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleSocialLogin("google")}
            className="bg-red-500 text-white py-2 px-4 rounded-xl hover:scale-105 transition-transform"
          >
            Google
          </button>

          <button
            onClick={() => handleSocialLogin("facebook")}
            className="bg-blue-600 text-white py-2 px-4 rounded-xl hover:scale-105 transition-transform"
          >
            Facebook
          </button>
        </div>

        <p className="mt-6 text-center text-gray-500">
          Don't have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer font-semibold"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;