"use client";
// Firebase initialization module
// Inline config based on components/auth/script.js; will be moved to env later.

import { initializeApp, type FirebaseApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    type Auth,
    onAuthStateChanged,
} from "firebase/auth";

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let googleProvider: GoogleAuthProvider | undefined;

// Guard: only initialize in browser to avoid SSR issues
if (typeof window !== "undefined") {
    const firebaseConfig = {
        apiKey: "AIzaSyDui5MKg4sB4eEcMjgjVXnw-u6bLm90D4E",
        authDomain: "scribe-c7f13.firebaseapp.com",
        projectId: "scribe-c7f13",
        storageBucket: "scribe-c7f13.firebasestorage.app",
        messagingSenderId: "970064337409",
        appId: "1:970064337409:web:ab8ecc361e352c5025be00",
        measurementId: "G-NH06MQQ2J3",
    };

    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    // default scopes: openid, email, profile
}

export { app, auth, googleProvider, onAuthStateChanged };

export function isFirebaseReady(): boolean {
    return typeof window !== "undefined" && !!app && !!auth;
}
