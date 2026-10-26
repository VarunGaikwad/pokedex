import { Suspense } from "react";
import { getPokemonDetails, getEvolutionChain } from "@/lib/pokeapi";
import { notFound } from "next/navigation";
import { Mars, Venus } from "lucide-react";
import TypeBadge from "@/components/type-badge";
import PokemonStats from "@/components/pokemon-stats";
import PokemonSprites from "@/components/pokemon-sprites";
import PokemonMoves from "@/components/pokemon-moves";
import PokemonEvolutionChain from "@/components/pokemon-evolution-chain";
import PokemonTypeEffectiveness from "@/components/pokemon-type-effectiveness";
import BackToPokedex from "./back-to-pokedex";

function SectionLoading({ title }: { title: string }) {
  return (
    <div className="dialog-panel p-6 sm:p-7" role="status">
      <h2 className="section-heading mb-3">{title}</h2>
      <p className="text-sm text-muted-foreground">Gathering field notes…</p>
      <div className="mt-5 h-2 w-2/3 animate-pulse rounded-full bg-muted motion-reduce:animate-none" />
    </div>
  );
}

async function EvolutionSection({ url }: { url: string }) {
  let chain = null;
  try { chain = await getEvolutionChain(url); } catch { /* Keep the entry available if supplemental data fails. */ }
  return <PokemonEvolutionChain chain={chain} />;
}

export default async function PokemonDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const pokemon = await getPokemonDetails(name);
  if (!pokemon) notFound();

  const species = pokemon.species_details;
  const description = species.flavor_text_entries?.find((entry: any) => entry.language.name === "en")?.flavor_text;
  const category = species.genera?.find((entry: any) => entry.language.name === "en")?.genus || "Pokémon";
  const types: string[] = pokemon.types.map((entry: any) => entry.type.name);
  const genderRate = species.gender_rate ?? -1;
  const female = genderRate / 8 * 100;

  return (
    <main id="main-content" tabIndex={-1} className="field-container pb-16 pt-5 sm:pt-7">
      <BackToPokedex />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3">
        <p className="device-label">National Pokédex <span className="ml-2 text-foreground">#{String(pokemon.id).padStart(4, "0")}</span></p>
        <span className="device-label flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-cyan-500 ring-4 ring-cyan-500/10" aria-hidden="true" />Entry received</span>
      </div>

      <nav aria-label="Entry sections" className="mb-7 grid grid-cols-4 gap-1 border-b sm:flex sm:gap-6">
        {[["overview", "Overview"], ["stats", "Stats"], ["evolution", "Evolution"], ["moves", "Moves"]].map(([id, label], index) => (
          <a key={id} href={`#${id}`} className={`min-h-11 border-b-2 px-1 py-3 text-xs font-semibold sm:px-1 sm:text-sm transition-colors hover:border-foreground hover:text-foreground ${index === 0 ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"}`}>{label}</a>
        ))}
      </nav>

      <section id="overview" aria-label="Overview" className="grid min-w-0 gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
        <PokemonSprites name={pokemon.name} sprites={pokemon.sprites} genderRate={genderRate} />
        <div className="min-w-0 space-y-6 lg:py-2">
          <header>
            <p className="device-label mb-3">Pokémon / {category}</p>
            <h1 className="break-words text-4xl font-extrabold capitalize leading-tight tracking-[-0.045em] sm:text-6xl">{pokemon.name.replaceAll("-", " ")}</h1>
            <div className="mt-4 flex flex-wrap gap-2" aria-label="Pokémon types">{types.map(type => <TypeBadge key={type} typeName={type} />)}</div>
          </header>
          <div className="border-l-4 border-primary pl-5">
            <p className="device-label mb-3">Professor’s field notes</p>
            <p className="text-lg leading-relaxed sm:text-xl sm:leading-relaxed">{description ? description.replace(/[\n\f\r]+/g, " ").replace(/\\n/g, " ") : "There's still more to discover about this Pokémon. Explore its stats, abilities, and evolution below."}</p>
          </div>
          <div className="device-panel p-5 sm:p-6">
            <h2 className="device-label mb-5">Biological data</h2>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-6 [&>div]:min-w-0 [&>div]:border-t [&>div]:pt-3">
              <div><dt className="eyebrow mb-1.5">Height</dt><dd className="text-xl font-semibold tabular-nums">{(pokemon.height / 10).toFixed(1)} <span className="text-sm font-normal text-muted-foreground">m</span></dd></div>
              <div><dt className="eyebrow mb-1.5">Weight</dt><dd className="text-xl font-semibold tabular-nums">{(pokemon.weight / 10).toFixed(1)} <span className="text-sm font-normal text-muted-foreground">kg</span></dd></div>
              <div><dt className="eyebrow mb-1.5">Abilities</dt><dd className="space-y-1 text-sm font-medium capitalize">{pokemon.abilities.map((entry: any) => <div key={entry.ability.name}>{entry.ability.name.replaceAll("-", " ")}{entry.is_hidden && <span className="mt-0.5 block text-xs font-normal normal-case text-muted-foreground">Hidden ability</span>}</div>)}</dd></div>
              <div><dt className="eyebrow mb-1.5">Gender</dt><dd className="flex flex-wrap gap-x-3 gap-y-1 text-sm font-medium tabular-nums">{genderRate === -1 ? "Genderless" : <><span className="inline-flex items-center gap-1" aria-label={`Male ${100 - female} percent`}><Mars className="h-4 w-4" aria-hidden="true" />{100 - female}%</span><span className="inline-flex items-center gap-1" aria-label={`Female ${female} percent`}><Venus className="h-4 w-4" aria-hidden="true" />{female}%</span></>}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <div className="mt-8 grid min-w-0 items-start gap-6 lg:grid-cols-2">
        <section id="stats" className="device-panel p-5 sm:p-7" aria-labelledby="stats-title">
          <p className="eyebrow mb-2">01 / Battle potential</p>
          <h2 id="stats-title" className="section-heading mb-6">Base stats</h2>
          <PokemonStats stats={pokemon.stats} />
        </section>
        <Suspense fallback={<SectionLoading title="Type effectiveness" />}>
          <PokemonTypeEffectiveness types={types} />
        </Suspense>
      </div>
      <section id="evolution" className="mt-6 min-w-0" aria-label="Evolution">
        <Suspense fallback={<SectionLoading title="Evolution" />}>
          <EvolutionSection url={species.evolution_chain?.url || ""} />
        </Suspense>
      </section>
      <section id="moves" className="mt-6 min-w-0" aria-label="Moves">
        <Suspense fallback={<SectionLoading title="Learnable moves" />}>
          <PokemonMoves pokemonName={pokemon.name} moves={pokemon.moves} />
        </Suspense>
      </section>
      <footer className="mt-10 border-t pt-5 text-xs text-muted-foreground">End of entry / Every Pokémon has a story. Keep exploring.</footer>
    </main>
  );
}
