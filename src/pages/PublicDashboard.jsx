import { Building2, CircleCheck, HeartHandshake } from 'lucide-react';
import Footer from '../components/Footer.jsx';
import FilterBar from '../components/FilterBar.jsx';
import Navbar from '../components/Navbar.jsx';
import ShelterCard from '../components/ShelterCard.jsx';
import { useAppData } from '../context/AppDataContext.jsx';

function PublicSummaryPanel({ shelters }) {
  const availableCount = shelters.filter((shelter) => shelter.status === 'Available').length;
  const partneredCount = shelters.filter((shelter) => shelter.partnered).length;

  return (
    <aside className="self-start rounded-lg border border-that-border bg-that-card p-5 shadow-card sm:p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-that-border bg-that-soft text-that-accent">
        <HeartHandshake className="h-6 w-6" strokeWidth={2.2} />
      </div>

      <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-that-text">
        Transition House Availability
      </h1>
      <p className="mt-3 text-sm font-medium leading-6 text-that-muted">
        View current shelter availability and contact transition houses directly for intake.
      </p>

      <div className="mt-6 grid gap-3">
        <div className="rounded-lg border border-that-border bg-white p-4">
          <div className="flex items-center gap-3">
            <CircleCheck className="h-5 w-5 text-that-green" strokeWidth={2.4} />
            <p className="text-sm font-bold text-that-muted">Available today</p>
          </div>
          <p className="mt-2 text-3xl font-black text-that-text">{availableCount}</p>
        </div>

        <div className="rounded-lg border border-that-border bg-white p-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-that-accent" strokeWidth={2.4} />
            <p className="text-sm font-bold text-that-muted">Partnered organizations</p>
          </div>
          <p className="mt-2 text-3xl font-black text-that-text">{partneredCount}</p>
        </div>
      </div>

      <p className="mt-5 rounded-lg border border-that-border bg-that-soft px-4 py-3 text-sm font-semibold leading-6 text-that-muted">
        Availability can change quickly. Please call before arriving.
      </p>
    </aside>
  );
}

export default function PublicDashboard() {
  const { shelters } = useAppData();

  return (
    <div className="min-h-screen bg-that-page text-that-text">
      <Navbar />

      <main className="mx-auto grid w-full max-w-[1512px] items-start gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)] lg:gap-8 lg:px-8">
        <PublicSummaryPanel shelters={shelters} />

        <section className="flex min-w-0 flex-col gap-5">
          <FilterBar />

          <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shelters.map((shelter) => (
              <ShelterCard key={shelter.id} shelter={shelter} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
