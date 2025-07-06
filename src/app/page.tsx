import PokemonList from '@/components/pokemon-list';
import { Pocket } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-center sm:justify-start gap-4 mb-8">
        <Pocket className="h-12 w-12 text-primary" />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-center sm:text-left font-headline">
          Pocket Monster Manifest
        </h1>
      </header>
      <main>
        <PokemonList />
      </main>
    </div>
  );
}
