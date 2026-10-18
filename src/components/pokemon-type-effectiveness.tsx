import type { CalculateWeaknessesOutput } from "@/ai/flows/calculate-weaknesses";
import { getWeaknesses } from "@/app/actions";
import { ShieldAlert, ShieldOff } from "lucide-react";
import TypeBadge from "./type-badge";

export default async function PokemonTypeEffectiveness({ types }: { types: string[] }) {
  let result: Awaited<ReturnType<typeof getWeaknesses>> | null = null;
  try { result = await getWeaknesses({ types }); } catch { /* Supplemental notes can fail independently. */ }
  const analysis: CalculateWeaknessesOutput | null = result && !("error" in result) ? result : null;
  const groups = analysis ? [
    { label: "4× damage", types: analysis.weaknesses4x, icon: ShieldAlert },
    { label: "2× damage", types: analysis.weaknesses2x, icon: ShieldAlert },
    { label: "No damage", types: analysis.immunities, icon: ShieldOff },
  ] : [];

  return (
    <section className="field-panel" aria-labelledby="effectiveness-title">
      <p className="eyebrow mb-2">Know your matchups</p>
      <h2 id="effectiveness-title" className="section-heading mb-2">Type effectiveness</h2>
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">Incoming damage based on this Pokémon’s types, before abilities or other effects.</p>
      {!analysis ? <p className="text-sm text-muted-foreground">Type notes are unavailable right now. Try this entry again in a moment.</p> : groups.every(group => !group.types.length) ? <p className="text-sm text-muted-foreground">No type weaknesses or immunities.</p> : (
        <dl className="space-y-5">
          {groups.filter(group => group.types.length).map(({ label, types: groupTypes, icon: Icon }) => (
            <div key={label} className="space-y-2.5">
              <dt className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><Icon className="h-4 w-4" aria-hidden="true" />{label}</dt>
              <dd className="flex flex-wrap gap-2">{groupTypes.map(type => <TypeBadge key={type} typeName={type} />)}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
