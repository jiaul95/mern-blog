// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-15fea.firebaseapp.com",
  projectId: "mern-blog-15fea",
  storageBucket: "mern-blog-15fea.firebasestorage.app",
  messagingSenderId: "870690731226",
  appId: "1:870690731226:web:ede1cec77ad8ed2c2d21e3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);