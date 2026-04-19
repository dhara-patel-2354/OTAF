import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { useAppData } from '../context/AppDataContext.jsx';
import { populationOptions, serviceOptions } from '../data/mockData.js';

function TogglePill({ active, label, onClick }) {
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

function toggleValue(values, value) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export default function WorkerOrgInfo() {
  const navigate = useNavigate();
  const { workerAccount, updateWorkerAccount } = useAppData();
  const [form, setForm] = useState({
    organizationName: workerAccount.organizationName,
    categories: workerAccount.categories,
    populationTags: workerAccount.populationTags,
    moreInfo: workerAccount.moreInfo
  });
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.organizationName.trim()) {
      setError('Organization name is required.');
      return;
    }

    updateWorkerAccount(form);
    navigate('/worker/pending');
  }

  return (
    <div className="min-h-screen bg-that-page text-that-text">
      <Navbar variant="worker" title="Organization Information" />

      <main className="mx-auto flex w-full max-w-[1512px] justify-center px-4 py-10 sm:px-6 lg:px-8">
        <form
          className="w-full max-w-3xl rounded-lg border border-that-border bg-that-card p-6 shadow-card sm:p-8"
          onSubmit={handleSubmit}
        >
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-that-accent">
            Verification Profile
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">Tell us about your organization</h1>
          <p className="mt-3 text-sm font-medium leading-6 text-that-muted">
            Administrators use this information to verify your organization before publishing it in THAT.
          </p>

          <label className="mt-7 block">
            <span className="text-sm font-bold text-that-text">Organization name</span>
            <input
              className="mt-2 w-full rounded-lg border border-that-border bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-that-accent focus:ring-4 focus:ring-that-accent/10"
              value={form.organizationName}
              onChange={(event) => setForm({ ...form, organizationName: event.target.value })}
              placeholder="Atira Women’s Resource Society"
            />
            {error && <span className="mt-2 block text-sm font-semibold text-that-red">{error}</span>}
          </label>

          <section className="mt-7">
            <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-that-muted">
              Categories
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {serviceOptions.map((category) => (
                <TogglePill
                  key={category}
                  label={category}
                  active={form.categories.includes(category)}
                  onClick={() => setForm({ ...form, categories: toggleValue(form.categories, category) })}
                />
              ))}
            </div>
          </section>

          <section className="mt-7">
            <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-that-muted">
              Population tags
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {populationOptions.map((tag) => (
                <TogglePill
                  key={tag}
                  label={tag}
                  active={form.populationTags.includes(tag)}
                  onClick={() => setForm({ ...form, populationTags: toggleValue(form.populationTags, tag) })}
                />
              ))}
            </div>
          </section>

          <label className="mt-7 block">
            <span className="text-sm font-bold text-that-text">More information</span>
            <textarea
              className="mt-2 min-h-32 w-full resize-none rounded-lg border border-that-border bg-white px-4 py-3 text-sm font-semibold leading-6 outline-none transition focus:border-that-accent focus:ring-4 focus:ring-that-accent/10"
              value={form.moreInfo}
              onChange={(event) => setForm({ ...form, moreInfo: event.target.value })}
              placeholder="Share intake notes, service details, or referral guidance."
            />
          </label>

          <button
            className="mt-7 rounded-lg bg-that-accent px-6 py-3 text-base font-extrabold text-white shadow-sm transition hover:bg-that-accentDark"
            type="submit"
          >
            Submit for Approval
          </button>
        </form>
      </main>
    </div>
  );
}
