import { SearchX } from "lucide-react";
import BackToPokedex from "./back-to-pokedex";

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="field-container py-7">
      <BackToPokedex />
      <div className="dialog-panel mx-auto my-10 max-w-xl p-7 text-center sm:p-10">
        <SearchX className="mx-auto mb-5 h-10 w-10 text-muted-foreground" aria-hidden="true" />
        <p className="eyebrow mb-3">An uncharted entry</p>
        <h1 className="text-3xl font-bold tracking-tight">Pokémon not found.</h1>
        <p className="my-5 text-sm leading-relaxed text-muted-foreground">We don’t have a field note under that name or number. Head back to the guide to find a familiar face — or a new favorite.</p>
      </div>
    </main>
  );
}
