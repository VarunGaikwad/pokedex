import { PokemonListType } from "../interface/common";
import TypeBadge from "./TypeBadge";

export default function PokemonCard({ info }: { info: PokemonListType }) {
  const { name, types, id, sprites } = info,
    { front_default } = sprites.other["home"];

  return (
    <div className="pokemon-tile-animation cursor-pointer m-4">
      <div className="w-max rounded-lg">
        <img width={200} height={200} src={front_default} />
      </div>
      <div className="px-4 py-2">
        <div className="font-semibold text-slate-400 tracking-wide text-xs">
          #{addZeros(id)}
        </div>
        <div className="font-semibold text-2xl capitalize">{name}</div>
        <div className="flex w-max space-x-4 mt-1 py-2">
          {types.map(({ type }, idx) => {
            return <TypeBadge key={idx}>{type.name}</TypeBadge>;
          })}
        </div>
      </div>
    </div>
  );
}

function addZeros(id: number) {
  let ids = String(id);

  while (ids.length < 4) {
    ids = "0" + ids;
  }

  return ids;
}
