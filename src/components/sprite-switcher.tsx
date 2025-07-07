"use client";

import { useState } from "react";
import Image from "next/image";

type SpriteOptions = "default" | "shiny" | "artwork";

interface SpriteSwitcherProps {
  sprites: {
    front_default: string | null;
    front_shiny: string | null;
    other: {
      "official-artwork": { front_default: string; front_shiny: string };
    };
  };
  name: string;
}

export function SpriteSwitcher({ sprites, name }: SpriteSwitcherProps) {
  const [view, setView] = useState<SpriteOptions>("default");

  // map our view keys to the actual URL
  const urlMap: Record<SpriteOptions, string | null> = {
    default: sprites.front_default,
    shiny: sprites.front_shiny,
    artwork: sprites.other["official-artwork"].front_default,
  };

  const labelMap: Record<SpriteOptions, string> = {
    default: "Default",
    shiny: "Shiny",
    artwork: "Official Artwork",
  };

  const imageUrl = urlMap[view];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex space-x-1">
        {(["default", "shiny", "artwork"] as SpriteOptions[]).map((opt) => (
          <button
            key={opt}
            onClick={() => setView(opt)}
            className={`px-2 py-1 rounded ${
              view === opt
                ? "bg-primary text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            {labelMap[opt]}
          </button>
        ))}
      </div>
      <div className="w-40 h-40 relative bg-gray-50">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${name} – ${labelMap[view]}`}
            fill
            className="object-contain p-4"
          />
        ) : (
          <p className="text-sm text-gray-500">No image available</p>
        )}
      </div>
    </div>
  );
}
