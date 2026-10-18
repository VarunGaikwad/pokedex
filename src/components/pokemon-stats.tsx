import { Progress } from "@/components/ui/progress";

interface PokemonStatsProps {
  stats: { base_stat: number; stat: { name: string } }[];
}

const labels: Record<string, string> = {
  hp: "HP", attack: "Attack", defense: "Defense",
  "special-attack": "Sp. Attack", "special-defense": "Sp. Defense", speed: "Speed",
};
const colors: Record<string, string> = {
  hp: "bg-emerald-600 dark:bg-emerald-400", attack: "bg-orange-500",
  defense: "bg-amber-500", "special-attack": "bg-violet-500 dark:bg-violet-400",
  "special-defense": "bg-teal-600 dark:bg-teal-400", speed: "bg-rose-500 dark:bg-rose-400",
};

export default function PokemonStats({ stats }: PokemonStatsProps) {
  return (
    <div className="space-y-4">
      {stats.map(({ stat, base_stat }) => (
        <div key={stat.name} className="grid grid-cols-[5.5rem_2rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[6rem_2rem_minmax(0,1fr)]">
          <span className="text-xs font-medium text-muted-foreground sm:text-sm">{labels[stat.name] || stat.name}</span>
          <span className="text-right text-sm font-semibold tabular-nums">{base_stat}</span>
          <Progress value={Math.min(100, base_stat / 255 * 100)} aria-label={labels[stat.name] || stat.name} aria-valuemin={0} aria-valuemax={255} aria-valuenow={base_stat} className="h-2 bg-muted" indicatorClassName={colors[stat.name] || "bg-primary"} />
        </div>
      ))}
      <div className="flex items-center justify-between border-t pt-4 text-sm"><span className="font-medium text-muted-foreground">Total</span><span className="font-bold tabular-nums">{stats.reduce((sum, stat) => sum + stat.base_stat, 0)}</span></div>
      <p className="text-xs leading-relaxed text-muted-foreground">Base values, before training. Each stat is shown on a scale of 255.</p>
    </div>
  );
}
