import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Helper to parse Firebase config
const parseFirebaseConfig = (configStr: string) => {
    try {
        return JSON.parse(configStr || '{}');
    } catch (e) {
        console.error("Critical: Firebase config parse error", e);
        return {};
    }
};

const firebaseConfig = parseFirebaseConfig(import.meta.env.PUBLIC_FIREBASE_CONFIG);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
