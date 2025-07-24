// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7DU2ZX-AqkJucnViua0llupQIVXy5xzA",
  authDomain: "dengarinklusif.firebaseapp.com",
  projectId: "dengarinklusif",
  storageBucket: "dengarinklusif.firebasestorage.app",
  messagingSenderId: "768721668635",
  appId: "1:768721668635:web:da72873c838476e27f46be",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;
