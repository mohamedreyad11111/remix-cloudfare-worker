/**
 * Simple signed session cookie implementation using HMAC-SHA256 via Web Crypto.
 *
 * Cookie format: base64(userId) + '.' + base64(hmac)
 */

function b64Encode(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}
function b64DecodeToBytes(b64) {
  const str = atob(b64);
  const arr = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) arr[i] = str.charCodeAt(i);
  return arr;
}

export async function createSessionCookieHeader(userId, secret) {
  const value = await createSignedValue(String(userId), secret);
  const cookie = `session=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`;
  return cookie;
}

export async function createSignedValue(payload, secret) {
  const payloadB64 = btoa(payload);
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payloadB64));
  const sigB64 = b64Encode(sig);
  return `${payloadB64}.${sigB64}`;
}

export async function verifySignedValue(signed, secret) {
  const parts = signed.split('.');
  if (parts.length !== 2) return null;
  const [payloadB64, sigB64] = parts;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
  const valid = await crypto.subtle.verify('HMAC', key, b64DecodeToBytes(sigB64), new TextEncoder().encode(payloadB64));
  if (!valid) return null;
  return atob(payloadB64);
}

export async function getUserFromSession(request, secret) {
  const cookieHeader = request.headers.get('Cookie') || '';
  const match = cookieHeader.split(';').map(s=>s.trim()).find(s=>s.startsWith('session='));
  if (!match) return null;
  const val = match.split('=')[1];
  try {
    const uid = await verifySignedValue(decodeURIComponent(val), secret);
    return uid;
  } catch (e) {
    return null;
  }
}
