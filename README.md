# Pokédex Field Guide

A responsive Pokémon field guide built with Next.js 15.3.3, React, TypeScript, Tailwind CSS, and [PokéAPI](https://pokeapi.co/).

## Features

- A canonical national-dex species catalog: one default Pokémon entry per species, without alternate-form duplicates in discovery.
- Search by name or exact national-dex number; combine type and generation filters, name/number sorting, and pagination.
- Shareable discovery URLs preserve search, filters, sort, page, artwork, and shiny selection. Returning from an entry restores the discovery context and scroll position.
- Multiple sprite styles, including official artwork, Home, Dream World, and animated Showdown sprites, with shiny and back variants where available.
- Detailed entries with base stats, abilities, gender ratios, type effectiveness, evolution chains, and categorized learnable moves.
- Light, dark, and system themes with a saved preference; responsive grids and a mobile filter drawer.
- Loading, empty, and retry states, keyboard-accessible controls, and reduced-motion support.

There is no collection tracker or alternate-form selection UI.

## Setup

<<<<<<< HEAD
## 🛠️ Tech Stack

- [Next.js 16](https://nextjs.org/) (Active LTS)
- [React 19](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PokeAPI](https://pokeapi.co/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 📦 Installation
=======
Use **Node.js 20+** and npm.
>>>>>>> f502f61 (new verison)

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open **http://localhost:9002**. The main app needs no API keys or environment variables. Internet access is required for PokéAPI data and remotely hosted Pokémon sprites. Move categorization and type effectiveness use deterministic Pokémon data, not an AI provider.

## Checks and production

```bash
npm test               # Compile tests and run Node's built-in test runner
npm run typecheck      # TypeScript validation
npm run lint           # Noninteractive Next.js ESLint checks
npm run build          # Production build, including type and lint validation
npm start              # Serve the production build on port 3000
```

`npm test` discovers `tests/*.test.ts`, compiles them and their imports into an OS temporary directory using the installed TypeScript compiler, runs them, and removes the temporary output. No additional test framework is required.

**Before public deployment:** the existing dependency stack, including the pinned Next.js 15.3.3 version, has critical security advisories reported by `npm audit`. Dependency/security upgrades remain a separate compatibility task; the interface improvements do not resolve those advisories.

### Optional browser smoke checks

With the app running, install Playwright separately and run the live-data checks:

```bash
python -m pip install playwright
python -m playwright install chromium
python tests/browser-check.py --url http://localhost:9002
```

The checks cover search/filter combinations, pagination, detail content, restored browsing state, mobile layout, themes, keyboard access, and API retry. Screenshots are saved to a temporary directory printed at completion. Internet access is required; upstream API failures can affect this smoke test. Pass `--axe-script /path/to/axe.min.js` to also run axe-core WCAG checks.

## Optional Genkit tooling

Genkit dependencies and the development entry point under `src/ai/` are retained for optional experiments:

```bash
npm run genkit:dev
npm run genkit:watch
```

Provider-backed experiments may need their own provider credentials. These tools are not required to run or build the main Pokédex.

## Project layout

- `src/app/` — App Router pages, layouts, and server actions
- `src/components/` — Pokémon views and shared UI components
- `src/lib/` — PokéAPI access, discovery state, and Pokémon analysis
- `src/ai/` — Optional Genkit development tooling
- `tests/` — Node test suites
- `scripts/test.mjs` — Dependency-free test runner

Pokémon data and sprites are provided by [PokéAPI](https://pokeapi.co/) and its [sprite repository](https://github.com/PokeAPI/sprites).
