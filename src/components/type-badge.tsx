import { cn } from "@/lib/utils";

interface TypeBadgeProps {
  typeName: string;
  className?: string;
}

const typeColors: Record<string, string> = {
  normal: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200",
  fire: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200",
  water: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
  electric: "bg-yellow-100 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-200",
  grass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  ice: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200",
  fighting: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
  poison: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200",
  ground: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  flying: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200",
  psychic: "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-200",
  bug: "bg-lime-100 text-lime-900 dark:bg-lime-950 dark:text-lime-200",
  rock: "bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200",
  ghost: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200",
  dragon: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200",
  dark: "bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200",
  steel: "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  fairy: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
};

export default function TypeBadge({ typeName, className }: TypeBadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize leading-5", typeColors[typeName] || "bg-muted text-muted-foreground", className)}>
      {typeName}
    </span>
  );
}
