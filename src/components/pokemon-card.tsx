"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import TypeBadge from "@/components/type-badge";
import type { PokemonSummary } from "@/lib/pokeapi";
import { displayPokemonName, spriteUrl, type ArtworkStyle } from "@/lib/pokemon-discovery";
import { cn } from "@/lib/utils";

interface PokemonCardProps {
  pokemon: PokemonSummary;
  artwork: ArtworkStyle;
  shiny: boolean;
  priority?: boolean;
}

const typeTints: Record<string, string> = {
  normal: "bg-stone-100/70 dark:bg-stone-500/10", fire: "bg-orange-100/60 dark:bg-orange-500/10",
  water: "bg-sky-100/60 dark:bg-sky-500/10", electric: "bg-yellow-100/70 dark:bg-yellow-500/10",
  grass: "bg-lime-100/60 dark:bg-lime-500/10", ice: "bg-cyan-100/60 dark:bg-cyan-500/10",
  fighting: "bg-red-100/60 dark:bg-red-500/10", poison: "bg-purple-100/60 dark:bg-purple-500/10",
  ground: "bg-amber-100/60 dark:bg-amber-500/10", flying: "bg-indigo-100/60 dark:bg-indigo-500/10",
  psychic: "bg-pink-100/60 dark:bg-pink-500/10", bug: "bg-lime-100/60 dark:bg-lime-500/10",
  rock: "bg-stone-100/70 dark:bg-stone-500/10", ghost: "bg-violet-100/60 dark:bg-violet-500/10",
  dragon: "bg-indigo-100/60 dark:bg-indigo-500/10", dark: "bg-slate-100/70 dark:bg-slate-500/10",
  steel: "bg-slate-100/70 dark:bg-slate-500/10", fairy: "bg-rose-100/60 dark:bg-rose-500/10",
};

function rememberBrowsePosition() {
  try {
    sessionStorage.setItem("pokedex:return-url", `${window.location.pathname}${window.location.search}`);
    sessionStorage.setItem("pokedex:scroll-y", String(window.scrollY));
  } catch { /* Browsing still works when storage is unavailable. */ }
}

export default function PokemonCard({ pokemon, artwork, shiny, priority = false }: PokemonCardProps) {
  const [failedUrls, setFailedUrls] = useState<string[]>([]);
  const candidates = [spriteUrl(pokemon.id, artwork, shiny), spriteUrl(pokemon.id, "Official Artwork", false), spriteUrl(pokemon.id, "Default", false)];
  const imageUrl = candidates.find((url) => !failedUrls.includes(url));
  const name = displayPokemonName(pokemon.name);

  return (
    <Link
      href={`/pokemon/${pokemon.id}`}
      prefetch={false}
      onClick={rememberBrowsePosition}
      className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-200 hover:-translate-y-1 hover:border-foreground/25 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 motion-reduce:transform-none"
    >
      <div className={cn("relative aspect-square overflow-hidden", typeTints[pokemon.types[0]] || "bg-muted/50")}>
        <span className="absolute left-3 top-3 z-10 font-mono text-[11px] font-medium tracking-wider text-foreground/60 sm:left-4 sm:top-4">#{String(pokemon.id).padStart(4, "0")}</span>
        {shiny && <span className="absolute right-3 top-3 text-xs font-medium text-foreground/70" aria-label="Shiny variant">✦</span>}
        {imageUrl ? (
          <Image
            key={imageUrl}
            src={imageUrl}
            alt=""
            fill
            priority={priority}
            fetchPriority={priority ? "high" : undefined}
            unoptimized={imageUrl.endsWith(".gif") || imageUrl.endsWith(".svg")}
            sizes="(max-width: 767px) 46vw, (max-width: 1023px) 30vw, (max-width: 1279px) 22vw, 220px"
            className="object-contain p-5 pt-8 transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none sm:p-7 sm:pt-10"
            onError={() => setFailedUrls((previous) => previous.includes(imageUrl) ? previous : [...previous, imageUrl])}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="h-8 w-8" aria-hidden="true" />
            <span className="text-xs">Artwork unavailable</span>
          </div>
        )}
      </div>
      <div className="space-y-3 border-t border-border/60 px-3 py-4 sm:px-4">
        <h2 className="truncate text-base font-semibold tracking-tight text-card-foreground sm:text-lg">{name}</h2>
        <div className="flex min-h-6 flex-wrap gap-1.5">
          {pokemon.types.length ? pokemon.types.map((type) => <TypeBadge key={type} typeName={type} className="px-2 py-0.5 text-[11px] font-medium" />) : <Skeleton className="h-6 w-16 rounded-full" aria-label="Loading Pokémon types" />}
        </div>
      </div>
    </Link>
  );
}

export function PokemonCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card" aria-hidden="true">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="space-y-3 border-t border-border/60 px-3 py-4 sm:px-4">
        <Skeleton className="h-7 w-3/4" />
        <div className="flex h-6 gap-2"><Skeleton className="h-6 w-14 rounded-full" /><Skeleton className="h-6 w-14 rounded-full" /></div>
      </div>
    </div>
  );
}
