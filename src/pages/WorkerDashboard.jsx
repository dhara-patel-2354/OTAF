import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import OrganizationPanel from '../components/OrganizationPanel.jsx';
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
      className={`rounded-full border px-3 py-1.5 text-sm font-bold transition ${
        active
          ? 'border-that-accent bg-that-accent text-white'
          : 'border-that-border bg-white text-that-text hover:border-that-accent hover:bg-that-soft'
      }`}
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default function WorkerDashboard() {
  const { workerShelter, updateShelter, workerShelterId } = useAppData();
  const [form, setForm] = useState(workerShelter);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(workerShelter);
  }, [workerShelter]);

  if (!form) {
    return null;
  }

  function setStatus(status) {
    setForm((currentForm) => ({ ...currentForm, status }));
    updateShelter(workerShelterId, { status });
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

  return (
    <div className="min-h-screen bg-that-page text-that-text">
      <Navbar variant="worker" title="Manage Availability" showSignOut />

      <main className="mx-auto grid w-full max-w-[1512px] items-start gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:gap-8 lg:px-8">
        <OrganizationPanel shelter={workerShelter} onSetStatus={setStatus} showActions />

        <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
          <form
            className="rounded-lg border border-that-border bg-that-card p-5 shadow-card sm:p-6"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-that-accent">
                  Worker Dashboard
                </p>
                <h1 className="mt-2 text-2xl font-black tracking-tight">Update public listing</h1>
                <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-that-muted">
                  Saved changes update the public dashboard mock data immediately for this session.
                </p>
              </div>

              {saved && (
                <p className="rounded-full border border-that-green/40 bg-that-green/15 px-3 py-1.5 text-sm font-extrabold text-that-text">
                  Updates saved
                </p>
              )}
            </div>

            <section className="mt-7">
              <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-that-muted">
                Availability status
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {['Available', 'Unavailable', 'Unknown'].map((status) => (
                  <button
                    className={`rounded-lg border px-4 py-3 text-sm font-extrabold transition ${
                      form.status === status
                        ? 'border-that-accent bg-that-accent text-white'
                        : 'border-that-border bg-white text-that-text hover:border-that-accent hover:bg-that-soft'
                    }`}
                    key={status}
                    type="button"
                    onClick={() => setForm({ ...form, status })}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  className="rounded-lg bg-that-green px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:brightness-95"
                  type="button"
                  onClick={() => setStatus('Available')}
                >
                  Set as Open
                </button>
                <button
                  className="rounded-lg bg-that-red px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:brightness-95"
                  type="button"
                  onClick={() => setStatus('Unavailable')}
                >
                  Set as Closed
                </button>
              </div>
            </section>

            <section className="mt-7">
              <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-that-muted">
                Population tags
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {populationOptions.map((tag) => (
                  <EditablePill
                    key={tag}
                    label={tag}
                    active={form.populationCategories.includes(tag)}
                    onClick={() =>
                      setForm({
                        ...form,
                        populationCategories: toggleValue(form.populationCategories, tag)
                      })
                    }
                  />
                ))}
              </div>
            </section>

            <section className="mt-7">
              <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-that-muted">
                Service categories
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {serviceOptions.map((service) => (
                  <EditablePill
                    key={service}
                    label={service}
                    active={form.serviceCategories.includes(service)}
                    onClick={() =>
                      setForm({
                        ...form,
                        serviceCategories: toggleValue(form.serviceCategories, service)
                      })
                    }
                  />
                ))}
              </div>
            </section>

            <label className="mt-7 block">
              <span className="text-sm font-bold uppercase tracking-[0.08em] text-that-muted">
                More information
              </span>
              <textarea
                className="mt-3 min-h-36 w-full resize-none rounded-lg border border-that-border bg-white px-4 py-3 text-sm font-semibold leading-6 text-that-text outline-none transition focus:border-that-accent focus:ring-4 focus:ring-that-accent/10"
                value={form.moreInfo}
                onChange={(event) => setForm({ ...form, moreInfo: event.target.value })}
                placeholder="Add intake notes or important service information."
              />
            </label>

            <button
              className="mt-7 rounded-lg bg-that-accent px-6 py-3 text-base font-extrabold text-white shadow-sm transition hover:bg-that-accentDark"
              type="submit"
            >
              Save Updates
            </button>
          </form>

          <aside className="rounded-lg border border-that-border bg-that-card p-5 shadow-card">
            <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-that-muted">
              Public card preview
            </h2>
            <div className="mt-4">
              <ShelterCard shelter={workerShelter} />
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
