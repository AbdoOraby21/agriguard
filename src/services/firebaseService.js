// ---------------------------------------------------------------------
// OPTIONAL — real Firebase integration.
//
// The app runs entirely on the local mock engine (src/data/dataEngine.js)
// by default, so it works immediately with zero setup. This file shows
// exactly how to wire up real Firebase once you have a project — install
// the SDK, fill in your config, and swap `useAgriGuardData()` calls in
// the screens for the hooks below.
//
//   npm install firebase
// ---------------------------------------------------------------------

// import { initializeApp } from "firebase/app";
// import {
//   getFirestore, collection, doc, onSnapshot, query, orderBy, limit,
// } from "firebase/firestore";
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
// };

// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const auth = getAuth(app);

// Firestore layout assumed (mirrors the Flutter build's structure):
//   farms/{farmId}/devices/{deviceId}
//   farms/{farmId}/predictions/current
//   farms/{farmId}/alerts/{alertId}
//   farms/{farmId}/analytics/{metric}/points/{ts}

// export function streamDevices(farmId, callback) {
//   return onSnapshot(collection(db, "farms", farmId, "devices"), (snap) => {
//     callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//   });
// }

// export function streamPrediction(farmId, callback) {
//   return onSnapshot(doc(db, "farms", farmId, "predictions", "current"), (snap) => {
//     callback(snap.data());
//   });
// }

// export function streamAlerts(farmId, callback) {
//   const q = query(collection(db, "farms", farmId, "alerts"), orderBy("time", "desc"), limit(50));
//   return onSnapshot(q, (snap) => {
//     callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//   });
// }

export const FIREBASE_INTEGRATION_NOTE =
  "Firebase is not wired up in this build — see comments in this file for the full integration path.";
