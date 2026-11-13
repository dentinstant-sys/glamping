import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

/**
 * Inicialización de Firebase para el frontend público.
 * Solo Firestore (lectura del catálogo) + Functions (crearBooking, etc.).
 * Config desde variables VITE_* (ver .env.example). NUNCA hardcodear llaves.
 *
 * Con VITE_USE_EMULATOR=true se conecta a los emuladores locales (para QA).
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const functions = getFunctions(app, 'us-central1');

if (import.meta.env.VITE_USE_EMULATOR === 'true') {
  // El host sale de la URL que sirvió la página, no de "localhost" fijo: al
  // abrir el sitio desde un teléfono en la red local, "localhost" sería el
  // teléfono y no habría datos. Así el emulador se resuelve bien desde
  // cualquier dispositivo.
  const host = window.location.hostname;
  connectFirestoreEmulator(db, host, 8080);
  connectFunctionsEmulator(functions, host, 5001);
}
