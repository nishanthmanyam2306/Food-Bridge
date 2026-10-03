"""Auth routes.

Actual sign-up/login/password-reset happens client-side via the Firebase
Auth SDK (see frontend/src/context/AuthContext.jsx) — that's the standard,
recommended pattern for Firebase. This backend only verifies the resulting
ID token on protected requests and manages the app-specific role that
Firebase Auth itself doesn't know about.
"""
import os
from fastapi import APIRouter, Header, HTTPException
from database.firestore import InMemoryCollection

router = APIRouter(prefix="/api/auth", tags=["auth"])

USE_FIRESTORE = os.getenv("USE_FIRESTORE", "false").lower() == "true"

# uid -> role, used when Firebase custom claims aren't set up yet
_roles = InMemoryCollection(seed=[])


@router.post("/verify")
def verify_token(authorization: str = Header(None)):
    """Verify a Firebase ID token sent as `Authorization: Bearer <token>`."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing bearer token")
    token = authorization.split(" ", 1)[1]

    if not USE_FIRESTORE:
        # Demo mode — accept the mock token issued by the frontend's mock auth.
        if token == "mock-token":
            return {"valid": True, "mode": "mock"}
        raise HTTPException(401, "Invalid token (demo mode only accepts mock-token)")

    from firebase_admin import auth as firebase_auth

    try:
        decoded = firebase_auth.verify_id_token(token)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(401, f"Invalid token: {exc}") from exc
    return {"valid": True, "uid": decoded["uid"], "email": decoded.get("email")}


@router.post("/role/{uid}")
def assign_role(uid: str, role: str):
    """Assign an app role to a user. In production, set this as a Firebase
    custom claim via firebase_admin.auth.set_custom_user_claims instead."""
    return _roles.set(uid, {"id": uid, "role": role})


@router.get("/role/{uid}")
def get_role(uid: str):
    record = _roles.get(uid)
    if not record:
        raise HTTPException(404, "No role assigned")
    return record
