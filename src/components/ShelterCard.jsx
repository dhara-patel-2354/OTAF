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
    <div className="flex items-center gap-2 rounded-md border border-that-border/70 bg-that-soft px-3 py-2 text-sm font-semibold text-that-muted">
      <Icon className="h-4 w-4 shrink-0 text-that-accent" strokeWidth={2.2} />
      <span className="min-w-0">{children}</span>
    </div>
  );
}

export default function ShelterCard({ shelter }) {
  const [expanded, setExpanded] = useState(false);
  const dotClass = getStatusClass(shelter);

  return (
    <article className="flex h-full w-full flex-col rounded-lg border border-that-border bg-that-card p-4 shadow-card transition hover:border-that-accent/70 hover:shadow-lg">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-that-border bg-that-soft text-that-accent">
          <Home className="h-5 w-5" strokeWidth={2.1} />
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-extrabold leading-snug text-that-text">
            {shelter.name}
          </h2>
          <p className="mt-0.5 text-xs font-medium leading-snug text-that-muted">
            {shelter.organization}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-start gap-2 text-sm font-bold leading-4 text-that-text">
        <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${dotClass}`} />
        <span>{shelter.status}</span>
      </div>

      <div className="mt-3 space-y-2">
        <InfoRow icon={Clock3}>Updated: {shelter.updatedAt}</InfoRow>
        <InfoRow icon={MapPin}>{shelter.location}</InfoRow>
      </div>

      <button
        className="mt-3 flex w-full items-center justify-between rounded-lg border border-that-border bg-white px-3 py-2 text-sm font-extrabold text-that-text transition hover:border-that-accent hover:bg-that-soft"
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
        <div className="mt-2 rounded-md border border-that-border bg-white px-3 py-2 text-xs font-medium leading-5 text-that-muted">
          <p>{shelter.moreInfo || 'No additional information has been added yet.'}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[...shelter.populationCategories, ...shelter.serviceCategories].slice(0, 5).map((tag) => (
              <span
                className="rounded-full border border-that-border bg-that-soft px-2 py-0.5 text-[10px] font-bold text-that-text"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto grid grid-cols-2 gap-2 pt-3">
        <button
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-that-accent px-3 py-2 text-sm font-extrabold text-white shadow-sm transition hover:bg-that-accentDark"
          type="button"
        >
          <Phone className="h-3.5 w-3.5" strokeWidth={2.3} />
          Call
        </button>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-that-accent px-3 py-2 text-sm font-extrabold text-white shadow-sm transition hover:bg-that-accentDark"
          type="button"
        >
          <Mail className="h-3.5 w-3.5" strokeWidth={2.3} />
          Email
        </button>
      </div>
    </article>
  );
}
