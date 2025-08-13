import { json, redirect } from '@remix-run/node';

import { getUserFromSession } from '~/utils/session.server';

export const loader = async ({ request, context }) => {
  const uid = await getUserFromSession(request, context.env.SESSION_SECRET);
  if (!uid) {
    return redirect('/login');
  }
  // optionally load user data from DB
  return json({ userId: uid });
};

export default function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>This is a protected page. If you see this, you're logged in.</p>
    </div>
  );
}
