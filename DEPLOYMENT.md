# Deployment Guide

This walks through taking Food Bridge from demo mode to a live deployment on Firebase Hosting with a real Firestore database, Firebase Auth, and Google Maps.

## 1. Create your Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com) → **Add project**.
2. Once created, go to **Build → Authentication → Get started**, enable the **Email/Password** provider.
3. Go to **Build → Firestore Database → Create database** (start in production mode).
4. Go to **Build → Storage → Get started** (for donation food photos).
5. Go to **Project settings → General → Your apps → Add app → Web**, copy the config object.

Paste those values into `frontend/.env`:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_USE_MOCK_DATA=false
```

## 2. Firestore security rules

Start from role-gated rules — every write must match the authenticated user's role, stored as a custom claim or in a `users/{uid}` doc:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() { return request.auth != null; }
    function role() { return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role; }

    match /donations/{donationId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && role() == 'donor';
      allow update: if isSignedIn() && role() in ['ngo', 'volunteer', 'donor'];
    }
    match /users/{userId} {
      allow read: if isSignedIn();
      allow write: if isSignedIn() && request.auth.uid == userId;
    }
    match /notifications/{notifId} {
      allow read, write: if isSignedIn();
    }
  }
}
```

Adjust to your actual trust model before going live — this is a starting point, not a final policy.

## 3. Google Maps API key

1. [Google Cloud Console](https://console.cloud.google.com) → create/select a project (can be the same one linked to Firebase).
2. **APIs & Services → Library** → enable **Maps JavaScript API** and **Directions API**.
3. **APIs & Services → Credentials → Create credentials → API key.**
4. Restrict the key to your domain (HTTP referrers) before shipping to production.
5. Add it to `frontend/.env`:

```
VITE_GOOGLE_MAPS_API_KEY=your-key-here
```

To actually render maps, install `@react-google-maps/api` and swap the distance/ETA numbers currently shown in `DonateFood.jsx` / `PickupRequests.jsx` for a `<GoogleMap>` component — the donor/NGO/volunteer coordinates are already flowing through `services/mockData.js` (or your live Firestore data) in the right shape.

## 4. Backend: Firebase service account

1. Firebase Console → **Project settings → Service accounts → Generate new private key**. This downloads a JSON file.
2. Place it at `backend/serviceAccountKey.json` (**do not commit this file** — add it to `.gitignore`).
3. In `backend/.env`:

```
USE_FIRESTORE=true
GOOGLE_APPLICATION_CREDENTIALS=serviceAccountKey.json
```

4. Restart the backend — `database/firestore.py` will now talk to real Firestore instead of the in-memory store.

## 5. Deploy the frontend to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
cd frontend
npm run build
firebase init hosting     # select your project, public dir = dist, configure as SPA = yes
firebase deploy --only hosting
```

## 6. Deploy the backend

Firebase Hosting only serves static files, so the FastAPI backend needs separate hosting — any of these work:

- **Cloud Run** (recommended, pairs naturally with Firebase/GCP): containerize `backend/` with a `Dockerfile`, `gcloud run deploy`.
- **Render / Railway / Fly.io**: point at `backend/`, start command `uvicorn main:app --host 0.0.0.0 --port $PORT`.

Once deployed, update `frontend/.env`:

```
VITE_API_BASE_URL=https://your-backend-url.com/api
```

and rebuild/redeploy the frontend.

## 7. Environment checklist before going live

- [ ] `VITE_USE_MOCK_DATA=false` and `USE_FIRESTORE=true`
- [ ] Firestore security rules reviewed and tightened
- [ ] Google Maps API key restricted to your production domain
- [ ] `serviceAccountKey.json` excluded from version control
- [ ] CORS origins in `backend/main.py` updated to your production frontend URL
- [ ] Firebase Auth email templates (verification, password reset) customized under Authentication → Templates
