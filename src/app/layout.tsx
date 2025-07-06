import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Pokédex",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
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
    "A modern Pokédex to browse, search, and manage your favorite Pokémon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/image/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <div className="bg-background/95 backdrop-blur-sm min-h-screen">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
