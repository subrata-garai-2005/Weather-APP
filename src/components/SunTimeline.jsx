import { Sunrise, Sunset } from 'lucide-react';

export default function SunTimeline({ weather }) {
  if (!weather?.sys?.sunrise || !weather?.sys?.sunset) return null;

  const { sunrise, sunset } = weather.sys;
  const tz = weather.timezone; // offset in seconds from UTC

  // Current UTC timestamp in seconds
  const nowUtc = Math.floor(Date.now() / 1000);

  // Calculate progress: 0 = sunrise, 1 = sunset
  const totalDaylight = sunset - sunrise;
  const elapsed = nowUtc - sunrise;
  const progress = Math.max(0, Math.min(1, elapsed / totalDaylight));
  const isDaytime = nowUtc >= sunrise && nowUtc <= sunset;

  // Format a UTC unix timestamp to the city's local time string
  const formatTime = (utcTs) => {
    const ms = (utcTs + tz) * 1000;
    const d = new Date(ms);
    const h = d.getUTCHours();
    const m = d.getUTCMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  // SVG arc dimensions
  const W = 280;
  const H = 90;
  const cx = W / 2;
  const cy = H - 5;
  const rx = 115;
  const ry = 65;

  // Sun position on the elliptic arc (angle goes from π to 0, left-to-right)
  const angle = Math.PI * (1 - progress);
  const sunX = cx + rx * Math.cos(angle);
  const sunY = cy - ry * Math.sin(angle);

  // Build the "traveled" arc path from sunrise point to current sun position
  const startX = cx - rx;
  const startY = cy;
  const largeArc = progress > 0.5 ? 1 : 0;
  const traveledPath = `M ${startX} ${startY} A ${rx} ${ry} 0 ${largeArc} 1 ${sunX} ${sunY}`;

  // Daylight duration
  const dlHours = Math.floor(totalDaylight / 3600);
  const dlMins = Math.floor((totalDaylight % 3600) / 60);

  return (
    <div
      className="card-enter glow-card bg-white/8 backdrop-blur rounded-xl p-3 sm:p-4 border border-white/10"
      id="sun-timeline"
    >
      {/* Arc SVG */}
      <div className="flex justify-center">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full max-w-[280px]"
          aria-label="Sun position arc"
        >
          {/* Dashed background arc */}
          <path
            d={`M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Horizon line */}
          <line
            x1={cx - rx - 12}
            y1={cy}
            x2={cx + rx + 12}
            y2={cy}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />

          {/* Traveled arc (golden) */}
          {isDaytime && (
            <path
              d={traveledPath}
              fill="none"
              stroke="rgba(251,191,36,0.5)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}

          {/* Sun glow + dot */}
          {isDaytime && (
            <>
              <circle
                cx={sunX}
                cy={sunY}
                r="12"
                fill="rgba(251,191,36,0.15)"
                className="sun-glow"
              />
              <circle
                cx={sunX}
                cy={sunY}
                r="5"
                fill="#fbbf24"
                className="sun-dot"
              />
            </>
          )}

          {/* Night moon */}
          {!isDaytime && (
            <circle
              cx={cx}
              cy={cy - ry + 10}
              r="5"
              fill="#94a3b8"
              opacity="0.6"
            />
          )}
        </svg>
      </div>

      {/* Labels */}
      <div className="flex justify-between items-center mt-2 px-2">
        <div className="flex items-center gap-1.5">
          <Sunrise className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-white/70">{formatTime(sunrise)}</span>
        </div>
        <span className="text-[10px] text-white/40">
          {dlHours}h {dlMins}m daylight
        </span>
        <div className="flex items-center gap-1.5">
          <Sunset className="w-4 h-4 text-orange-400" />
          <span className="text-xs text-white/70">{formatTime(sunset)}</span>
        </div>
      </div>
    </div>
  );
}
