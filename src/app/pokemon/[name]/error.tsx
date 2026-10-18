"use client";

import { RefreshCw, RadioTower } from "lucide-react";
import { Button } from "@/components/ui/button";
import BackToPokedex from "./back-to-pokedex";

export default function PokemonDetailError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main-content" tabIndex={-1} className="field-container py-7">
      <BackToPokedex />
      <div className="field-panel mx-auto my-10 max-w-xl text-center">
        <RadioTower className="mx-auto mb-5 h-10 w-10 text-muted-foreground" aria-hidden="true" />
        <p className="eyebrow mb-3">A little interference</p>
        <h1 className="text-3xl font-bold tracking-tight">This field note couldn’t be loaded.</h1>
        <p className="my-5 text-sm leading-relaxed text-muted-foreground">The Pokémon is still out there. We couldn’t reach its data right now — please try again.</p>
        <Button onClick={reset} className="min-h-11 gap-2"><RefreshCw className="h-4 w-4" aria-hidden="true" />Try again</Button>
      </div>
    </main>
  );
}
