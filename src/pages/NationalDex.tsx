import { useState } from "react";
import PokeBall from "../assets/pokeball.svg";
import SearchInput from "../components/SearchInput";
import SortMenu from "../components/SortMenu";
import { SortCriteria } from "../data/common";

export default function NationalDex() {
  const [sort, setSort] = useState<SortCriteria>({
    order: "asc",
    type: "number",
  });

  return (
    <div className="bg-primary">
      <div className="container flex flex-col mx-auto h-screen gap-1 p-1">
        <div>
          <span className="flex items-center gap-1 font-bold text-2xl text-white">
            <img className="size-7" src={PokeBall} />
            Pokédex
          </span>
          <div className="flex items-center gap-1">
            <SearchInput />
            <SortMenu {...{ sort, setSort }} />
          </div>
        </div>
        <div className="flex-grow bg-slate-100 rounded-md">List Content</div>
      </div>
    </div>
  );
}
