"""AI recommendation module.

Implements the features called for in the spec — nearest-NGO matching,
nearest-volunteer matching, expiry-based prioritization, delivery-time
estimation, and route/priority suggestions — using transparent, tunable
heuristics (distance + capacity + rating scoring). This is intentionally
built so each scoring function can later be swapped for a trained
scikit-learn model (e.g. a learned weighting via LogisticRegression/XGBoost
on historical acceptance/delivery-time data) without changing the API shape.
"""
from __future__ import annotations
import math
from datetime import datetime
from typing import List, Dict, Any


def haversine_km(a: Dict[str, float], b: Dict[str, float]) -> float:
    """Great-circle distance in km between two {lat, lng} points."""
    r = 6371.0
    lat1, lat2 = math.radians(a["lat"]), math.radians(b["lat"])
    dlat = math.radians(b["lat"] - a["lat"])
    dlng = math.radians(b["lng"] - a["lng"])
    h = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlng / 2) ** 2
    return r * 2 * math.atan2(math.sqrt(h), math.sqrt(1 - h))


def minutes_to_expiry(donation: Dict[str, Any]) -> float:
    expiry = datetime.fromisoformat(donation["expiryTime"].replace("Z", ""))
    return (expiry - datetime.utcnow()).total_seconds() / 60


def urgency_score(donation: Dict[str, Any]) -> int:
    """0-100 urgency score combining time pressure and donation size."""
    mins_left = minutes_to_expiry(donation)
    if mins_left <= 0:
        return 0
    time_pressure = max(0.0, 100 - mins_left / 3)
    size_factor = min(20.0, donation.get("meals", 0) / 5)
    return round(min(100, time_pressure * 0.8 + size_factor))


def estimate_delivery_minutes(distance_km: float, avg_speed_kmh: float = 25) -> int:
    """ETA in minutes assuming average city traffic speed + fixed handling buffer."""
    return round((distance_km / avg_speed_kmh) * 60 + 8)


def recommend_ngos(donation: Dict[str, Any], ngo_list: List[Dict[str, Any]], top_n: int = 5) -> List[Dict[str, Any]]:
    """Rank NGOs for a donation by weighted distance / capacity / rating score."""
    results = []
    for ngo in ngo_list:
        dist = haversine_km(donation["location"], ngo["location"])
        eta = estimate_delivery_minutes(dist)
        dist_score = max(0.0, 1 - dist / 20)
        capacity_score = min(1.0, ngo.get("capacity", 0) / 200)
        rating_score = ngo.get("rating", 5) / 5
        score = dist_score * 0.55 + capacity_score * 0.25 + rating_score * 0.2
        results.append({**ngo, "distanceKm": round(dist, 1), "etaMinutes": eta, "matchScore": round(score * 100)})
    results.sort(key=lambda r: r["matchScore"], reverse=True)
    return results[:top_n]


def recommend_volunteers(donation: Dict[str, Any], volunteer_list: List[Dict[str, Any]], top_n: int = 5) -> List[Dict[str, Any]]:
    """Rank available volunteers for a pickup by proximity and delivery track record."""
    results = []
    for v in volunteer_list:
        if not v.get("available", True):
            continue
        dist = haversine_km(donation["location"], v["location"])
        eta = estimate_delivery_minutes(dist)
        dist_score = max(0.0, 1 - dist / 15)
        track_score = min(1.0, v.get("deliveries", 0) / 100) * 0.5 + (v.get("rating", 5) / 5) * 0.5
        score = dist_score * 0.65 + track_score * 0.35
        results.append({**v, "distanceKm": round(dist, 1), "etaMinutes": eta, "matchScore": round(score * 100)})
    results.sort(key=lambda r: r["matchScore"], reverse=True)
    return results[:top_n]


def prioritize_donations(donation_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Sort active donations by urgency (expiry pressure + size) — used to
    build the NGO/volunteer priority queue and highlight at-risk donations."""
    active = [d for d in donation_list if d.get("status") not in ("delivered", "expired", "cancelled")]
    for d in active:
        d["urgency"] = urgency_score(d)
    active.sort(key=lambda d: d["urgency"], reverse=True)
    return active


def suggest_highest_priority(donation_list: List[Dict[str, Any]]) -> Dict[str, Any] | None:
    ranked = prioritize_donations(donation_list)
    return ranked[0] if ranked else None
