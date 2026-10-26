"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { displayPokemonName, spriteUrl } from "@/lib/pokemon-discovery";
import { cn } from "@/lib/utils";

interface TeamPokemonArtworkProps {
  id: number;
  name: string;
  type?: string;
  className?: string;
  sizes?: string;
}

const typeTints: Record<string, string> = {
  normal: "bg-stone-100/70 dark:bg-stone-500/10",
  fire: "bg-orange-100/60 dark:bg-orange-500/10",
  water: "bg-sky-100/60 dark:bg-sky-500/10",
  electric: "bg-yellow-100/70 dark:bg-yellow-500/10",
  grass: "bg-lime-100/60 dark:bg-lime-500/10",
  ice: "bg-cyan-100/60 dark:bg-cyan-500/10",
  fighting: "bg-red-100/60 dark:bg-red-500/10",
  poison: "bg-purple-100/60 dark:bg-purple-500/10",
  ground: "bg-amber-100/60 dark:bg-amber-500/10",
  flying: "bg-indigo-100/60 dark:bg-indigo-500/10",
  psychic: "bg-pink-100/60 dark:bg-pink-500/10",
  bug: "bg-lime-100/60 dark:bg-lime-500/10",
  rock: "bg-stone-100/70 dark:bg-stone-500/10",
  ghost: "bg-violet-100/60 dark:bg-violet-500/10",
  dragon: "bg-indigo-100/60 dark:bg-indigo-500/10",
  dark: "bg-slate-100/70 dark:bg-slate-500/10",
  steel: "bg-slate-100/70 dark:bg-slate-500/10",
  fairy: "bg-rose-100/60 dark:bg-rose-500/10",
};

function PokemonImage({ id, name, sizes }: Pick<TeamPokemonArtworkProps, "id" | "name" | "sizes">) {
  const [failedUrls, setFailedUrls] = useState<string[]>([]);
  const imageUrl = [spriteUrl(id, "Official Artwork", false), spriteUrl(id, "Default", false)]
    .find((url) => !failedUrls.includes(url));
  const displayName = displayPokemonName(name);

  return imageUrl ? (
    <Image
      key={imageUrl}
      src={imageUrl}
      alt={`${displayName} artwork`}
      fill
      sizes={sizes}
      className="z-10 object-contain p-[10%] drop-shadow-[0_8px_4px_rgba(10,30,20,0.12)]"
      onError={() => setFailedUrls((previous) => previous.includes(imageUrl) ? previous : [...previous, imageUrl])}
    />
  ) : (
    <div role="img" aria-label={`${displayName} artwork unavailable`} className="absolute inset-0 z-10 flex items-center justify-center text-muted-foreground">
      <ImageOff aria-hidden="true" className="h-auto w-1/3 max-w-8" />
      <span className="sr-only">Artwork unavailable</span>
    </div>
  );
}

export default function TeamPokemonArtwork({ id, name, type, className, sizes = "(max-width: 639px) 40vw, 200px" }: TeamPokemonArtworkProps) {
  return (
    <div className={cn("relative aspect-square overflow-hidden", typeTints[type || ""] || "bg-muted/50", className)}>
      <svg aria-hidden="true" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="pointer-events-none absolute inset-0 h-full w-full text-foreground/[0.06] dark:text-foreground/[0.08]">
        <circle cx="50" cy="50" r="38" />
        <path d="M12 50h28m20 0h28" />
        <circle cx="50" cy="50" r="10" />
      </svg>
      <PokemonImage key={id} id={id} name={name} sizes={sizes} />
    </div>
  );
}
