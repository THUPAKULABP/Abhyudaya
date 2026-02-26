export async function onRequest(context) {
    const { env } = context;

    // Return the Firebase configuration from Cloudflare Environment Variables
    const config = {
        apiKey: env.FIREBASE_API_KEY,
        authDomain: env.FIREBASE_AUTH_DOMAIN,
        databaseURL: env.FIREBASE_DATABASE_URL,
        projectId: env.FIREBASE_PROJECT_ID,
        storageBucket: env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
        appId: env.FIREBASE_APP_ID,
        measurementId: env.FIREBASE_MEASUREMENT_ID
    };

    // Make sure we at least have an apiKey to confirm it's configured
    if (!config.apiKey) {
        return new Response(JSON.stringify({ error: "Firebase Environment Variables are not configured in Cloudflare Pages." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response(JSON.stringify(config), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            // Cache the config for high availability
            'Cache-Control': 'public, max-age=3600'
        }
    });
}
