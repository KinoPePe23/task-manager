import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, remove } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'; // Import Firebase Auth functions

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7Mlw8vwpZKV9dv7mqwy-8E4sK9xWsbT4",
  authDomain: "taskmanager-898a2.firebaseapp.com",
  databaseURL: 'https://taskmanager-898a2-default-rtdb.europe-west1.firebasedatabase.app/', 
  projectId: "taskmanager-898a2",
  storageBucket: "taskmanager-898a2.firebasestorage.app",
  messagingSenderId: "507242755121",
  appId: "1:507242755121:web:e8cc64cd182c0a9df2d110"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);  // Initialize Firebase Auth

// Firebase Auth functions
const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('User registered:', user);
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error registering user:', errorCode, errorMessage);
      throw error;
    });
};

const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('User logged in:', user);
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error logging in user:', errorCode, errorMessage);
      throw error;
    });
};

const logoutUser = () => {
  return signOut(auth)
    .then(() => {
      console.log('User logged out');
    })
    .catch((error) => {
      console.error('Error logging out user:', error);
      throw error;
    });
};

// Export necessary functions and services
export { db, ref, set, get, remove, auth, registerUser, loginUser, logoutUser };