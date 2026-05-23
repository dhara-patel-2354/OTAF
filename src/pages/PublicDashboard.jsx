import { Building2, CircleCheck, HeartHandshake } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Footer from '../components/Footer.jsx';
import FilterBar from '../components/FilterBar.jsx';
import Navbar from '../components/Navbar.jsx';
import ShelterCard from '../components/ShelterCard.jsx';
import { useAppData } from '../context/AppDataContext.jsx';
import { serviceOptions } from '../data/mockData.js';

const cardsPerPage = 12;

function getUpdatedTimestamp(updatedAt) {
  const timestamp = Date.parse(updatedAt);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

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
  const [filters, setFilters] = useState({
    availability: '',
    city: '',
    services: [],
    population: ''
  });
  const [sortBy, setSortBy] = useState('Nearest');
  const [visibleCount, setVisibleCount] = useState(cardsPerPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef(null);

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

        if (sortBy === 'Recently updated') {
          return (
            getUpdatedTimestamp(secondShelter.updatedAt) -
            getUpdatedTimestamp(firstShelter.updatedAt)
          );
        }

        return 0;
      });
  }, [filters, shelters, sortBy]);

  const visibleShelters = filteredShelters.slice(0, visibleCount);
  const hasMoreShelters = visibleCount < filteredShelters.length;

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

  useEffect(() => {
    setVisibleCount(cardsPerPage);
  }, [filters, sortBy]);

  useEffect(() => {
    if (!hasMoreShelters || isLoadingMore) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setIsLoadingMore(true);
        window.setTimeout(() => {
          setVisibleCount((currentCount) => currentCount + cardsPerPage);
          setIsLoadingMore(false);
        }, 500);
      },
      { rootMargin: '240px 0px' }
    );

    const loadMoreElement = loadMoreRef.current;

    if (loadMoreElement) {
      observer.observe(loadMoreElement);
    }

    return () => {
      if (loadMoreElement) {
        observer.unobserve(loadMoreElement);
      }
    };
  }, [hasMoreShelters, isLoadingMore]);

  return (
    <div className="min-h-screen bg-that-page text-that-text">
      <Navbar />

      <main className="mx-auto flex w-full max-w-[1512px] flex-col gap-6 px-4 py-5 sm:px-6 lg:flex-row lg:items-start lg:px-8">
        <div className="w-full lg:w-[320px] lg:shrink-0">
          <PublicSummaryPanel shelters={shelters} />
        </div>

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
            {visibleShelters.map((shelter) => (
              <ShelterCard key={shelter.id} shelter={shelter} />
            ))}
          </div>

          {(hasMoreShelters || isLoadingMore) && (
            <div
              className="flex min-h-16 items-center justify-center rounded-lg border border-that-border bg-that-card px-4 py-4 text-sm font-bold text-that-muted shadow-card"
              ref={loadMoreRef}
            >
              {isLoadingMore ? 'Loading more shelters...' : 'Scroll to load more shelters'}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
