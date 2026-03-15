import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Super-robust parser: Regex-first approach to avoid JSON.parse crashes
const superRobustParse = (str: string) => {
    try {
        if (!str) return {};
        const config: any = {};
        const keys = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId", "measurementId"];
        
        keys.forEach(key => {
            // Match "key": "value" or 'key': 'value' or key: 'value'
            const regex = new RegExp(`['"]?${key}['"]?\\s*:\\s*['"]?([^'"\\s,}]+)['"]?`);
            const match = str.match(regex);
            if (match) {
                config[key] = match[1].trim().replace(/['",;]$/, '');
            }
        });

        // Validation: If no apiKey was found, only then try JSON.parse as a hail mary
        if (!config.apiKey) {
            try {
                const braceMatch = str.match(/\{[\s\S]*\}/);
                return JSON.parse(braceMatch ? braceMatch[0] : str);
            } catch (e) { return {}; }
        }
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
