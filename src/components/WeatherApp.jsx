import { useState, useEffect, useMemo } from 'react';
import {
  Cloud,
  Search,
  Droplets,
  Wind,
  Eye,
  Gauge,
  MapPin,
  Thermometer,
} from 'lucide-react';

import ForecastChart from './ForecastChart';
import UnitToggle from './UnitToggle';
import RecentSearches from './RecentSearches';
import SunTimeline from './SunTimeline';
import WeatherMap from './WeatherMap';
import AirQuality from './AirQuality';

/* ─── Weather‑to‑theme mapping ─────────────────────── */
const getTheme = (weather) => {
  if (!weather) return { bg: 'bg-default', effect: null };

  const id = weather.weather[0].id;
  const icon = weather.weather[0].icon;
  const isNight = icon.endsWith('n');

  if (isNight) return { bg: 'bg-night', effect: id >= 200 && id < 600 ? 'rain' : null };
  if (id >= 200 && id < 300) return { bg: 'bg-thunderstorm', effect: 'thunder' };
  if (id >= 300 && id < 600) return { bg: 'bg-rainy', effect: 'rain' };
  if (id >= 600 && id < 700) return { bg: 'bg-snowy', effect: 'snow' };
  if (id >= 700 && id < 800) return { bg: 'bg-misty', effect: null };
  if (id === 800) return { bg: 'bg-sunny', effect: null };
  if (id > 800) return { bg: 'bg-cloudy', effect: null };
  return { bg: 'bg-default', effect: null };
};

/* ─── Pre-generated particles (module-level → stable across renders) ── */
const RAINDROPS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 2,
  duration: 0.4 + Math.random() * 0.5,
  height: 14 + Math.random() * 22,
}));

const SNOWFLAKES = Array.from({ length: 45 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 6,
  duration: 4 + Math.random() * 6,
  size: 3 + Math.random() * 7,
  opacity: 0.3 + Math.random() * 0.5,
}));

/* ════════════════════════════════════════════════════════
   Main component
   ════════════════════════════════════════════════════════ */
export default function WeatherApp() {
  /* ── State ──────────────────────────────────────────── */
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);

  const [unit, setUnit] = useState(
    () => localStorage.getItem('weatherUnit') || 'C',
  );
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('recentSearches')) || [];
    } catch {
      return [];
    }
  });

  const API_KEY = import.meta.env.VITE_API_KEY;
  const theme = getTheme(weather);

  /* ── Persist preferences ────────────────────────────── */
  useEffect(() => {
    localStorage.setItem('weatherUnit', unit);
  }, [unit]);

  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  /* ── Helpers ────────────────────────────────────────── */
  const addRecent = (name) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (c) => c.toLowerCase() !== name.toLowerCase(),
      );
      return [name, ...filtered].slice(0, 5);
    });
  };

  const convertTemp = (temp) => {
    if (unit === 'F') return Math.round((temp * 9) / 5 + 32);
    return Math.round(temp);
  };

  const tempUnit = unit === 'F' ? '°F' : '°C';

  /* ── Fetch: by city name ────────────────────────────── */
  const fetchByCity = async (name) => {
    const trimmed = (name || '').trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');
    setCity(trimmed);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(trimmed)}&appid=${API_KEY}&units=metric`,
      );
      if (!res.ok) throw new Error('City not found');
      const data = await res.json();
      setWeather(data);
      addRecent(data.name);

      // Parallel: forecast + air quality
      const [fRes, aRes] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(trimmed)}&appid=${API_KEY}&units=metric`,
        ),
        fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${API_KEY}`,
        ),
      ]);
      if (fRes.ok) setForecast(await fRes.json());
      if (aRes.ok) setAirQuality(await aRes.json());
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast(null);
      setAirQuality(null);
    } finally {
      setLoading(false);
    }
  };

  /* ── Fetch: by coordinates (geolocation) ────────────── */
  const fetchByCoords = async (lat, lon) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
      );
      if (!res.ok) throw new Error('Location not found');
      const data = await res.json();
      setWeather(data);
      setCity(data.name);
      addRecent(data.name);

      const [fRes, aRes] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
        ),
        fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
        ),
      ]);
      if (fRes.ok) setForecast(await fRes.json());
      if (aRes.ok) setAirQuality(await aRes.json());
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast(null);
      setAirQuality(null);
    } finally {
      setLoading(false);
    }
  };

  /* ── Geolocation handler ────────────────────────────── */
  const handleGeo = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLoading(false);
        fetchByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setGeoLoading(false);
        setError('Unable to get your location. Please allow location access.');
      },
    );
  };

  /* ═══════════════════════════════════════════════════════
     Render
     ═══════════════════════════════════════════════════════ */
  return (
    <div
      className={`min-h-screen ${theme.bg} weather-bg flex items-start justify-center px-3 py-4 sm:px-4 sm:py-8 relative overflow-hidden`}
    >
      {/* ── Weather effects layer ─────────────────────── */}
      {(theme.effect === 'rain' || theme.effect === 'thunder') && (
        <div className="effects-container">
          {RAINDROPS.map((d) => (
            <div
              key={d.id}
              className="raindrop"
              style={{
                left: `${d.left}%`,
                animationDelay: `${d.delay}s`,
                animationDuration: `${d.duration}s`,
                height: `${d.height}px`,
              }}
            />
          ))}
        </div>
      )}
      {theme.effect === 'thunder' && <div className="lightning-overlay" />}
      {theme.effect === 'snow' && (
        <div className="effects-container">
          {SNOWFLAKES.map((f) => (
            <div
              key={f.id}
              className="snowflake"
              style={{
                left: `${f.left}%`,
                animationDelay: `${f.delay}s`,
                animationDuration: `${f.duration}s`,
                width: `${f.size}px`,
                height: `${f.size}px`,
                opacity: f.opacity,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Main card ─────────────────────────────────── */}
      <div className="w-full max-w-lg relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-white/20">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg sm:rounded-xl">
                <Cloud className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white leading-tight">
                  Weather
                </h1>
                <p className="text-[10px] sm:text-[11px] text-white/50">Real-time data</p>
              </div>
            </div>
            <UnitToggle
              unit={unit}
              onToggle={() => setUnit((u) => (u === 'C' ? 'F' : 'C'))}
            />
          </div>

          {/* Search bar + geo button */}
          <div className="mb-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  id="city-search"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchByCity(city)}
                  placeholder="Search city…"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-11 sm:pr-12 rounded-xl bg-white/12 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/25 focus:border-transparent text-sm transition-all"
                />
                <button
                  id="search-btn"
                  onClick={() => fetchByCity(city)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/15 hover:bg-white/25 rounded-lg transition-all hover:scale-105 active:scale-95"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4 text-white" />
                </button>
              </div>

              <button
                id="geo-btn"
                onClick={handleGeo}
                disabled={geoLoading}
                className={`p-3 bg-white/12 hover:bg-white/20 rounded-xl border border-white/15 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 ${geoLoading ? 'pulse-ring' : ''}`}
                title="Use my location"
                aria-label="Use my location"
              >
                <MapPin
                  className={`w-5 h-5 text-white ${geoLoading ? 'animate-pulse' : ''}`}
                />
              </button>
            </div>
          </div>

          {/* Recent searches */}
          <RecentSearches
            searches={recentSearches}
            onSelect={fetchByCity}
            onRemove={(c) =>
              setRecentSearches((prev) => prev.filter((s) => s !== c))
            }
          />

          {/* ── Loading state ────────────────────────── */}
          {loading && (
            <div className="text-center py-14">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-[3px] border-white/15 border-t-white" />
              <p className="mt-4 text-white/50 text-sm">Fetching weather…</p>
            </div>
          )}

          {/* ── Error state ──────────────────────────── */}
          {error && !loading && (
            <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-4 text-white/80 text-center text-sm fade-in">
              ⚠️ {error}
            </div>
          )}

          {/* ── Weather data ─────────────────────────── */}
          {weather && !loading && (
            <div className="space-y-4 fade-in">
              {/* Main display */}
              <div className="text-center py-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {weather.name}
                  <span className="text-white/50 font-normal ml-1 sm:ml-1.5 text-base sm:text-lg">
                    {weather.sys.country}
                  </span>
                </h2>

                <div className="flex items-center justify-center gap-1 sm:gap-2 my-1">
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt={weather.weather[0].description}
                    className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg"
                  />
                  <div className="text-5xl sm:text-6xl font-extralight text-white tracking-tighter temp-value">
                    {convertTemp(weather.main.temp)}
                    <span className="text-xl sm:text-2xl align-top ml-0.5 font-light">
                      {tempUnit}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-white/75 capitalize font-medium">
                  {weather.weather[0].description}
                </p>
                <p className="text-[11px] sm:text-xs text-white/40 mt-1">
                  Feels like {convertTemp(weather.main.feels_like)}
                  {tempUnit} · H:{convertTemp(weather.main.temp_max)}
                  {tempUnit} · L:{convertTemp(weather.main.temp_min)}
                  {tempUnit}
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 stagger">
                <div className="card-enter glow-card bg-white/8 backdrop-blur rounded-xl p-3 sm:p-4 border border-white/10">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                    <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-300/70" />
                    <span className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider">
                      Humidity
                    </span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {weather.main.humidity}
                    <span className="text-xs sm:text-sm font-normal text-white/50">%</span>
                  </p>
                </div>

                <div className="card-enter glow-card bg-white/8 backdrop-blur rounded-xl p-3 sm:p-4 border border-white/10">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                    <Wind className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-300/70" />
                    <span className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider">
                      Wind
                    </span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {unit === 'F'
                      ? (weather.wind.speed * 2.237).toFixed(1)
                      : weather.wind.speed}
                    <span className="text-xs sm:text-sm font-normal text-white/50 ml-1">
                      {unit === 'F' ? 'mph' : 'm/s'}
                    </span>
                  </p>
                </div>

                <div className="card-enter glow-card bg-white/8 backdrop-blur rounded-xl p-3 sm:p-4 border border-white/10">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                    <Gauge className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-300/70" />
                    <span className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider">
                      Pressure
                    </span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {weather.main.pressure}
                    <span className="text-xs sm:text-sm font-normal text-white/50 ml-1">
                      hPa
                    </span>
                  </p>
                </div>

                <div className="card-enter glow-card bg-white/8 backdrop-blur rounded-xl p-3 sm:p-4 border border-white/10">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-300/70" />
                    <span className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider">
                      Visibility
                    </span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {(weather.visibility / 1000).toFixed(1)}
                    <span className="text-xs sm:text-sm font-normal text-white/50 ml-1">
                      km
                    </span>
                  </p>
                </div>
              </div>

              {/* Sun timeline */}
              <SunTimeline weather={weather} />

              {/* Air quality */}
              <AirQuality data={airQuality} />

              {/* 5-day forecast */}
              <ForecastChart forecast={forecast} unit={unit} />

              {/* Map */}
              <WeatherMap weather={weather} />
            </div>
          )}

          {/* ── Empty state ──────────────────────────── */}
          {!weather && !loading && !error && (
            <div className="text-center py-10 sm:py-14">
              <Cloud className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 text-white/20 float-icon" />
              <p className="text-xs sm:text-sm text-white/40 px-2">
                Search a city or tap{' '}
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline -mt-0.5" /> to use your
                location
              </p>
            </div>
          )}
        </div>

        {/* Footer credit */}
        <p className="text-center text-[10px] text-white/25 mt-4">
          Powered by OpenWeatherMap · Built with React
        </p>
      </div>
    </div>
  );
}