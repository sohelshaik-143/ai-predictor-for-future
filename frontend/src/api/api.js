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

// Fake Network Request Delay
const simulateDelay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

const getAssessmentData = () => {
   try {
     return JSON.parse(localStorage.getItem('user_assessment')) || null;
   } catch {
     return null;
   }
};

export const predictCareerMatch = async (profile) => {
  await simulateDelay(600);
  const data = getAssessmentData();
  if (!data) return [{ name: "General Tech", value: 50, color: "#6366f1" }];

  const isBigLeap = (data.currentRole.toLowerCase().includes('junior') && data.targetRole.toLowerCase().includes('senior'));
  
  return [
    { name: data.targetRole || "Software Engineer", value: isBigLeap ? 65 : 88, color: "#6366f1" },
    { name: "Engineering Manager", value: 45, color: "#8b5cf6" },
    { name: "Product Manager", value: 30, color: "#10b981" }
  ];
};

export const predictSalaryGrowth = async (currentSalary = 80000) => {
  await simulateDelay(700);
  const data = getAssessmentData();
  
  const baseCurve = currentSalary || (data ? (data.experienceYears * 10000 + 60000) : 80000);
  const growthRate = data ? (data.goal === 'salary_growth' ? 1.15 : 1.08) : 1.10;
  
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear+1, currentYear+2, currentYear+3, currentYear+4];
  return years.map((year, idx) => ({
    year: year.toString(),
    projected: Math.round(baseCurve * Math.pow(growthRate, idx))
  }));
};

export const detectSkillGap = async (role) => {
  await simulateDelay(500);
  const data = getAssessmentData();
  
  if (!data || !data.skillsArray) {
    return [
      { subject: 'System Design', A: 40, B: 110, fullMark: 150 },
      { subject: 'React/Frontend', A: 90, B: 130, fullMark: 150 }
    ];
  }

  const skills = data.skillsArray.slice(0, 5);
  while(skills.length < 5) skills.push("Core Tech");

  return skills.map((skill, idx) => {
     const userLevel = 60 + (data.experienceYears * 5) + (Math.random() * 20);
     return {
       subject: skill,
       A: Math.round(userLevel),
       B: Math.round(120 + Math.random() * 30),
       fullMark: 150
     }
  });
};

export const generateRoadmap = async () => {
  await simulateDelay(800);
  const data = getAssessmentData();
  const target = data ? data.targetRole : "Your Next Role";

  return [
    { title: `Master System Design for ${target}`, status: 'completed' },
    { title: `Advanced Analytics in ${data ? data.topSkills.split(',')[0] || 'Tech' : 'Tech'}`, status: 'in-progress' },
    { title: 'Update Resume with Aura Metrics', status: 'pending' },
    { title: 'Virtual Mock Interview #3', status: 'pending' }
  ];
};

export const scoreReadiness = async () => {
  await simulateDelay(400);
  const data = getAssessmentData();
  const expBoost = data ? Math.min(30, data.experienceYears * 5) : 0;
  const score = 55 + expBoost + Math.round(Math.random() * 10);
  
  let status = 'Action Required';
  let color = 'text-orange-500';

  if (score >= 85) { status = 'Excellent'; color = 'text-green-500'; }
  else if (score >= 70) { status = 'Good'; color = 'text-primary'; }

  return { score, status, color };
};

export default api;