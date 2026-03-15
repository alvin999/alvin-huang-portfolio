import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Helper to safely parse Firebase config that might be incorrectly formatted
const safeParseConfig = (configStr: string) => {
    try {
        if (!configStr) return {};
        // Use a simple regex to extract JSON if the user pasted "const firebaseConfig = { ... };"
        const jsonMatch = configStr.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : configStr;
        return JSON.parse(jsonStr);
    } catch (e) {
        console.warn("Firebase config parsing failed, checking local fallback...", e);
        return {};
    }
};

const firebaseConfig = safeParseConfig(import.meta.env.PUBLIC_FIREBASE_CONFIG);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
