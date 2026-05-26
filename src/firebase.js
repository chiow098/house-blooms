import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAREMuBPlhoj7ZEoIorZxd5l6QSGh4C1-k",
  authDomain: "house-blooms.firebaseapp.com",
  databaseURL: "https://house-blooms-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "house-blooms",
  storageBucket: "house-blooms.firebasestorage.app",
  messagingSenderId: "896733296899",
  appId: "1:896733296899:web:a5bd98343ed6d82e965136"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);