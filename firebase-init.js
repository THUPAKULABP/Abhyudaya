// firebase-init.js

const firebaseConfig = {
    apiKey: "AIzaSyDKSV7nv1lpH5us9Dx9t1TZ6lOx6rxepUg",
    authDomain: "abhyudaya-48536.firebaseapp.com",
    databaseURL: "https://abhyudaya-48536-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "abhyudaya-48536",
    storageBucket: "abhyudaya-48536.firebasestorage.app",
    messagingSenderId: "802149164793",
    appId: "1:802149164793:web:70847d05da8cd0ad542428",
    measurementId: "G-Z0MFST47EB"
};

// Initialize Firebase automatically if SDK is loaded
if (typeof firebase !== 'undefined') {
    try {
        firebase.initializeApp(firebaseConfig);
        window.db = firebase.database();
        console.log("Firebase initialized successfully with your Realtime Database details.");
    } catch (error) {
        console.warn("Firebase initialization failed:", error);
    }
}
