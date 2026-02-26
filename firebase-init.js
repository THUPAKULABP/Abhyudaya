// firebase-init.js
// Dynamically grabs Firebase credentials from Cloudflare Pages API to protect raw credentials being hardcoded

window.firebaseInitPromise = (async function initFirebase() {
    if (typeof firebase === 'undefined') {
        console.warn("Firebase scripts not loaded on the page.");
        return;
    }

    try {
        const response = await fetch('/api/firebase-config');
        if (!response.ok) {
            console.warn("Firebase Environment Variables missing in Cloudflare. Database functions will use fallback local storage.");
            return;
        }

        const firebaseConfig = await response.json();

        firebase.initializeApp(firebaseConfig);
        window.db = firebase.database();

        console.log("Firebase initialized securely from Cloudflare Environment Variables.");
    } catch (error) {
        console.warn("Failed to fetch or initialize Firebase config:", error);
    }
})();
