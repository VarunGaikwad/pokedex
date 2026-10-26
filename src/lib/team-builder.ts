import { z } from 'zod';
import { getMoveDetails, getPokemonDetails, getTypeData } from './pokeapi';
import { STANDARD_TYPES } from './pokemon-discovery';

const typeName = z.enum(STANDARD_TYPES);
const resource = z.object({ name: typeName });
const relationsSchema = z.object({
  double_damage_from: z.array(resource),
  half_damage_from: z.array(resource),
  no_damage_from: z.array(resource),
});
export type TypeChart = Record<string, z.infer<typeof relationsSchema>>;
export interface TeamMove { name: string; type: string; category: string }
export interface TeamMember {
  id: number;
  name: string;
  types: string[];
  learnset: string[];
  moves: (TeamMove | null)[];
}

export async function loadTypeChart(): Promise<TypeChart> {
  const entries = await Promise.all(STANDARD_TYPES.map(async (type) => [type, relationsSchema.parse(await getTypeData(type))] as const));
  return Object.fromEntries(entries);
}

const pokemonSchema = z.object({
  id: z.number().int().positive(), name: z.string(),
  types: z.array(z.object({ type: resource })).min(1).max(2),
  moves: z.array(z.object({ move: z.object({ name: z.string() }) })),
});
export async function loadTeamMember(name: string): Promise<TeamMember> {
  const data = pokemonSchema.parse(await getPokemonDetails(name));
  return {
    id: data.id, name: data.name, types: data.types.map(({ type }) => type.name),
    learnset: [...new Set(data.moves.map(({ move }) => move.name))].sort(),
    moves: [null, null, null, null],
  };
}

export async function loadTeamMove(name: string): Promise<TeamMove> {
  if (!/^[a-z0-9-]+$/.test(name)) throw new Error('Invalid move name');
  const data = z.object({ type: resource, damage_class: z.object({ name: z.enum(['physical', 'special', 'status']) }) })
    .parse(await getMoveDetails(`https://pokeapi.co/api/v2/move/${name}/`));
  return { name, type: data.type.name, category: data.damage_class.name };
}

export function addTeamMember(team: TeamMember[], member: TeamMember): TeamMember[] {
  if (team.length >= 6) throw new Error('Your team already has six Pokémon. Remove one first.');
  if (team.some(({ id }) => id === member.id)) throw new Error('That Pokémon is already on your team.');
  return [...team, member];
}

export function setTeamMove(member: TeamMember, slot: number, move: TeamMove | null): TeamMember {
  if (!Number.isInteger(slot) || slot < 0 || slot >= 4) throw new Error('Invalid move slot');
  if (move && (!member.learnset.includes(move.name) || member.moves.some((entry, index) => index !== slot && entry?.name === move.name))) {
    throw new Error('Choose a learnable move that is not already selected.');
  }
  return { ...member, moves: member.moves.map((entry, index) => index === slot ? move : entry) };
}

export function damageMultiplier(attack: string, defense: string[], chart: TypeChart): number {
  return defense.reduce((multiplier, type) => {
    const relation = chart[type];
    if (!relation) throw new Error(`Missing type data: ${type}`);
    if (relation.no_damage_from.some(({ name }) => name === attack)) return 0;
    if (relation.double_damage_from.some(({ name }) => name === attack)) return multiplier * 2;
    if (relation.half_damage_from.some(({ name }) => name === attack)) return multiplier * 0.5;
    return multiplier;
  }, 1);
}

export function analyzeTeam(team: TeamMember[], chart: TypeChart) {
  return STANDARD_TYPES.map((type) => {
    const incoming = team.map((member) => damageMultiplier(type, member.types, chart));
    const attackers = team.filter((member) => member.moves.some((move) => move && move.category !== 'status' && damageMultiplier(move.type, [type], chart) > 1));
    return {
      type, incoming,
      weak: incoming.filter((value) => value > 1).length,
      resistant: incoming.filter((value) => value < 1).length,
      immune: incoming.filter((value) => value === 0).length,
      attackers: attackers.map(({ name }) => name),
    };
  });
}
