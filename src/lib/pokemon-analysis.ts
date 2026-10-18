import { z } from 'zod';
import { getMoveDetails, getTypeData } from './pokeapi';

const ALL_TYPES = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];

export const CalculateWeaknessesInputSchema = z.object({
  types: z.array(z.string().refine((type) => ALL_TYPES.includes(type), 'Unknown Pokémon type')).max(2)
    .refine((types) => new Set(types).size === types.length, 'Types must be unique')
    .describe("An array of the Pokémon's type names."),
});
export type CalculateWeaknessesInput = z.infer<typeof CalculateWeaknessesInputSchema>;

export const CalculateWeaknessesOutputSchema = z.object({
  weaknesses4x: z.array(z.string()).describe('Types that deal 4x damage.'),
  weaknesses2x: z.array(z.string()).describe('Types that deal 2x damage.'),
  immunities: z.array(z.string()).describe('Types that deal 0x damage.'),
}).describe("A Pokémon's type weaknesses and immunities.");
export type CalculateWeaknessesOutput = z.infer<typeof CalculateWeaknessesOutputSchema>;

const MoveVersionGroupDetailSchema = z.object({
  level_learned_at: z.number().int().nonnegative(),
  move_learn_method: z.object({ name: z.string().min(1), url: z.string() }),
  version_group: z.object({ name: z.string().min(1), url: z.string() }),
});

const MoveSchema = z.object({
  move: z.object({
    name: z.string().min(1),
    // Only this metadata URL is fetched by the server action.
    url: z.string().url().refine((value) => /^https:\/\/pokeapi\.co\/api\/v2\/move\/[a-z0-9-]+\/?$/.test(value), 'Expected a PokéAPI move URL'),
  }),
  version_group_details: z.array(MoveVersionGroupDetailSchema),
});

export const CategorizeMovesInputSchema = z.object({
  pokemonName: z.string().trim().min(1).describe('The name of the Pokémon.'),
  moves: z.array(MoveSchema).describe('The list of move objects for the Pokémon from PokeAPI.'),
});
export type CategorizeMovesInput = z.infer<typeof CategorizeMovesInputSchema>;

export const MoveDetailSchema = z.object({
  name: z.string(),
  level: z.number().optional(),
  type: z.string(),
  category: z.string().describe('e.g., physical, special, status'),
  power: z.number().nullable(),
  accuracy: z.number().nullable(),
});

export const CategorizeMovesOutputSchema = z.object({
  'level-up': z.array(MoveDetailSchema).describe('Moves learned by leveling up.').optional(),
  egg: z.array(MoveDetailSchema).describe('Moves learned by breeding.').optional(),
  machine: z.array(MoveDetailSchema).describe('Moves learned by machine (TM/TR).').optional(),
  tutor: z.array(MoveDetailSchema).describe('Moves learned from a move tutor.').optional(),
}).describe('A map of move learning methods to the moves learned by that method, with full details.');
export type CategorizeMovesOutput = z.infer<typeof CategorizeMovesOutputSchema>;

export async function calculateWeaknesses({ types }: CalculateWeaknessesInput): Promise<CalculateWeaknessesOutput> {
  const damageRelations = await Promise.all(types.map(getTypeData));
  const multipliers: Record<string, number> = Object.fromEntries(ALL_TYPES.map((type) => [type, 1]));
  for (const relation of damageRelations) {
    relation.double_damage_from.forEach((type: { name: string }) => { multipliers[type.name] *= 2; });
    relation.half_damage_from.forEach((type: { name: string }) => { multipliers[type.name] *= 0.5; });
    relation.no_damage_from.forEach((type: { name: string }) => { multipliers[type.name] *= 0; });
  }
  return {
    weaknesses4x: ALL_TYPES.filter((type) => multipliers[type] === 4),
    weaknesses2x: ALL_TYPES.filter((type) => multipliers[type] === 2),
    immunities: ALL_TYPES.filter((type) => multipliers[type] === 0),
  };
}

// PokéAPI version-group order, not alphabetical order or per-move fallbacks.
const VERSION_GROUPS = [
  'red-blue', 'yellow', 'gold-silver', 'crystal', 'ruby-sapphire', 'firered-leafgreen',
  'emerald', 'colosseum', 'xd', 'diamond-pearl', 'platinum', 'heartgold-soulsilver',
  'black-white', 'black-2-white-2', 'x-y', 'omega-ruby-alpha-sapphire', 'sun-moon',
  'ultra-sun-ultra-moon', 'lets-go-pikachu-lets-go-eevee', 'sword-shield',
  'the-isle-of-armor', 'the-crown-tundra', 'brilliant-diamond-shining-pearl',
  'legends-arceus', 'scarlet-violet', 'the-teal-mask', 'the-indigo-disk', 'legends-za', 'mega-dimension',
];
const METHODS = ['level-up', 'egg', 'machine', 'tutor'] as const;
type Method = typeof METHODS[number];
const moveMethod = (method: string): Method | undefined => method === 'tm' ? 'machine' : METHODS.find((known) => known === method);

const ApiMoveDetailsSchema = z.object({
  type: z.object({ name: z.string() }),
  damage_class: z.object({ name: z.string() }),
  power: z.number().nullable(),
  accuracy: z.number().nullable(),
});
type ApiMoveDetails = z.infer<typeof ApiMoveDetailsSchema>;
const moveRequests = new Map<string, Promise<ApiMoveDetails | null>>();
let activeMoveRequests = 0;
const moveQueue: (() => void)[] = [];

async function loadMoveDetails(url: string): Promise<ApiMoveDetails | null> {
  if (activeMoveRequests >= 5) await new Promise<void>((resolve) => moveQueue.push(resolve));
  else activeMoveRequests++;
  try {
    const result = ApiMoveDetailsSchema.safeParse(await getMoveDetails(url));
    return result.success ? result.data : null;
  } catch {
    return null;
  } finally {
    const next = moveQueue.shift();
    if (next) next();
    else activeMoveRequests--;
  }
}

function cachedMoveDetails(url: string): Promise<ApiMoveDetails | null> {
  const existing = moveRequests.get(url);
  if (existing) return existing;
  const request = loadMoveDetails(url).then((details) => {
    if (!details) moveRequests.delete(url);
    return details;
  });
  moveRequests.set(url, request);
  return request;
}

export async function categorizeMoves(input: CategorizeMovesInput): Promise<CategorizeMovesOutput> {
  const availableVersions = new Set(input.moves.flatMap((move) => move.version_group_details.map((detail) => detail.version_group.name)));
  const version = availableVersions.has('scarlet-violet') ? 'scarlet-violet'
    : [...VERSION_GROUPS].reverse().find((name) => availableVersions.has(name));
  if (!version) return {};

  const selectedMoves = input.moves.map((move) => ({
    ...move,
    version_group_details: move.version_group_details.filter((detail) => detail.version_group.name === version && moveMethod(detail.move_learn_method.name)),
  })).filter((move) => move.version_group_details.length > 0);
  const details = await Promise.all(selectedMoves.map((move) => cachedMoveDetails(move.move.url)));
  const categorized: Record<Method, z.infer<typeof MoveDetailSchema>[]> = { 'level-up': [], egg: [], machine: [], tutor: [] };

  selectedMoves.forEach((move, index) => {
    const detail = details[index];
    if (!detail) return;
    for (const learned of move.version_group_details) {
      const method = moveMethod(learned.move_learn_method.name);
      if (!method) continue;
      const existing = categorized[method].find((entry) => entry.name === move.move.name);
      if (existing) {
        if (method === 'level-up') existing.level = Math.min(existing.level!, learned.level_learned_at);
        continue;
      }
      categorized[method].push({
        name: move.move.name,
        type: detail.type.name,
        category: detail.damage_class.name,
        power: detail.power,
        accuracy: detail.accuracy,
        ...(method === 'level-up' ? { level: learned.level_learned_at } : {}),
      });
    }
  });

  const result: CategorizeMovesOutput = {};
  for (const method of METHODS) {
    if (!categorized[method].length) continue;
    result[method] = categorized[method].sort((a, b) => (method === 'level-up' ? a.level! - b.level! : 0) || a.name.localeCompare(b.name));
  }
  return result;
}
