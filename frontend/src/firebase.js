import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA_DZ2N4MFhBKTFmInakRo08zHQopEQJV0",
    authDomain: "neuro-loop-15319.firebaseapp.com",
    projectId: "neuro-loop-15319",
    storageBucket: "neuro-loop-15319.firebasestorage.app",
    messagingSenderId: "387172701855",
    appId: "1:387172701855:web:dc2aba036a10568de6f4aa",
    measurementId: "G-N7V3VZRRW5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);