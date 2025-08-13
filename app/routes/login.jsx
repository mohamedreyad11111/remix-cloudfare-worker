import { json, redirect } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import { verifyUser } from '~/utils/auth.server';
import { createSessionCookieHeader } from '~/utils/session.server';

export const action = async ({ request, context }) => {
  const form = await request.formData();
  const email = form.get('email');
  const password = form.get('password');

  if (!email || !password) {
    return json({ error: 'Email and password required' }, { status: 400 });
  }

  const user = await verifyUser({ email, password, env: context.env });
  if (!user) return json({ error: 'Invalid credentials' }, { status: 401 });

  const cookie = await createSessionCookieHeader(user.id, context.env.SESSION_SECRET);
  // set cookie and redirect
  return redirect('/dashboard', {
    headers: {
      'Set-Cookie': cookie
    }
  });
};

export default function Login() {
  const actionData = useActionData();
  return (
    <div>
      <h2>Login</h2>
      <form method="post">
        <div>
          <label>Email</label>
          <input name="email" type="email" required />
        </div>
        <div>
          <label>Password</label>
          <input name="password" type="password" required />
        </div>
        <button type="submit">Log in</button>
      </form>
      {actionData?.error && <p style={{ color: 'red' }}>{actionData.error}</p>}
    </div>
  );
}
