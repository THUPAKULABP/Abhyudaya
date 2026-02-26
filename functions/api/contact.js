export async function onRequest(context) {
    const { request, env } = context;

    // Check if the developer bound the CONTACTS_DB KV Namespace in Cloudflare
    if (!env.CONTACTS_DB) {
        return new Response(JSON.stringify({ error: "CONTACTS_DB namespace not bound in Cloudflare. Please bind the KV Namespace." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (request.method === 'POST') {
        try {
            const data = await request.json();
            const id = `contact_${Date.now()}_${Math.random().toString(36).substring(7)}`;

            // Store the full message payload in 'metadata' so we can fetch all messages using a single fast list() operation
            const metadata = {
                id: id,
                firstName: data.firstName || "Unknown",
                lastName: data.lastName || "",
                email: data.email || "",
                phone: data.phone || "",
                program: data.program || "",
                message: data.message || "",
                timestamp: data.timestamp || new Date().toISOString()
            };

            await env.CONTACTS_DB.put(id, "metadata_only", { metadata: metadata });

            return new Response(JSON.stringify({ success: true, id: id }), {
                status: 200,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        } catch (err) {
            return new Response(JSON.stringify({ error: err.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }
    }

    if (request.method === 'GET') {
        // Authenticate request using the existing private key env
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== `Bearer ${env.IMAGEKIT_PRIVATE_KEY}`) {
            return new Response(JSON.stringify({ error: "Unauthorized access." }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        try {
            // Retrieve all contact records efficiently via their metadata
            const list = await env.CONTACTS_DB.list({ prefix: 'contact_' });
            let messages = list.keys.map(k => k.metadata);

            messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            return new Response(JSON.stringify(messages), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (err) {
            return new Response(JSON.stringify({ error: err.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }

    if (request.method === 'DELETE') {
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== `Bearer ${env.IMAGEKIT_PRIVATE_KEY}`) {
            return new Response(JSON.stringify({ error: "Unauthorized access." }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        try {
            const url = new URL(request.url);
            const id = url.searchParams.get('id');
            if (!id) return new Response(JSON.stringify({ error: "Missing ID to delete" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });

            await env.CONTACTS_DB.delete(id);
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (err) {
            return new Response(JSON.stringify({ error: err.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }

    // CORS Preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        });
    }

    return new Response("Method Not Allowed", { status: 405 });
}
