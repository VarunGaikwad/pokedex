"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { getGenerationMembership, getGenerations, getPokemonCatalog, getPokemonPageMetadata, getTypeMembership, type PokemonListItem, type PokemonSummary } from "@/lib/pokeapi";
import { DEFAULT_DISCOVERY, STANDARD_TYPES, POKEMON_PER_PAGE, discoveryParams, displayPokemonName, filterCatalog, paginate, parseDiscoveryParams, pokemonIdFromUrl, type CatalogPokemon, type DiscoveryState, type InitialDiscovery } from "@/lib/pokemon-discovery";
import PokemonCard, { PokemonCardSkeleton } from "@/components/pokemon-card";
import { ArtworkControls } from "@/components/sprite-switcher";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export { POKEMON_PER_PAGE };
const gridClass = "grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4";
interface Membership {
  key: string;
  typeIds?: ReadonlySet<number>;
  generationIds?: ReadonlySet<number>;
  error?: string;
}

export default function PokemonList({ initial }: { initial?: InitialDiscovery }) {
  const initialMembership = useMemo<Membership | null>(() => initial?.membership ? {
    key: initial.membership.key,
    typeIds: initial.membership.typeIds ? new Set(initial.membership.typeIds) : undefined,
    generationIds: initial.membership.generationIds ? new Set(initial.membership.generationIds) : undefined,
  } : null, [initial]);
  const [state, setState] = useState<DiscoveryState>(initial?.state ?? DEFAULT_DISCOVERY);
  const stateRef = useRef(state);
  const [ready, setReady] = useState(!!initial);
  const [catalog, setCatalog] = useState<CatalogPokemon[] | null>(initial?.catalog ?? null);
  const [generations, setGenerations] = useState<PokemonListItem[]>(initial?.generations ?? []);
  const [indexError, setIndexError] = useState("");
  const [membership, setMembership] = useState<Membership | null>(initialMembership);
  const [metadata, setMetadata] = useState<{ key: string; items: PokemonSummary[]; error?: string } | null>(null);
  const [indexRetry, setIndexRetry] = useState(0);
  const [filterRetry, setFilterRetry] = useState(0);
  const [metadataRetry, setMetadataRetry] = useState(0);
  const restoredScroll = useRef(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const readLocation = () => {
      const next = parseDiscoveryParams(new URLSearchParams(window.location.search));
      stateRef.current = next;
      setState(next);
    };
    readLocation();
    setReady(true);
    window.addEventListener("popstate", readLocation);
    return () => window.removeEventListener("popstate", readLocation);
  }, []);

  const update = useCallback((patch: Partial<DiscoveryState>, replace = false) => {
    const next = { ...stateRef.current, ...patch };
    stateRef.current = next;
    setState(next);
    const query = discoveryParams(next);
    const url = `${window.location.pathname}${query ? `?${query}` : ""}`;
    if (url !== `${window.location.pathname}${window.location.search}`) {
      window.history[replace ? "replaceState" : "pushState"](null, "", url);
    }
  }, []);

  useEffect(() => {
    if (initial?.catalog && indexRetry === 0) return;
    let current = true;
    setIndexError("");
    Promise.all([getPokemonCatalog(), getGenerations()]).then(([entries, generationList]) => {
      if (!current) return;
      setCatalog(entries);
      setGenerations(generationList);
    }).catch(() => { if (current) setIndexError("We couldn’t open the field guide. Check your connection and try again."); });
    return () => { current = false; };
  }, [initial, indexRetry]);

  const filterKey = `${state.type}:${state.generation}`;
  useEffect(() => {
    if (!ready) return;
    if (initialMembership?.key === filterKey && filterRetry === 0) {
      setMembership(initialMembership);
      return;
    }
    let current = true;
    Promise.all([
      state.type === "all" ? Promise.resolve(undefined) : getTypeMembership(state.type),
      state.generation === "all" ? Promise.resolve(undefined) : getGenerationMembership(state.generation),
    ]).then(([typeIds, generationIds]) => {
      if (current) setMembership({ key: filterKey, typeIds, generationIds });
    }).catch(() => {
      if (current) setMembership({ key: filterKey, error: "These filters couldn’t be loaded. Please try again." });
    });
    return () => { current = false; };
  }, [ready, filterKey, state.type, state.generation, filterRetry, initialMembership]);

  const filtersReady = ready && !!catalog && membership?.key === filterKey && !membership.error;
  const filtered = useMemo(() => filtersReady && catalog ? filterCatalog(catalog, { q: state.q, type: state.type, generation: state.generation, sort: state.sort }, membership?.typeIds, membership?.generationIds) : [], [filtersReady, catalog, state.q, state.type, state.generation, state.sort, membership]);
  const page = useMemo(() => paginate(filtered, state.page), [filtered, state.page]);
  const pageKey = filtersReady ? page.items.map((pokemon) => pokemon.id).join(",") : null;

  useEffect(() => {
    if (filtersReady && page.page !== state.page) update({ page: page.page }, true);
  }, [filtersReady, page.page, state.page, update]);

  useEffect(() => {
    if (pageKey === null) return;
    const controller = new AbortController();
    getPokemonPageMetadata(page.items, controller.signal).then((items) => {
      if (!controller.signal.aborted) setMetadata({ key: pageKey, items });
    }).catch(() => {
      if (!controller.signal.aborted) setMetadata({ key: pageKey, items: [], error: "The Pokémon on this page couldn’t be loaded. Your filters are saved." });
    });
    return () => controller.abort();
  }, [pageKey, page.items, metadataRetry]);

  const filterError = membership?.key === filterKey ? membership.error : undefined;
  const metadataError = metadata?.key === pageKey ? metadata.error : undefined;
  const error = indexError || filterError || metadataError;
  const loading = !error && !filtersReady;
  const visibleMetadata = metadata?.key === pageKey ? new Map(metadata.items.map((pokemon) => [pokemon.id, pokemon])) : new Map<number, PokemonSummary>();

  useEffect(() => {
    if (loading || error || restoredScroll.current || !metadata || metadata.key !== pageKey) return;
    let frame = 0;
    try {
      const savedUrl = sessionStorage.getItem("pokedex:return-url");
      const savedY = sessionStorage.getItem("pokedex:scroll-y");
      if (savedUrl === `${window.location.pathname}${window.location.search}` && savedY !== null) {
        const y = Number(savedY);
        if (Number.isFinite(y) && y >= 0) {
          frame = requestAnimationFrame(() => {
            window.scrollTo({ top: y, behavior: "instant" });
            sessionStorage.removeItem("pokedex:scroll-y");
            restoredScroll.current = true;
          });
        }
      } else restoredScroll.current = true;
    } catch { restoredScroll.current = true; }
    return () => cancelAnimationFrame(frame);
  }, [loading, error, metadata, pageKey]);

  const clearFilters = () => update({ q: "", type: "all", generation: "all", page: 1 });
  const activeFilters = [
    ...(state.q ? [{ label: `“${state.q}”`, clear: () => update({ q: "", page: 1 }) }] : []),
    ...(state.type !== "all" ? [{ label: displayPokemonName(state.type), clear: () => update({ type: "all", page: 1 }) }] : []),
    ...(state.generation !== "all" ? [{ label: `Generation ${state.generation}`, clear: () => update({ generation: "all", page: 1 }) }] : []),
  ];

  const filterControls = (
    <>
      <FilterSelect label="Type" value={state.type} onChange={(type) => update({ type, page: 1 })}>
        <SelectItem value="all">All types</SelectItem>
        {STANDARD_TYPES.map((type) => <SelectItem key={type} value={type}>{displayPokemonName(type)}</SelectItem>)}
      </FilterSelect>
      <FilterSelect label="Generation" value={state.generation} onChange={(generation) => update({ generation, page: 1 })}>
        <SelectItem value="all">All generations</SelectItem>
        {generations.map((generation) => {
          const id = pokemonIdFromUrl(generation.url);
          return <SelectItem key={id} value={String(id)}>Generation {id}</SelectItem>;
        })}
      </FilterSelect>
      <FilterSelect label="Sort by" value={state.sort} onChange={(sort) => update({ sort: sort as DiscoveryState["sort"], page: 1 })}>
        <SelectItem value="number">Number: lowest first</SelectItem>
        <SelectItem value="number-desc">Number: highest first</SelectItem>
        <SelectItem value="name">Name: A–Z</SelectItem>
        <SelectItem value="name-desc">Name: Z–A</SelectItem>
      </FilterSelect>
    </>
  );

  const changePage = (next: number) => {
    update({ page: next });
    resultsRef.current?.scrollIntoView({ behavior: "instant", block: "start" });
  };

  return (
    <section id="pokedex-explorer" className="scroll-mt-6 space-y-6" aria-label="Pokémon field guide">
      <div className="device-panel overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b bg-muted/50 px-4 py-4 sm:px-6">
          <div><p className="device-label mb-1">Discovery console</p><h2 className="section-heading">Who&apos;s that Pokémon?</h2></div>
          <span className="hidden items-center gap-2 rounded-full border bg-card px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:inline-flex"><span className="h-2 w-2 rounded-full bg-cyan-500" aria-hidden="true" />Ready to explore</span>
        </div>
        <div className="p-4 sm:p-6">
        <div className="flex items-end gap-3">
          <div className="min-w-0 flex-1 space-y-1.5">
            <label htmlFor="pokemon-search" className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Find your Pokémon</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input id="pokemon-search" type="search" placeholder="Name or Pokédex number…" value={state.q} maxLength={100} onChange={(event) => update({ q: event.target.value, page: 1 }, true)} className="h-11 bg-background pl-10 text-sm" />
            </div>
          </div>
          <Sheet>
            <SheetTrigger asChild><Button variant="outline" className="h-11 gap-2 md:hidden"><SlidersHorizontal className="h-4 w-4" aria-hidden="true" />Filters{activeFilters.length > 0 && <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">{activeFilters.length}</span>}</Button></SheetTrigger>
            <SheetContent className="flex w-[min(90vw,380px)] flex-col overflow-y-auto">
              <SheetHeader><SheetTitle>Refine your field guide</SheetTitle><SheetDescription>Combine type, generation, and search to find a Pokémon.</SheetDescription></SheetHeader>
              <div className="mt-4 space-y-5">{filterControls}<ArtworkControls artwork={state.artwork} shiny={state.shiny} onArtworkChange={(artwork) => update({ artwork })} onShinyChange={(shiny) => update({ shiny })} /></div>
              <Button variant="outline" onClick={clearFilters} className="mt-4">Clear filters</Button>
              <SheetClose asChild><Button className="text-primary-foreground">Show results</Button></SheetClose>
            </SheetContent>
          </Sheet>
        </div>
        <div className="mt-4 hidden grid-cols-3 gap-4 md:grid">{filterControls}</div>
        <div className="mt-4 hidden items-end justify-between gap-6 border-t border-border pt-4 md:flex">
          <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">Your field guide, your view. Browse original artwork or switch to classic sprites.</p>
          <ArtworkControls artwork={state.artwork} shiny={state.shiny} onArtworkChange={(artwork) => update({ artwork })} onShinyChange={(shiny) => update({ shiny })} />
        </div>
        </div>
      </div>

      <div ref={resultsRef} className="scroll-mt-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
            {filtersReady ? <><strong className="font-semibold tabular-nums text-foreground">{filtered.length.toLocaleString()}</strong> Pokémon{filtered.length > 0 && <span className="ml-2 text-xs">· {page.start + 1}–{Math.min(page.start + POKEMON_PER_PAGE, filtered.length)} of {filtered.length.toLocaleString()}</span>}</> : "Opening the field guide…"}
          </p>
          {activeFilters.length > 0 && <Button variant="ghost" size="sm" onClick={clearFilters} className="h-11 gap-1.5 text-xs"><RotateCcw className="h-3 w-3" aria-hidden="true" />Clear filters</Button>}
        </div>
        {activeFilters.length > 0 && <div className="flex flex-wrap gap-2" aria-label="Active filters">{activeFilters.map((filter) => <button key={filter.label} onClick={filter.clear} aria-label={`Remove filter ${filter.label}`} className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className="truncate">{filter.label}</span><X className="h-3 w-3 shrink-0" aria-hidden="true" /></button>)}</div>}

        {error ? (
          <div className="dialog-panel px-6 py-16 text-center" role="alert">
            <BookOpen className="mx-auto mb-4 h-8 w-8 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-xl font-semibold">A little trouble in the field</h2><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{error}</p>
            <Button className="mt-6 gap-2" onClick={() => {
              if (indexError) setIndexRetry((value) => value + 1);
              else if (filterError) { setMembership(null); setFilterRetry((value) => value + 1); }
              else { setMetadata(null); setMetadataRetry((value) => value + 1); }
            }}><RotateCcw className="h-4 w-4" aria-hidden="true" />Try again</Button>
          </div>
        ) : loading ? (
          <div className={gridClass} aria-label="Loading Pokémon" aria-busy="true">{Array.from({ length: filtersReady ? page.items.length : POKEMON_PER_PAGE }, (_, index) => <PokemonCardSkeleton key={index} />)}</div>
        ) : filtered.length === 0 ? (
          <div className="dialog-panel border-dashed px-6 py-20 text-center">
            <Search className="mx-auto mb-4 h-8 w-8 text-muted-foreground" aria-hidden="true" /><h2 className="text-xl font-semibold">No discoveries just yet</h2><p className="mt-2 text-sm text-muted-foreground">Try another name or number, or give your filters a little more room.</p><Button onClick={clearFilters} className="mt-6">Clear filters</Button>
          </div>
        ) : (
          <div className={gridClass}>{page.items.map((pokemon, index) => <PokemonCard key={pokemon.id} pokemon={visibleMetadata.get(pokemon.id) || { ...pokemon, types: [] }} artwork={state.artwork} shiny={state.shiny} priority={page.page === 1 && index < 3} />)}</div>
        )}

        {filtersReady && !error && filtered.length > 0 && <nav className="flex items-center justify-between gap-3 border-t border-border pt-6" aria-label="Pokémon pages">
          <Button variant="outline" onClick={() => changePage(page.page - 1)} disabled={page.page === 1} className="h-11 gap-2"><ArrowLeft className="h-4 w-4" aria-hidden="true" /><span>Previous</span></Button>
          <span className="text-xs tabular-nums text-muted-foreground sm:text-sm">Page <strong className="font-medium text-foreground">{page.page}</strong> of {page.totalPages}</span>
          <Button variant="outline" onClick={() => changePage(page.page + 1)} disabled={page.page === page.totalPages} className="h-11 gap-2"><span>Next</span><ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
        </nav>}
      </div>
    </section>
  );
}

function FilterSelect({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return <div className="space-y-1.5"><span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</span><Select value={value} onValueChange={onChange}><SelectTrigger aria-label={label} className="h-11 bg-background"><SelectValue /></SelectTrigger><SelectContent>{children}</SelectContent></Select></div>;
}
