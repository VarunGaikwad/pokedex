export default function PokemonTypeCard({ children }: PokemonTypeCardType) {
  const typeStyles: { [key: string]: string } = {
    normal: "bg-gray-300 text-gray-800",
    fire: "bg-red-500 text-white",
    water: "bg-blue-500 text-white",
    electric: "bg-yellow-400 text-gray-800",
    grass: "bg-green-500 text-white",
    ice: "bg-blue-200 text-gray-800",
    fighting: "bg-red-600 text-white",
    poison: "bg-purple-600 text-white",
    ground: "bg-yellow-800 text-gray-200",
    flying: "bg-indigo-400 text-white",
    psychic: "bg-pink-500 text-white",
    bug: "bg-green-600 text-white",
    rock: "bg-gray-600 text-gray-200",
    ghost: "bg-purple-700 text-white",
    dragon: "bg-indigo-700 text-white",
    dark: "bg-gray-800 text-gray-200",
    steel: "bg-gray-500 text-gray-200",
    fairy: "bg-pink-300 text-gray-800",
  };

  return (
    <div
      className={`w-1/2 capitalize rounded-3xl text-center ${
        typeStyles[children.toLowerCase()]
      } shadow-md p-1 text-lg font-semibold glow`}
    >
      {children}
    </div>
  );
}

interface PokemonTypeCardType {
  children: string;
}
