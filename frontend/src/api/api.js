import axios from "axios";

/* =========================
   BASE CONFIG
========================= */

const API_BASE =
  process.env.REACT_APP_API_BASE || "http://localhost:8080/api";

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
  timeout: 10000,
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
    // Network error
    if (!error.response) {
      return Promise.reject("Network error. Check your connection.");
    }

    // Unauthorized (401) → React-controlled logout
    if (error.response.status === 401) {
      clearToken();

      // Notify app about logout
      window.dispatchEvent(new Event("auth-logout"));

      return Promise.reject("Session expired. Please login again.");
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

  if (data.token) {
    setToken(data.token);

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

export const getIncome = () => api.get("/income");

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

export const getPrediction = () => api.get("/predict");

/* =========================
   AI FEATURES
========================= */

export const getFinancialSuggestions = () =>
  api.get("/ai/suggestions");

export default api;