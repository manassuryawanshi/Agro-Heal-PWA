# 🌿 Agro Heal — Roadmap to Users

> From Hackathon Prototype → Production App for Maharashtra Farmers

---

## 📍 Where We Are Now (Phase 0 — Prototype)

✅ Mobile-first web app running locally  
✅ 6 core screens: Dashboard, Weather, Crops, Livestock, Rates, News  
✅ Bilingual English + Marathi  
✅ AI disease detection (Gemini 2.0 Flash)  
✅ Personalized farmer profiles  
✅ APMC rate simulation  
✅ Offline-capable with local fallbacks  

---

## 🗺️ Full Roadmap

### Phase 1 — Polish & Deploy (Weeks 1–3)
**Goal: Get a live shareable URL for judges and early users**

| Task | Details |
|---|---|
| ☐ Deploy to Vercel/Netlify | Free hosting, instant CI/CD from GitHub |
| ☐ Custom domain | `agroheal.in` (₹800/year via GoDaddy/Namecheap) |
| ☐ Fix remaining UI bugs | Profile edit, search deep-links |
| ☐ Real weather API | OpenWeatherMap free tier (1000 calls/day) |
| ☐ Real APMC data | Agmarknet.gov.in open API (free, govt) |
| ☐ PWA setup | Add `manifest.json` + service worker → "Add to Home Screen" on Android |
| ☐ Performance audit | Lighthouse score target: 90+ |

**Cost: ~₹800 (domain only)**

---

### Phase 2 — Real Data & PWA (Weeks 4–8)
**Goal: App feels real, data is live, works on farmers' phones**

| Task | Details |
|---|---|
| ☐ Live APMC rates | Agmarknet API or scraper for daily updates |
| ☐ Live weather | IMD API or OpenWeatherMap (district-level) |
| ☐ Live news | NewsAPI.org or RSS feeds from Agrostar/Krishi Jagran |
| ☐ Gemini API key backend | Move API key to backend proxy (hide from frontend) |
| ☐ Simple Node.js backend | Express server on Railway/Render (free tier) |
| ☐ WhatsApp share button | Let farmers share disease diagnosis via WhatsApp |
| ☐ Android PWA testing | Test on ₹5,000–₹10,000 Android phones (Redmi, Realme) |
| ☐ Marathi voice input | Web Speech API with `lang="mr-IN"` |

**Cost: ~₹0–2,000/month (free tiers + cheap hosting)**

---

### Phase 3 — User Testing (Month 2–3)
**Goal: 50 real farmers using it, get feedback**

| Task | Details |
|---|---|
| ☐ Partner with 1 Krishi Vigyan Kendra (KVK) | Free, government agricultural extension centers in every district |
| ☐ Partner with 1 FPO (Farmer Producer Org) | They have WhatsApp groups with 100s of farmers |
| ☐ Onboard 50 farmers in Pune/Akola/Nagpur | Focus on Cotton + Soybean farmers |
| ☐ Feedback collection | Google Form in Marathi, simple 5-question survey |
| ☐ Usage analytics | Add basic Google Analytics / Mixpanel |
| ☐ Weekly feature updates | Based on direct farmer feedback |
| ☐ Village demo sessions | Visit 2–3 villages with a projector/screen |

**Key insight to get:** Do farmers understand the UI? What do they actually need?

---

### Phase 4 — Scale & Monetize (Month 4–6)
**Goal: 500 active users, first revenue stream**

#### Revenue Models (pick 1–2)

| Model | How It Works | Potential |
|---|---|---|
| **B2B SaaS (best)** | Sell to Agri input companies (Bayer, UPL, Coromandel) as a farmer engagement platform | ₹5–50L/year per client |
| **Government grants** | Apply to Startup India, NABARD AgriTech fund, MEITY Tide fund | ₹10–50L grant |
| **Commission on products** | Farmers buy pesticides/seeds through the app (affiliate) | 5–10% commission per sale |
| **Premium subscription** | ₹99/month for unlimited AI scans, advanced weather alerts | ₹1,200/year per farmer |
| **FPO licensing** | Charge FPOs ₹5,000/month for their farmer group | Scalable B2B |

#### Distribution Channels

| Channel | Why |
|---|---|
| **WhatsApp groups** | Farmers already on WhatsApp, share the PWA link |
| **KVK partnerships** | Government-trusted, free field access |
| **Agri input dealers** | 50,000+ dealers in Maharashtra — they influence farmer decisions |
| **YouTube farming channels** | Massive Marathi farming YouTube community |
| **Agrowon newspaper** | Leading Marathi farming newspaper — PR opportunity |

---

### Phase 5 — Native App (Month 6–12)
**Goal: Android app on Play Store for offline-first use**

| Task | Details |
|---|---|
| ☐ React Native conversion | ~60% code reuse from React web |
| ☐ Offline-first architecture | SQLite local database, sync when online |
| ☐ Real camera integration | Native camera for disease scanning (no upload step) |
| ☐ SMS/WhatsApp alerts | Send price alerts and weather warnings |
| ☐ Hindi support | Expand beyond Maharashtra |
| ☐ Play Store listing | ₹2,500 one-time developer fee |

---

## 💰 Funding Path

```
Stage 1: Hackathon Prize → Fund Phase 1 & 2
Stage 2: Apply to NABARD AgriTech Incubator (free mentorship + ₹10L grant)
Stage 3: Startup India recognition + DPIIT registration (tax benefits)
Stage 4: Angel round from AgriTech VCs (Omnivore, Ankur Capital, Avaana Capital)
Stage 5: Series A after 10,000+ MAU
```

---

## 🏆 Competitive Advantage

| App | Weakness | Our Edge |
|---|---|---|
| Plantix | English-only, no APMC rates | Full Marathi, integrated rates |
| Krishi Network | No AI diagnosis | Gemini AI + photo scan |
| AgroStar | Paid, product-push only | Free, farmer-first advisory |
| DeHaat | Bihar/UP focus | Maharashtra-specific data |
| mKisan (govt) | Poor UX, outdated | Modern mobile-first UI |

**Our moat:** Marathi-first + AI diagnosis + APMC rates + Livestock — no other app combines all four.

---

## 📣 Hackathon Pitch Points

1. **Problem is massive** — 1.15 crore farming families in Maharashtra, <5% have access to quality agri-advisory
2. **Tech is proven** — Gemini AI, working prototype, zero bugs in demo
3. **Bilingual by design** — Not an afterthought, Marathi is the primary language
4. **No internet needed for core features** — Local fallbacks work offline
5. **Deployment-ready** — One `npm run build` + drag-drop to Netlify = live in 5 minutes
6. **Clear monetization** — B2B SaaS to agri-input companies (not asking farmers to pay)
7. **Government alignment** — Supports Digital India, PM-KISAN, and Maharashtra's SmartGram vision

---

## 📞 Quick Contacts for Partnerships

- **Agmarknet API**: agmarknet.gov.in (free, no registration)
- **IMD Weather API**: mausam.imd.gov.in/api
- **NABARD AgriTech**: nabard.org/agritech
- **Pune KVK**: kvkpune.icar.gov.in
- **Maharashtra FPO list**: msamb.com

---

*Last updated: May 2026 | Agro Heal Hackathon Prototype v1.0*
