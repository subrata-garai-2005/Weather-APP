import { Wind } from 'lucide-react';

const AQI_LEVELS = [
  { label: 'Good', color: '#22c55e', bg: 'bg-green-500/20', text: 'text-green-400' },
  { label: 'Fair', color: '#eab308', bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  { label: 'Moderate', color: '#f97316', bg: 'bg-orange-500/20', text: 'text-orange-400' },
  { label: 'Poor', color: '#ef4444', bg: 'bg-red-500/20', text: 'text-red-400' },
  { label: 'Very Poor', color: '#7c3aed', bg: 'bg-purple-500/20', text: 'text-purple-400' },
];

export default function AirQuality({ data }) {
  if (!data?.list?.[0]) return null;

  const aqi = data.list[0].main.aqi; // 1–5
  const level = AQI_LEVELS[aqi - 1] || AQI_LEVELS[0];
  const comps = data.list[0].components;

  const pollutants = [
    { name: 'PM2.5', value: comps.pm2_5 },
    { name: 'PM10', value: comps.pm10 },
    { name: 'O₃', value: comps.o3 },
    { name: 'NO₂', value: comps.no2 },
  ];

  const barPercent = (aqi / 5) * 100;

  return (
    <div
      className="card-enter glow-card bg-white/8 backdrop-blur rounded-xl p-3 sm:p-4 border border-white/10"
      id="air-quality"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-white/60" />
          <h3 className="text-xs sm:text-sm font-semibold text-white/70 uppercase tracking-wider">
            Air Quality
          </h3>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${level.bg} ${level.text}`}
        >
          {level.label}
        </span>
      </div>

      {/* AQI Bar */}
      <div className="relative h-1.5 rounded-full overflow-hidden bg-white/10 mb-3 sm:mb-4">
        <div className="absolute inset-0 aqi-bar-bg opacity-25 rounded-full" />
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${barPercent}%`, background: level.color }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-md transition-all duration-1000 ease-out"
          style={{ left: `calc(${barPercent}% - 5px)` }}
        />
      </div>

      {/* Pollutant Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {pollutants.map((p) => (
          <div key={p.name} className="text-center">
            <p className="text-[10px] text-white/40 mb-0.5 uppercase tracking-wider">
              {p.name}
            </p>
            <p className="text-sm font-bold text-white">
              {p.value != null ? p.value.toFixed(1) : '—'}
            </p>
            <p className="text-[9px] text-white/30">μg/m³</p>
          </div>
        ))}
      </div>
    </div>
  );
}
