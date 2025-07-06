import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TypeBadgeProps {
  typeName: string;
  className?: string;
}

const typeColors: { [key: string]: string } = {
  normal: "bg-gray-400 text-white hover:bg-gray-400/90",
  fire: "bg-orange-500 text-white hover:bg-orange-500/90",
  water: "bg-blue-500 text-white hover:bg-blue-500/90",
  electric: "bg-yellow-400 text-black hover:bg-yellow-400/90",
  grass: "bg-green-500 text-white hover:bg-green-500/90",
  ice: "bg-cyan-300 text-black hover:bg-cyan-300/90",
  fighting: "bg-red-700 text-white hover:bg-red-700/90",
  poison: "bg-purple-600 text-white hover:bg-purple-600/90",
  ground: "bg-yellow-600 text-white hover:bg-yellow-600/90",
  flying: "bg-indigo-400 text-white hover:bg-indigo-400/90",
  psychic: "bg-pink-500 text-white hover:bg-pink-500/90",
  bug: "bg-lime-500 text-black hover:bg-lime-500/90",
  rock: "bg-stone-500 text-white hover:bg-stone-500/90",
  ghost: "bg-indigo-800 text-white hover:bg-indigo-800/90",
  dragon: "bg-indigo-600 text-white hover:bg-indigo-600/90",
  dark: "bg-gray-800 text-white hover:bg-gray-800/90",
  steel: "bg-slate-400 text-black hover:bg-slate-400/90",
  fairy: "bg-pink-300 text-black hover:bg-pink-300/90",
};

export default function TypeBadge({ typeName, className }: TypeBadgeProps) {
  const colorClass = typeColors[typeName] || "bg-gray-500 text-white";
  return (
    <Badge className={cn("capitalize text-base border-none", colorClass, className)}>
      {typeName}
    </Badge>
  );
}
