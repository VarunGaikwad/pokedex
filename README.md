# 🧬 Pokedex App

A modern and responsive Pokedex built with **Next.js**, **Tailwind CSS**, and data powered by the [PokeAPI](https://pokeapi.co/). Browse Pokémon, view high-quality sprites in various styles (default, shiny, dream world, etc.), and explore detailed information about each Pokémon.

---

## 🚀 Features

- 🔍 **Search** and browse paginated Pokémon list
- 🎨 **Sprite switcher** with support for:
  - Default / Shiny
  - Home / Official Artwork
  - Dream World (SVG)
  - Showdown (GIF) Front & Back
- 📱 Fully responsive and mobile-first design
- ⚡ Optimized images with `next/image`
- 🌙 Dark mode support
- ♻️ Built with reusable and accessible UI components

---

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PokeAPI](https://pokeapi.co/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 📦 Installation

git clone https://github.com/VarunGaikwad/pokedex
cd pokedex-app
npm install
npm run dev

> The app will be running at: `http://localhost:3000`

---

## 🧱 Build for Production

npm run build
npm run start

````

- `npm run build`: Compiles the app for production
- `npm run start`: Starts the production server (after build)

---

## 🧪 Additional Scripts

- `npm run lint` – Run ESLint for code quality
- `npm run type-check` – (if configured) Check for TypeScript type errors

---

## 📁 Folder Structure

```text
/components       → Reusable UI components
/lib              → Utility functions, API helpers
/pages            → Route-based components (Next.js)
/public           → Static assets (e.g., icons, images)
/styles           → Global styles (if any)
```

---

## 🌐 Deployment

You can deploy this app on platforms like:

### Vercel (Recommended)

```bash
vercel
```

Or connect the GitHub repository directly to Vercel for automatic deployments.

### Netlify

- Use the **Next.js** preset in site settings
- Set `npm run build` as the build command
- Output directory depends on your setup (`.next` or a custom one)

---

## 🙌 Acknowledgements

- [PokeAPI](https://pokeapi.co/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Heroicons](https://heroicons.com/) (if applicable)

---

## 📜 License

MIT License © Varun Gaikwad
````
