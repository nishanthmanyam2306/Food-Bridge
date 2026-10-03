from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException
import uuid

from models.schemas import DonationCreate, StatusUpdate
from database.firestore import InMemoryCollection
from seed_data import DONATIONS, NGOS, VOLUNTEERS
from ai.recommend import recommend_ngos, recommend_volunteers, prioritize_donations

router = APIRouter(prefix="/api/donations", tags=["donations"])

_donations = InMemoryCollection(seed=DONATIONS)


@router.get("")
def list_donations(status: Optional[str] = None, veg_type: Optional[str] = None, prioritized: bool = False):
    items = _donations.all()
    if status:
        items = [d for d in items if d["status"] == status]
    if veg_type:
        items = [d for d in items if d["vegType"] == veg_type]
    if prioritized:
        items = prioritize_donations(items)
    return items


@router.get("/{donation_id}")
def get_donation(donation_id: str):
    donation = _donations.get(donation_id)
    if not donation:
        raise HTTPException(404, "Donation not found")
    return donation


@router.post("", status_code=201)
def create_donation(payload: DonationCreate):
    donation_id = f"FD-{uuid.uuid4().hex[:6].upper()}"
    record = {
        **payload.model_dump(mode="json"),
        "id": donation_id,
        "status": "available",
        "createdAt": datetime.utcnow().isoformat(),
    }
    _donations.set(donation_id, record)
    return record


@router.patch("/{donation_id}/status")
def update_status(donation_id: str, payload: StatusUpdate):
    updated = _donations.update(donation_id, {"status": payload.status.value})
    if not updated:
        raise HTTPException(404, "Donation not found")
    return updated


@router.get("/{donation_id}/recommend-ngos")
def get_ngo_recommendations(donation_id: str):
    """AI: recommend nearest / best-fit NGOs for this donation."""
    donation = _donations.get(donation_id)
    if not donation:
        raise HTTPException(404, "Donation not found")
    return recommend_ngos(donation, NGOS)


@router.get("/{donation_id}/recommend-volunteers")
def get_volunteer_recommendations(donation_id: str):
    """AI: recommend nearest / best-fit volunteers for this pickup."""
    donation = _donations.get(donation_id)
    if not donation:
        raise HTTPException(404, "Donation not found")
    return recommend_volunteers(donation, VOLUNTEERS)
