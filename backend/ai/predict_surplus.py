"""Surplus forecasting and demand analytics.

Uses a simple linear regression (scikit-learn) over historical daily meal
counts to project near-term surplus. With more historical data this is the
natural place to swap in a seasonal model (e.g. Prophet, ARIMA) — the
function signature is deliberately kept generic (list of daily totals in,
list of forecast totals out) so that swap doesn't touch the API layer.
"""
from __future__ import annotations
from typing import List
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression


def predict_surplus_trend(daily_meals: List[float], days_ahead: int = 7) -> List[int]:
    """Project `days_ahead` future daily meal/surplus totals from history."""
    if len(daily_meals) < 2:
        return []

    series = pd.Series(daily_meals)
    X = np.arange(len(series)).reshape(-1, 1)
    y = series.values

    model = LinearRegression()
    model.fit(X, y)

    future_X = np.arange(len(series), len(series) + days_ahead).reshape(-1, 1)
    preds = model.predict(future_X)
    return [max(0, round(float(p))) for p in preds]


def category_demand_breakdown(donations: List[dict]) -> dict:
    """Aggregate donation counts by category — powers the pie/bar charts."""
    if not donations:
        return {"labels": [], "values": []}
    df = pd.DataFrame(donations)
    counts = df["category"].value_counts()
    return {"labels": counts.index.tolist(), "values": counts.values.tolist()}


def top_contributors(donations: List[dict], key: str, meals_key: str = "meals", top_n: int = 5) -> List[dict]:
    """Generic leaderboard builder — used for top donors / NGOs by meals moved."""
    if not donations:
        return []
    df = pd.DataFrame(donations)
    if key not in df.columns:
        return []
    grouped = df.groupby(key)[meals_key].sum().sort_values(ascending=False).head(top_n)
    return [{"name": k, "meals": int(v)} for k, v in grouped.items()]
