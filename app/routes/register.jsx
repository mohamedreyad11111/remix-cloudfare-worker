import { json, redirect } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import { registerUser } from '~/utils/auth.server';

export const action = async ({ request, context }) => {
  const form = await request.formData();
  const email = form.get('email');
  const password = form.get('password');

  if (!email || !password) {
    return json({ error: 'Email and password required' }, { status: 400 });
  }

  try {
    await registerUser({ email, password, env: context.env });
    return redirect('/login');
  } catch (err) {
    return json({ error: err.message || 'Failed to register' }, { status: 500 });
  }
};

export default function Register() {
  const actionData = useActionData();
  return (
    <div>
      <h2>Register</h2>
      <form method="post">
        <div>
          <label>Email</label>
          <input name="email" type="email" required />
        </div>
        <div>
          <label>Password</label>
          <input name="password" type="password" required />
        </div>
        <button type="submit">Create account</button>
      </form>
      {actionData?.error && <p style={{ color: 'red' }}>{actionData.error}</p>}
    </div>
  );
}
