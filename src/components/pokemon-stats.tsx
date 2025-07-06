import { Progress } from "@/components/ui/progress";

interface PokemonStatsProps {
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
}

const statNameMapping: { [key: string]: string } = {
    'hp': 'HP',
    'attack': 'Attack',
    'defense': 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    'speed': 'Speed',
};

const statColorMapping: { [key: string]: string } = {
    'hp': 'bg-red-500',
    'attack': 'bg-orange-500',
    'defense': 'bg-yellow-500',
    'special-attack': 'bg-blue-500',
    'special-defense': 'bg-green-500',
    'speed': 'bg-pink-500',
};


export default function PokemonStats({ stats }: PokemonStatsProps) {
  const maxStat = 255;

  return (
    <div className="space-y-3">
      {stats.map(({ stat, base_stat }) => (
        <div key={stat.name} className="grid grid-cols-4 items-center gap-2">
            <span className="col-span-1 text-sm font-medium capitalize text-muted-foreground">{statNameMapping[stat.name] || stat.name}</span>
            <div className="col-span-3 flex items-center gap-2">
                <span className="font-bold w-10 text-right">{base_stat}</span>
                <Progress value={(base_stat / maxStat) * 100} className="h-3" indicatorClassName={statColorMapping[stat.name] || 'bg-primary'} />
            </div>
        </div>
      ))}
    </div>
  );
}
