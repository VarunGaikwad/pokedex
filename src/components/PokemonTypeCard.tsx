export default function PokemonTypeCard({ children }: { children: string }) {
  return (
    <div
      className={`bg-${children} text-sm text-white p-1 w-32 text-center rounded-full capitalize font-semibold`}
    >
      {children}
    </div>
  );
}
