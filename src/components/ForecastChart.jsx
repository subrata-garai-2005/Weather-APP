import { Droplets } from 'lucide-react';

export default function ForecastChart({ forecast, unit }) {
  if (!forecast?.list) return null;

  const convertTemp = (temp) => {
    if (unit === 'F') return Math.round((temp * 9) / 5 + 32);
    return Math.round(temp);
  };

  // Group forecast items by calendar day
  const days = {};
  forecast.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    if (!days[dayKey]) days[dayKey] = [];
    days[dayKey].push(item);
  });

  const dayEntries = Object.entries(days).slice(0, 5);

  // Global min/max for bar width scaling
  let globalMin = Infinity;
  let globalMax = -Infinity;
  dayEntries.forEach(([, items]) => {
    items.forEach((item) => {
      if (item.main.temp < globalMin) globalMin = item.main.temp;
      if (item.main.temp > globalMax) globalMax = item.main.temp;
    });
  });
  const tempRange = globalMax - globalMin || 1;

  return (
    <div className="mt-5 section-enter" id="forecast-section">
      <h3 className="text-xs sm:text-sm font-semibold text-white/70 uppercase tracking-wider mb-2 sm:mb-3">
        5-Day Forecast
      </h3>
      <div className="space-y-2 stagger">
        {dayEntries.map(([day, items], i) => {
          const temps = items.map((item) => item.main.temp);
          const minTemp = Math.min(...temps);
          const maxTemp = Math.max(...temps);
          const icon =
            items[Math.floor(items.length / 2)].weather[0].icon;
          const pop = Math.max(...items.map((item) => item.pop || 0));

          // Calculate bar positioning relative to global range
          const barLeft = ((minTemp - globalMin) / tempRange) * 100;
          const barWidth =
            ((maxTemp - minTemp) / tempRange) * 100 || 5;

          return (
            <div
              key={day}
              className="card-enter glow-card bg-white/8 backdrop-blur rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 border border-white/10 flex items-center gap-2 sm:gap-3"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              {/* Day label */}
              <span className="text-white/80 text-xs sm:text-sm font-medium w-16 sm:w-24 shrink-0 truncate">
                {i === 0 ? 'Today' : day.split(',')[0]}
              </span>

              {/* Rain probability */}
              <div className="hidden sm:flex items-center gap-1 w-12 shrink-0">
                <Droplets className="w-3 h-3 text-blue-300/70" />
                <span className="text-[11px] text-blue-300/70">
                  {Math.round(pop * 100)}%
                </span>
              </div>

              {/* Weather icon */}
              <img
                src={`https://openweathermap.org/img/wn/${icon}.png`}
                alt=""
                className="w-7 h-7 sm:w-8 sm:h-8 shrink-0"
              />

              {/* Min temp */}
              <span className="text-white/50 text-xs sm:text-sm w-7 sm:w-8 text-right shrink-0">
                {convertTemp(minTemp)}°
              </span>

              {/* Temperature bar */}
              <div className="flex-1 h-1.5 bg-white/10 rounded-full relative mx-1">
                <div
                  className="absolute top-0 h-full rounded-full `bg-gradient-to-r` from-cyan-400 via-amber-400 to-orange-500"
                  style={{
                    left: `${barLeft}%`,
                    width: `${Math.max(barWidth, 5)}%`,
                  }}
                />
              </div>

              {/* Max temp */}
              <span className="text-white text-xs sm:text-sm font-semibold w-7 sm:w-8 shrink-0">
                {convertTemp(maxTemp)}°
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
