import { ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

const filters = ['Availability', 'City', 'Services', 'Population'];

function FilterButton({ label, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const allLabel = `All ${label.toLowerCase()}`;
  const menuOptions = ['', ...options];

  function selectOption(option) {
    onChange(option);
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-that-border bg-that-card px-4 py-2.5 text-sm font-bold text-that-text shadow-sm transition hover:border-that-accent hover:bg-white"
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{value || label}</span>
        <ChevronDown
          className={`h-4 w-4 text-that-accent transition ${isOpen ? 'rotate-180' : ''}`}
          strokeWidth={2.4}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-20 mt-2 max-h-72 overflow-auto rounded-lg border border-that-border bg-that-card p-2.5 shadow-card">
          <p className="px-2 pb-2 text-xs font-extrabold uppercase tracking-[0.12em] text-that-muted">
            {label}
          </p>
          <div className="grid gap-1">
            {menuOptions.map((option) => (
              <button
                className={`rounded-md px-2 py-2 text-left text-sm font-bold transition hover:bg-that-soft ${
                  option === value ? 'bg-that-soft text-that-text' : 'text-that-text'
                }`}
                key={option || allLabel}
                type="button"
                onClick={() => selectOption(option)}
              >
                {option || allLabel}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SortButton({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const sortOptions = ['Nearest', 'Availability', 'Name', 'Recently updated'];

  function selectOption(option) {
    onChange(option);
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        className="flex min-h-11 items-center gap-3 rounded-lg border border-that-border bg-white px-4 py-2.5 text-sm font-bold text-that-text shadow-sm transition hover:border-that-accent hover:bg-that-soft"
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        {value}
        <ChevronDown
          className={`h-4 w-4 text-that-accent transition ${isOpen ? 'rotate-180' : ''}`}
          strokeWidth={2.4}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-20 mt-2 min-w-full rounded-lg border border-that-border bg-that-card p-2.5 shadow-card">
          <p className="px-2 pb-2 text-xs font-extrabold uppercase tracking-[0.12em] text-that-muted">
            Sort by
          </p>
          <div className="grid gap-1">
            {sortOptions.map((option) => (
              <button
                className={`whitespace-nowrap rounded-md px-2 py-2 text-left text-sm font-bold transition hover:bg-that-soft ${
                  option === value ? 'bg-that-soft text-that-text' : 'text-that-text'
                }`}
                key={option}
                type="button"
                onClick={() => selectOption(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ServiceFilterButton({ options, values, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedCount = values.length;

  function toggleService(service) {
    onChange(
      values.includes(service)
        ? values.filter((value) => value !== service)
        : [...values, service]
    );
  }

  return (
    <div className="relative">
      <button
        className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-that-border bg-that-card px-4 py-2.5 text-sm font-bold text-that-text shadow-sm transition hover:border-that-accent hover:bg-white"
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{selectedCount ? `${selectedCount} services` : 'Services'}</span>
        <ChevronDown
          className={`h-4 w-4 text-that-accent transition ${isOpen ? 'rotate-180' : ''}`}
          strokeWidth={2.4}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-20 mt-2 max-h-72 overflow-auto rounded-lg border border-that-border bg-that-card p-2.5 shadow-card">
          <p className="px-2 pb-2 text-xs font-extrabold uppercase tracking-[0.12em] text-that-muted">
            All Services
          </p>
          <div className="grid gap-1">
            {options.map((option) => (
              <label
                className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm font-bold text-that-text transition hover:bg-that-soft"
                key={option}
              >
                <input
                  className="h-4 w-4 rounded border-that-border accent-that-accent focus:ring-that-accent"
                  type="checkbox"
                  checked={values.includes(option)}
                  onChange={() => toggleService(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FilterBar({
  filters: activeFilters,
  options,
  sortBy,
  onFilterChange,
  onSortChange,
  onClearFilter
}) {
  const activeChips = [
    ['availability', activeFilters.availability],
    ['city', activeFilters.city],
    ...activeFilters.services.map((service) => ['services', service]),
    ['population', activeFilters.population]
  ].filter(([, value]) => value);

  return (
    <section className="rounded-lg border border-that-border bg-that-card p-4 shadow-card sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FilterButton
            label={filters[0]}
            options={options.availability}
            value={activeFilters.availability}
            onChange={(value) => onFilterChange('availability', value)}
          />
          <FilterButton
            label={filters[1]}
            options={options.cities}
            value={activeFilters.city}
            onChange={(value) => onFilterChange('city', value)}
          />
          <ServiceFilterButton
            options={options.services}
            values={activeFilters.services}
            onChange={(value) => onFilterChange('services', value)}
          />
          <FilterButton
            label={filters[3]}
            options={options.populations}
            value={activeFilters.population}
            onChange={(value) => onFilterChange('population', value)}
          />
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="text-sm font-bold text-that-muted">Sort by</span>
          <SortButton value={sortBy} onChange={onSortChange} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {activeChips.length > 0 ? (
          activeChips.map(([key, value]) => (
            <span
              className="inline-flex items-center gap-2 rounded-full border border-that-border bg-that-soft px-3 py-1.5 text-sm font-bold text-that-text"
              key={`${key}-${value}`}
            >
              {value}
              <button
                className="rounded-full text-that-muted transition hover:text-that-text"
                type="button"
                aria-label={`Remove ${value} filter`}
                onClick={() => onClearFilter(key, value)}
              >
                <X className="h-3.5 w-3.5" strokeWidth={2.5} />
              </button>
            </span>
          ))
        ) : (
          <span className="text-sm font-semibold text-that-muted">
            No active filters
          </span>
        )}
      </div>
    </section>
  );
}
