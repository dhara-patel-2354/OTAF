import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { useAppData } from '../context/AppDataContext.jsx';

export default function WorkerSignIn() {
  const navigate = useNavigate();
  const { signIn } = useAppData();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};
    const email = form.email.trim().toLowerCase();
    if (!email) {
      nextErrors.email = 'Email is required.';
    }
    if (!form.password.trim()) nextErrors.password = 'Password is required.';

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      const result = await signIn(email, form.password);

      if (!result.ok) {
        setErrors({ form: result.error });
        return;
      }

      if (result.worker.approvalStatus !== 'approved') {
        navigate('/worker/pending');
        return;
      }

      navigate('/worker/dashboard');
    }
  }

  return (
    <div className="min-h-screen bg-white text-that-text">
      <Navbar variant="worker" title="Worker Sign In" />

      <main className="mx-auto flex w-full max-w-[430px] justify-center px-5 py-24 sm:px-6">
        <form
          className="w-full"
          onSubmit={handleSubmit}
        >
          <h1 className="text-center text-3xl font-medium tracking-tight text-that-text">
            Welcome!
          </h1>
          <p className="mx-auto mt-5 max-w-[320px] text-center text-lg font-medium leading-6 text-that-text">
            Sign in to manage your transition house availability and information.
          </p>

          <div className="mt-7 space-y-4">
            <label className="block">
              <span className="text-base font-medium text-that-text">Email</span>
              <input
                className="mt-2 w-full rounded-md border border-that-border bg-white px-4 py-3 text-base font-medium outline-none transition placeholder:text-that-muted/60 focus:border-that-accent focus:ring-4 focus:ring-that-accent/10"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="Value"
              />
              {errors.email && <span className="mt-2 block text-sm font-semibold text-that-red">{errors.email}</span>}
            </label>

            <label className="block">
              <span className="text-base font-medium text-that-text">Password</span>
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
            Sign in
          </button>

          {errors.form && (
            <p className="mt-3 text-sm font-semibold text-that-red">{errors.form}</p>
          )}

          <p className="mt-5 text-base font-medium text-that-text">
            Don't have an account?{' '}
            <Link className="font-extrabold text-that-text underline underline-offset-2" to="/worker/sign-up">
              Sign up
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
