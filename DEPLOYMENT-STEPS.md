# Deployment Steps (no terminal/CLI)

1. Create a new GitHub repository (via GitHub web UI).
2. Upload all files from this project (use the "Add file" -> "Upload files" button on GitHub) and commit to `main` branch.
3. On Cloudflare dashboard:
   - Create a D1 database (Workers -> D1 -> Create database). Name it e.g. `auth_db`.
   - Run the SQL schema (see `db/schema.sql`) to create the `users` table.
   - Create a Worker (Workers -> Create Service -> "Start from scratch") or use "Deploy from Git" (see below).
4. Add a D1 binding to your Worker with name `DB` (binding name must match the code).
   - In the Worker settings -> Variables & Secrets -> D1 Bindings -> Add binding: Binding name: `DB`, Database: (choose your `auth_db`).
5. Create a Cloudflare API token with permissions for Workers and D1 and account-level access. Save the token and your account ID.
6. In your GitHub repository, go to Settings -> Secrets and variables -> Actions -> New repository secret. Add secrets:
   - `CF_ACCOUNT_ID` = your Cloudflare account id
   - `CF_API_TOKEN` = API token created in step 5
   - `SESSION_SECRET` = a long random secret (used to sign session cookies)
7. The included GitHub Actions workflow will run on push to `main`. It installs dependencies, builds the Remix app, and publishes using `wrangler` with the provided secrets.
8. Open the Cloudflare dashboard -> Workers to confirm the deployment. Test the endpoints:
   - `/register` to create a user
   - `/login` to log in (redirects to `/dashboard`)
   - `/dashboard` shows a protected page for logged-in users
9. If you need to update pages, edit files locally or via GitHub web UI and push — the GitHub Action will rebuild and redeploy automatically.

Notes:
- If you prefer Cloudflare Pages + Functions, you can adapt the workflow to use `pages`.
- Building on GitHub Actions avoids needing to run `remix build` locally.
