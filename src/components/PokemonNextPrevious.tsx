import { pokemonNumberPadding } from "../data/common";

export default function PokemonNextPrevious({
  mainText,
  numberText = "",
  numberFirst = false,
}: {
  mainText: string;
  numberText?: string;
  numberFirst?: boolean;
}) {
  return (
    <div className="cursor-pointer m-2 rounded-xl text-xl w-1/2 bg-gray-600 hover:bg-indigo-400 p-4 font-semibold tracking-wider flex justify-center gap-4">
      <div className={`${numberFirst ? "visible" : "hidden"}`}>
        #{pokemonNumberPadding(numberText)}
      </div>
      <div className="text-gray-900">{mainText}</div>
      <div className={`${!numberFirst ? "visible" : "hidden"}`}>
        #{pokemonNumberPadding(numberText)}
      </div>
    </div>
  );
}
