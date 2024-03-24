import ProgressBar from "./ProgressBar";

export default function PokemonStats({
  title,
  value,
}: {
  title:
    | "hp"
    | "attack"
    | "attack"
    | "defense"
    | "special-attack"
    | "special-defense"
    | "speed";
  value: number;
}) {
  const percentage = (value / 255) * 100,
    dict = {
      hp: "HP",
      attack: "ATK",
      defense: "DEF",
      "special-attack": "SPA",
      "special-defense": "SPD",
      speed: "SPD",
    };
  return (
    <div className="flex gap-4 px-4 p-1">
      <span className="w-10 font-semibold capitalize">{dict[title]}</span>
      <span className="w-10 font-semibold">{value}</span>
      <ProgressBar percentage={percentage} />
    </div>
  );
}
