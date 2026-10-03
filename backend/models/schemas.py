"""Pydantic models shared across routes.

These mirror the Firestore collection shapes described in the project spec:
Users, Donations, NGOs, Volunteers, Deliveries, Notifications, Analytics, Feedback.
"""
from __future__ import annotations
from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class Role(str, Enum):
    donor = "donor"
    ngo = "ngo"
    volunteer = "volunteer"


class DonationStatus(str, Enum):
    available = "available"
    accepted = "accepted"
    volunteer_assigned = "volunteer_assigned"
    picked_up = "picked_up"
    in_transit = "in_transit"
    delivered = "delivered"
    expired = "expired"
    cancelled = "cancelled"


class VegType(str, Enum):
    veg = "veg"
    non_veg = "non-veg"


class GeoPoint(BaseModel):
    lat: float
    lng: float
    address: Optional[str] = None


class UserProfile(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: Role
    location: Optional[GeoPoint] = None
    phone: Optional[str] = None
    rating: float = 5.0
    created_at: datetime = Field(default_factory=datetime.utcnow)


class DonationCreate(BaseModel):
    foodName: str
    category: str
    vegType: VegType
    quantityKg: float
    meals: int
    expiryTime: datetime
    pickupTime: datetime
    description: Optional[str] = None
    location: GeoPoint
    contact: str
    donorId: str
    donor: str
    instructions: Optional[str] = None
    image: Optional[str] = None


class Donation(DonationCreate):
    id: str
    status: DonationStatus = DonationStatus.available
    ngoId: Optional[str] = None
    ngo: Optional[str] = None
    volunteerId: Optional[str] = None
    volunteer: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)


class StatusUpdate(BaseModel):
    status: DonationStatus


class NgoProfile(BaseModel):
    id: str
    name: str
    location: GeoPoint
    capacity: int
    rating: float = 5.0


class VolunteerProfile(BaseModel):
    id: str
    name: str
    location: GeoPoint
    available: bool = True
    rating: float = 5.0
    deliveries: int = 0


class Notification(BaseModel):
    id: str
    userId: str
    title: str
    body: str
    type: str = "info"
    read: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)


class Feedback(BaseModel):
    id: str
    userId: str
    message: str
    rating: Optional[int] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
