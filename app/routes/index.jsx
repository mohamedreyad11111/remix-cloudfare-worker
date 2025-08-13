import { Link } from '@remix-run/react';

export default function Index() {
  return (
    <div>
      <p>Welcome! Use the links below:</p>
      <ul>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/dashboard">Dashboard (protected)</Link></li>
      </ul>
    </div>
  );
}
