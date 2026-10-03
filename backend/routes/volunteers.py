from fastapi import APIRouter, HTTPException
from database.firestore import InMemoryCollection
from seed_data import VOLUNTEERS, NOTIFICATIONS
from models.schemas import VolunteerProfile

router = APIRouter(prefix="/api", tags=["volunteers", "notifications"])

_volunteers = InMemoryCollection(seed=VOLUNTEERS)
_notifications = InMemoryCollection(seed=NOTIFICATIONS)


@router.get("/volunteers")
def list_volunteers(available: bool | None = None):
    items = _volunteers.all()
    if available is not None:
        items = [v for v in items if v["available"] == available]
    return items


@router.get("/volunteers/{volunteer_id}")
def get_volunteer(volunteer_id: str):
    v = _volunteers.get(volunteer_id)
    if not v:
        raise HTTPException(404, "Volunteer not found")
    return v


@router.post("/volunteers", status_code=201)
def register_volunteer(payload: VolunteerProfile):
    return _volunteers.set(payload.id, payload.model_dump(mode="json"))


@router.patch("/volunteers/{volunteer_id}/availability")
def set_availability(volunteer_id: str, available: bool):
    updated = _volunteers.update(volunteer_id, {"available": available})
    if not updated:
        raise HTTPException(404, "Volunteer not found")
    return updated


@router.get("/notifications")
def list_notifications(user_id: str | None = None):
    items = _notifications.all()
    if user_id:
        items = [n for n in items if n["userId"] == user_id]
    return items
