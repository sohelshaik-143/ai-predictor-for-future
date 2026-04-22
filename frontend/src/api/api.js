import axios from "axios";

/* =========================
   BASE CONFIG
========================= */

const API_BASE =
  process.env.REACT_APP_API_BASE || "http://localhost:8084/api";

// Docker-compose uses 'backend' as hostname when running in containers
const DOCKER_API_BASE = "http://backend:8084/api";

/* =========================
   TOKEN HELPERS
========================= */
export const getToken = () => localStorage.getItem("aip_token");

export const setToken = (token) =>
  localStorage.setItem("aip_token", token);

export const clearToken = () =>
  localStorage.removeItem("aip_token");

/* =========================
   AXIOS INSTANCE
========================= */
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 65000, // 65s — Render free tier cold start can take ~60s
});

/* =========================
   REQUEST INTERCEPTOR
   → Attach JWT automatically
========================= */
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
   → Handle global errors
========================= */
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Network error or timeout (Render free tier cold start)
    if (!error.response) {
      if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
        return Promise.reject("Server is waking up, please wait 30 seconds and try again.");
      }
      return Promise.reject("Network error. Check your connection.");
    }

    // Unauthorized (401) — only logout if user was already authenticated
    // (don't fire auth-logout on a failed login attempt)
    if (error.response.status === 401) {
      const wasLoggedIn = !!getToken();
      clearToken();
      if (wasLoggedIn) {
        window.dispatchEvent(new Event("auth-logout"));
        return Promise.reject("Session expired. Please login again.");
      }
      return Promise.reject(
        error.response.data?.message ||
        error.response.data?.error ||
        "Invalid credentials. Please check your email and password."
      );
    }

    return Promise.reject(
      error.response.data?.message ||
      error.response.data?.error ||
      "Something went wrong"
    );
  }
);

/* =========================
   AUTH APIs
========================= */

export const registerUser = (name, email, password) =>
  api.post("/auth/register", { name, email, password });

export const loginUser = async (email, password) => {
  const data = await api.post("/auth/login", { email, password });

  if (data.accessToken) {
    setToken(data.accessToken);

    // Notify app that login happened
    window.dispatchEvent(new Event("auth-login"));
  }

  return data;
};

export const logoutUser = () => {
  clearToken();

  // Notify app about logout
  window.dispatchEvent(new Event("auth-logout"));
};

/* =========================
   INCOME APIs
========================= */

export const getIncome = async () => {
  const response = await api.get("/income");
  // axios interceptor already returns response.data (the body)
  // Backend body: { timestamp, count, data: [...] } OR direct array
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.data)) return response.data;
  return [];
};

export const addIncome = (amount, source = "manual") =>
  api.post("/income", {
    date: new Date().toISOString().slice(0, 10),
    amount,
    source,
  });

export const deleteIncome = (id) =>
  api.delete(`/income/${id}`);

/* =========================
   PREDICTION APIs
========================= */

export const getPrediction = async () => {
  const response = await api.get("/income/predict");
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.predicted_next_7d)) return response.predicted_next_7d;
  return [];
};

/* =========================
   AI FEATURES
========================= */

export const getFinancialSuggestions = () =>
  api.get("/ai/suggestions");

/* =========================
   AURA AI SIMULATION LOGIC
   (Simulating frontend predictions for the God-Level UI)
========================= */

const simulateDelay = (ms = 1500) => new Promise(resolve => setTimeout(resolve, ms));

export const predictCareerMatch = async (profile) => {
  await simulateDelay(800);
  return [
    { name: 'Software Engineer', value: 92, color: '#6366f1' },
    { name: 'Solutions Architect', value: 85, color: '#06b6d4' },
    { name: 'Product Manager', value: 65, color: '#8b5cf6' },
    { name: 'Data Scientist', value: 40, color: '#10b981' },
  ];
};

export const predictSalaryGrowth = async (currentSalary = 80000) => {
  await simulateDelay(1000);
  const currentYear = new Date().getFullYear();
  return [
    { year: String(currentYear), actual: currentSalary, projected: currentSalary },
    { year: String(currentYear + 1), actual: null, projected: Math.round(currentSalary * 1.15) },
    { year: String(currentYear + 2), actual: null, projected: Math.round(currentSalary * 1.40) },
    { year: String(currentYear + 3), actual: null, projected: Math.round(currentSalary * 1.70) },
    { year: String(currentYear + 4), actual: null, projected: Math.round(currentSalary * 2.20) },
  ];
};

export const detectSkillGap = async (role) => {
  await simulateDelay(1200);
  return [
    { subject: 'System Design', A: 120, B: 140, fullMark: 150 },
    { subject: 'React / Frontend', A: 135, B: 110, fullMark: 150 },
    { subject: 'Cloud (AWS/GCP)', A: 86, B: 130, fullMark: 150 },
    { subject: 'Algorithms', A: 99, B: 125, fullMark: 150 },
    { subject: 'Leadership', A: 85, B: 90, fullMark: 150 },
    { subject: 'Communication', A: 115, B: 95, fullMark: 150 },
  ];
};

export const generateRoadmap = async () => {
  await simulateDelay(900);
  return [
    { title: "Master System Design basics", status: "completed" },
    { title: "Build scalable microservice", status: "in-progress" },
    { title: "Advanced AWS Certification", status: "pending" },
    { title: "Mock Interview Series", status: "pending" },
    { title: "Open Source Contribution", status: "pending" },
  ];
};

export const scoreReadiness = async () => {
  await simulateDelay(500);
  return {
    score: 78,
    status: "Action Required",
    color: "text-orange-500",
  };
};

export default api;