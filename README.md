# ⛅ Weather App — Real-Time Forecast
A beautiful, feature-rich weather application built with **React 19** and **Vite**. Get real-time weather data, 5-day forecasts, air quality index, sunrise/sunset timelines, and interactive maps — all wrapped in a stunning glassmorphism UI with dynamic animated backgrounds that change based on current weather conditions.

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)
---
## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **City Search** | Search any city worldwide with instant results |
| 📍 **Geolocation** | One-tap current location detection via browser GPS |
| 🌡️ **Real-Time Weather** | Temperature, feels-like, humidity, wind, pressure & visibility |
| 📊 **5-Day Forecast** | Daily min/max temperature bars with rain probability |
| 🌬️ **Air Quality Index** | AQI level with PM2.5, PM10, O₃, NO₂ pollutant breakdown |
| 🌅 **Sunrise/Sunset Timeline** | SVG arc visualization showing live sun position |
| 🗺️ **Interactive Map** | OpenStreetMap embed centered on the searched city |
| 🔄 **Unit Toggle** | Switch between Celsius (°C) and Fahrenheit (°F) |
| 🕐 **Recent Searches** | Quick-access chips for your last 5 searches (persisted in localStorage) |
| 🎨 **Dynamic Backgrounds** | Gradient backgrounds adapt to weather (sunny, rainy, snowy, night, etc.) |
| 🌧️ **Weather Animations** | Rain drops, snowflakes, and lightning flash effects |
| 📱 **Fully Responsive** | Mobile-first design with safe-area support for notched phones |
---
## 🛠️ Tech Stack

- **Frontend Framework: [React 19](https://react.dev/) with JSX
- **Build Tool:** [Vite](https://vite.dev/) (via Rolldown)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) + custom CSS animations
- **Icons:** [Lucide React](https://lucide.dev/)
- **Typography:** [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts)
- **Weather API:** [OpenWeatherMap API](https://openweathermap.org/api)
- **Maps:** [OpenStreetMap](https://www.openstreetmap.org/) (embedded)
---
## 📁 Project Structure

```
WeatherApp/
├── public/
│   └── netlify.toml          # Netlify redirect config (SPA support)
├── src/
│   ├── components/
│   │   ├── WeatherApp.jsx    # Main app component (state, API calls, layout)
│   │   ├── ForecastChart.jsx # 5-day forecast with temperature bars
│   │   ├── AirQuality.jsx   # Air Quality Index display with pollutant grid
│   │   ├── SunTimeline.jsx  # Sunrise/sunset SVG arc visualization
│   │   ├── WeatherMap.jsx   # OpenStreetMap location embed
│   │   ├── UnitToggle.jsx   # °C / °F toggle switch
│   │   └── RecentSearches.jsx # Recent search chips with remove option
│   ├── App.jsx               # Root component
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles, animations & weather themes
├── .env                      # API key (VITE_API_KEY)
├── .gitignore
├── index.html                # HTML entry with SEO meta & Google Fonts
├── package.json
├── vite.config.js            # Vite + React + Tailwind plugin config
└── eslint.config.js          # ESLint configuration
```

---

## 🧩 Component Overview

###`WeatherApp.jsx — Core Component
The central hub managing all application state and API communication:
- **State management** for city input, weather data, forecast, air quality, loading/error states, unit preference, and recent searches
- **Weather-to-theme mapping** — dynamically selects background gradients and particle effects (rain/snow/thunder) based on OpenWeatherMap condition codes
- **Parallel API calls** — fetches current weather, 5-day forecast, and air quality data concurrently
- **Geolocation support** — detects user location via `navigator.geolocation`
- **LocalStorage persistence** — remembers unit preference and recent searches across sessions

### ForecastChart.jsx — 5-Day Forecast
Groups 3-hour forecast intervals by day and renders:
- Daily min/max temperature range bars scaled to the global temperature range
- Weather icons and rain probability percentages
- Staggered card-entrance animations

### AirQuality.jsx — Air Quality Index
- Color-coded AQI levels (Good → Very Poor) with badge labels
- Animated progress bar with a dragging indicator dot
- Pollutant grid showing PM2.5, PM10, O₃, NO₂ values in μg/m³

### `SunTimeline.jsx` — Sunrise/Sunset Arc
- SVG-rendered elliptic arc showing the sun's daytime journey
- Live sun position calculated from UTC timestamps and city timezone offset
- Golden "traveled arc" path with glowing sun dot animation
- Displays total daylight duration

### WeatherMap.jsx — Location Map
- Embeds an OpenStreetMap iframe centered on the city coordinates
- Styled with desaturated filter for a cohesive dark-theme look
- Shows coordinate badge (lat/lon) overlay

### UnitToggle.jsx — Temperature Unit Switch
- Pill-style toggle between °C and °F with smooth transitions
- Bouncy cubic-bezier animation on switch

### RecentSearches.jsx — Search History
- Displays up to 5 recent searches as removable chips
- Click to re-search, or dismiss with the ✕ button
- Hover-to-reveal remove button on desktop, always visible on mobile

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### 1. Clone the Repository

```bash
git clone https://github.com/subrata-garai-2005/Weather-APP.git
cd Weather-APP
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_KEY=your_openweathermap_api_key_here
```

> 🔑 Get a free API key at [OpenWeatherMap](https://home.openweathermap.org/api_keys)

### 4. Start the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with hot-reload |
| `npm run build` | Create optimized production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check for code issues |

---

## 🌐 API Endpoints Used

All data is fetched from the [OpenWeatherMap API](https://openweathermap.org/api):

| Endpoint | Purpose |
|---|---|
| `/data/2.5/weather` | Current weather by city name or coordinates |
| `/data/2.5/forecast` | 5-day / 3-hour forecast |
| `/data/2.5/air_pollution` | Air quality index & pollutant data |

---

## 🎨 Dynamic Themes

The background changes based on the current weather condition:

| Weather | Theme | Effect |
|---|---|---|
| ☀️ Clear Sky | Warm amber-to-red gradient | — |
| ☁️ Cloudy | Slate-grey gradient | — |
| 🌧️ Rain/Drizzle | Deep navy-blue gradient | Animated raindrops |
| ❄️ Snow | Light silver-white gradient | Floating snowflakes |
| ⛈️ Thunderstorm | Dark charcoal gradient | Rain + lightning flash |
| 🌫️ Mist/Fog | Soft grey gradient | — |
| 🌙 Night | Deep dark gradient | Rain (if applicable) |

---

## 🚢 Deployment

### Netlify (Recommended)
This project includes a `netlify.toml` for SPA routing. Simply:
1. Push to GitHub
2. Connect the repo on [Netlify](https://app.netlify.com/)
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add `VITE_API_KEY` as an environment 

## 🌐 Live Demo
[![Netlify](https://img.shields.io/badge/Netlify-Live%20Demo-00C7B7?logo=netlify&logoColor=white)](https://weather-project-f1c225.netlify.app/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Subrata Garai**
- GitHub: [@subrata-garai-2005](https://github.com/subrata-garai-2005)
---

<p align="center">
  Built with ❤️ using React & Vite &nbsp;·&nbsp; Powered by Subrata Garai
</p>

