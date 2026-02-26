// firebase-init.js
// =========================================================
// REPLACE THESE VALUES WITH YOUR REAL FIREBASE FREE PLAN KEYS
// 1. Go to console.firebase.google.com
// 2. Create a Project and add a "Web App"
// 3. Create a "Realtime Database" in test mode or with security rules
// 4. Copy the config object details below
// =========================================================

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};

// Initialize Firebase automatically if SDK is loaded
if (typeof firebase !== 'undefined') {
    try {
        firebase.initializeApp(firebaseConfig);
        window.db = firebase.database();
        console.log("Firebase initialized successfully on frontend.");
    } catch (error) {
        console.warn("Firebase initialization failed. Did you replace the keys in firebase-init.js?", error);
    }
}
