import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// These will be injected via environment variables or a config object
const firebaseConfig = JSON.parse(import.meta.env.PUBLIC_FIREBASE_CONFIG || '{}');

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
