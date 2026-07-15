import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { useAppData } from '../context/AppDataContext.jsx';
import { isValidEmail, normalizeEmail } from '../data/email.js';

export default function WorkerSignUp() {
  const navigate = useNavigate();
  const { workerAccount, updateWorkerAccount } = useAppData();
  const [form, setForm] = useState({
    email: workerAccount.email,
    password: workerAccount.password
  });
  const [errors, setErrors] = useState({});

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};
    const email = normalizeEmail(form.email);
    if (!email) {
      nextErrors.email = 'Email is required.';
    } else if (!isValidEmail(email)) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (!form.password.trim()) {
      nextErrors.password = 'Password is required.';
    } else if (form.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      updateWorkerAccount({ ...form, email });
      navigate('/worker/org-info');
    }
  }

  return (
    <div className="min-h-screen bg-white text-that-text">
      <Navbar variant="worker" title="Create Worker Account" />

      <main className="mx-auto flex w-full max-w-[430px] justify-center px-5 py-24 sm:px-6">
        <form
          className="w-full"
          onSubmit={handleSubmit}
        >
          <h1 className="text-3xl font-medium tracking-tight text-that-text">Create an account</h1>
          <p className="mt-5 text-center text-lg font-medium leading-6 text-that-text">
            Please note that after you create an account, app administrators will manually verify
            your organization before including you in the app.
          </p>

          <div className="mt-7 space-y-4">
            <label className="block">
              <span className="text-base font-medium text-that-text">Email*</span>
              <span className="mt-2 block text-base font-medium leading-6 text-that-muted">
                Please choose an email where all your staff members managing availability will have the access to.
              </span>
              <input
                className="mt-3 w-full rounded-md border border-that-border bg-white px-4 py-3 text-base font-medium outline-none transition placeholder:text-that-muted/60 focus:border-that-accent focus:ring-4 focus:ring-that-accent/10"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="Value"
              />
              {errors.email && <span className="mt-2 block text-sm font-semibold text-that-red">{errors.email}</span>}
            </label>

            <label className="block">
              <span className="text-base font-medium text-that-text">Password*</span>
              <input
                className="mt-2 w-full rounded-md border border-that-border bg-white px-4 py-3 text-base font-medium outline-none transition placeholder:text-that-muted/60 focus:border-that-accent focus:ring-4 focus:ring-that-accent/10"
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder="Value"
              />
              {errors.password && <span className="mt-2 block text-sm font-semibold text-that-red">{errors.password}</span>}
            </label>
          </div>

          <button
            className="mt-5 w-full rounded-md bg-[#2f2f2f] px-5 py-3 text-base font-medium text-white shadow-sm transition hover:bg-that-text"
            type="submit"
          >
            Continue
          </button>

          <p className="mt-5 text-center text-sm font-semibold text-that-muted">
            Already have access?{' '}
            <Link className="text-that-accentDark underline decoration-that-accent/40 underline-offset-4" to="/worker/sign-in">
              Sign in
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
