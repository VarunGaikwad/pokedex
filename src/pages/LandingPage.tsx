import axios from "axios";
import Button from "../components/Button";
import PokemonCard from "../components/PokemonCard";
import { useCallback, useEffect, useRef, useState } from "react";
import { PokemonListType } from "../interface/common";

export default function LandingPage() {
  const [pokemonList, setPokemonList] = useState<PokemonListType[]>(
      JSON.parse(localStorage.getItem("cachePokemon") || "[]")
    ),
    [offset, setOffset] = useState<number>(1),
    [hasCompleted, setHasCompleted] = useState<boolean>(false),
    lastElementRef = useRef<HTMLDivElement>(null),
    limit = 12,
    firstLimit = limit * 3,
    fetchPokemon = useCallback(
      async (offset: number = 1) => {
        const allResponse = [];

        for (
          let i = offset;
          i < offset + (offset > 1 ? limit : firstLimit);
          ++i
        ) {
          try {
            const { data } = await axios.get(
              `https://pokeapi.co/api/v2/pokemon/${i}`
            );
            const { name, types, id, sprites } = data;
            allResponse.push({ name, types, id, sprites });
          } catch (error) {
            setHasCompleted(true);
            return allResponse;
          }
        }
        return allResponse;
      },
      [firstLimit]
    ),
    elementVisible = (value: HTMLElement | null): boolean => {
      if (!value) return false;

      const item = value.getBoundingClientRect();
      return (
        item.top >= 0 &&
        item.left >= 0 &&
        item.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        item.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    },
    onScroll = useCallback(() => {
      if (elementVisible(lastElementRef.current)) {
        setOffset(offset + (offset > 1 ? limit : firstLimit));
      }
    }, [firstLimit, offset]);

  useEffect(() => {
    if (hasCompleted) {
      return;
    }

    fetchPokemon(offset).then((response) => {
      setPokemonList((prev) => [...prev, ...response]);
    });
  }, [offset, hasCompleted, fetchPokemon]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  return (
    <div className="bg-white bg-opacity-25 p-4">
      <div className="flex justify-center p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pokemonList.map((info: PokemonListType, idx: number) => {
            return <PokemonCard info={info} key={idx} />;
          })}
        </div>
      </div>
      <div ref={lastElementRef} className="flex justify-center">
        {!hasCompleted ? (
          <Button disabled={true} src="Refresh" type="Success">
            Load More Pokémon
          </Button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
