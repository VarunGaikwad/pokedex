"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ChevronLeft, ChevronRight, CircleDot, Loader2, Plus, Search, Shield, Swords, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TypeBadge from '@/components/type-badge';
import TeamPokemonArtwork from '@/components/team-pokemon-artwork';
import { getPokemonCatalog } from '@/lib/pokeapi';
import { displayPokemonName as label, matchesPokemon, paginate, type CatalogPokemon } from '@/lib/pokemon-discovery';
import { addTeamMember, analyzeTeam, loadTeamMember, loadTeamMove, loadTypeChart, setTeamMove, type TeamMember, type TypeChart } from '@/lib/team-builder';
import { cn } from '@/lib/utils';

const control = 'min-h-11 w-full min-w-0 rounded-xl border border-input bg-background px-3 text-sm';
const redButton = 'bg-primary text-primary-foreground hover:bg-primary/90';

export default function TeamBuilder() {
  const [catalog, setCatalog] = useState<CatalogPokemon[]>([]);
  const [chart, setChart] = useState<TypeChart | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);
  const busyRef = useRef(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLHeadingElement>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.all([getPokemonCatalog(), loadTypeChart()]).then(([pokemon, types]) => {
      if (active) { setCatalog(pokemon); setChart(types); }
    }).catch(() => {
      if (active) setError('Could not load Pokémon and type data. Check your connection and retry.');
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);

  async function updateTeam(action: () => Promise<void>) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError('');
    try { await action(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not update the team. Please try again.'); }
    finally { busyRef.current = false; setBusy(false); setAddingId(null); }
  }

  function focusSearch() {
    searchRef.current?.focus();
  }

  function selectMember(id: number) {
    setActiveId(id);
    requestAnimationFrame(() => editorRef.current?.focus());
  }

  function removeMember(member: TeamMember) {
    if (busyRef.current) return;
    const index = team.findIndex(({ id }) => id === member.id);
    const next = team.filter(({ id }) => id !== member.id);
    const nextActive = next[index] ?? next[index - 1];
    setTeam(next);
    setActiveId(nextActive?.id ?? null);
    setError('');
    setNotice(`${label(member.name)} removed. A party slot is now open.`);
    requestAnimationFrame(() => document.getElementById(nextActive ? `party-${nextActive.id}` : 'party-empty-0')?.focus());
  }

  const results = paginate(catalog.filter((pokemon) => matchesPokemon(pokemon, query)), page, 6);
  const rows = chart ? analyzeTeam(team, chart) : [];
  const covered = rows.filter((row) => row.attackers.length > 0).length;
  const risks = rows.filter((row) => row.weak >= 2);
  const activeIndex = team.findIndex(({ id }) => id === activeId);
  const member = team[activeIndex];
  const weaknesses = rows.filter((row) => row.incoming[activeIndex] > 1);
  const hasDamagingMoves = team.some(({ moves }) => moves.some((move) => move && move.category !== 'status'));
  const full = team.length === 6;

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="device-panel overflow-hidden" aria-labelledby="party-heading">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/40 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-700 text-white"><CircleDot className="h-5 w-5" aria-hidden="true" /></span>
            <div><p className="device-label mb-1">Party registration</p><h2 id="party-heading" className="section-heading">Your party</h2></div>
          </div>
          <span className="rounded-lg border bg-background px-4 py-2 font-mono text-sm font-bold">{full ? <Check className="mr-1 inline h-4 w-4" aria-hidden="true" /> : null}{team.length} / 6 Pokémon</span>
        </div>
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:p-6 lg:grid-cols-6">
          {team.map((entry, index) => (
            <button key={entry.id} id={`party-${entry.id}`} type="button" aria-pressed={entry.id === activeId} aria-controls="teammate-editor" aria-label={`Edit ${label(entry.name)}, slot ${index + 1}`} disabled={busy} onClick={() => selectMember(entry.id)} className={cn('group relative min-w-0 overflow-hidden rounded-2xl border-2 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring disabled:opacity-60', entry.id === activeId ? 'border-primary bg-primary/5 ring-2 ring-primary/15' : 'border-border bg-muted/30 hover:border-primary/50')}>
              <span className="absolute left-2 top-2 z-20 rounded-md border bg-card/95 px-1.5 py-1 font-mono text-[10px] font-bold text-muted-foreground">0{index + 1}</span>
              {entry.id === activeId && <span className="absolute right-2 top-2 z-20 rounded-full bg-primary p-1 text-primary-foreground"><Check className="h-3 w-3" aria-hidden="true" /></span>}
              <TeamPokemonArtwork id={entry.id} name={entry.name} type={entry.types[0]} sizes="(max-width: 639px) 40vw, (max-width: 1023px) 27vw, 160px" />
              <div className="space-y-2 px-3 pb-3 pt-2"><p className="truncate font-bold">{label(entry.name)}</p><div className="flex flex-wrap gap-1">{entry.types.map((type) => <TypeBadge key={type} typeName={type} className="px-2 py-0.5 text-[10px]" />)}</div></div>
            </button>
          ))}
          {Array.from({ length: 6 - team.length }, (_, index) => (
            <button id={`party-empty-${index}`} key={`empty-${index}`} type="button" disabled={loading || !chart || busy} onClick={focusSearch} className="group flex min-h-44 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed bg-muted/20 p-4 text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring disabled:opacity-50 sm:min-h-48">
              <span className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 bg-card"><CircleDot className="h-10 w-10 opacity-35" strokeWidth={1} aria-hidden="true" /><Plus className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border bg-card p-1 text-primary" aria-hidden="true" /></span>
              <span className="text-sm font-semibold">Add Pokémon<span className="mt-1 block text-xs font-normal text-muted-foreground">Slot {team.length + index + 1}</span></span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t bg-muted/30 px-5 py-3 text-xs text-muted-foreground sm:px-7">
          <p>{full ? 'Team complete! Remove a teammate to make room for another.' : 'Six slots. Endless possibilities. Select a teammate to edit its moves.'}</p>
          <p>Team stays only while this page is open.</p>
        </div>
      </section>

      <div role="status" aria-live="polite" className="sr-only">{busy ? 'Loading selection…' : notice}</div>
      {error && <div role="alert" className="dialog-panel border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive"><p>{error}</p>{!chart && <Button variant="outline" className="mt-3 min-h-11" disabled={loading} onClick={() => { setError(''); setLoading(true); setAttempt((value) => value + 1); }}>Retry loading data</Button>}</div>}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <section className="device-panel min-w-0 p-5 sm:p-6" aria-labelledby="find-heading">
          <p className="eyebrow mb-2">01 / Scout</p>
          <h2 id="find-heading" className="section-heading">Find a teammate</h2>
          <p className="mt-2 text-sm text-muted-foreground">A familiar favorite or a new discovery?</p>
          <label className="mb-2 mt-5 block text-sm font-semibold" htmlFor="pokemon-search">Search Pokémon</label>
          <div className="relative"><Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" aria-hidden="true" /><input id="pokemon-search" ref={searchRef} type="search" className={`${control} pl-10`} value={query} placeholder="Name or Pokédex number" disabled={loading || !chart} onChange={(event) => { setQuery(event.target.value); setPage(1); }} /></div>
          {loading ? <div role="status" className="dialog-panel mt-5 flex min-h-48 items-center justify-center gap-2 p-4 text-sm text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />Loading your Pokédex…</div> : !chart ? <p className="py-10 text-center text-sm text-muted-foreground">Your Pokédex is offline. Retry loading data above.</p> : results.total === 0 ? <div className="dialog-panel mt-5 px-4 py-8 text-center"><Search className="mx-auto mb-3 h-7 w-7 text-muted-foreground" aria-hidden="true" /><h3 className="font-bold">No Pokémon found</h3><p className="mt-2 text-sm text-muted-foreground">Try a different name or an exact Pokédex number.</p><Button variant="outline" className="mt-4 min-h-11" onClick={() => { setQuery(''); setPage(1); focusSearch(); }}>Clear search</Button></div> : (
            <>
              <p role="status" className="my-4 text-xs text-muted-foreground">{results.total} Pokémon found · Showing {results.start + 1}–{results.start + results.items.length}</p>
              <ul className="grid grid-cols-2 gap-3">
                {results.items.map((pokemon) => {
                  const added = team.some(({ id }) => id === pokemon.id);
                  return <li key={pokemon.id} className="min-w-0 overflow-hidden rounded-2xl border bg-background transition-colors hover:border-primary/40">
                    <div className="relative"><TeamPokemonArtwork id={pokemon.id} name={pokemon.name} sizes="(max-width: 639px) 40vw, (max-width: 1023px) 42vw, 200px" /><span className="absolute left-3 top-2 font-mono text-[11px] text-muted-foreground">#{String(pokemon.id).padStart(4, '0')}</span></div>
                    <div className="space-y-3 p-3"><h3 className="truncate text-sm font-bold" title={label(pokemon.name)}>{label(pokemon.name)}</h3>
                      <Button variant={added || full ? 'outline' : 'default'} className={cn('min-h-11 w-full px-2 text-xs', !added && !full && redButton)} disabled={added || full || busy} aria-label={added ? `${label(pokemon.name)} is on your team` : `Add ${label(pokemon.name)} to team`} onClick={() => {
                        void updateTeam(async () => {
                          setAddingId(pokemon.id);
                          const nextMember = await loadTeamMember(String(pokemon.id));
                          setTeam(addTeamMember(team, nextMember));
                          setActiveId(nextMember.id);
                          setNotice(`${label(nextMember.name)} added to your team.`);
                          requestAnimationFrame(() => editorRef.current?.focus());
                        });
                      }}>{addingId === pokemon.id ? <><Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />Adding…</> : added ? <><Check className="h-4 w-4" aria-hidden="true" />On your team</> : full ? 'Team full' : <><Plus className="h-4 w-4" aria-hidden="true" />Add to team</>}</Button>
                    </div>
                  </li>;
                })}
              </ul>
              {results.totalPages > 1 && <nav aria-label="Pokémon results pages" className="mt-5 flex items-center justify-between gap-2"><Button variant="outline" size="icon" className="min-h-11 min-w-11" aria-label="Previous Pokémon results" disabled={results.page === 1} onClick={() => setPage(results.page - 1)}><ChevronLeft aria-hidden="true" /></Button><span className="text-xs text-muted-foreground">Page {results.page} of {results.totalPages}</span><Button variant="outline" size="icon" className="min-h-11 min-w-11" aria-label="Next Pokémon results" disabled={results.page === results.totalPages} onClick={() => setPage(results.page + 1)}><ChevronRight aria-hidden="true" /></Button></nav>}
            </>
          )}
        </section>

        <section id="teammate-editor" className="device-panel min-w-0 scroll-mt-6 p-5 sm:p-6" aria-labelledby="editor-heading">
          <p className="eyebrow mb-2">02 / Prepare</p>
          <h2 id="editor-heading" ref={editorRef} tabIndex={-1} className="section-heading rounded-sm">{member ? 'Make it battle-ready' : 'Your adventure starts here'}</h2>
          {member ? <>
            <div className="mt-5 grid items-center gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <div className="battle-stage mx-auto w-full max-w-64"><TeamPokemonArtwork id={member.id} name={member.name} type={member.types[0]} className="!bg-transparent" sizes="(max-width: 639px) 256px, 220px" /></div>
              <div className="min-w-0"><p className="eyebrow">Slot {activeIndex + 1} · #{String(member.id).padStart(4, '0')}</p><h3 className="mt-2 break-words text-2xl font-extrabold tracking-tight sm:text-3xl">{label(member.name)}</h3><div className="mt-3 flex flex-wrap gap-2">{member.types.map((type) => <TypeBadge key={type} typeName={type} />)}</div><Link href={`/pokemon/${member.name}`} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline">View Pokédex entry<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
            </div>
            <div className="mb-4 mt-6 flex flex-wrap items-center justify-between gap-2 border-t pt-5"><h3 className="font-bold">Moveset</h3><span className="text-xs text-muted-foreground">{member.moves.filter(Boolean).length} / 4 moves selected</span></div>
            <div className="grid gap-4 sm:grid-cols-2">{member.moves.map((move, slot) => <div key={`${member.id}-${slot}`} className="min-w-0 rounded-xl border-2 border-border bg-muted/20 p-3 shadow-[2px_2px_0_hsl(var(--border))]">
              <label className="block space-y-2 text-xs font-bold"><span className="device-label">Move / 0{slot + 1}</span><span className="sr-only"> for {label(member.name)}</span>
                <select className={`${control} font-normal`} value={move?.name ?? ''} disabled={busy} onChange={(event) => {
                  const name = event.target.value;
                  void updateTeam(async () => {
                    const nextMove = name ? await loadTeamMove(name) : null;
                    const updated = setTeamMove(member, slot, nextMove);
                    setTeam(team.map((entry) => entry.id === member.id ? updated : entry));
                    setNotice(`${label(member.name)} move ${slot + 1} updated.`);
                  });
                }}>
                  <option value="">No move selected</option>
                  {member.learnset.filter((name) => !member.moves.some((entry, other) => other !== slot && entry?.name === name)).map((name) => <option key={name} value={name}>{label(name)}</option>)}
                </select>
              </label>
              <p className="mt-2 min-h-8 text-xs text-muted-foreground">{move ? `${label(move.type)} · ${label(move.category)}${move.category === 'status' ? ' · Not counted as coverage' : ''}` : 'Pick a move from this Pokémon’s learnset.'}</p>
            </div>)}</div>
            {busy && !addingId && <p role="status" className="mt-3 text-sm text-muted-foreground">Updating moveset…</p>}
            <div className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4"><h3 className="mb-3 flex items-center gap-2 text-sm font-bold"><Shield className="h-4 w-4" aria-hidden="true" />Watch out for</h3><div className="flex flex-wrap gap-2">{weaknesses.length ? weaknesses.map((row) => <span key={row.type} className="inline-flex items-center gap-1.5 rounded-full border bg-card py-1 pl-1 pr-2 text-xs font-semibold"><TypeBadge typeName={row.type} className="text-[10px]" />{row.incoming[activeIndex]}×</span>) : <p className="text-sm text-muted-foreground">No type weaknesses.</p>}</div></div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t pt-4"><p className="text-xs text-muted-foreground">Changes update your team analysis below.</p><Button variant="ghost" className="min-h-11 text-destructive hover:text-destructive" disabled={busy} aria-label={`Remove ${label(member.name)} from team`} onClick={() => removeMember(member)}><Trash2 className="h-4 w-4" aria-hidden="true" />Remove</Button></div>
          </> : <div className="dialog-panel mt-6 flex flex-col items-center justify-center px-5 py-8 text-center"><div className="relative mb-5 flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed bg-muted/30"><CircleDot className="h-20 w-20 text-red-700/70 dark:text-red-400/70" strokeWidth={1} aria-hidden="true" /><span className="absolute bottom-0 right-0 flex h-11 w-11 items-center justify-center rounded-full bg-red-700 text-white"><Plus className="h-5 w-5" aria-hidden="true" /></span></div><h3 className="text-xl font-bold">Meet your first teammate.</h3><p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">Add a Pokémon to see its artwork, choose four moves, and discover its strengths and weaknesses.</p><Button className={cn('mt-6 min-h-11', redButton)} disabled={loading || !chart} onClick={focusSearch}>Find a Pokémon<ArrowRight className="h-4 w-4" aria-hidden="true" /></Button></div>}
        </section>
      </div>

      <section className="device-panel min-w-0 p-5 sm:p-7" aria-labelledby="analysis-heading">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="eyebrow mb-2">03 / Strategize</p><h2 id="analysis-heading" className="section-heading">Stronger together</h2><p className="mt-2 text-sm text-muted-foreground">A quick look at your team’s strengths and blind spots.</p></div><span className="device-label flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2"><span className="h-2 w-2 rounded-full bg-cyan-500" aria-hidden="true" />Live team analysis</span></div>
        {team.length > 0 && chart ? <>
          <div className="my-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-600/25 bg-emerald-500/5 p-5"><h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Swords className="h-4 w-4" aria-hidden="true" />Offensive coverage</h3><p className="text-4xl font-extrabold tracking-tight">{covered}<span className="ml-2 text-sm font-normal tracking-normal text-muted-foreground">/ 18 types</span></p><p className="mt-3 text-sm text-muted-foreground">{hasDamagingMoves ? 'Hit super effectively by your selected damaging moves.' : 'Choose damaging moves to see offensive coverage.'}</p><div className="mt-4 flex flex-wrap gap-1.5">{rows.filter((row) => row.attackers.length > 0).map((row) => <TypeBadge key={row.type} typeName={row.type} />)}</div></div>
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5"><h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Shield className="h-4 w-4" aria-hidden="true" />Shared weaknesses</h3><p className="text-4xl font-extrabold tracking-tight">{risks.length}<span className="ml-2 text-sm font-normal tracking-normal text-muted-foreground">types to watch</span></p><p className="mt-3 text-sm text-muted-foreground">{risks.length ? 'These types deal extra damage to two or more teammates.' : 'No attacking type threatens two or more teammates.'}</p><div className="mt-4 flex flex-wrap gap-2">{risks.map((row) => <span key={row.type} className="inline-flex items-center gap-2 rounded-full border bg-card py-1 pl-1 pr-3 text-xs"><TypeBadge typeName={row.type} />{row.weak} weak</span>)}</div></div>
          </div>
          <details className="group rounded-xl border"><summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-semibold">Full type breakdown · 18 types<ChevronRight className="h-4 w-4 shrink-0 transition-transform group-open:rotate-90" aria-hidden="true" /></summary><div className="border-t p-4"><p className="mb-4 text-sm leading-relaxed text-muted-foreground">Attack compares selected non-status moves against single-type opponents. Defense counts teammates taking 2× or 4× damage, resisting (½× or ¼×), or immune (0×). A switch-in is not guaranteed.</p><div className="overflow-x-auto rounded-lg focus-visible:outline-offset-[-2px]" tabIndex={0} role="region" aria-label="Scrollable type breakdown"><table className="w-full text-left text-sm"><caption className="sr-only">Offensive coverage and defensive weaknesses for all eighteen types</caption><thead><tr className="border-b text-xs text-muted-foreground"><th scope="col" className="py-3 pr-3">Type</th><th scope="col" className="p-3">Super-effective attackers</th><th scope="col" className="p-3">Weak</th><th scope="col" className="p-3">Resist</th><th scope="col" className="p-3">Immune</th></tr></thead><tbody>{rows.map((row) => <tr key={row.type} className="border-b last:border-0"><th scope="row" className="py-3 pr-3"><TypeBadge typeName={row.type} /></th><td className="p-3">{row.attackers.length ? row.attackers.map(label).join(', ') : <span className="text-muted-foreground">Not covered</span>}</td><td className={cn('p-3', row.weak >= 2 && 'font-bold text-destructive')}>{row.weak}</td><td className="p-3">{row.resistant - row.immune}</td><td className="p-3">{row.immune}</td></tr>)}</tbody></table></div></div></details>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Modern type chart only. Moves come from learnsets across all games, not a single-format legality check. Abilities, held items, alternate forms, move-specific effects, stats, STAB, and damage rolls are not included.</p>
        </> : <p className="dialog-panel mt-6 p-6 text-center text-sm leading-relaxed text-muted-foreground">Add your first Pokémon to reveal your team’s defensive matchups. Then choose moves to explore offensive coverage.</p>}
      </section>
    </div>
  );
}
