// Firebase initialization.
// Fill in your project's credentials in `.env` (copy from `.env.example`).
// Get these from Firebase Console > Project Settings > General > Your apps.
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false'

let app, auth, db, storage

// Only initialize real Firebase if keys are present — otherwise the app
// runs entirely on mock data so it works out of the box for preview/dev.
if (firebaseConfig.apiKey) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
}

export { app, auth, db, storage }
