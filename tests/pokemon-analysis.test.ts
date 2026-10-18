import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateWeaknesses,
  categorizeMoves,
  CalculateWeaknessesInputSchema,
  CategorizeMovesInputSchema,
  CategorizeMovesOutputSchema,
  type CategorizeMovesInput,
} from '../src/lib/pokemon-analysis';

const resource = (name: string) => ({ name, url: `https://pokeapi.co/api/v2/version-group/${name}/` });
function move(name: string, versions: [string, string, number][]): CategorizeMovesInput['moves'][number] {
  return {
    move: { name, url: `https://pokeapi.co/api/v2/move/${name}/` },
    version_group_details: versions.map(([version, method, level]) => ({
      version_group: resource(version),
      move_learn_method: resource(method),
      level_learned_at: level,
    })),
  };
}
const moveDetails = { type: { name: 'normal' }, damage_class: { name: 'physical' }, power: 40, accuracy: 100 };
const relations = (double: string[], half: string[], immune: string[] = []) => ({
  damage_relations: {
    double_damage_from: double.map((name) => ({ name })),
    half_damage_from: half.map((name) => ({ name })),
    no_damage_from: immune.map((name) => ({ name })),
  },
});

test('analysis imports no Genkit or Google AI runtime', () => {
  assert.equal(Object.keys(require.cache).some((path) => /node_modules\/(genkit|@genkit-ai)\//.test(path)), false);
});

test('Charizard has 4x rock, 2x water/electric and ground immunity; ice cancels to neutral', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    if (String(input).endsWith('/fire')) return Response.json(relations(['water', 'ground', 'rock'], ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy']));
    assert.ok(String(input).endsWith('/flying'));
    return Response.json(relations(['electric', 'ice', 'rock'], ['grass', 'fighting', 'bug'], ['ground']));
  };
  try {
    assert.deepEqual(await calculateWeaknesses({ types: ['fire', 'flying'] }), {
      weaknesses4x: ['rock'], weaknesses2x: ['water', 'electric'], immunities: ['ground'],
    });
    assert.deepEqual(await calculateWeaknesses({ types: ['flying', 'fire'] }), {
      weaknesses4x: ['rock'], weaknesses2x: ['water', 'electric'], immunities: ['ground'],
    });
  } finally { globalThis.fetch = originalFetch; }
});

test('water/ground multiplies grass to 4x, cancels water/ice to neutral and electric to immune', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => Response.json(String(input).endsWith('/water')
    ? relations(['electric', 'grass'], ['fire', 'water', 'ice', 'steel'])
    : relations(['water', 'grass', 'ice'], ['poison', 'rock'], ['electric']));
  try {
    assert.deepEqual(await calculateWeaknesses({ types: ['water', 'ground'] }), {
      weaknesses4x: ['grass'], weaknesses2x: [], immunities: ['electric'],
    });
    assert.deepEqual(await calculateWeaknesses({ types: [] }), { weaknesses4x: [], weaknesses2x: [], immunities: [] });
  } finally { globalThis.fetch = originalFetch; }
});

test('type request failures propagate rather than inventing a chart', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(null, { status: 503 });
  try { await assert.rejects(calculateWeaknesses({ types: ['fire'] }), /Failed to fetch type data/); }
  finally { globalThis.fetch = originalFetch; }
});

test('boundary schemas reject malformed types, move metadata and non-PokéAPI fetch URLs', () => {
  for (const input of [null, {}, { types: 'fire' }, { types: ['unknown'] }, { types: ['fire', 'fire'] }, { types: ['fire', 'water', 'grass'] }]) {
    assert.equal(CalculateWeaknessesInputSchema.safeParse(input).success, false);
  }
  assert.equal(CalculateWeaknessesInputSchema.safeParse({ types: ['fire', 'flying'] }).success, true);
  const valid = { pokemonName: 'charizard', moves: [move('schema-valid', [['scarlet-violet', 'level-up', 0]])] };
  assert.equal(CategorizeMovesInputSchema.safeParse(valid).success, true);
  for (const input of [null, {}, { ...valid, pokemonName: '' }, { ...valid, moves: 'bad' },
    { ...valid, moves: [{ ...valid.moves[0], version_group_details: [{ level_learned_at: -1 }] }] },
    { ...valid, moves: [{ ...valid.moves[0], move: { name: 'bad', url: 'not-a-url' } }] },
    { ...valid, moves: [{ ...valid.moves[0], move: { name: 'bad', url: 'https://example.com/api/v2/move/1/' } }] },
  ]) assert.equal(CategorizeMovesInputSchema.safeParse(input).success, false);
});

test('Scarlet/Violet is selected once for the Pokémon, retaining level 0 and excluding old-game methods/moves', async () => {
  const originalFetch = globalThis.fetch;
  const requests: string[] = [];
  globalThis.fetch = async (input) => { requests.push(String(input)); return Response.json(moveDetails); };
  const input: CategorizeMovesInput = {
    pokemonName: 'charizard',
    moves: [
      move('version-zeta', [['sword-shield', 'level-up', 30], ['scarlet-violet', 'level-up', 0], ['sword-shield', 'tutor', 0]]),
      move('version-alpha', [['scarlet-violet', 'level-up', 10], ['scarlet-violet', 'level-up', 0], ['scarlet-violet', 'egg', 0]]),
      move('version-later', [['scarlet-violet', 'level-up', 10], ['scarlet-violet', 'machine', 0], ['scarlet-violet', 'tm', 0]]),
      move('version-tutor', [['scarlet-violet', 'tutor', 0]]),
      move('version-old-only', [['sword-shield', 'machine', 0]]),
      move('version-new-only', [['the-indigo-disk', 'machine', 0]]),
      move('version-unsupported', [['scarlet-violet', 'form-change', 0]]),
    ],
  };
  try {
    const result = await categorizeMoves(CategorizeMovesInputSchema.parse(input));
    assert.deepEqual(result['level-up']?.map(({ name, level }) => [name, level]), [['version-alpha', 0], ['version-zeta', 0], ['version-later', 10]]);
    assert.deepEqual(result.egg?.map(({ name }) => name), ['version-alpha']);
    assert.deepEqual(result.machine?.map(({ name }) => name), ['version-later']);
    assert.deepEqual(result.tutor?.map(({ name }) => name), ['version-tutor']);
    assert.deepEqual(result['level-up']?.[0], { name: 'version-alpha', level: 0, type: 'normal', category: 'physical', power: 40, accuracy: 100 });
    assert.equal(CategorizeMovesOutputSchema.safeParse(result).success, true);
    assert.equal(requests.length, 4);
    assert.equal(requests.some((url) => /old-only|new-only|unsupported/.test(url)), false);
  } finally { globalThis.fetch = originalFetch; }
});

test('without Scarlet/Violet, all moves use the latest applicable official version, not a per-move fallback', async () => {
  const originalFetch = globalThis.fetch;
  const requests: string[] = [];
  globalThis.fetch = async (input) => { requests.push(String(input)); return Response.json(moveDetails); };
  try {
    const result = await categorizeMoves({ pokemonName: 'legacy', moves: [
      move('fallback-sword', [['sword-shield', 'machine', 0]]),
      move('fallback-bdsp', [['brilliant-diamond-shining-pearl', 'machine', 0]]),
      move('fallback-latest', [['sword-shield', 'machine', 0], ['legends-arceus', 'level-up', 5]]),
    ] });
    assert.deepEqual(result['level-up']?.map(({ name, level }) => [name, level]), [['fallback-latest', 5]]);
    assert.equal(result.machine, undefined);
    assert.equal(requests.length, 1);
    const emerald = await categorizeMoves({ pokemonName: 'older', moves: [
      move('fallback-firered', [['firered-leafgreen', 'machine', 0]]),
      move('fallback-emerald', [['emerald', 'tutor', 0]]),
    ] });
    assert.deepEqual(emerald.tutor?.map(({ name }) => name), ['fallback-emerald']);
    assert.equal(emerald.machine, undefined);
    assert.equal(requests.length, 2);
    assert.deepEqual(await categorizeMoves({ pokemonName: 'empty', moves: [] }), {});
    assert.equal(requests.length, 2);
  } finally { globalThis.fetch = originalFetch; }
});

test('failed/malformed move lookups are skipped and evicted for retry', async (t) => {
  const originalFetch = globalThis.fetch;
  t.mock.method(console, 'warn', () => {});
  t.mock.method(console, 'error', () => {});
  const requests = new Map<string, number>();
  globalThis.fetch = async (input) => {
    const url = String(input);
    requests.set(url, (requests.get(url) ?? 0) + 1);
    if (requests.get(url)! > 1) return Response.json(moveDetails);
    if (url.includes('failure-http')) return new Response(null, { status: 503 });
    if (url.includes('failure-network')) throw new Error('offline');
    if (url.includes('failure-json')) return new Response('not-json');
    if (url.includes('failure-shape')) return Response.json({});
    return Response.json({ ...moveDetails, power: null, accuracy: null });
  };
  const input = { pokemonName: 'failures', moves: ['failure-http', 'failure-network', 'failure-json', 'failure-shape', 'failure-good'].map((name) => move(name, [['scarlet-violet', 'machine', 0]])) };
  try {
    const first = await categorizeMoves(input);
    assert.deepEqual(first.machine?.map(({ name }) => name), ['failure-good']);
    assert.equal(first.machine?.[0].power, null);
    assert.equal(first.machine?.[0].accuracy, null);
    const second = await categorizeMoves(input);
    assert.equal(second.machine?.length, 5);
    for (const [url, count] of requests) assert.equal(count, url.includes('failure-good') ? 1 : 2);
  } finally { globalThis.fetch = originalFetch; }
});

test('move requests are globally bounded, deduplicated and cached; irrelevant game moves are never fetched', async () => {
  const originalFetch = globalThis.fetch;
  let active = 0;
  let peak = 0;
  const requests: string[] = [];
  globalThis.fetch = async (input) => {
    requests.push(String(input));
    active++;
    peak = Math.max(peak, active);
    await new Promise((resolve) => setTimeout(resolve, 2));
    active--;
    return Response.json(moveDetails);
  };
  const selected = Array.from({ length: 20 }, (_, index) => move(`bounded-${index}`, [['scarlet-violet', 'machine', 0]]));
  const irrelevant = Array.from({ length: 100 }, (_, index) => move(`irrelevant-${index}`, [['sword-shield', 'machine', 0]]));
  const first = { pokemonName: 'first', moves: [...selected.slice(0, 10), ...irrelevant] };
  const second = { pokemonName: 'second', moves: selected.slice(8) };
  try {
    const [a, b] = await Promise.all([categorizeMoves(first), categorizeMoves(second)]);
    assert.equal(a.machine?.length, 10);
    assert.equal(b.machine?.length, 12);
    assert.equal(peak, 5);
    assert.equal(requests.length, 20);
    assert.equal(requests.some((url) => url.includes('irrelevant')), false);
    await categorizeMoves(first);
    await categorizeMoves(second);
    assert.equal(requests.length, 20);
  } finally { globalThis.fetch = originalFetch; }
});
