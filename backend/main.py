"""Food Bridge API — FastAPI backend.

Run locally:
    pip install -r requirements.txt --break-system-packages
    uvicorn main:app --reload --port 8000

Docs available at http://localhost:8000/docs once running.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import donations, ngo, volunteers, auth
from ai.predict_surplus import predict_surplus_trend
from seed_data import ANALYTICS

app = FastAPI(
    title="Food Bridge API",
    description="Backend for the Food Bridge intelligent food redistribution platform.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(donations.router)
app.include_router(ngo.router)
app.include_router(volunteers.router)
app.include_router(auth.router)


@app.get("/")
def root():
    return {"service": "Food Bridge API", "status": "running", "docs": "/docs"}


@app.get("/api/ai/predict-surplus")
def predict_surplus(days_ahead: int = 7):
    """AI: forecast surplus meals for the next N days from monthly history."""
    history = ANALYTICS["monthly"]["mealsSaved"]
    forecast = predict_surplus_trend(history, days_ahead=days_ahead)
    return {"history": history, "forecast": forecast, "daysAhead": days_ahead}
