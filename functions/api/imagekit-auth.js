export async function onRequest(context) {
    const privateKey = context.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = context.env.IMAGEKIT_PUBLIC_KEY;

    if (!privateKey || !publicKey) {
        return new Response(JSON.stringify({
            error: "ImageKit API keys are not configured in Cloudflare Pages Environment Variables. Please set IMAGEKIT_PRIVATE_KEY and IMAGEKIT_PUBLIC_KEY."
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    const token = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 60 * 30; // 30 minutes expiry
    const signatureStr = token + expire;

    // Web Crypto API to generate HMAC-SHA1 signature
    const encoder = new TextEncoder();
    const keyData = encoder.encode(privateKey);
    const msgData = encoder.encode(signatureStr);

    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-1' },
        false,
        ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const signatureHex = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return new Response(JSON.stringify({
        token: token,
        expire: expire,
        signature: signatureHex,
        publicKey: publicKey
    }), {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}
