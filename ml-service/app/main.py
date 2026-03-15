import os
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from typing import List, Optional
from fastapi.responses import JSONResponse

app = FastAPI(title="ML Service")


class IncomePoint(BaseModel):
    date: str
    amount: float


class PredictIncomeRequest(BaseModel):
    user_id: int
    recent_incomes: List[IncomePoint]
    occupation: Optional[str] = None
    city: Optional[str] = None


class PredictIncomeResponse(BaseModel):
    predicted_next_7d: List[float]
    volatility: float
    confidence: float


@app.post("/ml/predict-income", response_model=PredictIncomeResponse)
def predict_income(req: PredictIncomeRequest, x_api_key: Optional[str] = Header(None)):
    # Simple heuristic predictor stub — replace with a trained model
    if x_api_key is None:
        raise HTTPException(status_code=401, detail="Missing API key")
    amounts = [p.amount for p in req.recent_incomes]
    avg = sum(amounts) / max(1, len(amounts))
    predicted = [round(avg * (0.95 + 0.1 * (i/6)), 2) for i in range(7)]
    volatility = (max(amounts) - min(amounts)) if amounts else 0.0
    return PredictIncomeResponse(predicted_next_7d=predicted, volatility=volatility, confidence=0.8)


class PredictRiskRequest(BaseModel):
    predicted_series: List[float]
    savings_rate: Optional[float] = 0.0
    debt_ratio: Optional[float] = 0.0


class PredictRiskResponse(BaseModel):
    risk_score: int
    risk_class: str
    reasons: List[str]


@app.post("/ml/predict-risk", response_model=PredictRiskResponse)
def predict_risk(req: PredictRiskRequest, x_api_key: Optional[str] = Header(None)):
    if x_api_key is None:
        raise HTTPException(status_code=401, detail="Missing API key")
    mean_pred = sum(req.predicted_series) / max(1, len(req.predicted_series))
    variability = max(req.predicted_series) - min(req.predicted_series) if req.predicted_series else 0
    score = int(min(100, max(0, (variability / max(1, mean_pred)) * 100 - req.savings_rate * 20 + req.debt_ratio * 50)))
    if score < 30:
        cls = "low"
    elif score < 70:
        cls = "medium"
    else:
        cls = "high"
    reasons = [f"variability:{variability:.2f}", f"savings_rate:{req.savings_rate}"]
    return PredictRiskResponse(risk_score=score, risk_class=cls, reasons=reasons)


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)
