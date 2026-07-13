# AgriGuard — React Web Dashboard

An AI-powered smart agriculture dashboard: farm health score, live IoT
device monitoring, a field map, AI predictions, notifications, and
analytics. Built with React + Vite + Tailwind, ready to deploy on Vercel.

This was built, compiled, and verified in a headless browser (all 6 screens
render correctly with live data) before being handed to you.

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Works immediately — no backend or API
keys needed. Data is simulated and persisted in the browser's
localStorage, updating live every 5 seconds.

## Deploy to Vercel

**Option A — Vercel CLI**
```bash
npm install -g vercel
vercel
```
Follow the prompts (accept the auto-detected Vite settings). `vercel.json`
is already included so build command/output directory are set correctly.

**Option B — GitHub + Vercel dashboard**
1. Push this folder to a GitHub repo.
2. Go to vercel.com → New Project → import the repo.
3. Vercel auto-detects Vite — just click Deploy.

No environment variables are required for the default (mock data) build.

## Project structure

```
src/
  data/
    dataEngine.js        # core simulation engine (devices, predictions, alerts, history)
    useAgriGuardData.js  # React hook subscribing to the engine
    localDb.js            # localStorage wrapper
  services/
    firebaseService.js    # OPTIONAL — commented-out real Firebase integration
  components/
    Shared.jsx             # SectionCard, StatusChip, RiskChip, MetricTile
    HealthScoreGauge.jsx
    BottomNav.jsx
  screens/
    DashboardScreen.jsx
    DevicesScreen.jsx
    FieldMapScreen.jsx
    AiPredictionScreen.jsx
    NotificationsScreen.jsx
    AnalyticsScreen.jsx
  App.jsx                  # tab state + screen switching
```

## Connecting real Firebase (optional)

The app runs entirely on the built-in simulation engine by default. To go
live with real sensors:

1. `npm install firebase`
2. Create a Firebase project, enable Firestore/Auth/Cloud Messaging.
3. Uncomment and fill in the config in `src/services/firebaseService.js` —
   it already sketches the exact Firestore document shapes
   (`farms/{farmId}/devices/...`, `predictions/current`, `alerts/...`) and
   the `onSnapshot` listeners you need.
4. In each screen, replace the `data` prop (currently sourced from
   `useAgriGuardData()` in `App.jsx`) with your own hook that subscribes
   to the Firebase streams instead. The shape of `data` expected by every
   screen is:
   ```js
   {
     devices: [{ id, name, status, battery, soilMoisture, soilTemp, airTemp, airHum, ec, n, p, k, voc, lat, lng, lastUpdate }],
     prediction: { farmHealthScore, diseaseRisk, diseaseProbabilityPercent, irrigationRecommendation, fertilizerRecommendation, cropHealthSummary, expectedIrrigationTime, predictedWaterUsageLiters, suggestedActions },
     alerts: [{ id, type, severity, title, message, time }],
     history: { soilMoisture: [{time, value}], temperature: [...], humidity: [...], waterUsage: [...], uptime: [...] },
   }
   ```
   Keeping this shape means no screen needs to change — only the data
   source in `App.jsx`.

## Notes

- **Field Map** is a custom, dependency-free component (no Google Maps API
  key needed) using relative 0-1 coordinates. Swap in a real map library
  later if you need GPS/satellite imagery.
- **Push notifications**: the in-app Notifications screen works out of the
  box; real browser push would use Firebase Cloud Messaging's web SDK —
  see the commented section in `firebaseService.js`.
- Built and bundle-checked with `npm run build` — production bundle is
  about 572 KB (171 KB gzipped). If you want to shrink it further, consider
  code-splitting the charts (`recharts`) with `React.lazy()`.
# agriguard
