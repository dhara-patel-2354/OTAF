import { useEffect, useMemo, useState } from 'react';
import { Check, Clock3, Home, Plus, Save, X } from 'lucide-react';
import FilterBar from '../components/FilterBar.jsx';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import ShelterCard from '../components/ShelterCard.jsx';
import { useAppData } from '../context/AppDataContext.jsx';
import { populationOptions, serviceOptions } from '../data/mockData.js';

function toggleValue(values, value) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function EditablePill({ active, label, onClick }) {
  return (
    <button
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-bold transition ${
        active
          ? 'border-that-accent/20 bg-that-soft text-that-text'
          : 'border-that-border bg-white text-that-text hover:border-that-accent hover:bg-that-soft'
      }`}
      type="button"
      onClick={onClick}
    >
      {active && <Check className="h-3.5 w-3.5 text-that-accent" strokeWidth={2.5} />}
      {label}
    </button>
  );
}

function EditableSection({ options, title, values, onToggle }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-that-text">{title}</h3>
        <button
          className="flex h-7 w-7 items-center justify-center rounded-full border border-that-border bg-white text-that-accent transition hover:border-that-accent hover:bg-that-soft"
          type="button"
          aria-label={`Add ${title.toLowerCase()}`}
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <EditablePill
            key={option}
            label={option}
            active={values.includes(option)}
            onClick={() => onToggle(option)}
          />
        ))}
      </div>
    </section>
  );
}

export default function WorkerDashboard() {
  const { shelters, workerShelter, updateShelter, workerShelterId } = useAppData();
  const [form, setForm] = useState(workerShelter);
  const [filters, setFilters] = useState({
    availability: '',
    city: '',
    services: [],
    population: ''
  });
  const [sortBy, setSortBy] = useState('Nearest');
  const [pendingStatus, setPendingStatus] = useState('');
  const [saved, setSaved] = useState(false);

  const filterOptions = useMemo(
    () => ({
      availability: ['Available', 'Unavailable', 'Unknown'],
      cities: [...new Set(shelters.map((shelter) => shelter.location))].sort(),
      services: [
        ...new Set([
          ...serviceOptions,
          ...shelters.flatMap((shelter) => shelter.serviceCategories)
        ])
      ].sort(),
      populations: [...new Set(shelters.flatMap((shelter) => shelter.populationCategories))].sort()
    }),
    [shelters]
  );

  const filteredShelters = useMemo(() => {
    const statusRank = {
      Available: 0,
      Unavailable: 1,
      Unknown: 2
    };

    return [...shelters]
      .filter((shelter) => {
        const statusMatches = filters.availability
          ? shelter.status === filters.availability
          : true;
        const cityMatches = filters.city ? shelter.location === filters.city : true;
        const serviceMatches = filters.services.length
          ? filters.services.every((service) => shelter.serviceCategories.includes(service))
          : true;
        const populationMatches = filters.population
          ? shelter.populationCategories.includes(filters.population)
          : true;

        return statusMatches && cityMatches && serviceMatches && populationMatches;
      })
      .sort((firstShelter, secondShelter) => {
        if (sortBy === 'Availability') {
          return (
            (statusRank[firstShelter.status] ?? 3) -
            (statusRank[secondShelter.status] ?? 3)
          );
        }

        if (sortBy === 'Name') {
          return firstShelter.name.localeCompare(secondShelter.name);
        }

        return 0;
      });
  }, [filters, shelters, sortBy]);

  useEffect(() => {
    setForm(workerShelter);
  }, [workerShelter]);

  if (!form) {
    return null;
  }

  function requestStatus(status) {
    setPendingStatus(status);
  }

  function confirmStatus() {
    const status = pendingStatus;
    if (!status) {
      return;
    }

    setForm((currentForm) => ({ ...currentForm, status }));
    updateShelter(workerShelterId, { status });
    setPendingStatus('');
    setSaved(true);
  }

  function handleSubmit(event) {
    event.preventDefault();
    updateShelter(workerShelterId, {
      status: form.status,
      populationCategories: form.populationCategories,
      serviceCategories: form.serviceCategories,
      moreInfo: form.moreInfo
    });
    setSaved(true);
  }

  function handleFilterChange(filterName, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [filterName]: value
    }));
  }

  function clearFilter(filterName, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [filterName]: Array.isArray(currentFilters[filterName])
        ? currentFilters[filterName].filter((item) => item !== value)
        : ''
    }));
  }

  return (
    <div className="min-h-screen bg-that-page text-that-text">
      <Navbar variant="worker" title="Manage Availability" showSignOut />

      <main className="mx-auto flex w-full max-w-[1512px] flex-col gap-6 px-4 py-5 sm:px-6 lg:flex-row lg:items-start lg:px-8">
        <form
          className="w-full rounded-lg border border-that-border bg-that-card p-5 shadow-card sm:p-6 lg:w-[340px] lg:shrink-0"
          onSubmit={handleSubmit}
        >
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-extrabold tracking-tight text-that-text">
              Your Organization
            </h1>
            {saved && (
              <span className="rounded-full border border-that-green/40 bg-that-green/15 px-2.5 py-1 text-xs font-extrabold text-that-text">
                Saved
              </span>
            )}
          </div>

          <div className="mt-5 rounded-lg border border-that-border bg-white p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-that-border bg-that-soft text-that-accent">
                <Home className="h-6 w-6" strokeWidth={2.1} />
              </div>

              <div className="min-w-0 pt-0.5">
                <h2 className="text-base font-extrabold leading-snug text-that-text">
                  {form.name}
                </h2>
                <p className="mt-1 text-sm font-medium leading-snug text-that-muted">
                  {form.organization}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 text-sm font-bold leading-5 text-that-text">
              <span
                className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                  form.status === 'Available'
                    ? 'bg-that-green'
                    : form.status === 'Unavailable'
                      ? 'bg-that-red'
                      : 'bg-that-gray'
                }`}
              />
              <span>{form.status}</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                className={`rounded-md px-4 py-2.5 text-sm font-extrabold shadow-sm transition ${
                  form.status === 'Available'
                    ? 'bg-that-accent text-white hover:bg-that-accentDark'
                    : 'border border-that-border bg-white text-that-text hover:border-that-accent hover:bg-that-soft'
                }`}
                type="button"
                onClick={() => requestStatus('Available')}
              >
                Set as Open
              </button>
              <button
                className={`rounded-md px-4 py-2.5 text-sm font-extrabold shadow-sm transition ${
                  form.status === 'Unavailable'
                    ? 'bg-that-accent text-white hover:bg-that-accentDark'
                    : 'border border-that-border bg-white text-that-text hover:border-that-accent hover:bg-that-soft'
                }`}
                type="button"
                onClick={() => requestStatus('Unavailable')}
              >
                Set as Closed
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-lg border border-that-border bg-that-soft px-4 py-3 text-xs font-semibold text-that-muted">
            <Clock3 className="h-4 w-4 shrink-0 text-that-accent" strokeWidth={2.2} />
            <span>Updated: {workerShelter.updatedAt}</span>
          </div>

          <div className="mt-5 space-y-6">
            <EditableSection
              title="Population Categories"
              options={populationOptions}
              values={form.populationCategories}
              onToggle={(tag) =>
                setForm({
                  ...form,
                  populationCategories: toggleValue(form.populationCategories, tag)
                })
              }
            />

            <EditableSection
              title="Service Categories"
              options={serviceOptions}
              values={form.serviceCategories}
              onToggle={(service) =>
                setForm({
                  ...form,
                  serviceCategories: toggleValue(form.serviceCategories, service)
                })
              }
            />

            <label className="block">
              <span className="text-sm font-semibold text-that-text">More Information</span>
              <span className="mt-2 block text-xs font-medium leading-5 text-that-muted">
                Is there anything that you&apos;d like the users to know about your organization?
              </span>
              <textarea
                className="mt-3 min-h-28 w-full resize-none rounded-lg border border-that-border bg-white px-3 py-3 text-sm font-medium leading-6 text-that-text outline-none transition focus:border-that-accent focus:ring-4 focus:ring-that-accent/10"
                value={form.moreInfo}
                onChange={(event) => setForm({ ...form, moreInfo: event.target.value })}
                placeholder="Add intake notes or important service information."
              />
            </label>
          </div>

          <button
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-that-accent px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-that-accentDark"
            type="submit"
          >
            <Save className="h-4 w-4" strokeWidth={2.3} />
            Save Updates
          </button>
        </form>

        <section className="flex w-full min-w-0 flex-1 flex-col gap-6">
          <FilterBar
            filters={filters}
            options={filterOptions}
            sortBy={sortBy}
            onFilterChange={handleFilterChange}
            onSortChange={setSortBy}
            onClearFilter={clearFilter}
          />

          <div className="grid w-full grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {filteredShelters.map((shelter) => (
              <ShelterCard key={shelter.id} shelter={shelter} />
            ))}
          </div>
        </section>
      </main>

      {pendingStatus && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-white/70 px-4 pt-[22vh] backdrop-blur-[1px]">
          <section
            className="w-full max-w-[540px] rounded-lg border border-that-border bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="availability-confirm-title"
          >
            <div className="flex items-start justify-between gap-4">
              <h2
                className="text-lg font-semibold leading-7 text-that-text"
                id="availability-confirm-title"
              >
                Please confirm that you&apos;d like to set {form.name} to be{' '}
                <span className="font-extrabold">
                  {pendingStatus === 'Available' ? 'Open' : 'Closed'}.
                </span>
              </h2>

              <button
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-that-muted transition hover:bg-that-soft hover:text-that-text"
                type="button"
                aria-label="Close confirmation"
                onClick={() => setPendingStatus('')}
              >
                <X className="h-4 w-4" strokeWidth={2.4} />
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                className="rounded-md border border-that-accent bg-white px-4 py-2.5 text-sm font-extrabold text-that-text transition hover:bg-that-soft"
                type="button"
                onClick={() => setPendingStatus('')}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-that-accent px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-that-accentDark"
                type="button"
                onClick={confirmStatus}
              >
                Confirm
              </button>
            </div>
          </section>
        </div>
      )}

      <Footer />
    </div>
  );
}
