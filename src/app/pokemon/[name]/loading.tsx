import { Skeleton } from "@/components/ui/skeleton";
import BackToPokedex from "./back-to-pokedex";

export default function PokemonDetailLoading() {
  return (
    <main id="main-content" tabIndex={-1} className="field-container pb-16 pt-7" aria-busy="true" aria-label="Loading Pokémon entry">
      <BackToPokedex />
      <p className="dialog-panel device-label mb-5 flex items-center gap-3 p-4" role="status"><span className="h-2 w-2 rounded-full bg-cyan-500" aria-hidden="true" />Opening the Pokédex / Receiving entry…</p>
      <Skeleton className="h-14 w-3/4 max-w-sm" />
      <div className="mb-7 mt-5 flex gap-2"><Skeleton className="h-7 w-20 rounded-full" /><Skeleton className="h-7 w-20 rounded-full" /></div>
      <div className="mb-7 flex gap-4 border-b py-4">{[1, 2, 3, 4].map(item => <Skeleton key={item} className="h-4 w-14 sm:w-20" />)}</div>
      <div className="grid min-w-0 gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
        <div className="battle-stage flex aspect-square max-h-[480px] items-center justify-center"><Skeleton className="relative z-10 h-1/2 w-1/2 rounded-full motion-reduce:animate-none" /></div>
        <div className="space-y-6 py-4"><Skeleton className="h-5 w-2/3" /><Skeleton className="h-5 w-full" /><Skeleton className="h-5 w-5/6" /><Skeleton className="h-64 w-full rounded-2xl" /></div>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2"><Skeleton className="h-80 rounded-2xl" /><Skeleton className="h-80 rounded-2xl" /></div>
    </main>
  );
}
