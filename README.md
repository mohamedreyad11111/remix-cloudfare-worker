# Remix + Cloudflare Workers + D1 — Auth Example

This project is a minimal example of a Remix app deployed to Cloudflare Workers using a Cloudflare D1 database for user storage (register / login).

Files included show a simple register/login flow, password hashing with Web Crypto (PBKDF2), and a simple signed cookie session implementation.

**Important:** You will need to create a D1 database in Cloudflare, create the `users` table (schema provided), and wire the D1 binding and some secrets (SESSION_SECRET, CF_ACCOUNT_ID, CF_API_TOKEN) as described in the deployment steps. The repository includes a GitHub Actions workflow to build & publish using `wrangler` (so you don't need local CLI to publish).

See DEPLOYMENT-STEPS.md for the full step-by-step (upload to GitHub web UI and connect to Cloudflare without terminal/CLI).
