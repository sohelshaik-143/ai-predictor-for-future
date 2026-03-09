import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* =========================
     HANDLE REGISTER
  ========================= */
  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await registerUser(name, email, password);

      navigate("/login");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-teal-800 to-green-700">

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-96 border-4 border-yellow-400">

        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Create Your APS AI Account
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 mb-4 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
          onKeyDown={(e) => e.key === "Enter" && handleRegister()}
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-300 disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        {error && (
          <div className="text-red-500 text-sm mt-3 text-center">
            {error}
          </div>
        )}

        <p className="mt-6 text-center text-gray-500">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer font-semibold"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default Register;