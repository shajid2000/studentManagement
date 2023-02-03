import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "studentmanagement-8a21e.firebaseapp.com",
  projectId: "studentmanagement-8a21e",
  storageBucket: "studentmanagement-8a21e.appspot.com",
  messagingSenderId: "525043360202",
  appId: "1:525043360202:web:87a83881bfc4ff8224ef33"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
