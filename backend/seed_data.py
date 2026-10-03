"""Seed data for demo/dev mode. Mirrors frontend/src/services/mockData.js
so the FastAPI backend and the React UI agree when VITE_USE_MOCK_DATA=false."""
from datetime import datetime, timedelta


def _in(mins):
    return (datetime.utcnow() + timedelta(minutes=mins)).isoformat()


def _ago(mins):
    return (datetime.utcnow() - timedelta(minutes=mins)).isoformat()


DONATIONS = [
    {
        "id": "FD-2201", "foodName": "Vegetable Biryani", "category": "Cooked Meal", "vegType": "veg",
        "quantityKg": 12, "meals": 40, "expiryTime": _in(90), "pickupTime": _in(30),
        "description": "Freshly prepared, from a wedding event.", "donor": "Green Leaf Bakery", "donorId": "don_101",
        "location": {"lat": 12.9716, "lng": 77.5946, "address": "MG Road, Bengaluru"},
        "contact": "+91 98450 12345", "status": "available", "createdAt": _ago(10),
    },
    {
        "id": "FD-2202", "foodName": "Bread & Pastries", "category": "Bakery", "vegType": "veg",
        "quantityKg": 8, "meals": 25, "expiryTime": _in(240), "pickupTime": _in(60),
        "description": "End-of-day surplus bakery items.", "donor": "Sunrise Bakers", "donorId": "don_102",
        "location": {"lat": 12.9789, "lng": 77.6008, "address": "Indiranagar, Bengaluru"},
        "contact": "+91 98450 22345", "status": "accepted", "ngo": "Anna Seva Foundation", "createdAt": _ago(45),
    },
    {
        "id": "FD-2203", "foodName": "Chicken Curry & Rice", "category": "Cooked Meal", "vegType": "non-veg",
        "quantityKg": 20, "meals": 60, "expiryTime": _in(45), "pickupTime": _in(15),
        "description": "Corporate event surplus, short expiry window.", "donor": "Taj Convention Center", "donorId": "don_103",
        "location": {"lat": 12.9558, "lng": 77.6497, "address": "Whitefield, Bengaluru"},
        "contact": "+91 98450 32345", "status": "volunteer_assigned", "ngo": "Anna Seva Foundation",
        "volunteer": "Rahul Menon", "createdAt": _ago(20),
    },
]

NGOS = [
    {"id": "ngo_204", "name": "Anna Seva Foundation", "location": {"lat": 12.9352, "lng": 77.6146}, "capacity": 200, "rating": 4.9},
    {"id": "ngo_205", "name": "Bengaluru Food Relief", "location": {"lat": 12.9611, "lng": 77.5750}, "capacity": 150, "rating": 4.6},
    {"id": "ngo_206", "name": "Hope Kitchen Trust", "location": {"lat": 12.9950, "lng": 77.6900}, "capacity": 100, "rating": 4.8},
]

VOLUNTEERS = [
    {"id": "vol_309", "name": "Rahul Menon", "location": {"lat": 12.9611, "lng": 77.6387}, "available": True, "rating": 4.7, "deliveries": 42},
    {"id": "vol_310", "name": "Priya Nair", "location": {"lat": 12.9350, "lng": 77.6100}, "available": True, "rating": 4.9, "deliveries": 78},
    {"id": "vol_311", "name": "Arjun Iyer", "location": {"lat": 12.9800, "lng": 77.6300}, "available": False, "rating": 4.5, "deliveries": 30},
]

NOTIFICATIONS = [
    {"id": "1", "userId": "don_101", "title": "Donation accepted", "body": "Anna Seva Foundation accepted your donation.", "type": "success", "read": False, "createdAt": _ago(4)},
    {"id": "2", "userId": "don_101", "title": "Volunteer assigned", "body": "Rahul Menon is on the way to pick up your donation.", "type": "info", "read": False, "createdAt": _ago(18)},
]

ANALYTICS = {
    "mealsSaved": 48210, "peopleFed": 16070, "foodSavedKg": 24105, "co2ReducedKg": 60262,
    "registeredDonors": 842, "registeredNgos": 96, "registeredVolunteers": 1310,
    "monthly": {
        "labels": ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        "mealsSaved": [4200, 5100, 6300, 7200, 8100, 9400],
        "foodWasteKg": [2100, 2550, 3150, 3600, 4050, 4700],
    },
}
