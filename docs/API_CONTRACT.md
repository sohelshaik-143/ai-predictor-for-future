# API Contract

Backend endpoints

- POST /api/auth/register
  - body: { name, email, password }
  - response: { message }

- POST /api/auth/login
  - body: { email, password }
  - response: { token }

- POST /api/income
  - body: { date, amount, source }
  - response: { message }

- GET /api/income/summary?userId=ID
  - response: { total, weeklyTrend }

- POST /api/income/predict
  - body: { userId, recent_incomes }
  - response: { predicted_next_7d }

ML Service endpoints

- POST /ml/predict-income
  - body: { user_id, recent_incomes: [{date,amount}], occupation, city }
  - response: { predicted_next_7d, volatility, confidence }

- POST /ml/predict-risk
  - body: { predicted_series, savings_rate, debt_ratio }
  - response: { risk_score, risk_class, reasons }
