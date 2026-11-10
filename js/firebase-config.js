/**
 * NAGASA LAUNDRY - Firebase Configuration & Initialization
 * Palu, Sulawesi Tengah | WhatsApp: 082251267232
 * 
 * Konfigurasi resmi proyek Firebase "nagasa-laundry"
 */

// 1. Import Firebase App & Services dari CDN resmi (ES Module Browser)
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { 
  getAnalytics, 
  isSupported as isAnalyticsSupported 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// 2. Konfigurasi Proyek Firebase Resmi Nagasa Laundry
// Data diambil dari Web App yang Anda daftarkan di Firebase Console
const defaultFirebaseConfig = {
  apiKey: "AIzaSyBPXpKefXhzsSlh023KhfhTR0cXM2nyrZQ",
  authDomain: "nagasa-laundry.firebaseapp.com",
  projectId: "nagasa-laundry",
  storageBucket: "nagasa-laundry.firebasestorage.app",
  messagingSenderId: "845218199976",
  appId: "1:845218199976:web:8ec9cdcad676046440059d",
  measurementId: "G-T08ZMG2VXM"
};

// Cek apakah ada konfigurasi kustom tersimpan di browser
let customConfig = null;
if (typeof window !== "undefined" && window.localStorage) {
  try {
    const saved = localStorage.getItem("nagasa_firebase_config");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.apiKey && parsed.projectId) {
        customConfig = parsed;
      }
    }
  } catch (e) {
    console.warn("Gagal membaca saved Firebase config:", e);
  }
}

export const firebaseConfig = customConfig || defaultFirebaseConfig;

// Cek apakah konfigurasi valid
export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.includes("GANTI_DENGAN") &&
    firebaseConfig.projectId &&
    !firebaseConfig.projectId.includes("GANTI_DENGAN")
  );
};

// 3. Inisialisasi Firebase App
let app = null;
let auth = null;
let db = null;
let storage = null;
let analytics = null;

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  console.log("✅ Firebase Nagasa Laundry App initialized:", firebaseConfig.projectId);
} catch (appErr) {
  console.error("❌ Gagal initializeApp Firebase:", appErr);
}

// Inisialisasi Auth
if (app) {
  try {
    auth = getAuth(app);
  } catch (authErr) {
    console.warn("⚠️ Firebase Auth warning:", authErr);
  }
}

// Inisialisasi Firestore Database
if (app) {
  try {
    db = getFirestore(app);
  } catch (dbErr) {
    console.warn("⚠️ Firestore warning:", dbErr);
  }
}

// Inisialisasi Firebase Storage
if (app) {
  try {
    storage = getStorage(app);
  } catch (stErr) {
    console.warn("⚠️ Firebase Storage belum diaktifkan di console (opsional):", stErr);
  }
}

// Inisialisasi Firebase Analytics
if (app && typeof window !== "undefined") {
  try {
    isAnalyticsSupported().then((supported) => {
      if (supported && firebaseConfig.measurementId) {
        analytics = getAnalytics(app);
        console.log("📊 Firebase Analytics active:", firebaseConfig.measurementId);
      }
    }).catch(() => {});
  } catch (anErr) {
    // Analytics is non-critical
  }
}

// Pasang di window untuk mempermudah pengecekan langsung via Browser DevTools Console (F12)
if (typeof window !== "undefined") {
  window.nagasaFirebase = {
    app,
    auth,
    db,
    storage,
    analytics,
    config: firebaseConfig,
    isConfigured: isFirebaseConfigured()
  };
}

// 4. Ekspor seluruh objek dan fungsi yang dibutuhkan modul aplikasi
export {
  app,
  auth,
  db,
  storage,
  analytics,
  getAuth,
  getFirestore,
  getStorage,
  getAnalytics,
  // Auth methods
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  // Firestore methods
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
  // Storage methods
  ref,
  uploadBytes,
  getDownloadURL
};

// Default export untuk kemudahan import
export default {
  app,
  auth,
  db,
  storage,
  analytics,
  firebaseConfig,
  isFirebaseConfigured
};
