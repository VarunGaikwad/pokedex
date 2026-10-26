import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import SiteHeader from "@/components/site-header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Pokédex",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  keywords: [
    "Pokédex",
    "Pokémon",
    "Pokemon",
    "Pokedex",
    "Search Pokémon",
    "Browse Pokémon",
    "Manage Pokémon",
    "React App",
    "Next.js App",
  ],
  authors: [
    {
      name: "Varun",
      url: "https://portfolio-drab-nine-70.vercel.app",
    },
  ],
  description:
    "Your Pokémon field guide. Discover Pokémon, explore their stories, and find your next favorite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://pokeapi.co" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('pokedex:theme');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light'}catch(e){try{var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light'}catch(e){}}})();` }} />
      </head>
      <body className={`${inter.variable} font-body antialiased`}>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <div className="min-h-screen">
          <SiteHeader />
          {children}
          <footer className="border-t bg-card/70">
            <div className="field-container flex flex-wrap items-center justify-between gap-3 py-6 text-xs leading-relaxed text-muted-foreground">
              <span className="flex items-center gap-2 font-semibold"><span className="pokeball-mark h-5 w-5 border-2" aria-hidden="true" />Made for the joy of discovery.</span>
              <span>Pokémon data & artwork via PokéAPI. Unofficial fan project.</span>
            </div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
