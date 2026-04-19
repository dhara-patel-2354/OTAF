import { ChevronDown, ChevronUp, Clock3, Home, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';

const statusClasses = {
  Available: 'bg-that-green',
  Unavailable: 'bg-that-red',
  Unknown: 'bg-that-gray'
};

function getStatusClass(shelter) {
  if (!shelter.partnered) {
    return 'bg-that-gray';
  }

  return statusClasses[shelter.status] ?? 'bg-that-gray';
}

function InfoRow({ children, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-that-border/70 bg-that-soft px-3 py-2.5 text-sm font-semibold text-that-muted">
      <Icon className="h-4 w-4 shrink-0 text-that-accent" strokeWidth={2.2} />
      <span className="min-w-0">{children}</span>
    </div>
  );
}

export default function ShelterCard({ shelter }) {
  const [expanded, setExpanded] = useState(false);
  const dotClass = getStatusClass(shelter);

  return (
    <article className="flex h-full min-h-[358px] w-full flex-col rounded-lg border border-that-border bg-that-card p-4 shadow-card transition hover:border-that-accent/70 hover:shadow-lg">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-that-border bg-that-soft text-that-accent">
          <Home className="h-6 w-6" strokeWidth={2.1} />
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-extrabold leading-snug text-that-text">
            {shelter.name}
          </h2>
          <p className="mt-1 text-sm font-medium leading-snug text-that-muted">
            {shelter.organization}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 text-sm font-bold leading-5 text-that-text">
        <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dotClass}`} />
        <span>{shelter.status}</span>
      </div>

      <div className="mt-4 space-y-3">
        <InfoRow icon={Clock3}>Updated: {shelter.updatedAt}</InfoRow>
        <InfoRow icon={MapPin}>{shelter.location}</InfoRow>
      </div>

      <button
        className="mt-4 flex w-full items-center justify-between rounded-lg border border-that-border bg-white px-3 py-3 text-sm font-extrabold text-that-text transition hover:border-that-accent hover:bg-that-soft"
        type="button"
        onClick={() => setExpanded((current) => !current)}
      >
        More info
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-that-accent" strokeWidth={2.4} />
        ) : (
          <ChevronDown className="h-4 w-4 text-that-accent" strokeWidth={2.4} />
        )}
      </button>

      {expanded && (
        <div className="mt-3 rounded-lg border border-that-border bg-white px-3 py-3 text-sm font-medium leading-6 text-that-muted">
          <p>{shelter.moreInfo || 'No additional information has been added yet.'}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[...shelter.populationCategories, ...shelter.serviceCategories].slice(0, 5).map((tag) => (
              <span
                className="rounded-full border border-that-border bg-that-soft px-2.5 py-1 text-xs font-bold text-that-text"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto grid grid-cols-2 gap-3 pt-4">
        <button
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-that-accent px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-that-accentDark"
          type="button"
        >
          <Phone className="h-4 w-4" strokeWidth={2.3} />
          Call
        </button>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-that-accent px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-that-accentDark"
          type="button"
        >
          <Mail className="h-4 w-4" strokeWidth={2.3} />
          Email
        </button>
      </div>
    </article>
  );
}
