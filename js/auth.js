import { clientId, redirectUri, authEndpoint, tokenEndpoint, scopes } from './config.js';


function generateRandomString(length) 
{
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

async function sha256(plain) 
{
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
}

function base64urlencode(a) 
{
    return btoa(String.fromCharCode.apply(null, new Uint8Array(a)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function generateCodeChallenge(v) 
{
    const hashed = await sha256(v);
    return base64urlencode(hashed);
}


export async function redirectToSpotify() 
{
    const codeVerifier = generateRandomString(64);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    
    window.localStorage.setItem('code_verifier', codeVerifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", redirectUri);
    params.append("scope", scopes.join(" "));
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", codeChallenge);

    const authUrl = `${authEndpoint}?${params.toString()}`;
    window.location.href = authUrl;
}


export async function handleRedirect() 
{
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) return null;

    const codeVerifier = localStorage.getItem('code_verifier');

    const payload = new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
    });

    try {
        const response = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: payload,
        });

        const data = await response.json();
        
        if (data.access_token) 
        {
            localStorage.setItem('spotify_token', data.access_token);
            const now = new Date().getTime();
            localStorage.setItem('token_timestamp', now);
            window.history.replaceState({}, document.title, "/index.html");
            return data.access_token;
        } 
        else 
        {
            console.error("Eroare la obținerea token-ului:", data);
            return null;
        }
    } 
    catch (error) 
    {
        console.error("Eroare de rețea:", error);
        return null;
    }
}