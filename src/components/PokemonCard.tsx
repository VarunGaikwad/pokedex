import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  image_base_url,
  PokemonListType,
  pokemonNumberPadding,
} from "../data/common";
import missingno from "../assets/missingno.png";

export default function PokemonCard({
  entry_number,
  pokemon_species,
}: PokemonListType) {
  const [pokeImg, setPokeImg] = useState<string>(missingno),
    cardRef = useRef<HTMLDivElement>(null),
    [isVisible, setIsVisible] = useState(false),
    [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const fetchImage = new Image();
      fetchImage.src = `${image_base_url}/other/official-artwork/${entry_number}.png`;
      fetchImage.onload = () => {
        setPokeImg(fetchImage.src);
        setIsImageLoaded(true);
      };
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.5,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [entry_number, isVisible]);

  return (
    <Link to={`/pokedex/${entry_number}`}>
      <div
        ref={cardRef}
        className={`h-max bg-slate-100 rounded-md p-2 flex flex-col ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        } transition-opacity duration-500 ease-in-out`}
        style={{
          boxShadow:
            "0px 0px 10px 5px rgba(0,0,0,0.1),inset 0px 3.5rem 5px 0px white",
        }}
      >
        <span className="opacity-50 text-end">
          #{pokemonNumberPadding(entry_number.toString())}
        </span>
        <img
          height={20}
          loading="lazy"
          className={`m-auto ${isImageLoaded ? "visible" : "invisible"}`}
          src={pokeImg}
          alt={pokemon_species.name}
        />
        <span className="mt-1 text-sm font-semibold text-center">
          {pokemon_species.name}
        </span>
      </div>
    </Link>
  );
}
