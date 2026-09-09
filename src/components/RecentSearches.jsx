import { X, Clock } from 'lucide-react';

export default function RecentSearches({ searches, onSelect, onRemove }) {
  if (!searches || searches.length === 0) return null;

  return (
    <div className="mb-4 fade-in" id="recent-searches">
      <div className="flex items-center gap-1.5 mb-2">
        <Clock className="w-3 h-3 text-white/50" />
        <span className="text-[11px] text-white/50 uppercase tracking-wider font-medium">
          Recent
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {searches.map((city) => (
          <div
            key={city}
            className="chip group flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-white/10 backdrop-blur rounded-full border border-white/15 cursor-pointer"
          >
            <span
              onClick={() => onSelect(city)}
              className="text-xs text-white/85 font-medium"
            >
              {city}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(city);
              }}
              className="opacity-50 sm:opacity-0 sm:group-hover:opacity-100 p-0.5 rounded-full hover:bg-white/20 transition-all"
              aria-label={`Remove ${city}`}
            >
              <X className="w-3 h-3 text-white/50 hover:text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
