import PokeBall from "../assets/pokeball.svg";
import SearchInput from "../components/SearchInput";
import SortMenu from "../components/SortMenu";

export default function NationalDex() {
  return (
    <div className="bg-primary">
      <div className="container flex flex-col mx-auto h-screen">
        <div className="mx-4 my-2">
          <span className="flex items-center gap-1 font-bold text-2xl text-white">
            <img className="size-7" src={PokeBall} />
            Pokédex
          </span>
          <div className="flex items-center gap-1">
            <SearchInput />
            <SortMenu />
          </div>
        </div>
        <div className="flex-grow bg-slate-100 rounded-md m-1">
          List Content
        </div>
      </div>
    </div>
  );
}
