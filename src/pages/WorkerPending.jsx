import { Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { useAppData } from '../context/AppDataContext.jsx';

export default function WorkerPending() {
  const { workerAccount } = useAppData();

  return (
    <div className="min-h-screen bg-that-page text-that-text">
      <Navbar variant="worker" title="Pending Approval" />

      <main className="mx-auto flex w-full max-w-[1512px] justify-center px-4 py-10 sm:px-6 lg:px-8">
        <section className="w-full max-w-2xl rounded-lg border border-that-border bg-that-card p-6 text-center shadow-card sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-that-border bg-that-soft text-that-accent">
            <Clock3 className="h-8 w-8" strokeWidth={2.2} />
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.12em] text-that-accent">
            Verification pending
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">Your account is waiting for approval</h1>
          <p className="mt-4 text-sm font-medium leading-6 text-that-muted">
            Administrators must verify {workerAccount.organizationName || 'your organization'} before including it in the public app.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              className="rounded-lg bg-that-accent px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-that-accentDark"
              to="/worker/dashboard"
            >
              Continue to Worker Dashboard (mock)
            </Link>
            <Link
              className="rounded-lg border border-that-border bg-white px-5 py-3 text-sm font-extrabold text-that-text transition hover:border-that-accent hover:bg-that-soft"
              to="/"
            >
              Return to Public Dashboard
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
