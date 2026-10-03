from fastapi import APIRouter, HTTPException
from database.firestore import InMemoryCollection
from seed_data import NGOS, ANALYTICS
from models.schemas import NgoProfile

router = APIRouter(prefix="/api", tags=["ngo", "analytics"])

_ngos = InMemoryCollection(seed=NGOS)


@router.get("/ngos")
def list_ngos():
    return _ngos.all()


@router.get("/ngos/{ngo_id}")
def get_ngo(ngo_id: str):
    ngo = _ngos.get(ngo_id)
    if not ngo:
        raise HTTPException(404, "NGO not found")
    return ngo


@router.post("/ngos", status_code=201)
def register_ngo(payload: NgoProfile):
    return _ngos.set(payload.id, payload.model_dump(mode="json"))


@router.get("/analytics")
def get_analytics():
    """Dashboard cards + chart data: meals saved, people fed, CO2 reduced, etc."""
    return ANALYTICS
