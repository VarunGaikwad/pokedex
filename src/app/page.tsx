import PokemonList from "@/components/pokemon-list";
import Image from "next/image";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in-up opacity-0">
      <header className="flex items-center justify-center sm:justify-start gap-4 mb-8 pb-4 border-b-2 border-primary/20">
        <Image
          src="/images/logo.png"
          alt="Pokédex Logo"
          width={48}
          height={48}
          className="h-12 w-12 rounded-full"
        />
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-center sm:text-left font-headline">
          Pokédex
        </h1>
      </header>
      <main>
        <PokemonList />
      </main>
    </div>
  );
}
