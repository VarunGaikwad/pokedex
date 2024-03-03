export default function TypeBadge({ children }: TypeBadgeType) {
  const commonClasses = "px-4 rounded-md",
    lightTextColor = "text-white",
    darkTextColor = "text-black",
    typeBadgeClass: TypeBadgeClass = {
      normal: `bg-gradient-to-br from-gray-300 to-gray-400 ${darkTextColor} ${commonClasses}`,
      fire: `bg-gradient-to-br from-red-500 to-red-700 ${lightTextColor} ${commonClasses}`,
      water: `bg-gradient-to-br from-blue-500 to-blue-700 ${lightTextColor} ${commonClasses}`,
      electric: `bg-gradient-to-br from-yellow-400 to-yellow-600 ${darkTextColor} ${commonClasses}`,
      grass: `bg-gradient-to-br from-green-400 to-green-600 ${lightTextColor} ${commonClasses}`,
      ice: `bg-gradient-to-br from-blue-100 to-blue-200 ${darkTextColor} ${commonClasses}`,
      fighting: `bg-gradient-to-br from-red-600 to-red-800 ${lightTextColor} ${commonClasses}`,
      poison: `bg-gradient-to-br from-purple-500 to-purple-700 ${lightTextColor} ${commonClasses}`,
      ground: `bg-gradient-to-br from-yellow-700 to-yellow-900 ${lightTextColor} ${commonClasses}`,
      flying: `bg-gradient-to-br from-blue-300 to-blue-500 ${darkTextColor} ${commonClasses}`,
      psychic: `bg-gradient-to-br from-purple-600 to-purple-800 ${lightTextColor} ${commonClasses}`,
      bug: `bg-gradient-to-br from-green-300 to-green-500 ${darkTextColor} ${commonClasses}`,
      rock: `bg-gradient-to-br from-gray-600 to-gray-800 ${lightTextColor} ${commonClasses}`,
      ghost: `bg-gradient-to-br from-indigo-600 to-indigo-800 ${lightTextColor} ${commonClasses}`,
      dragon: `bg-gradient-to-br from-purple-800 to-purple-900 ${lightTextColor} ${commonClasses}`,
      dark: `bg-gradient-to-br from-gray-800 to-gray-900 ${lightTextColor} ${commonClasses}`,
      steel: `bg-gradient-to-br from-gray-500 to-gray-700 ${darkTextColor} ${commonClasses}`,
      fairy: `bg-gradient-to-br from-pink-300 to-pink-500 ${darkTextColor} ${commonClasses}`,
    };

  return (
    <div
      className={`${typeBadgeClass[children]} font-semibold text-sm capitalize`}
    >
      {children}
    </div>
  );
}

interface TypeBadgeType {
  children: string;
}

type TypeBadgeClass = {
  [key: string]: string;
};
