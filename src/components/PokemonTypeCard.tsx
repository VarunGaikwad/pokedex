export default function PokemonTypeCard({ children }: { children: string }) {
  // Define background colors for each Pokemon type
  const typeColors: { [key: string]: string } = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
  };

  // Get the background color for the given type
  const bgColor = typeColors[children.toLowerCase()] || "#BDBDBD"; // Default color for unknown types

  return (
    <div
      className={`text-lg text-white p-2 w-32 text-center rounded-full capitalize`}
      style={{ backgroundColor: bgColor }}
    >
      {children}
    </div>
  );
}
