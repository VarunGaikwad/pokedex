import Image from "next/image";
import Link from "next/link";
import PokemonList from "@/components/pokemon-list";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { getInitialDiscovery } from "@/lib/pokeapi";
import { parseDiscoveryParams } from "@/lib/pokemon-discovery";

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const initial = await getInitialDiscovery(parseDiscoveryParams(await searchParams));
  return (
    <main id="main-content" tabIndex={-1} className="field-container pb-12 pt-6 sm:pt-8">
      <section className="scenic-panel mb-7 grid sm:mb-8 md:min-h-[370px] md:grid-cols-[1.1fr_1fr]" aria-labelledby="guide-title">
        <div className="relative z-10 px-6 pb-3 pt-7 sm:p-9 md:py-10 lg:p-10">
          <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-yellow-200 sm:text-[11px]">Trainer field guide / A world of discovery</p>
          <h1 id="guide-title" className="max-w-lg text-4xl font-black leading-[1.04] tracking-[-0.055em] sm:text-5xl lg:text-[3.5rem]">Your next adventure starts here.</h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/90">Every great journey starts with a little curiosity. Find a new favorite. Get to know your team.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#pokedex-explorer" className="inline-flex min-h-11 items-center gap-3 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-red-700">Explore Pokémon<ArrowDown className="h-4 w-4" aria-hidden="true" /></a>
            <Link href="/team-builder" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/45 bg-emerald-950/70 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-950">Build a team<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </div>
        <div className="relative h-[200px] sm:h-[250px] md:h-full" aria-label="A few familiar traveling companions">
          <span className="absolute bottom-8 left-[8%] h-9 w-[83%] rounded-[50%] bg-emerald-950/30 blur-md" aria-hidden="true" />
          <Image src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png" alt="Bulbasaur, the Grass-type starter Pokémon" width={220} height={220} sizes="(max-width: 767px) 145px, 200px" className="absolute bottom-2 left-0 w-[42%] max-w-[220px] -rotate-6 object-contain drop-shadow-xl md:bottom-10" />
          <Image src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png" alt="Charmander, the Fire-type starter Pokémon" width={240} height={240} sizes="(max-width: 767px) 155px, 220px" className="absolute bottom-3 right-0 w-[45%] max-w-[240px] rotate-6 object-contain drop-shadow-xl md:bottom-12" />
          <Image src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="Pikachu, the Electric-type Pokémon" width={280} height={280} sizes="(max-width: 767px) 170px, 250px" priority className="absolute bottom-0 left-[24%] z-10 w-[51%] max-w-[280px] object-contain drop-shadow-xl md:bottom-5" />
          <span className="absolute right-5 top-2 rounded-md border border-white/40 bg-emerald-950/80 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-widest text-yellow-100 md:right-6 md:top-6" aria-hidden="true">Route 001 · Let&apos;s go!</span>
        </div>
      </section>
      <div className="mb-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-border pb-5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:text-[11px]">
        <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />National Pokédex</span><span>All generations</span><span>Built for discovery</span>
      </div>
      <PokemonList initial={initial} />
    </main>
  );
}
