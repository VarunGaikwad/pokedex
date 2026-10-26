"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/theme-toggle";

export default function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="border-b bg-card/95">
      <div className="field-container flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-3 sm:flex-nowrap sm:py-4">
        <Link href="/" className="flex min-h-11 min-w-0 items-center gap-2.5 rounded-md" aria-label="Pokédex. The Pokémon field guide — home">
          <span className="pokeball-mark h-10 w-10 sm:h-11 sm:w-11" aria-hidden="true" />
          <div>
            <span className="block text-xl font-black tracking-[-0.06em] sm:text-2xl">POKÉDEX<span className="text-primary">.</span></span>
            <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-cyan-500 ring-2 ring-cyan-500/15" aria-hidden="true" />The Pokémon field guide</span>
          </div>
        </Link>
        <div className="order-3 flex w-full items-center gap-1 pt-1 sm:order-none sm:w-auto sm:gap-5 sm:pt-0">
          <nav aria-label="Main navigation" className="flex w-full gap-1 rounded-xl bg-muted/70 p-1 sm:w-auto">
            {[{ href: "/", label: "Pokédex", active: !pathname.startsWith("/team-builder") }, { href: "/team-builder", label: "Team Builder", active: pathname.startsWith("/team-builder") }].map(({ href, label, active }) => (
              <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`inline-flex min-h-11 flex-1 items-center justify-center whitespace-nowrap rounded-lg px-4 text-xs font-bold transition-colors sm:flex-none sm:text-sm ${active ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:bg-card hover:text-foreground"}`}>{label}</Link>
            ))}
          </nav>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
