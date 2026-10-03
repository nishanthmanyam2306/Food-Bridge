"""Firestore client wrapper.

If GOOGLE_APPLICATION_CREDENTIALS / Firebase service account creds are not
configured, this falls back to a simple in-memory store so the API is fully
runnable and testable without any cloud setup. Swap `USE_FIRESTORE=true` in
your .env once you've added a service account key (see DEPLOYMENT.md).
"""
import os
from typing import Any, Dict, List, Optional

USE_FIRESTORE = os.getenv("USE_FIRESTORE", "false").lower() == "true"

_db = None
if USE_FIRESTORE:
    import firebase_admin
    from firebase_admin import credentials, firestore

    cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "serviceAccountKey.json")
    if not firebase_admin._apps:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    _db = firestore.client()


class InMemoryCollection:
    """Minimal Firestore-like collection interface backed by a dict."""

    def __init__(self, seed: Optional[List[Dict[str, Any]]] = None):
        self._store: Dict[str, Dict[str, Any]] = {d["id"]: d for d in (seed or [])}

    def all(self) -> List[Dict[str, Any]]:
        return list(self._store.values())

    def get(self, doc_id: str) -> Optional[Dict[str, Any]]:
        return self._store.get(doc_id)

    def set(self, doc_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        self._store[doc_id] = data
        return data

    def update(self, doc_id: str, patch: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if doc_id not in self._store:
            return None
        self._store[doc_id].update(patch)
        return self._store[doc_id]

    def delete(self, doc_id: str) -> None:
        self._store.pop(doc_id, None)


def get_db():
    """Returns the real Firestore client, or None if running in-memory mode."""
    return _db
