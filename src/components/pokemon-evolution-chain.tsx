"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ImageOff } from "lucide-react";
import type { PokemonListItem } from "@/lib/pokeapi";

interface EvolutionDetail {
  item: PokemonListItem | null;
  trigger: PokemonListItem;
  gender: number | null;
  held_item: PokemonListItem | null;
  known_move: PokemonListItem | null;
  known_move_type: PokemonListItem | null;
  location: PokemonListItem | null;
  min_level: number | null;
  min_happiness: number | null;
  min_beauty: number | null;
  min_affection: number | null;
  needs_overworld_rain: boolean;
  party_species: PokemonListItem | null;
  party_type: PokemonListItem | null;
  relative_physical_stats: number | null;
  time_of_day: string;
  trade_species: PokemonListItem | null;
  turn_upside_down: boolean;
}
interface EvolutionNode {
  species: PokemonListItem;
  evolves_to: EvolutionNode[];
  evolution_details: EvolutionDetail[];
}
const readable = (name: string) => name.replaceAll("-", " ");

function formatEvolutionDetails(details: EvolutionDetail): string {
  const conditions: string[] = [];
  if (details.trigger.name === "level-up") conditions.push(details.min_level ? `Level ${details.min_level}` : "Level up");
  else if (details.trigger.name === "use-item") conditions.push(details.item ? `Use ${readable(details.item.name)}` : "Use item");
  else conditions.push(readable(details.trigger.name));
  if (details.held_item) conditions.push(`holding ${readable(details.held_item.name)}`);
  if (details.min_happiness) conditions.push("high friendship");
  if (details.min_affection) conditions.push("high affection");
  if (details.min_beauty) conditions.push("high beauty");
  if (details.time_of_day) conditions.push(`at ${details.time_of_day}`);
  if (details.gender === 1) conditions.push("female");
  if (details.gender === 2) conditions.push("male");
  if (details.known_move) conditions.push(`knowing ${readable(details.known_move.name)}`);
  if (details.known_move_type) conditions.push(`knowing a ${readable(details.known_move_type.name)} move`);
  if (details.location) conditions.push(`at ${readable(details.location.name)}`);
  if (details.party_species) conditions.push(`with ${readable(details.party_species.name)} in party`);
  if (details.party_type) conditions.push(`with a ${details.party_type.name} type in party`);
  if (details.trade_species) conditions.push(`for ${readable(details.trade_species.name)}`);
  if (details.needs_overworld_rain) conditions.push("in rain");
  if (details.turn_upside_down) conditions.push("turn system upside down");
  if (details.relative_physical_stats !== null && details.relative_physical_stats !== undefined) conditions.push(`Attack ${details.relative_physical_stats === 0 ? "=" : details.relative_physical_stats > 0 ? ">" : "<"} Defense`);
  return conditions.join(" · ");
}

function EvolutionPortrait({ id, name }: { id: string; name: string }) {
  const [failed, setFailed] = useState(0);
  const source = failed === 0
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  return (
    <div className="relative z-10 h-24 w-24 shrink-0 rounded-full bg-background/60">
      {failed < 2 ? <Image src={source} alt={readable(name)} fill sizes="96px" className={`object-contain ${failed ? "pixelated" : ""}`} onError={() => setFailed(value => value + 1)} unoptimized={failed > 0} /> : <div className="flex h-full items-center justify-center text-muted-foreground"><ImageOff className="h-7 w-7" aria-label="Artwork unavailable" /></div>}
    </div>
  );
}

function EvolutionStep({ node, root = false }: { node: EvolutionNode; root?: boolean }) {
  const id = node.species.url.split("/").filter(Boolean).pop() || "0";
  return (
    <li className="flex min-w-0 flex-col items-center">
      {!root && <div className="relative flex min-h-20 flex-col items-center justify-center gap-1 border-l-2 border-dashed border-primary/40 px-4 py-3 text-center"><ArrowDown className="h-4 w-4 text-primary" aria-hidden="true" /><p className="max-w-64 rounded-md bg-card px-2 py-1 font-mono text-[11px] leading-relaxed text-muted-foreground">{node.evolution_details.length ? Array.from(new Set(node.evolution_details.map(formatEvolutionDetails))).join(" or ") : "Special conditions"}</p></div>}
      <Link href={`/pokemon/${node.species.name}`} className="device-panel relative flex w-full max-w-64 items-center gap-3 p-3 transition-colors hover:border-primary hover:bg-accent">
        <EvolutionPortrait id={id} name={node.species.name} />
        <div className="min-w-0"><span className="block font-mono text-xs text-muted-foreground">#{id.padStart(4, "0")}</span><span className="mt-1 block break-words text-sm font-semibold capitalize">{readable(node.species.name)}</span></div>
      </Link>
      {node.evolves_to.length > 0 && <ol className="mt-3 grid w-full gap-x-4 gap-y-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))" }}>{node.evolves_to.map(next => <EvolutionStep key={next.species.name} node={next} />)}</ol>}
    </li>
  );
}

export default function PokemonEvolutionChain({ chain }: { chain: { chain: EvolutionNode } | null }) {
  return (
    <div className="device-panel p-5 sm:p-7">
      <p className="eyebrow mb-2">03 / Evolution paths</p>
      <h2 className="section-heading mb-2">Evolution</h2>
      {!chain ? <p className="dialog-panel mt-4 p-4 text-sm text-muted-foreground">Evolution notes are unavailable right now. The rest of this entry is ready to explore.</p> : <>
        <p className="mb-6 text-sm text-muted-foreground">{chain.chain.evolves_to.length ? "Follow each path to discover how this Pokémon family changes." : "This Pokémon does not evolve."}</p>
        <ol><EvolutionStep node={chain.chain} root /></ol>
      </>}
    </div>
  );
}
