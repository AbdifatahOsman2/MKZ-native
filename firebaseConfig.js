// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1nAXz9qN3hj6cIyq1lyl3jzc96VDiKaU",
  authDomain: "mkz-auth.firebaseapp.com",
  projectId: "mkz-auth",
  storageBucket: "mkz-auth.appspot.com",
  messagingSenderId: "367788490328",
  appId: "1:367788490328:web:1dac407a2a3639ad0b942d",
  measurementId: "G-PS8DZ6W5JT"
  };
  
// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };
