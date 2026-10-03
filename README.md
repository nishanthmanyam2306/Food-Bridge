# Food Bridge

**An Intelligent Food Redistribution Platform**
*"Don't Waste It. Donate It."*

Food Bridge connects Food Donors (restaurants, hotels, bakeries, supermarkets, event organizers), NGOs, and Volunteers so surplus food reaches people in need before it expires — matched by an AI recommendation engine, tracked in real time, and measured through an impact dashboard.

---

## What's in this repo

```
food-bridge/
├── frontend/          React 18 + Vite + Tailwind CSS SPA
│   ├── src/
│   │   ├── ai/                 client-side AI recommendation engine
│   │   ├── components/         Navbar, Footer, DashboardLayout, cards, etc.
│   │   ├── context/AuthContext.jsx   role-based auth (mock or Firebase)
│   │   ├── firebase/config.js  Firebase init (auth, Firestore, storage)
│   │   ├── pages/
│   │   │   ├── donor/          Donor dashboard, donate-food form, history
│   │   │   ├── ngo/             NGO dashboard, nearby donations
│   │   │   └── volunteer/      Volunteer dashboard, pickup requests
│   │   └── services/           API client + mock data
│   └── .env.example
├── backend/            FastAPI service
│   ├── ai/              recommend.py (matching/urgency), predict_surplus.py (forecasting)
│   ├── routes/           donations, ngo, volunteers, auth
│   ├── models/schemas.py Pydantic models (Users, Donations, NGOs, Volunteers…)
│   ├── database/firestore.py  Firestore client with in-memory fallback
│   └── seed_data.py     demo data shared with the frontend mocks
├── README.md
└── DEPLOYMENT.md
```

## Quick start (works out of the box, no API keys needed)

The app ships in **demo mode**: the frontend runs entirely on realistic mock data (`VITE_USE_MOCK_DATA=true`), and the backend runs on an in-memory store (`USE_FIRESTORE=false`). This means you can explore every dashboard, the donation flow, and the AI matching immediately.

### 1. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Visit `http://localhost:5173`. Log in with **any email/password** and pick a role (Donor / NGO / Volunteer) — demo mode seeds you into a matching profile instantly.

### 2. Backend (optional for the demo, required once you go live)

```bash
cd backend
python -m venv venv && source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API docs: `http://localhost:8000/docs`.

Set `VITE_USE_MOCK_DATA=false` in `frontend/.env` once the backend is running to have the UI call it for real.

## Going live: what you need to provide

This scaffold intentionally does **not** ship with live credentials — you'll need to create your own:

| Service | What it's for | Where to get it |
|---|---|---|
| Firebase project | Auth, Firestore, Storage | [Firebase Console](https://console.firebase.google.com) → Project Settings → your web app config |
| Google Maps API key | Live maps, routing, ETA | [Google Cloud Console](https://console.cloud.google.com) → enable Maps JavaScript API + Directions API |
| Firebase service account (backend) | Firestore access from FastAPI | Firebase Console → Project Settings → Service Accounts → Generate new private key |

Full step-by-step is in [`DEPLOYMENT.md`](./DEPLOYMENT.md).

## AI features (implemented)

Both the frontend (`frontend/src/ai/recommendation.js`) and backend (`backend/ai/recommend.py`, `backend/ai/predict_surplus.py`) implement the same logic so results match whether the UI calls the API or falls back to local mock data:

- **Nearest NGO / volunteer matching** — haversine distance + capacity/rating weighting
- **Expiry-based prioritization** — urgency score (0–100) combining time-to-expiry and donation size
- **Delivery time estimation** — distance-based ETA with a fixed handling buffer
- **Surplus prediction** — scikit-learn linear regression over historical meal counts (`backend/ai/predict_surplus.py`)
- **Demand analytics** — category breakdown and top-contributor leaderboards via pandas groupby

These are built as clear, tunable heuristics rather than black boxes, specifically so you can later swap any scoring function for a trained model (e.g. a learned NGO-acceptance classifier) without changing the function signatures the rest of the app depends on.

## Design system

- **Colors:** primary `#2E7D32` (green), secondary white, accent `#E8792E` (orange), plus a near-black `ink` scale for dark mode
- **Type:** Fraunces (display/headings), Sora (body/UI), IBM Plex Mono (data/technical)
- **Style:** glassmorphism panels, rounded `xl2` cards, soft shadows, restrained motion (Framer Motion), full dark mode via Tailwind's `class` strategy

## What's scaffolded vs. what to extend

Built and functional: landing page, all marketing pages, 3-role auth, all 3 dashboards, donation lifecycle UI, AI matching (client + server), analytics data layer, notifications UI, FastAPI backend with Firestore-ready data layer.

Left as extension points (structure is in place, wire up when you're ready):
- Live Google Maps rendering + turn-by-turn navigation (currently shows distance/ETA numbers from the AI module; drop in `@react-google-maps/api` using your Maps key)
- QR code generation per donation, PDF impact certificates
- Real-time listeners (Firestore `onSnapshot`) for live status updates instead of polling
- Firebase Storage image upload wiring for the donation photo field (UI is built, just needs the upload call)
- Chart.js wiring for the analytics dashboards (`analytics` data shape is ready in `services/mockData.js` / `backend/seed_data.py`)

## License

Build freely — this is your project scaffold to extend.
