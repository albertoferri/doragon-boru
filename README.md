# Doragon Boru — Dragon Ball Universe Explorer

A Dragon Ball fan app built with React, featuring character browsing, planet exploration, battle simulations, a quiz mode and a favorites system.

---

## Features

- **Characters** — Browse all fighters with search, race filter and Ki power level sorting
- **Planets** — Explore planets with alive/destroyed filter
- **Character Detail** — Full stats, transformations and origin planet
- **Planet Detail** — Description, status and list of known residents
- **Battle Arena** — Select two fighters and watch a round-by-round battle with live HP bars
- **Planet Battle** — Pit two planets against each other based on their stats
- **Quiz Mode** — Identify characters from images or planets from descriptions (10 questions each)
- **Favorites** — Save characters and planets locally, persisted across sessions

---

## Tech Stack

| Category | Library |
|---|---|
| Framework | React 18 |
| Build tool | Vite 5 |
| Routing | React Router DOM 6 |
| Animations | Framer Motion 11 |
| HTTP client | Axios |
| Styling | Tailwind CSS 3 |
| Icons | Font Awesome 7 |
| State | React Context API + localStorage |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install and run

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── assets/images/       # Static images (logo, star icons, Dragon Ball sphere)
├── components/          # Reusable UI components
│   ├── BattleArena.jsx      # Round-by-round battle engine
│   ├── CharacterCard.jsx    # Character grid card
│   ├── DragonBallOrb.jsx    # Animated Dragon Ball orb
│   ├── Navbar.jsx           # Fixed top navigation
│   ├── PlanetBattle.jsx     # Planet vs planet comparison
│   ├── PlanetCard.jsx       # Planet grid card
│   ├── QuizCard.jsx         # Quiz question card
│   └── ...
├── context/
│   ├── FavoritesContext.jsx # Favorites state (persisted to localStorage)
│   └── GlobalContext.jsx    # Global search/filter state
├── hooks/
│   ├── useFetch.js          # Data fetching with loading/error states
│   └── useLocalStorage.js   # localStorage with React state
├── pages/
│   ├── Landing.jsx          # Home page with orbital character navigation
│   ├── Home.jsx             # Character browser with pagination
│   ├── CharacterDetail.jsx  # Single character page
│   ├── Planets.jsx          # Planet browser
│   ├── PlanetDetail.jsx     # Single planet page
│   ├── BattleArenaPage.jsx  # Character battle page
│   ├── PlanetBattlePage.jsx # Planet battle page
│   ├── QuizMode.jsx         # Quiz game
│   └── Favorites.jsx        # Saved favorites
├── services/
│   └── api.js               # All API calls (dragonball-api.com)
└── utils/
    └── helpers.js           # Ki parsing, race badges, shuffle, etc.
```

---

## API

Data is sourced from the public [Dragon Ball API](https://dragonball-api.com).

| Endpoint | Description |
|---|---|
| `GET /characters?limit=100` | All characters |
| `GET /characters/:id` | Single character |
| `GET /planets?limit=100` | All planets |
| `GET /planets/:id` | Single planet with residents |

---

## Routes

| Path | Page |
|---|---|
| `/` | Landing — orbital character navigation |
| `/characters` | Character browser |
| `/characters/:id` | Character detail |
| `/planets` | Planet browser |
| `/planets/:id` | Planet detail |
| `/battle` | Character battle arena |
| `/planet-battle` | Planet battle |
| `/quiz` | Quiz mode |
| `/favorites` | Saved favorites |
