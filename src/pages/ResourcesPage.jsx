import { ExternalLink, LifeBuoy } from 'lucide-react';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import { resourceItems } from '../data/publicInfo.js';

export default function ResourcesPage() {
  return (
    <div className="flex h-[111.12vh] flex-col overflow-hidden bg-that-page text-that-text">
      <Navbar title="Resources" />

      <main className="mx-auto flex min-h-0 w-full max-w-[1512px] flex-1 px-4 pb-5 pt-5 sm:px-6 lg:px-8">
        <section className="w-full flex-1 rounded-lg border border-that-border bg-white p-4 shadow-card sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-that-soft text-that-accent">
              <LifeBuoy className="h-6 w-6" strokeWidth={2.3} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-that-text">
                Resources
              </h1>
              <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-that-muted">
                Verified support links for safety planning, crisis support, referrals, and shelter navigation.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {resourceItems.map((resource) => (
              <a
                className="group rounded-lg border border-that-border bg-that-card p-4 shadow-card transition hover:border-that-accent hover:bg-white"
                href={resource.href}
                key={resource.title}
                rel="noreferrer"
                target="_blank"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-base font-extrabold leading-6 text-that-text">
                    {resource.title}
                  </h2>
                  <ExternalLink
                    className="mt-1 h-4 w-4 shrink-0 text-that-accent transition group-hover:translate-x-0.5"
                    strokeWidth={2.4}
                  />
                </div>
                <p className="mt-3 text-sm font-medium leading-6 text-that-muted">
                  {resource.description}
                </p>
                <p className="mt-4 text-sm font-extrabold text-that-accentDark">
                  {resource.contact}
                </p>
              </a>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
