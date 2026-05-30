import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Plus, Search } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import { useAppData } from '../context/AppDataContext.jsx';
import { populationOptions, serviceOptions } from '../data/mockData.js';

function workerDashboardPath(worker) {
  return worker.organizationId ? `/worker/dashboard/${worker.organizationId}` : '/worker/dashboard';
}

function TogglePill({ active, label, onClick }) {
  return (
    <button
      className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition ${
        active
          ? 'border-that-accent/30 bg-that-soft text-that-text'
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

function toggleValue(values, value) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export default function WorkerOrgInfo() {
  const navigate = useNavigate();
  const { createWorker, workerAccount } = useAppData();
  const categoryOptions = [...populationOptions, ...serviceOptions];
  const [form, setForm] = useState({
    organizationName: workerAccount.organizationName,
    categories: workerAccount.categories,
    populationTags: workerAccount.populationTags,
    moreInfo: workerAccount.moreInfo
  });
  const [error, setError] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const selectedCategories = [...form.populationTags, ...form.categories];
  const filteredCategories = categoryOptions.filter((category) =>
    category.toLowerCase().includes(categorySearch.trim().toLowerCase())
  );

  function toggleCategory(category) {
    if (populationOptions.includes(category)) {
      setForm({ ...form, populationTags: toggleValue(form.populationTags, category) });
      return;
    }

    setForm({ ...form, categories: toggleValue(form.categories, category) });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.organizationName.trim()) {
      setError('Organization name is required.');
      return;
    }

    const result = await createWorker(form);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    navigate(result.worker.approvalStatus === 'approved' ? workerDashboardPath(result.worker) : '/worker/pending');
  }

  return (
    <div className="min-h-screen bg-white text-that-text">
      <Navbar variant="worker" title="Organization Information" />

      <main className="mx-auto flex w-full max-w-[430px] justify-center px-5 py-20 sm:px-6">
        <form
          className="w-full"
          onSubmit={handleSubmit}
        >
          <h1 className="text-3xl font-medium tracking-tight text-that-text">Create an account</h1>
          <p className="mt-5 text-center text-lg font-medium leading-6 text-that-text">
            Please note that after you create an account, app administrators will manually verify
            your organization before including you in the app.
          </p>

          <label className="mt-7 block">
            <span className="text-base font-medium text-that-text">Organization Name</span>
            <input
              className="mt-2 w-full rounded-md border border-that-border bg-white px-4 py-3 text-base font-medium outline-none transition placeholder:text-that-muted/60 focus:border-that-accent focus:ring-4 focus:ring-that-accent/10"
              value={form.organizationName}
              onChange={(event) => setForm({ ...form, organizationName: event.target.value })}
              placeholder="Value"
            />
            {error && <span className="mt-2 block text-sm font-semibold text-that-red">{error}</span>}
          </label>

          <section className="relative mt-5">
            <h2 className="text-base font-medium text-that-text">Categories</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedCategories.length > 0 ? (
                selectedCategories.map((category) => (
                  <TogglePill
                    key={category}
                    label={category}
                    active
                    onClick={() => toggleCategory(category)}
                  />
                ))
              ) : (
                <span className="text-sm font-medium text-that-muted">No categories selected</span>
              )}
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full border border-that-border bg-white text-that-text transition hover:border-that-accent hover:bg-that-soft"
                type="button"
                aria-label="Add category"
                onClick={() => setCategoryOpen((current) => !current)}
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>

            {categoryOpen && (
              <div className="absolute left-0 right-0 z-20 mt-3 rounded-lg border border-that-border bg-white p-3 shadow-xl">
                <label className="flex items-center gap-2 rounded-md border border-that-border bg-white px-3 py-2">
                  <Search className="h-4 w-4 text-that-muted" strokeWidth={2.2} />
                  <input
                    className="w-full text-sm font-medium outline-none placeholder:text-that-muted/60"
                    value={categorySearch}
                    onChange={(event) => setCategorySearch(event.target.value)}
                    placeholder="Search categories"
                  />
                </label>

                <div className="mt-3 max-h-72 overflow-y-auto pr-1">
                  {filteredCategories.map((category) => (
                    <label
                      className="flex cursor-pointer items-start gap-3 rounded-md px-2 py-2 text-base font-medium text-that-text hover:bg-that-soft"
                      key={category}
                    >
                      <input
                        className="mt-1 h-4 w-4 rounded border-that-border accent-that-accent"
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                      />
                      {category}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </section>

          <label className="mt-6 block">
            <span className="text-base font-medium text-that-text">Information to be displayed</span>
            <span className="mt-2 block text-base font-medium leading-6 text-that-muted">
              Is there anything that you'd like the users to know about your organization?
            </span>
            <textarea
              className="mt-3 min-h-24 w-full resize-none rounded-md border border-that-border bg-white px-4 py-3 text-base font-medium leading-6 outline-none transition placeholder:text-that-muted/60 focus:border-that-accent focus:ring-4 focus:ring-that-accent/10"
              value={form.moreInfo}
              onChange={(event) => setForm({ ...form, moreInfo: event.target.value })}
              placeholder="Value"
            />
          </label>

          <button
            className="mt-5 w-full rounded-md bg-[#2f2f2f] px-5 py-3 text-base font-medium text-white shadow-sm transition hover:bg-that-text"
            type="submit"
          >
            Submit
          </button>
        </form>
      </main>
    </div>
  );
}
