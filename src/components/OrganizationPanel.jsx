import { Check, Clock3, Home, Plus } from 'lucide-react';

const dotClasses = {
  Available: 'bg-that-green',
  Unavailable: 'bg-that-red',
  Unknown: 'bg-that-gray'
};

function statusDotClass(shelter) {
  if (!shelter?.partnered) {
    return 'bg-that-gray';
  }

  return dotClasses[shelter?.status] ?? 'bg-that-gray';
}

function CategoryPill({ label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-that-border bg-white px-3 py-1.5 text-sm font-semibold text-that-text shadow-sm">
      <Check className="h-3.5 w-3.5 text-that-green" strokeWidth={2.5} />
      {label}
    </span>
  );
}

function CategorySection({ categories = [], title }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-that-muted">
          {title}
        </h3>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full border border-that-border bg-white text-that-accent transition hover:border-that-accent hover:bg-that-soft"
          type="button"
          aria-label={`Add ${title.toLowerCase()}`}
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <CategoryPill key={category} label={category} />
        ))}
      </div>
    </section>
  );
}

export default function OrganizationPanel({ onSetStatus, shelter, showActions = false }) {
  if (!shelter) {
    return null;
  }

  return (
    <aside className="self-start rounded-lg border border-that-border bg-that-card p-5 shadow-card sm:p-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-that-text">
        Your Organization
      </h1>

      <div className="mt-5 space-y-5">
        <div className="rounded-lg border border-that-border bg-white p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-that-border bg-that-soft text-that-accent">
              <Home className="h-7 w-7" strokeWidth={2.1} />
            </div>

            <div className="min-w-0 pt-1">
              <h2 className="text-lg font-extrabold leading-snug text-that-text">
                {shelter.name}
              </h2>
              <p className="mt-1 text-sm font-medium leading-snug text-that-muted">
                {shelter.organization}
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-2 text-sm font-bold leading-5 text-that-text">
            <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${statusDotClass(shelter)}`} />
            <span>{shelter.status}</span>
          </div>
        </div>

        {showActions && (
          <div className="grid gap-3">
            <button
              className="w-full rounded-lg bg-that-green px-5 py-3 text-base font-extrabold text-white shadow-sm transition hover:brightness-95"
              type="button"
              onClick={() => onSetStatus?.('Available')}
            >
              Set as Open
            </button>
            <button
              className="w-full rounded-lg bg-that-red px-5 py-3 text-base font-extrabold text-white shadow-sm transition hover:brightness-95"
              type="button"
              onClick={() => onSetStatus?.('Unavailable')}
            >
              Set as Closed
            </button>
          </div>
        )}

        <div className="flex items-center gap-3 rounded-lg border border-that-border bg-that-soft px-4 py-3 text-sm font-semibold text-that-muted">
          <Clock3 className="h-4 w-4 shrink-0 text-that-accent" strokeWidth={2.2} />
          <span>Updated: {shelter.updatedAt}</span>
        </div>

        <CategorySection title="Population Categories" categories={shelter.populationCategories} />
        <CategorySection title="Service Categories" categories={shelter.serviceCategories} />

        <section className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-that-muted">
            More Information
          </h3>
          <p className="text-sm font-medium leading-6 text-that-muted">
            Is there anything that you&apos;d like the users to know about your organization?
          </p>
          <textarea
            className="min-h-28 w-full resize-none rounded-lg border border-that-border bg-white px-4 py-3 text-sm font-medium leading-6 text-that-text outline-none transition focus:border-that-accent focus:ring-4 focus:ring-that-accent/10"
            readOnly
            value={shelter.moreInfo}
          />
        </section>
      </div>
    </aside>
  );
}
