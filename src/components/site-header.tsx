import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";

export default function SiteHeader() {
  return (
    <header className="border-b bg-background">
      <div className="field-container flex h-20 items-center justify-between gap-3">
        <Link href="/" className="group flex min-w-0 items-center gap-3 rounded-md" aria-label="Pokédex. The Pokémon field guide — home">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2.5" />
              <path d="M4 16h24" stroke="currentColor" strokeWidth="2.5" />
              <circle cx="16" cy="16" r="4" fill="currentColor" />
              <circle cx="16" cy="16" r="1.5" className="fill-primary" />
            </svg>
          </span>
          <div>
            <span className="block text-xl font-black tracking-[-0.06em] sm:text-2xl">Pokédex<span className="text-muted-foreground">.</span></span>
            <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground sm:text-[10px]">The Pokémon field guide</span>
          </div>
        </Link>
        <div className="flex items-center gap-5">
          <span className="hidden text-xs text-muted-foreground md:block">A little curiosity. A whole world to discover.</span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
