import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDzRQFtFORHQuSEqeW9ndDEeMLb4qaoM88",
  authDomain: "yoalquilo-d5a67.firebaseapp.com",
  projectId: "yoalquilo-d5a67",
  storageBucket: "yoalquilo-d5a67.firebasestorage.app",
  messagingSenderId: "732726223688",
  appId: "1:732726223688:web:552a08274af0e44935497d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
