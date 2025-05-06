// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBJzqvtBmtMhr_25rjDTEDY8MikiTaXVL8",
  authDomain: "dolphin-finance-quiz.firebaseapp.com",
  projectId: "dolphin-finance-quiz",
  storageBucket: "dolphin-finance-quiz.firebasestorage.app",
  messagingSenderId: "171056666251",
  appId: "1:171056666251:web:dcc821ee9c66f2f822e68e",
  measurementId: "G-HCX65ZG9JZ"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, db, analytics }; 