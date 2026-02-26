/**
 * Cloudflare Pages Function — Admin Middleware
 * Intercepts ALL requests to /admin/* and enforces password auth.
 * Password is stored in the Cloudflare env variable: ADMIN_PASSWORD
 */

const SESSION_COOKIE = 'abhyudaya_admin_session';
const SALT = 'abhyudaya_school_2026';

async function hashToken(value) {
    const encoder = new TextEncoder();
    const data = encoder.encode(value + SALT);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getSessionCookie(request) {
    const cookie = request.headers.get('Cookie') || '';
    const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
    return match ? match[1] : null;
}

function loginPage(errorMsg = '') {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login — Abhyudaya</title>
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
    <style>
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            background: #050505;
            color: #fff;
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .bg-mesh {
            position: fixed; inset: 0; z-index: 0;
            background:
                radial-gradient(at 20% 20%, rgba(255,107,0,0.25) 0, transparent 50%),
                radial-gradient(at 80% 80%, rgba(30,58,138,0.25) 0, transparent 50%);
            filter: blur(80px);
            animation: meshMove 12s ease-in-out infinite alternate;
        }
        @keyframes meshMove {
            from { transform: scale(1) translate(0,0); }
            to   { transform: scale(1.1) translate(30px,-20px); }
        }

        .card {
            position: relative; z-index: 1;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.1);
            backdrop-filter: blur(24px);
            border-radius: 2rem;
            padding: 3rem 2.5rem;
            width: 100%;
            max-width: 420px;
            margin: 1rem;
            box-shadow: 0 40px 80px rgba(0,0,0,0.5);
            animation: slideUp 0.6s cubic-bezier(0.23,1,0.32,1) both;
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(40px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        .logo-ring {
            width: 72px; height: 72px;
            background: linear-gradient(135deg, #ff6b00, #d4af37);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 2rem; margin: 0 auto 1.5rem;
            box-shadow: 0 0 40px rgba(255,107,0,0.4);
            animation: pulse 2.5s infinite;
        }
        @keyframes pulse {
            0%,100% { box-shadow: 0 0 40px rgba(255,107,0,0.4); }
            50%      { box-shadow: 0 0 60px rgba(255,107,0,0.7); }
        }

        h1 {
            font-family: 'Syne', sans-serif;
            font-size: 1.75rem; font-weight: 800;
            text-align: center; margin-bottom: 0.25rem;
        }
        .subtitle {
            text-align: center;
            color: rgba(255,255,255,0.5);
            font-size: 0.875rem;
            margin-bottom: 2.5rem;
        }

        .error-box {
            background: rgba(239,68,68,0.1);
            border: 1px solid rgba(239,68,68,0.4);
            border-radius: 0.75rem;
            padding: 0.875rem 1rem;
            margin-bottom: 1.5rem;
            display: flex; align-items: center; gap: 0.75rem;
            color: #fca5a5; font-size: 0.875rem;
            animation: shake 0.4s cubic-bezier(0.36,0.07,0.19,0.97);
        }
        @keyframes shake {
            10%,90% { transform: translateX(-2px); }
            20%,80% { transform: translateX(4px); }
            30%,50%,70% { transform: translateX(-6px); }
            40%,60% { transform: translateX(6px); }
        }

        .input-group {
            position: relative; margin-bottom: 1.5rem;
        }
        .input-group i {
            position: absolute; left: 1rem; top: 50%;
            transform: translateY(-50%);
            color: rgba(255,255,255,0.35); font-size: 1.15rem;
            pointer-events: none;
        }
        .input-group input {
            width: 100%;
            padding: 1rem 3.5rem 1rem 3rem;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 0.875rem;
            color: white; font-family: 'Inter', sans-serif; font-size: 1rem;
            transition: border-color 0.3s, background 0.3s;
            outline: none;
        }
        .input-group input:focus {
            border-color: #ff6b00;
            background: rgba(255,107,0,0.07);
        }
        .toggle-vis {
            position: absolute; right: 1rem; top: 50%;
            transform: translateY(-50%);
            background: none; border: none;
            color: rgba(255,255,255,0.4); cursor: pointer;
            font-size: 1.15rem; padding: 0;
            transition: color 0.2s;
        }
        .toggle-vis:hover { color: #ff6b00; }

        .btn-login {
            width: 100%;
            padding: 1rem;
            background: linear-gradient(135deg, #ff6b00, #d4af37);
            border: none; border-radius: 0.875rem;
            color: white; font-family: 'Inter', sans-serif;
            font-size: 1rem; font-weight: 700;
            cursor: pointer; letter-spacing: 0.03em;
            transition: transform 0.3s, box-shadow 0.3s;
            display: flex; align-items: center; justify-content: center; gap: 0.5rem;
        }
        .btn-login:hover {
            transform: translateY(-3px);
            box-shadow: 0 20px 40px rgba(255,107,0,0.45);
        }
        .btn-login:active { transform: scale(0.98); }

        .footer-note {
            text-align: center;
            margin-top: 2rem;
            font-size: 0.75rem;
            color: rgba(255,255,255,0.25);
        }
    </style>
</head>
<body>
    <div class="bg-mesh"></div>
    <div class="card">
        <div class="logo-ring"><i class="ri-shield-keyhole-fill"></i></div>
        <h1>Admin Access</h1>
        <p class="subtitle">Abhyudaya E.M. High School — Secure Panel</p>

        ${errorMsg ? `
        <div class="error-box">
            <i class="ri-error-warning-fill"></i>
            ${errorMsg}
        </div>` : ''}

        <form method="POST" action="/admin/auth">
            <div class="input-group">
                <i class="ri-lock-password-line"></i>
                <input type="password" name="password" id="pwdInput"
                    placeholder="Enter admin password"
                    autofocus autocomplete="current-password" required>
                <button type="button" class="toggle-vis" onclick="toggleVis()" id="visBtn">
                    <i class="ri-eye-line" id="visIcon"></i>
                </button>
            </div>
            <button type="submit" class="btn-login">
                <i class="ri-login-box-line"></i> Unlock Admin Panel
            </button>
        </form>

        <p class="footer-note">Protected by Cloudflare · Abhyudaya School</p>
    </div>

    <script>
        function toggleVis() {
            const inp = document.getElementById('pwdInput');
            const icon = document.getElementById('visIcon');
            if (inp.type === 'password') {
                inp.type = 'text';
                icon.className = 'ri-eye-off-line';
            } else {
                inp.type = 'password';
                icon.className = 'ri-eye-line';
            }
        }
    </script>
</body>
</html>`;
}

export async function onRequest(context) {
    const { request, env, next } = context;
    const url = new URL(request.url);

    const ADMIN_PASSWORD = env.ADMIN_PASSWORD;

    // If ADMIN_PASSWORD is not set, block access entirely
    if (!ADMIN_PASSWORD) {
        return new Response(loginPage('⚙️ ADMIN_PASSWORD environment variable is not set in Cloudflare. Please add it in your project settings.'), {
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
    }

    const validToken = await hashToken(ADMIN_PASSWORD);

    // ── Handle POST /admin/auth ──────────────────────────────
    if (request.method === 'POST' && url.pathname === '/admin/auth') {
        let password = '';
        try {
            const formData = await request.formData();
            password = formData.get('password') || '';
        } catch (_) {}

        const submittedToken = await hashToken(password);

        if (submittedToken === validToken) {
            // Correct password — set cookie and redirect to admin
            return new Response(null, {
                status: 302,
                headers: {
                    'Location': '/admin/',
                    'Set-Cookie': `${SESSION_COOKIE}=${validToken}; Path=/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`
                }
            });
        } else {
            // Wrong password
            return new Response(loginPage('Incorrect password. Please try again.'), {
                status: 401,
                headers: { 'Content-Type': 'text/html; charset=utf-8' }
            });
        }
    }

    // ── Handle GET /admin/logout ─────────────────────────────
    if (url.pathname === '/admin/logout') {
        return new Response(null, {
            status: 302,
            headers: {
                'Location': '/admin/',
                'Set-Cookie': `${SESSION_COOKIE}=; Path=/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=0`
            }
        });
    }

    // ── Check session cookie ─────────────────────────────────
    const sessionValue = getSessionCookie(request);

    if (sessionValue === validToken) {
        // Authenticated — pass through to admin panel
        return next();
    }

    // Not authenticated — show login page
    return new Response(loginPage(''), {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}
