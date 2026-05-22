# Agro Heal — Smart Farming Assistant

> **Empowering Maharashtra's Farmers · Built with React + Vite + Gemini AI**

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-5.4-purple)
![Gemini](https://img.shields.io/badge/Gemini%20AI-2.0%20Flash-orange)
![Language](https://img.shields.io/badge/Language-English%20%2B%20मराठी-yellow)

---

## What Is Agro Heal?

**Agro Heal** is a bilingual (English & Marathi) web application designed specifically for farmers across Maharashtra. It brings together crop disease detection, live APMC market rates, localized weather forecasts, livestock health diagnostics, and farming news into a single, accessible platform. We built it as a mobile-first Progressive Web App (PWA) so farmers don't have to download anything—they just open the link and start using it.

### Problem We Solve

| Problem | Our Solution |
|---|---|
| Farmers can't identify crop diseases early | AI photo scanner + symptom chatbot |
| No real-time market price visibility | Live APMC ticker + district-wise rate charts |
| Language barrier (English-only apps) | Full Marathi + English toggle |
| Livestock diseases go undetected | Photo diagnosis + Vet AI chat |
| No personalized farming advice | Profile-based advisory system |
| Weather data not farming-specific | Farming-optimized weather metrics |

---

## Features

### Personalized Home Screen
- Farmer profile onboarding (Name, District, Multi-crop selection)
- Live APMC market ticker scrolling at top
- My district crop rate widget
- Personalized crop advisory alerts
- Global search across diseases, rates, and news
- Marathi English toggle at any time

### ️ Weather Section
- District-specific weather forecast
- Farming-optimized metrics (soil moisture, UV index, wind, humidity)
- 7-day forecast with week-view tabs
- Rain map iframe (IMD Doppler link)
- Color-coded farming recommendations

### Crops (via FAB button)
- **AI Disease Scanner** — Upload leaf photo → Gemini AI diagnoses disease
- **Sample crop thumbnails** — Quick diagnosis without photo (Cotton, Tomato, Wheat, Rice, Sugarcane)
- **Crop AI Chat** — Conversational farming advisor (fertilizer, spacing, water, pests)
- **Product Recommendations** — Real Bayer/BASF/UPL products with dosage info
- Voice input simulation for queries

### Livestock (via FAB button)
- **Photo Diagnosis** — Upload animal photo → Vet AI diagnosis
- **Sample sick animals** — Lumpy Skin, Mastitis, PPR, Ranikhet quick select
- **Vet AI Chat** — Describe symptoms → Instant diagnosis with First Aid + Isolation steps
- Multi-animal support: Cow , Goat , Chicken 

### APMC Rates
- 15+ Maharashtra district rates
- Quick filter buttons by crop and region
- Price trend indicators (↑ ↓) with reasoning
- Min/Max/Modal price breakdown
- Visual bar charts
- Market news section

### News Feed
- Local farming news filtered by crop/region
- Tabs: All · Alerts · Weather · Government · Market Rates
- Market Rates tab with price trend news
- Article cards with source, date, and read-more links

### Profile System
- Slide-up edit modal accessible from header
- Multi-crop selection (8 crops with emoji grid)
- Full Maharashtra district dropdown (36 districts)
- Persisted in localStorage

---

## Quick Start — Run Locally

### Prerequisites
- **Node.js** v18+ ([download](https://nodejs.org/))
- **npm** v9+
- A modern browser (Chrome recommended)

### Steps

```bash
# 1. Clone or navigate to the project folder
cd "/Users/manassurvyawanshi/Downloads/VC Projects/Agro Heal"

# 2. Install dependencies (only once)
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# → http://localhost:5173 (or 5174 if port is in use)
```

### AI Backend (Gemini Integration)

We securely integrated Google Gemini 2.0 Flash using serverless environment variables. 
- In production, it connects seamlessly to the live AI engine.
- Locally, if `VITE_GEMINI_API_KEY` is not present in your `.env.local`, the application will automatically fall back to local offline data so you can still test the UI without hitting API limits.

### Build for Production

```bash
npm run build
# Output in /dist folder — can be deployed to any static host
```

---

## ️ Project Architecture

```
agro-heal/
├── index.html # App entry point
├── vite.config.js # Vite build config
├── package.json # Dependencies
└── src/
 ├── main.jsx # React root mount
 ├── App.jsx # Global state, routing, profile edit modal
 ├── App.css # Minimal base reset
 ├── index.css # Full design system (2000+ lines)
 │
 ├── components/
 │ ├── PhoneBezel.jsx # Phone frame, nav bar, FAB speed-dial
 │ ├── PhoneBezel.jsx # Phone frame, nav bar, FAB speed-dial
 │ ├── Dashboard.jsx # Home screen, search, rates widget, advisory
 │ ├── WeatherMetrics.jsx # Weather forecast, farming metrics
 │ ├── Crops.jsx # Disease scanner + Crop AI chat
 │ ├── Livestock.jsx # Photo diagnosis + Vet AI chat
 │ ├── RateChart.jsx # APMC rate charts and filters
 │ └── News.jsx # News feed with tabs and filtering
 │ Onboarding.jsx # First-run profile wizard
 │
 └── data/
 └── mockData.js # All local data (districts, diseases, rates, news)
```

### State Management
- **Global state** lives in `App.jsx` — `farmerProfile`, `language`, `currentTab`, `apiKey`
- **localStorage** persistence for farmer profile across sessions
- **Component state** is passed down intentionally via props to keep the architecture clean and simple without the overhead of Redux.
- **Offline/Live mode handling** — every AI component seamlessly checks if the API key is present.

### AI Integration (Gemini 2.0 Flash)
- Crop disease scanner sends base64 image + prompt → gets JSON diagnosis
- Crop AI chat sends conversational messages → farming advice
- Livestock photo diagnosis sends animal photo → vet diagnosis JSON
- Livestock chat sends symptom description → diagnosis JSON
- All components have **local keyword-matching fallbacks** that work without internet

---

## Data Sources

| Data | Source |
|---|---|
| APMC Rates | Simulated from real Maharashtra APMC data patterns |
| Crop Diseases | Curated dataset of 20+ diseases across 5 major crops |
| Livestock Diseases | 4 common diseases per animal type with First Aid |
| Weather Data | Simulated (integration-ready for IMD/OpenWeather APIs) |
| News | Curated farming news articles (Maharashtra-specific) |
| Districts | All 36 Maharashtra districts with division mapping |

---

## ️ Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 |
| Build Tool | Vite 5.4 |
| Styling | Vanilla CSS (custom design system, no Tailwind) |
| Icons | Lucide React |
| AI | Google Gemini 2.0 Flash (REST API) |
| Fonts | Google Fonts — Outfit + Noto Sans Devanagari |
| Storage | Browser localStorage |
| Language | JavaScript (ES Modules) |
| Deployment | Any static host (Vercel, Netlify, GitHub Pages) |

---

## Localization

The app fully supports **English** and **Marathi (मराठी)** throughout:
- Toggle button in the app header
- All UI labels, buttons, and headings
- Onboarding flow
- AI responses (when Gemini is connected)
- District and crop names in both scripts
- Advisory messages, news, and error messages

---

## Demo Walkthrough

1. **Open** `http://localhost:5174`
2. **Onboarding** — Enter name "Ramesh Patil", select "Pune", pick Cotton + Soybean
3. **Dashboard** — See personalized greeting, APMC ticker, crop advisory, market rate widget
4. **Search** — Type "blight" to find disease, or "Akola" to find rates
5. **FAB Button** (center bottom) — Tap to choose Crops or Livestock
6. **Crop Scanner** — Click "Cotton Leaf" sample → watch AI scan and diagnosis
7. **Crop Chat** — Ask "when to irrigate cotton?" in chat
8. **Livestock** — Switch to Livestock, click "Cow – Lumpy Skin" sample
9. **Vet Chat** — Type "my goat has heavy coughing and nasal discharge"
10. **Rates** — Filter by "Cotton" and "Vidarbha" to see regional prices
11. **News** — Switch to "Rates" tab to see market price news
12. **Language** — Toggle to मराठी using the button in the header
13. **Profile Edit** — Click your name/avatar to edit crops and district



## ‍ Project Focus

Built with a strong focus on AgriTech to solve real problems for Maharashtra farmers.

---

## License

Licensed under the MIT License.
