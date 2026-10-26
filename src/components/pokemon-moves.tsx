import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CategorizeMovesOutput } from "@/ai/flows/categorize-moves";
import { getCategorizedMoves } from "@/app/actions";
import TypeBadge from "./type-badge";

interface PokemonMovesProps { pokemonName: string; moves: any[] }
const learnMethods = ["level-up", "machine", "egg", "tutor"] as const;
const methodNames = { "level-up": "Level up", machine: "TM / TR", egg: "Egg", tutor: "Tutor" };

function MovesTable({ moves, hasLevel }: { moves: CategorizeMovesOutput[keyof CategorizeMovesOutput]; hasLevel: boolean }) {
  if (!moves?.length) return <p className="dialog-panel p-4 text-sm text-muted-foreground">No moves in this category.</p>;
  return (
    <div className="max-h-[520px] w-full overflow-auto rounded-xl border focus-visible:outline-offset-2" role="region" aria-label="Move details, scroll to see all columns and rows" tabIndex={0}>
      <table className="w-full min-w-[560px] caption-bottom text-sm">
        <caption className="sr-only">Learnable moves with type, category, power, and accuracy</caption>
        <TableHeader className="sticky top-0 z-10 bg-secondary font-mono text-xs">
          <TableRow>
            {hasLevel && <TableHead scope="col" className="w-14">Lv.</TableHead>}
            <TableHead scope="col">Move</TableHead><TableHead scope="col">Type</TableHead><TableHead scope="col">Category</TableHead>
            <TableHead scope="col" className="text-right">Power</TableHead><TableHead scope="col" className="text-right">Acc.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {moves.map(move => <TableRow key={move.name}>
            {hasLevel && <TableCell className="font-mono font-semibold tabular-nums">{move.level ?? "—"}</TableCell>}
            <TableCell className="whitespace-nowrap font-medium capitalize">{move.name.replaceAll("-", " ")}</TableCell>
            <TableCell><TypeBadge typeName={move.type} /></TableCell>
            <TableCell className="capitalize">{move.category}</TableCell>
            <TableCell className="text-right tabular-nums">{move.power ?? "—"}</TableCell>
            <TableCell className="text-right tabular-nums">{move.accuracy == null ? "—" : `${move.accuracy}%`}</TableCell>
          </TableRow>)}
        </TableBody>
      </table>
    </div>
  );
}

export default async function PokemonMoves({ pokemonName, moves }: PokemonMovesProps) {
  let result: Awaited<ReturnType<typeof getCategorizedMoves>> | null = null;
  try { result = await getCategorizedMoves({ pokemonName, moves }); } catch { /* A failed move lookup must not hide the entry. */ }
  const categorized = result && !("error" in result) ? result : null;
  const defaultTab = learnMethods.find(method => categorized?.[method]?.length);

  return (
    <div className="device-panel p-5 sm:p-7">
      <p className="eyebrow mb-2">04 / Move archive</p>
      <h2 className="section-heading mb-2">Learnable moves</h2>
      <p className="mb-5 text-sm text-muted-foreground">Explore moves by how they’re learned. Availability can vary between games.</p>
      {!categorized ? <p className="dialog-panel p-4 text-sm text-muted-foreground">Move details couldn’t be loaded right now. Try this entry again in a moment.</p> : !defaultTab ? <p className="text-sm text-muted-foreground">This Pokémon has no learnable moves to display.</p> : (
        <Tabs defaultValue={defaultTab} className="min-w-0 w-full">
          <TabsList className="mb-4 grid h-auto w-full grid-cols-2 gap-1 p-1 sm:grid-cols-4" aria-label="Move learning methods">
            {learnMethods.map(method => <TabsTrigger key={method} value={method} disabled={!categorized[method]?.length} className="min-h-11 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">{methodNames[method]} <span className="ml-1.5 text-xs">{categorized[method]?.length ?? 0}</span></TabsTrigger>)}
          </TabsList>
          <p className="mb-3 text-xs text-muted-foreground sm:hidden">Swipe the table sideways to see every detail.</p>
          {learnMethods.map(method => <TabsContent key={method} value={method} className="min-w-0"><MovesTable moves={categorized[method]} hasLevel={method === "level-up"} /></TabsContent>)}
        </Tabs>
      )}
    </div>
  );
}
