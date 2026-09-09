import { MapPin } from 'lucide-react';

export default function WeatherMap({ weather }) {
  if (!weather?.coord) return null;

  const { lat, lon } = weather.coord;

  // OpenStreetMap embed centred on the city
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.6},${lat - 0.35},${lon + 0.6},${lat + 0.35}&layer=mapnik&marker=${lat},${lon}`;

  return (
    <div className="card-enter mt-5" id="weather-map">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-4 h-4 text-white/60" />
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
          Location
        </h3>
      </div>

      <div className="glow-card bg-white/8 backdrop-blur rounded-xl border border-white/10 overflow-hidden relative">
        <iframe
          src={mapSrc}
          width="100%"
          height="150"
          style={{
            border: 'none',
            display: 'block',
            filter: 'saturate(0.6) brightness(0.75) contrast(1.1)',
          }}
          className="sm:!h-[180px]"
          title={`Map of ${weather.name}`}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {/* Coordinate badge */}
        <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg px-2.5 py-1 text-[10px] text-white/80 font-mono">
          {lat.toFixed(2)}°, {lon.toFixed(2)}°
        </div>
      </div>
    </div>
  );
}
