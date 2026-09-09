export default function UnitToggle({ unit, onToggle }) {
  return (
    <button
      id="unit-toggle"
      onClick={onToggle}
      className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 backdrop-blur rounded-full px-1 py-1 border border-white/20 transition-all"
      aria-label={`Switch to ${unit === 'C' ? 'Fahrenheit' : 'Celsius'}`}
    >
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
          unit === 'C'
            ? 'bg-white/25 text-white shadow-sm'
            : 'text-white/50'
        }`}
      >
        °C
      </span>
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
          unit === 'F'
            ? 'bg-white/25 text-white shadow-sm'
            : 'text-white/50'
        }`}
      >
        °F
      </span>
    </button>
  );
}
