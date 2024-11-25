// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get,remove } from 'firebase/database';

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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

export { db, ref, set, get,remove };
