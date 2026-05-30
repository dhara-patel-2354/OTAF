import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext.jsx';

const navItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Resources', to: '/resources' }
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
  const { signOut } = useAppData();
  const isWorker = variant === 'worker';

  return (
    <header className="w-full border-b border-that-border bg-white">
      <nav className="mx-auto max-w-[1512px] px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link className="flex min-w-0 items-center gap-3" to="/">
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="text-sm font-semibold tracking-normal text-that-accent">TechAlong</span>
              <div className="relative h-9 w-9 shrink-0">
                <div className="absolute left-1/2 top-[2px] h-6 w-6 -translate-x-1/2 rotate-45 rounded-[3px] bg-[#d8bbdc]" />
                <div className="absolute bottom-[4px] left-[4px] h-5 w-5 skew-y-[28deg] rounded-[3px] bg-that-accent/90" />
                <div className="absolute bottom-[4px] right-[4px] h-5 w-5 -skew-y-[28deg] rounded-[3px] bg-[#a684ab]" />
              </div>
              <span className="text-sm font-semibold tracking-normal text-that-accent">Labs</span>
            </div>

            <div className="hidden min-w-0 items-center gap-2 sm:flex">
              <p className="text-2xl font-extrabold leading-none tracking-normal text-that-text">
                OTAF
              </p>
              <p className="max-w-[90px] text-[10px] font-semibold leading-tight text-that-muted">
                One Tap
                <br />
                Away Finder
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
                  onClick={signOut}
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
