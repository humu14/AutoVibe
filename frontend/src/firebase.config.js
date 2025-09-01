
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDJQgvvCnc_Y8AQzxB7tIl3WUN3cvagyto",
  authDomain: "otpproject-f1080.firebaseapp.com",
  projectId: "otpproject-f1080",
  storageBucket: "otpproject-f1080.appspot.com",
  messagingSenderId: "337279341539",
  appId: "1:337279341539:web:ebbe0c6d7b81080d2746d6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
