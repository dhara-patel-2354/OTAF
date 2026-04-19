import { Menu, ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'FAQ', to: '/#faq' },
  { label: 'Resources', to: '/#resources' }
];

function PublicLinks({ onNavigate }) {
  return (
    <>
      {navItems.map((item) => (
        <NavLink
          className={({ isActive }) =>
            `rounded-lg px-3 py-2 transition hover:bg-that-soft hover:text-that-text ${
              isActive && item.to === '/' ? 'bg-that-soft text-that-text' : ''
            }`
          }
          end={item.to === '/'}
          key={item.label}
          onClick={onNavigate}
          to={item.to}
        >
          {item.label}
        </NavLink>
      ))}
      <Link
        className="rounded-lg bg-that-accent px-4 py-2 text-white shadow-sm transition hover:bg-that-accentDark"
        onClick={onNavigate}
        to="/worker/sign-in"
      >
        Sign In
      </Link>
    </>
  );
}

export default function Navbar({ showSignOut = false, title, variant = 'public' }) {
  const [isOpen, setIsOpen] = useState(false);
  const isWorker = variant === 'worker';

  return (
    <header className="w-full border-b border-that-border bg-white">
      <nav className="mx-auto max-w-[1512px] px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link className="flex min-w-0 items-center gap-3" to="/">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-that-accent text-white">
              <ShieldCheck className="h-5 w-5" strokeWidth={2.2} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-that-accentDark">
                  TechAlong Labs
                </p>
                <p className="text-xl font-extrabold leading-none text-that-text">
                  THAT
                </p>
              </div>
              <p className="mt-1 text-sm font-medium text-that-muted">
                {title || 'Transition House Availability Tracker'}
              </p>
            </div>
          </Link>

          {isWorker ? (
            <div className="hidden items-center gap-2 text-sm font-semibold text-that-muted sm:flex">
              <Link
                className="rounded-lg px-3 py-2 transition hover:bg-that-soft hover:text-that-text"
                to="/"
              >
                Public Dashboard
              </Link>
              {showSignOut && (
                <Link
                  className="rounded-lg bg-that-accent px-4 py-2 text-white shadow-sm transition hover:bg-that-accentDark"
                  to="/"
                >
                  Sign out
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="hidden items-center gap-2 text-sm font-semibold text-that-muted md:flex">
                <PublicLinks />
              </div>

              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-that-border text-that-text transition hover:bg-that-soft md:hidden"
                type="button"
                aria-label="Toggle menu"
                onClick={() => setIsOpen((current) => !current)}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </>
          )}
        </div>

        {!isWorker && isOpen && (
          <div className="mt-4 grid gap-2 border-t border-that-border pt-4 text-sm font-semibold text-that-muted md:hidden">
            <PublicLinks onNavigate={() => setIsOpen(false)} />
          </div>
        )}
      </nav>
    </header>
  );
}
