// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config object
// For development, you can use these demo values or replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "demo-api-key-replace-with-real-one",
  authDomain: "ecolearn-demo.firebaseapp.com",
  projectId: "ecolearn-demo",
  storageBucket: "ecolearn-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
