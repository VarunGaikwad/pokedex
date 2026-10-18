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

<<<<<<< HEAD
function getGenderRatio(
  rate: number
): { male: number; female: number } | "genderless" {
  if (rate === -1) {
    return "genderless";
  }
  const femalePercentage = (rate / 8) * 100;
  const malePercentage = 100 - femalePercentage;
  return { male: malePercentage, female: femalePercentage };
}

export default async function PokemonDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const pokemon = await getPokemonDetails(name);

  if (!pokemon) {
    notFound();
  }

  const evolutionChain = await getEvolutionChain(
    pokemon.species_details.evolution_chain?.url
  );

  const flavorTextEntry = pokemon.species_details.flavor_text_entries.find(
    (entry: any) => entry.language.name === "en"
  );

  const category =
    pokemon.species_details.genera?.find((g: any) => g.language.name === "en")
      ?.genus || "Unknown";

  const moves = pokemon.moves;
  const abilities = pokemon.abilities.map(
    (ability: any) => ability.ability.name
  );
  const types = pokemon.types.map((typeInfo: any) => typeInfo.type.name);

  const genderRatio = getGenderRatio(pokemon.species_details.gender_rate);

=======
function SectionLoading({ title }: { title: string }) {
>>>>>>> f502f61 (new verison)
  return (
    <div className="field-panel" role="status">
      <h2 className="section-heading mb-3">{title}</h2>
      <p className="text-sm text-muted-foreground">Gathering field notes…</p>
      <div className="mt-5 h-2 w-2/3 animate-pulse rounded-full bg-muted" />
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
      <header className="mb-6 flex flex-wrap items-end justify-between gap-5">
        <div className="min-w-0">
          <p className="eyebrow mb-2">Field notes <span className="ml-2 font-mono tracking-normal">#{String(pokemon.id).padStart(4, "0")}</span></p>
          <h1 className="break-words text-4xl font-extrabold capitalize leading-tight tracking-[-0.045em] sm:text-6xl">{pokemon.name.replaceAll("-", " ")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{category}</p>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Pokémon types">
          {types.map(type => <TypeBadge key={type} typeName={type} />)}
        </div>
      </header>

      <nav aria-label="Entry sections" className="mb-7 flex gap-1 border-b sm:gap-6">
        {[["overview", "Overview"], ["stats", "Stats"], ["evolution", "Evolution"], ["moves", "Moves"]].map(([id, label], index) => (
          <a key={id} href={`#${id}`} className={`min-h-11 border-b-2 px-3 py-3 text-sm font-semibold transition-colors hover:border-foreground hover:text-foreground sm:px-1 ${index === 0 ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"}`}>{label}</a>
        ))}
      </nav>

      <section id="overview" aria-label="Overview" className="grid min-w-0 gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
        <PokemonSprites name={pokemon.name} sprites={pokemon.sprites} genderRate={genderRate} />
        <div className="min-w-0 space-y-6 lg:py-4">
          <div>
            <p className="eyebrow mb-3">Meet {pokemon.name.replaceAll("-", " ")}</p>
            <p className="text-lg leading-relaxed sm:text-xl sm:leading-relaxed">{description ? description.replace(/[\n\f\r]+/g, " ").replace(/\\n/g, " ") : "There's still more to discover about this Pokémon. Explore its stats, abilities, and evolution below."}</p>
          </div>
          <div className="field-panel">
            <h2 className="section-heading mb-5">At a glance</h2>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
              <div><dt className="eyebrow mb-1.5">Height</dt><dd className="text-xl font-semibold tabular-nums">{(pokemon.height / 10).toFixed(1)} <span className="text-sm font-normal text-muted-foreground">m</span></dd></div>
              <div><dt className="eyebrow mb-1.5">Weight</dt><dd className="text-xl font-semibold tabular-nums">{(pokemon.weight / 10).toFixed(1)} <span className="text-sm font-normal text-muted-foreground">kg</span></dd></div>
              <div><dt className="eyebrow mb-1.5">Abilities</dt><dd className="space-y-1 text-sm font-medium capitalize">{pokemon.abilities.map((entry: any) => <div key={entry.ability.name}>{entry.ability.name.replaceAll("-", " ")}{entry.is_hidden && <span className="mt-0.5 block text-xs font-normal normal-case text-muted-foreground">Hidden ability</span>}</div>)}</dd></div>
              <div><dt className="eyebrow mb-1.5">Gender</dt><dd className="flex flex-wrap gap-x-3 gap-y-1 text-sm font-medium tabular-nums">{genderRate === -1 ? "Genderless" : <><span className="inline-flex items-center gap-1" aria-label={`Male ${100 - female} percent`}><Mars className="h-4 w-4" aria-hidden="true" />{100 - female}%</span><span className="inline-flex items-center gap-1" aria-label={`Female ${female} percent`}><Venus className="h-4 w-4" aria-hidden="true" />{female}%</span></>}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <div className="mt-8 grid min-w-0 items-start gap-6 lg:grid-cols-2">
        <section id="stats" className="field-panel" aria-labelledby="stats-title">
          <p className="eyebrow mb-2">The numbers behind the nature</p>
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
      <footer className="mt-10 border-t pt-5 text-xs text-muted-foreground">Every Pokémon has a story. Keep exploring.</footer>
    </main>
  );
}
