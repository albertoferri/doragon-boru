# Doragon Boru — Dragon Ball Universe Explorer

A Dragon Ball fan app built with React. Browse fighters and planets, simulate battles, test your knowledge with multiple quiz modes and save your favourites — all powered by the public Dragon Ball API.

---

## Features

### Characters
- Browse all fighters in a responsive grid with 3-D tilt hover effect
- Search by name, filter by race, sort by Ki power level — all inline with scrollable chips
- Pagination (24 cards per page)

### Character Detail
- Full stats: Ki, Max Ki, Affiliation, Origin Planet
- Translated description (Spanish → Italian via DeepL)
- Transformation gallery with image reveal

### Planets
- Browse with alive / destroyed filter
- Starfield background on each card

### Planet Detail
- Description, status, known residents grid
- Translated description (Spanish → Italian via DeepL)

### Battle Arena
- Pick two fighters from a searchable drawer
- Round-by-round simulation with live HP bars, race aura effects and win/loss result

### Planet Battle
- Select two planets (only planets with known warriors are listed)
- Battle score based on total Ki of residents, with a penalty for destroyed planets

### Quiz Mode — 4 game types
| Mode | Description |
|---|---|
| **Character Quiz** | Identify a fighter from their image |
| **Silhouette Quiz** | Guess who hides in the shadow (image reveals on answer) |
| **Lore Quiz** | Read a character description and name the fighter |
| **Planet Quiz** | Read a planet description and name the planet |

10 questions per game, score tracker, Play Again remembers the last mode.

### Favorites
- Save / unsave characters and planets from any card or detail page
- Persisted in `localStorage`, survives page refresh

### Landing Page
- Desktop: orbital ring with animated character links
- Mobile: fullscreen background with Swiper EffectCards carousel

---

## Tech Stack

| Category | Library / Tool |
|---|---|
| Framework | React 18 |
| Build tool | Vite 5 |
| Routing | React Router DOM 6 |
| Animations | Framer Motion 11 |
| Carousel | Swiper 12 (EffectCards) |
| HTTP client | Axios |
| Styling | Tailwind CSS 3 + SCSS (BEM) |
| Icons | Font Awesome 7 |
| Translation | DeepL API Free (ES → IT) |
| State | React Context API + localStorage |
| Deploy | GitHub Pages via gh-pages |

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

### Build and deploy

```bash
npm run build      # build to /dist
npm run preview    # preview the build locally
npm run deploy     # push to GitHub Pages
```

---

## Environment Variables

Create a `.env.local` file in the project root (never commit this file):

```env
# DeepL API Free key — get one free at deepl.com/en/pro-api
VITE_DEEPL_API_KEY=your-key-here

# Cloudflare Worker proxy URL (required for production builds)
# See translation proxy setup below
VITE_DEEPL_PROXY_URL=https://your-worker.workers.dev
```

### Why a proxy?

DeepL's API blocks direct browser requests (CORS). In development the Vite dev server proxies `/deepl` automatically. For production a lightweight Cloudflare Worker is used as a pass-through proxy (free tier: 100k requests/day). Translated texts are cached in `localStorage` so each description is only translated once.

---

## Project Structure

```
src/
├── assets/images/           # Logo, star icons, background images, card images
├── components/
│   ├── BattleArena.jsx      # Round-by-round battle engine with HP bars
│   ├── CharacterCard.jsx    # Fighter card with 3-D tilt and hover clip-path effect
│   ├── DragonBallOrb.jsx    # Animated floating Dragon Ball orb (mobile shortcut)
│   ├── Navbar.jsx           # Fixed top nav — desktop links hidden on Landing
│   ├── NeoToggle.jsx        # Animated hamburger toggle (mobile menu)
│   ├── PlanetBattle.jsx     # Planet vs planet comparison engine
│   ├── PlanetCard.jsx       # Planet card with procedural starfield background
│   ├── QuizCard.jsx         # Quiz question card (supports image, silhouette, text)
│   └── SearchBar.jsx        # Reusable search input
├── context/
│   ├── FavoritesContext.jsx # Favourites state (characters + planets, localStorage)
│   └── GlobalContext.jsx    # Global app state
├── hooks/
│   ├── useFetch.js          # Data fetching with loading / error / refetch
│   ├── useLocalStorage.js   # Synced localStorage state
│   └── useTranslatedText.js # Shows original immediately, swaps to translation silently
├── pages/
│   ├── Landing.jsx          # Home — orbital ring (desktop) + Swiper cards (mobile)
│   ├── Home.jsx             # Character browser with inline filter chips
│   ├── CharacterDetail.jsx  # Single character — stats, description, transformations
│   ├── Planets.jsx          # Planet browser with alive/destroyed filter
│   ├── PlanetDetail.jsx     # Single planet — description, residents
│   ├── BattleArenaPage.jsx  # Character battle page
│   ├── PlanetBattlePage.jsx # Planet battle page (pre-filtered, Ki-based)
│   ├── QuizMode.jsx         # Quiz hub — 4 modes, score, result screen
│   └── Favorites.jsx        # Saved characters and planets
├── services/
│   └── api.js               # All API calls (dragonball-api.com)
├── styles/
│   └── main.scss            # Global overrides, BEM blocks (landing, swiper, detail image)
└── utils/
    ├── helpers.js           # Ki parsing, race badge styles, shuffle
    └── translate.js         # DeepL fetch wrapper with localStorage cache
```

---

## API

All data comes from the public [Dragon Ball API](https://dragonball-api.com).

| Endpoint | Used for |
|---|---|
| `GET /characters?limit=100` | Character list and quiz pool |
| `GET /characters/:id` | Character detail + transformations |
| `GET /planets?limit=100` | Planet list |
| `GET /planets/:id` | Planet detail with residents (used by Planet Battle too) |

---

## Routes

| Path | Page |
|---|---|
| `/` | Landing |
| `/characters` | Character browser |
| `/characters/:id` | Character detail |
| `/planets` | Planet browser |
| `/planets/:id` | Planet detail |
| `/battle` | Character battle arena |
| `/planet-battle` | Planet battle |
| `/quiz` | Quiz mode |
| `/favorites` | Saved favourites |
