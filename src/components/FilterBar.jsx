import { ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

const filters = ['Availability', 'City', 'Services', 'Population'];

function FilterButton({ label }) {
  return (
    <button
      className="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-that-border bg-that-card px-4 py-2.5 text-sm font-bold text-that-text shadow-sm transition hover:border-that-accent hover:bg-white"
      type="button"
    >
      <span>{label}</span>
      <ChevronDown className="h-4 w-4 text-that-accent" strokeWidth={2.4} />
    </button>
  );
}

export default function FilterBar() {
  const [activeChip, setActiveChip] = useState('Women only');

  return (
    <section className="rounded-lg border border-that-border bg-that-card p-4 shadow-card sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {filters.map((filter) => (
            <FilterButton key={filter} label={filter} />
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="text-sm font-bold text-that-muted">Sort by</span>
          <button
            className="flex min-h-11 items-center gap-3 rounded-lg border border-that-border bg-white px-4 py-2.5 text-sm font-bold text-that-text shadow-sm transition hover:border-that-accent hover:bg-that-soft"
            type="button"
          >
            Nearest
            <ChevronDown className="h-4 w-4 text-that-accent" strokeWidth={2.4} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {activeChip ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-that-border bg-that-soft px-3 py-1.5 text-sm font-bold text-that-text">
            {activeChip}
            <button
              className="rounded-full text-that-muted transition hover:text-that-text"
              type="button"
              aria-label={`Remove ${activeChip} filter`}
              onClick={() => setActiveChip('')}
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
          </span>
        ) : (
          <span className="text-sm font-semibold text-that-muted">
            No active filters
          </span>
        )}
      </div>
    </section>
  );
}
