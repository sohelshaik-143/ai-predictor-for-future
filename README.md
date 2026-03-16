<div align="center">

# 🧠 APS AI Platform

### *Financial Intelligence · Job Discovery · Worker Empowerment · Multilingual AI*

**One platform. Four life-changing tools. Built for every Indian.**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-10b981?style=for-the-badge)](https://frontend-seven-sigma-4xq7uomq89.vercel.app)
[![Backend API](https://img.shields.io/badge/⚡_Backend_API-Render-6366f1?style=for-the-badge)](https://ai-predictor-backend.onrender.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.5-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-f59e0b?style=flat-square)](LICENSE)

---

> *From a ₹300/day labourer in Mumbai to a software professional in Bangalore — APS gives every Indian the tools to understand their money, find better work, and build a real future. Free. Fast. In their own language.*

</div>

---

## 📌 What is APS AI Platform?

**APS AI Platform** is a production-grade, full-stack web application that brings together four powerful tools under one roof — an AI financial predictor, a live job board, a worker wage tracker, and a multilingual AI chatbot.

It was built to solve a real problem: **millions of Indian workers have no access to financial guidance, job discovery tools, or career advice in their native language.** APS changes that.

---

## ✨ Four Tools. One Platform.

<table>
<tr>
<td align="center" width="25%">

### 📊
**AI Financial Predictor**

Predict your income, get an investment plan, track savings, and watch the live NSE/BSE market — all from one dashboard.

`Login Required`

</td>
<td align="center" width="25%">

### 💼
**WorkIndia Job Board**

Post and browse live jobs across 12 cities in 6 Indian languages. Zero fees. WhatsApp apply in one tap.

`Public Access`

</td>
<td align="center" width="25%">

### 👷
**Worker Hub**

Track 7-day wages, get alerted when you're underpaid, find better-paying cities on Google Maps, and apply for part-time gigs.

`Login Required`

</td>
<td align="center" width="25%">

### 🤖
**AI Chat Assistant**

Ask anything about finance, jobs, or wages. Pre-trained on 50+ topics in 7 Indian languages, available 24/7.

`Public Access`

</td>
</tr>
</table>

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                              │
│          React 18 · Tailwind CSS · React Router v6               │
│                Deployed on → Vercel (CDN)                        │
└──────────────────────────┬───────────────────────────────────────┘
                           │  HTTPS / REST
┌──────────────────────────▼───────────────────────────────────────┐
│                  Spring Boot 3.2.5 (Java 17)                     │
│         JWT Auth · Google OAuth2 · CORS · REST API               │
│              Deployed on → Render (Docker)                       │
└────────────────┬─────────────────────────┬───────────────────────┘
                 │                         │
   ┌─────────────▼──────────┐   ┌──────────▼──────────────────────┐
   │     MongoDB Atlas       │   │     ML Prediction Service        │
   │  users · jobs · income  │   │  FastAPI + Python (Vercel)       │
   └────────────────────────┘   └─────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | React 18 (Create React App) |
| Routing | React Router v6 |
| Styling | Tailwind CSS + Inline styles |
| HTTP Client | Axios (65s timeout for Render cold starts) |
| State | React hooks + LocalStorage |
| Deployment | Vercel |

### Backend
| Layer | Technology |
|-------|-----------|
| Framework | Spring Boot 3.2.5 |
| Security | Spring Security + JWT + Google OAuth2 |
| Database ORM | Spring Data MongoDB |
| Build Tool | Maven |
| Deployment | Render (Docker Web Service) |

### Infrastructure
| Service | Role |
|---------|------|
| Vercel | Frontend static hosting |
| Render | Spring Boot Docker container |
| MongoDB Atlas | Cloud NoSQL database (M0 free) |
| Vercel (ml-vercel) | FastAPI ML microservice |

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+
- Java 17+
- Maven 3.8+
- MongoDB URI (Atlas or local)

### 1 — Clone
```bash
git clone https://github.com/sohelshaik-143/ai-predictor-for-future.git
cd ai-predictor-for-future
```

### 2 — Backend
```bash
cd backend

# Set your environment variables (or create application-local.properties)
export MONGODB_URI="mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/aipredictor"
export JWT_SECRET="your_super_secret_key"
export GOOGLE_CLIENT_ID="your_google_client_id"
export GOOGLE_CLIENT_SECRET="your_google_client_secret"
export FRONTEND_URL="http://localhost:3000"
export ADMIN_EMAIL="your@email.com"

mvn spring-boot:run
# → API running at http://localhost:8084
```

### 3 — Frontend
```bash
cd frontend
npm install

# Create local env file
echo "REACT_APP_API_BASE=http://localhost:8084/api" > .env.local

npm start
# → App running at http://localhost:3000
```

### 4 — ML Service *(optional)*
```bash
cd ml-vercel
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## 📱 Routes Reference

| Route | Page | Auth |
|-------|------|:----:|
| `/` | Home — landing page & platform overview | ✅ Public |
| `/login` | Sign in with email or Google | ✅ Public |
| `/register` | Create a new account | ✅ Public |
| `/my-dashboard` | Personal hub — session timer, activity log, tool launcher | 🔒 Auth |
| `/dashboard` | AI Financial Predictor | 🔒 Auth |
| `/financial-setup` | Multi-step financial profile wizard | 🔒 Auth |
| `/investment-plan` | Personalised investment recommendations | 🔒 Auth |
| `/profile` | User settings & account info | 🔒 Auth |
| `/worker` | Worker Hub — wages, city tips, part-time jobs | 🔒 Auth |
| `/jobs` | WorkIndia Job Board | ✅ Public |
| `/chat` | AI Financial Chat Assistant | ✅ Public |

---

## 🌐 REST API Reference

### Auth
```
POST  /api/auth/register           Create account
POST  /api/auth/login              Login → returns { accessToken }
GET   /oauth2/authorization/google Google OAuth2 redirect
```

### Job Board
```
GET    /api/jobs                   All active jobs (public)
GET    /api/jobs?city=Mumbai       Filter by city
GET    /api/jobs?category=Driver   Filter by category
GET    /api/jobs/{id}              Single job detail
POST   /api/jobs                   Post a job     [JWT required]
PATCH  /api/jobs/{id}/toggle       Toggle active  [owner or admin]
DELETE /api/jobs/{id}              Delete job     [owner or admin]
GET    /api/jobs/my                My posted jobs [JWT required]
```

### Income & Prediction
```
GET   /api/income                  Get income history      [JWT]
POST  /api/income                  Add income entry        [JWT]
POST  /api/predict                 AI income prediction    [JWT]
```

---

## 🔑 Feature Deep Dives

### 📊 AI Financial Predictor
- Enter daily or monthly income and instantly see **monthly, yearly, and 5-year projections**
- **Financial Health Score** (0–100) — calculated from savings rate, consistency, and growth trend
- **AI investment plan** — recommends PPF, SIP, FD, gold, or equities based on your risk profile
- **Live NSE/BSE stock ticker** — 10 major stocks with real-time price simulation
- Tax savings estimator, emergency fund calculator, and consistency scoring

### 💼 WorkIndia Job Board
- Live listings from MongoDB — not hardcoded, refreshed on every load
- Full **CRUD**: post, view, toggle on/off, delete — with ownership checks
- **Admin control** via `ADMIN_EMAIL` env var — admin can manage any listing
- **WhatsApp apply** — tap to open a pre-filled WhatsApp message to the employer
- Full **multilingual UI** — 6 languages, switchable mid-session

### 👷 Worker Hub
- **7-day wage log** — visual KPI cards: avg/total/best/worst day
- **Low income alert**: if daily avg < ₹500 → shows 5 recommended Indian cities with job demand data, avg pay, and embedded Google Maps
- **Part-time jobs** — 12 categories including delivery, BPO, data entry, tutoring, content writing, Amazon Flex
- **Adzuna API integration** — tries live job data, falls back to curated static listings

### 🤖 AI Chat Assistant
- **50+ knowledge base entries** covering: SIP, PPF, FD, stocks, mutual funds, gold, crypto, insurance, IPO, dividends, tax, loans, real estate, and all platform features
- **Keyword matching engine** — scans user query against KB tags for accurate answers
- **7 Indian languages** — every KB answer has translations for en/hi/te/ta/kn/mr
- **12 suggestion chips** to guide new users
- Simulated typing delay for a natural conversation feel

---

## 🌍 Language Support

| Language | Code | Tools |
|----------|------|-------|
| English | `en` | All |
| हिंदी Hindi | `hi` | All |
| తెలుగు Telugu | `te` | Dashboard, Jobs, Chat |
| தமிழ் Tamil | `ta` | Dashboard, Jobs, Chat |
| ಕನ್ನಡ Kannada | `kn` | Dashboard, Jobs, Chat |
| मराठी Marathi | `mr` | Dashboard, Jobs, Chat |

---

## 🔒 Security Practices

| Area | Implementation |
|------|---------------|
| Authentication | JWT Bearer tokens, 1-hour expiry |
| Social Login | Google OAuth2 with secure server-side redirect |
| CORS | `setAllowedOriginPatterns` — `*.vercel.app`, `*.onrender.com`, localhost |
| Database | MongoDB Atlas TLS 1.2/1.3 enforced |
| Secrets | All credentials in environment variables, never committed |
| Admin | Protected by `ADMIN_EMAIL` env var server-side check |

---

## 📂 Project Structure

```
ai-predictor-for-future/
│
├── frontend/                          # React 18 SPA
│   └── src/
│       ├── pages/
│       │   ├── Home.jsx               # Landing page
│       │   ├── MyDashboard.jsx        # Hub — session tracker + tool launcher
│       │   ├── Dashboard.jsx          # AI Financial Predictor
│       │   ├── WorkerHub.jsx          # Wage tracker + job finder
│       │   ├── JobBoard.jsx           # Live job listings
│       │   ├── ChatPage.jsx           # AI assistant
│       │   ├── FinancialSetup.jsx     # Onboarding wizard
│       │   ├── InvestmentPlan.jsx     # Investment recommendations
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   └── Profile.jsx
│       ├── components/
│       │   └── OnboardingModal.jsx    # First-login role selector
│       ├── api/api.js                 # Axios instance + auth helpers
│       ├── data/indianJobs.js         # City & part-time job data
│       ├── i18n/jobLang.js            # Job board i18n translations
│       └── utils/tracker.js          # Session + activity tracker
│
├── backend/                           # Spring Boot API
│   └── src/main/java/com/aipredictor/
│       ├── config/
│       │   ├── SecurityConfig.java    # CORS, OAuth2, JWT setup
│       │   └── JwtFilter.java         # Per-request JWT validation
│       ├── controller/
│       │   ├── AuthController.java
│       │   ├── JobController.java
│       │   └── PredictionController.java
│       ├── model/
│       │   ├── User.java
│       │   └── Job.java
│       └── repository/
│           ├── UserRepository.java
│           └── JobRepository.java
│
├── ml-service/                        # Local FastAPI ML model
├── ml-vercel/                         # Vercel-deployed ML API
├── docker-compose.yml                 # Full local stack
└── render.yaml                        # Render deployment config
```

---

## ☁️ Deployment Guide

### Frontend → Vercel
```bash
cd frontend
npx vercel deploy --prod
# Set REACT_APP_API_BASE = https://ai-predictor-backend.onrender.com/api
```

### Backend → Render
- Type: **Docker Web Service**
- Required env vars:
```
MONGODB_URI
JWT_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
FRONTEND_URL=https://your-vercel-url.vercel.app
ADMIN_EMAIL=your@email.com
JAVA_TOOL_OPTIONS=-Djdk.tls.client.protocols=TLSv1.2,TLSv1.3
```

### MongoDB Atlas
- Free tier M0 cluster
- Network Access: add `0.0.0.0/0` (required for Render dynamic IPs)
- Collections auto-created: `users`, `jobs`, `incomes`

---

## 🤝 Contributing

1. Fork the repository
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: describe your change'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author

**Shaik Imam Basha**
GitHub: [@sohelshaik-143](https://github.com/sohelshaik-143)
Email: shaikimambasha968@gmail.com

---

<div align="center">

**⭐ If this project helped you, please give it a star!**

*Free · Secure · Multilingual · AI Powered · Made with ❤️ for India*

</div>
