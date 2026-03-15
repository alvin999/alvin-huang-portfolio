import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Super-robust parser to extract Firebase config key-values even if JSON.parse fails
const superRobustParse = (str: string) => {
    try {
        if (!str) return {};
        // 1. Try standard JSON first
        try {
            return JSON.parse(str);
        } catch (e) {}

        // 2. Try to extract anything between { and }
        const braceMatch = str.match(/\{[\s\S]*\}/);
        if (braceMatch) {
            try { return JSON.parse(braceMatch[0]); } catch (e) {}
        }

        // 3. Last resort: Regex extract individual keys for typical Firebase config
        const config: any = {};
        const keys = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId", "measurementId"];
        keys.forEach(key => {
            const regex = new RegExp(`['"]?${key}['"]?\\s*:\\s*['"]?([^'"]+)['"]?`);
            const match = str.match(regex);
            if (match) config[key] = match[1];
        });
        return config;
    } catch (e) {
        return {};
    }
};

const firebaseConfig = superRobustParse(import.meta.env.PUBLIC_FIREBASE_CONFIG || '{}');

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
