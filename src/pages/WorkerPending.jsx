import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext.jsx';
import PublicDashboard from './PublicDashboard.jsx';

export default function WorkerPending() {
  const { workerAccount } = useAppData();

  return (
    <div className="relative min-h-screen bg-that-page text-that-text">
      <div className="pointer-events-none opacity-30">
        <PublicDashboard />
      </div>

      <div className="fixed inset-0 z-50 flex items-start justify-center px-5 pt-[34vh]">
        <section
          className="w-full max-w-[330px] rounded-md border border-that-border bg-white p-5 shadow-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pending-approval-title"
        >
          <div className="flex items-start justify-between gap-4">
            <h1
              className="text-xl font-extrabold leading-6 text-that-text"
              id="pending-approval-title"
            >
              Please wait until the app administrators add you to the app.
            </h1>
            <Link
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-that-muted transition hover:bg-that-soft hover:text-that-text"
              to="/"
              aria-label="Close pending message"
            >
              <X className="h-4 w-4" strokeWidth={2.4} />
            </Link>
          </div>

          <p className="mt-4 text-sm font-medium leading-5 text-that-text">
            Thank you so much for signing up! For security reasons, the app administrators will verify once again that{' '}
            {workerAccount.organizationName || 'your organization'} exists and you have kind hearts.
            You will receive an email when you are officially onboard!
          </p>
        </section>
      </div>
    </div>
  );
}
