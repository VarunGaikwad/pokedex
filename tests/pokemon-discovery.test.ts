import test from "node:test";
import assert from "node:assert/strict";
import { getGenerationMembership, getInitialDiscovery, getPokemonCatalog, getPokemonDetails, getPokemonPageMetadata, getTypeMembership, getTypes } from "../src/lib/pokeapi";
import { ARTWORK_STYLES, DEFAULT_DISCOVERY, discoveryParams, displayPokemonName, filterCatalog, matchesPokemon, normalizePokemonSearch, paginate, parseDiscoveryParams, pokemonIdFromUrl, spriteUrl, type CatalogPokemon } from "../src/lib/pokemon-discovery";

const catalog: CatalogPokemon[] = [
  { id: 25, name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" },
  { id: 122, name: "mr-mime", url: "https://pokeapi.co/api/v2/pokemon/122/" },
  { id: 1, name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
  { id: 250, name: "ho-oh", url: "https://pokeapi.co/api/v2/pokemon/250/" },
];

test("search matches national-dex numbers exactly, with optional hash and padding", () => {
  for (const query of ["25", "#0025", " 0025 "]) assert.equal(matchesPokemon(catalog[0], query), true);
  assert.equal(matchesPokemon(catalog[3], "25"), false);
  assert.equal(matchesPokemon(catalog[0], "0"), false);
  assert.equal(matchesPokemon(catalog[0], "PIKA"), true);
  assert.equal(matchesPokemon(catalog[0], ""), true);
});

test("names normalize spaces, punctuation, hyphens, case and accents", () => {
  assert.equal(normalizePokemonSearch(" Flabébé "), "flabebe");
  for (const query of ["Mr Mime", "MR-MIME", "mr. mime", "mrmime"]) assert.equal(matchesPokemon(catalog[1], query), true);
  assert.equal(matchesPokemon(catalog[3], "ho oh"), true);
  assert.equal(displayPokemonName("mr-mime"), "Mr Mime");
});

test("search, type, and generation intersect rather than replacing each other", () => {
  const state = { ...DEFAULT_DISCOVERY, q: "i", type: "electric", generation: "1" };
  assert.deepEqual(filterCatalog(catalog, state, new Set([25, 122]), new Set([1, 25])).map((entry) => entry.id), [25]);
  assert.deepEqual(filterCatalog(catalog, { ...state, q: "ho" }, new Set([25, 122]), new Set([1, 25])), []);
  assert.deepEqual(filterCatalog(catalog, state), []);
});

test("sorts names and numbers without mutating the source index", () => {
  assert.deepEqual(filterCatalog(catalog, DEFAULT_DISCOVERY).map((entry) => entry.id), [1, 25, 122, 250]);
  assert.deepEqual(filterCatalog(catalog, { ...DEFAULT_DISCOVERY, sort: "number-desc" }).map((entry) => entry.id), [250, 122, 25, 1]);
  assert.deepEqual(filterCatalog(catalog, { ...DEFAULT_DISCOVERY, sort: "name" }).map((entry) => entry.id), [1, 250, 122, 25]);
  assert.deepEqual(filterCatalog(catalog, { ...DEFAULT_DISCOVERY, sort: "name-desc" }).map((entry) => entry.id), [25, 122, 250, 1]);
  assert.equal(catalog[0].id, 25);
});

test("pagination clamps invalid and out-of-range pages, including empty results", () => {
  assert.deepEqual(paginate(catalog, 2, 3), { items: [catalog[3]], page: 2, totalPages: 2, start: 3, total: 4 });
  assert.equal(paginate(catalog, 100, 3).page, 2);
  assert.equal(paginate(catalog, -5, 3).page, 1);
  assert.equal(paginate(catalog, NaN, 3).page, 1);
  assert.deepEqual(paginate([], 5), { items: [], page: 1, totalPages: 1, start: 0, total: 0 });
});

test("URL state round-trips every discovery control and omits defaults", () => {
  assert.equal(discoveryParams(DEFAULT_DISCOVERY), "");
  assert.deepEqual(parseDiscoveryParams(new URLSearchParams()), DEFAULT_DISCOVERY);
  const state = { ...DEFAULT_DISCOVERY, q: "mr mime", type: "psychic", generation: "1", page: 4, sort: "name-desc" as const, artwork: "Showdown Back" as const, shiny: true };
  assert.deepEqual(parseDiscoveryParams(new URLSearchParams(discoveryParams(state))), state);
});

test("URL parsing rejects unsupported types, artwork, sort and malformed pagination", () => {
  for (const type of ["stellar", "unknown", "shadow", "nope"]) assert.equal(parseDiscoveryParams(new URLSearchParams({ type })).type, "all");
  for (const page of ["-1", "0", "1.5", "Infinity", "NaN", "9007199254740992"]) assert.equal(parseDiscoveryParams(new URLSearchParams({ page })).page, 1);
  const parsed = parseDiscoveryParams(new URLSearchParams("generation=banana&sort=oops&artwork=oops&shiny=no"));
  assert.deepEqual(parsed, DEFAULT_DISCOVERY);
});

test("server query records match browser parsing, including repeated and missing values", () => {
  const query = { q: ["mr mime", "pikachu"], type: "psychic", generation: "1", page: "999", sort: "name-desc", artwork: "Home", shiny: "true", unused: undefined };
  assert.deepEqual(parseDiscoveryParams(query), parseDiscoveryParams(new URLSearchParams("q=mr+mime&q=pikachu&type=psychic&generation=1&page=999&sort=name-desc&artwork=Home&shiny=true")));
  assert.deepEqual(parseDiscoveryParams({ q: [], page: "nope", type: "unknown" }), DEFAULT_DISCOVERY);
});

test("base-pokemon URLs use stable numeric IDs and all previous artwork variants remain available", () => {
  assert.equal(pokemonIdFromUrl("https://pokeapi.co/api/v2/pokemon-species/386/"), 386);
  assert.equal(pokemonIdFromUrl("https://pokeapi.co/api/v2/pokemon/386"), 386);
  assert.equal(pokemonIdFromUrl("broken"), 0);
  for (const style of ARTWORK_STYLES) {
    assert.match(spriteUrl(25, style, false), /\/25\.(png|gif|svg)$/);
    assert.match(spriteUrl(25, style, true), /\/25\.(png|gif|svg)$/);
    if (style !== "Dream World") assert.notEqual(spriteUrl(25, style, true), spriteUrl(25, style, false));
  }
  assert.match(spriteUrl(386, "Official Artwork", false), /official-artwork\/386\.png$/);
});

test("catalog caches one species index and constructs canonical default-pokemon URLs", async () => {
  const originalFetch = globalThis.fetch;
  const requests: string[] = [];
  globalThis.fetch = async (input) => {
    requests.push(String(input));
    return Response.json({ results: [{ name: "deoxys", url: "https://pokeapi.co/api/v2/pokemon-species/386/" }] });
  };
  try {
    const [first, second] = await Promise.all([getPokemonCatalog(), getPokemonCatalog()]);
    assert.deepEqual(first, [{ id: 386, name: "deoxys", url: "https://pokeapi.co/api/v2/pokemon/386/" }]);
    assert.strictEqual(first, second);
    assert.equal(requests.length, 1);
    assert.match(requests[0], /pokemon-species\?limit=/);
  } finally { globalThis.fetch = originalFetch; }
});

test("initial discovery gracefully falls back, uses cached lightweight indexes, and serializes only requested memberships", async () => {
  const originalFetch = globalThis.fetch;
  const requests: string[] = [];
  let generationAttempts = 0;
  globalThis.fetch = async (input) => {
    const url = String(input);
    requests.push(url);
    if (url.includes("/generation?")) {
      if (++generationAttempts === 1) return new Response(null, { status: 503 });
      return Response.json({ results: [{ name: "generation-ii", url: "https://pokeapi.co/api/v2/generation/2/" }] });
    }
    if (url.endsWith("/type/water")) return Response.json({ pokemon: [{ pokemon: { name: "deoxys", url: "https://pokeapi.co/api/v2/pokemon/386/" } }] });
    if (url.endsWith("/generation/2")) return Response.json({ pokemon_species: [{ name: "deoxys", url: "https://pokeapi.co/api/v2/pokemon-species/386/" }] });
    throw new Error(`Unexpected request: ${url}`);
  };
  const state = parseDiscoveryParams({ q: "deoxys", type: "water", generation: "2", page: "999", artwork: "Home", shiny: "1", sort: "name-desc" });
  try {
    const fallback = await getInitialDiscovery(DEFAULT_DISCOVERY);
    assert.deepEqual(fallback, { state: DEFAULT_DISCOVERY, catalog: null, generations: [], membership: null });
    const defaults = await getInitialDiscovery(DEFAULT_DISCOVERY);
    assert.deepEqual(defaults.membership, { key: "all:all" });
    assert.equal(defaults.catalog?.[0].id, 386);
    assert.equal(requests.length, 2); // Catalog already cached; no default membership or metadata work.
    const initial = await getInitialDiscovery(state);
    assert.deepEqual(initial.membership, { key: "water:2", typeIds: [386], generationIds: [386] });
    assert.deepEqual(JSON.parse(JSON.stringify(initial)), initial);
    assert.deepEqual(initial.state, state);
    assert.equal(initial.state.page, 999);
    const filtered = filterCatalog(initial.catalog!, state, new Set(initial.membership!.typeIds), new Set(initial.membership!.generationIds));
    assert.equal(paginate(filtered, state.page).page, 1);
    assert.deepEqual(filtered.map((entry) => entry.id), [386]);
    assert.equal("types" in initial.catalog![0], false);
    await getInitialDiscovery(state);
    assert.equal(requests.length, 4);
  } finally { globalThis.fetch = originalFetch; }
});

test("membership failures are evicted, generation uses species IDs, and only standard types are offered", async () => {
  const originalFetch = globalThis.fetch;
  let typeAttempts = 0;
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.endsWith("/type/fire")) {
      if (++typeAttempts === 1) return new Response(null, { status: 503 });
      return Response.json({ pokemon: [{ pokemon: { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" } }] });
    }
    if (url.includes("/generation/")) return Response.json({ pokemon_species: [{ name: "deoxys", url: "https://pokeapi.co/api/v2/pokemon-species/386/" }] });
    return Response.json({ results: ["fire", "stellar", "unknown", "shadow"].map((name) => ({ name, url: `https://pokeapi.co/api/v2/type/${name}` })) });
  };
  try {
    await assert.rejects(getTypeMembership("fire"), /503/);
    assert.deepEqual([...await getTypeMembership("fire")], [4]);
    assert.equal(typeAttempts, 2);
    assert.deepEqual([...await getGenerationMembership("3")], [386]);
    assert.deepEqual((await getTypes()).map((type) => type.name), ["fire"]);
  } finally { globalThis.fetch = originalFetch; }
});

test("page metadata is globally concurrency-bounded, caches visits, and skips aborted pages", async () => {
  const originalFetch = globalThis.fetch;
  let active = 0;
  let peak = 0;
  const requested: string[] = [];
  globalThis.fetch = async (input) => {
    requested.push(String(input));
    active++;
    peak = Math.max(peak, active);
    await new Promise((resolve) => setTimeout(resolve, 2));
    active--;
    return Response.json({ types: [{ slot: 2, type: { name: "poison" } }, { slot: 1, type: { name: "grass" } }] });
  };
  const entries = Array.from({ length: 12 }, (_, index) => ({ id: 700 + index, name: `entry-${index}`, url: `https://pokeapi.co/api/v2/pokemon/${700 + index}/` }));
  try {
    const [first] = await Promise.all([getPokemonPageMetadata(entries.slice(0, 6)), getPokemonPageMetadata(entries.slice(6))]);
    assert.equal(peak, 4);
    assert.equal(requested.length, 12);
    assert.deepEqual(first[0].types, ["grass", "poison"]);
    await getPokemonPageMetadata(entries);
    assert.equal(requested.length, 12);
    const controller = new AbortController();
    controller.abort();
    await assert.rejects(getPokemonPageMetadata([{ id: 9999, name: "unused", url: "unused" }], controller.signal), { name: "AbortError" });
    assert.equal(requested.length, 12);
    const blockers = entries.slice(0, 4).map((entry) => ({ ...entry, id: entry.id + 100, url: `${entry.url}blocker` }));
    const staleEntries = entries.slice(0, 4).map((entry) => ({ ...entry, id: entry.id + 200, url: `${entry.url}stale` }));
    const occupied = getPokemonPageMetadata(blockers);
    const staleController = new AbortController();
    const rejected = assert.rejects(getPokemonPageMetadata(staleEntries, staleController.signal), { name: "AbortError" });
    staleController.abort();
    await Promise.all([occupied, rejected]);
    assert.equal(requested.length, 16);
    assert.equal(requested.some((url) => url.endsWith("stale")), false);
  } finally { globalThis.fetch = originalFetch; }
});

test("details distinguish not-found from service or species failures and retain form-name routes", async () => {
  const originalFetch = globalThis.fetch;
  const requests: string[] = [];
  globalThis.fetch = async (input) => {
    const url = String(input);
    requests.push(url);
    if (url.endsWith("/pokemon/missing")) return new Response(null, { status: 404 });
    if (url.endsWith("/pokemon/unavailable")) return new Response(null, { status: 503 });
    if (url.endsWith("/pokemon/deoxys-normal")) return Response.json({ name: "deoxys-normal", species: { url: "https://pokeapi.co/api/v2/pokemon-species/386/" } });
    return new Response(null, { status: 502 });
  };
  try {
    assert.equal(await getPokemonDetails("missing"), null);
    await assert.rejects(getPokemonDetails("unavailable"), /503/);
    await assert.rejects(getPokemonDetails("Deoxys-Normal"), /species.*502/);
    assert.ok(requests.some((url) => url.endsWith("/pokemon/deoxys-normal")));
  } finally { globalThis.fetch = originalFetch; }
});
