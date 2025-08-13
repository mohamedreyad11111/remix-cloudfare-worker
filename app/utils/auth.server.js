/**
 * Utilities for hashing passwords and accessing D1 for user registration/login.
 * Uses Web Crypto PBKDF2 for password hashing (available in Cloudflare Workers).
 */

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function generateSalt() {
  const array = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...array));
}

export async function hashPassword(password, salt) {
  const pwKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const saltBytes = Uint8Array.from(atob(salt), c => c.charCodeAt(0));
  const derived = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBytes, iterations: 100000, hash: 'SHA-256' },
    pwKey,
    256
  );
  return btoa(String.fromCharCode(...new Uint8Array(derived)));
}

export async function registerUser({ email, password, env }) {
  const salt = await generateSalt();
  const hash = await hashPassword(password, salt);
  const created_at = new Date().toISOString();
  // insert into D1
  await env.DB.prepare('INSERT INTO users (email, password_hash, salt, created_at) VALUES (?, ?, ?, ?)')
    .bind(email, hash, salt, created_at)
    .run();
  return true;
}

export async function verifyUser({ email, password, env }) {
  const res = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).all();
  const row = res.results && res.results[0];
  if (!row) return null;
  const expectedHash = row.password_hash;
  const salt = row.salt;
  const hash = await hashPassword(password, salt);
  if (hash === expectedHash) {
    return { id: row.id, email: row.email };
  }
  return null;
}
