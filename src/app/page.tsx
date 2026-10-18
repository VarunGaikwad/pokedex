import PokemonList from "@/components/pokemon-list";
import { ArrowDownRight } from "lucide-react";
import { getInitialDiscovery } from "@/lib/pokeapi";
import { parseDiscoveryParams } from "@/lib/pokemon-discovery";

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const initial = await getInitialDiscovery(parseDiscoveryParams(await searchParams));
  return (
    <main id="main-content" tabIndex={-1} className="field-container pb-16 pt-8 sm:pt-10">
      <section className="mb-7 flex items-end justify-between gap-4 sm:mb-9" aria-labelledby="guide-title">
        <div>
          <p className="eyebrow mb-2">For the endlessly curious</p>
          <h1 id="guide-title" className="text-3xl font-extrabold leading-tight tracking-[-0.045em] sm:text-4xl lg:text-5xl">Find your next favorite<span className="text-muted-foreground">.</span></h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">Big personalities. Remarkable abilities. Get to know the Pokémon that make this world extraordinary.</p>
        </div>
        <ArrowDownRight className="hidden h-10 w-10 shrink-0 text-foreground sm:block" strokeWidth={1.25} aria-hidden="true" />
      </section>
      <PokemonList initial={initial} />
      <footer className="mt-12 flex flex-wrap justify-between gap-2 border-t pt-5 text-xs text-muted-foreground">
        <span>Made for the joy of discovery.</span>
        <span>Pokémon data from PokéAPI. Unofficial fan project.</span>
      </footer>
    </main>
  );
}
