import { initializeApp,getApp,getApps } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA6hqTmtZ7DLOgknvnp1nD9VhTYytrfd9A",
    authDomain: "skillgauge-3ef7a.firebaseapp.com",
    projectId: "skillgauge-3ef7a",
    storageBucket: "skillgauge-3ef7a.firebasestorage.app",
    messagingSenderId: "684813557241",
    appId: "1:684813557241:web:94ce83ef202877ee087128",
    measurementId: "G-8PWJTZXBC4"
};

// Initialize Firebase
const app =!getApps().length ? initializeApp(firebaseConfig):getApp();

export const auth=getAuth(app);
export const db=getFirestore(app);