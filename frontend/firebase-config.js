// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcReQnKpWAjWpBHbmNYMp8FXJKEwDeaJc",
  authDomain: "a3-quinta-1a763.firebaseapp.com",
  databaseURL: "https://a3-quinta-1a763-default-rtdb.firebaseio.com",
  projectId: "a3-quinta-1a763",
  storageBucket: "a3-quinta-1a763.firebasestorage.app",
  messagingSenderId: "82585857395",
  appId: "1:82585857395:web:a8351096fa4d8106a22906",
  measurementId: "G-2XELCPKECS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
