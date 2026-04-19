import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

export default function WorkerSignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = 'Email is required.';
    if (!form.password.trim()) nextErrors.password = 'Password is required.';

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      navigate('/worker/dashboard');
    }
  }

  return (
    <div className="min-h-screen bg-that-page text-that-text">
      <Navbar variant="worker" title="Worker Sign In" />

      <main className="mx-auto flex w-full max-w-[1512px] justify-center px-4 py-10 sm:px-6 lg:px-8">
        <form
          className="w-full max-w-lg rounded-lg border border-that-border bg-that-card p-6 shadow-card sm:p-8"
          onSubmit={handleSubmit}
        >
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-that-accent">
            Worker Portal
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">Sign in</h1>
          <p className="mt-3 text-sm font-medium leading-6 text-that-muted">
            Manage shelter availability and keep public information current.
          </p>

          <div className="mt-7 space-y-5">
            <label className="block">
              <span className="text-sm font-bold text-that-text">Email</span>
              <input
                className="mt-2 w-full rounded-lg border border-that-border bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-that-accent focus:ring-4 focus:ring-that-accent/10"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="worker@example.org"
              />
              {errors.email && <span className="mt-2 block text-sm font-semibold text-that-red">{errors.email}</span>}
            </label>

            <label className="block">
              <span className="text-sm font-bold text-that-text">Password</span>
              <input
                className="mt-2 w-full rounded-lg border border-that-border bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-that-accent focus:ring-4 focus:ring-that-accent/10"
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder="Enter password"
              />
              {errors.password && <span className="mt-2 block text-sm font-semibold text-that-red">{errors.password}</span>}
            </label>
          </div>

          <button
            className="mt-7 w-full rounded-lg bg-that-accent px-5 py-3 text-base font-extrabold text-white shadow-sm transition hover:bg-that-accentDark"
            type="submit"
          >
            Sign In
          </button>

          <p className="mt-5 text-center text-sm font-semibold text-that-muted">
            Need an account?{' '}
            <Link className="text-that-accentDark underline decoration-that-accent/40 underline-offset-4" to="/worker/sign-up">
              Sign up
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
