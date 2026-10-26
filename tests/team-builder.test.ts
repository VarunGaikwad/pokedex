import test from 'node:test';
import assert from 'node:assert/strict';
import { STANDARD_TYPES } from '../src/lib/pokemon-discovery';
import { addTeamMember, analyzeTeam, damageMultiplier, loadTeamMember, loadTeamMove, loadTypeChart, setTeamMove, type TeamMember, type TypeChart } from '../src/lib/team-builder';

type PokemonType = typeof STANDARD_TYPES[number];
const relation = (double: PokemonType[] = [], half: PokemonType[] = [], immune: PokemonType[] = []) => ({
  double_damage_from: double.map((name) => ({ name })),
  half_damage_from: half.map((name) => ({ name })),
  no_damage_from: immune.map((name) => ({ name })),
});
const chart = Object.fromEntries(STANDARD_TYPES.map((type) => [type, relation()])) as TypeChart;
chart.fire = relation(['water', 'ground', 'rock'], ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy']);
chart.flying = relation(['electric', 'ice', 'rock'], ['grass', 'fighting', 'bug'], ['ground']);
chart.grass = relation(['fire', 'ice', 'poison', 'flying', 'bug']);
chart.normal = relation(['fighting'], [], ['ghost']);
const member = (id = 6): TeamMember => ({ id, name: 'charizard', types: ['fire', 'flying'], learnset: ['flamethrower', 'growl', 'ember'], moves: [null, null, null, null] });
const flame = { name: 'flamethrower', type: 'fire', category: 'special' };

test('dual types multiply weaknesses/resistances, cancel neutral and preserve immunity', () => {
  const types = member().types;
  assert.equal(damageMultiplier('rock', types, chart), 4);
  assert.equal(damageMultiplier('grass', types, chart), 0.25);
  assert.equal(damageMultiplier('ice', types, chart), 1);
  assert.equal(damageMultiplier('ground', types, chart), 0);
  assert.equal(damageMultiplier('ground', [...types].reverse(), chart), 0);
  assert.equal(damageMultiplier('ghost', ['normal'], chart), 0);
});

test('team defense counts shared weaknesses, resistances and immunities; offense counts each member once', () => {
  let first = setTeamMove(member(), 0, flame);
  first = setTeamMove(first, 1, { ...flame, name: 'ember' });
  const second = { ...member(18), name: 'pidgeot', types: ['normal', 'flying'] };
  const rows = analyzeTeam([first, second], chart);
  assert.deepEqual(rows.find(({ type }) => type === 'rock')?.incoming, [4, 2]);
  assert.equal(rows.find(({ type }) => type === 'rock')?.weak, 2);
  assert.equal(rows.find(({ type }) => type === 'ground')?.immune, 2);
  assert.equal(rows.find(({ type }) => type === 'grass')?.resistant, 2);
  assert.deepEqual(rows.find(({ type }) => type === 'grass')?.attackers, ['charizard']);
  const status = setTeamMove(member(), 0, { name: 'growl', type: 'fire', category: 'status' });
  assert.ok(analyzeTeam([status], chart).every(({ attackers }) => attackers.length === 0));
  assert.ok(analyzeTeam([], chart).every(({ weak, attackers }) => weak === 0 && attackers.length === 0));
  assert.equal(analyzeTeam([setTeamMove(first, 0, null)], chart).find(({ type }) => type === 'grass')?.attackers.length, 1);
  assert.equal(analyzeTeam([member()], chart).find(({ type }) => type === 'grass')?.attackers.length, 0);
});

test('team and moves enforce capacity, uniqueness and learnability without mutating input', () => {
  const original = member();
  const team = addTeamMember([], original);
  assert.throws(() => addTeamMember(team, original), /already/);
  assert.throws(() => addTeamMember(Array.from({ length: 6 }, (_, i) => member(i)), member(7)), /six/);
  const updated = setTeamMove(original, 3, flame);
  assert.equal(original.moves[3], null);
  assert.equal(updated.moves[3]?.name, flame.name);
  assert.throws(() => setTeamMove(updated, 0, flame), /already/);
  assert.throws(() => setTeamMove(original, 0, { ...flame, name: 'unknown' }), /learnable/);
  for (const slot of [-1, 4, 0.5]) assert.throws(() => setTeamMove(original, slot, flame), /slot/);
  assert.equal(setTeamMove(updated, 3, null).moves[3], null);
});

test('loaders validate Pokémon, move and complete type data and surface failures for retry', async (t) => {
  t.mock.method(console, 'warn', () => {});
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.includes('/type/')) return Response.json(relationPayload());
    if (url.includes('/move/')) return Response.json({ type: { name: 'fire' }, damage_class: { name: 'special' } });
    if (url.includes('/pokemon/')) return Response.json({ id: 6, name: 'charizard', types: [{ type: { name: 'fire' } }], moves: [{ move: { name: 'ember' } }], species: { url: 'https://pokeapi.co/api/v2/pokemon-species/6/' } });
    return Response.json({});
  };
  function relationPayload() { return { damage_relations: relation() }; }
  try {
    assert.equal(Object.keys(await loadTypeChart()).length, 18);
    assert.deepEqual((await loadTeamMember('charizard')).learnset, ['ember']);
    assert.deepEqual(await loadTeamMove('flamethrower'), flame);
    await assert.rejects(loadTeamMove('../bad'), /Invalid/);
    globalThis.fetch = async () => new Response(null, { status: 503 });
    await assert.rejects(loadTypeChart());
    await assert.rejects(loadTeamMember('charizard'));
    await assert.rejects(loadTeamMove('flamethrower'));
    globalThis.fetch = async () => Response.json({});
    await assert.rejects(loadTypeChart());
    await assert.rejects(loadTeamMember('charizard'));
    await assert.rejects(loadTeamMove('flamethrower'));
  } finally { globalThis.fetch = originalFetch; }
});
