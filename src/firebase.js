import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCoFV4iJq3MNIeD5ukevs0idrISVqXmng4",
  authDomain: "herbal-app-sk.firebaseapp.com",
  projectId: "herbal-app-sk",
  storageBucket: "herbal-app-sk.firebasestorage.app",
  messagingSenderId: "609976772035",
  appId: ":609976772035:web:2c16f4eaacc6900bb7c976"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);