"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuLabel,
  DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Theme = "light" | "dark" | "system";
const storageKey = "pokedex:theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setTheme(saved === "light" || saved === "dark" ? saved : "system");
    } catch { setTheme("system"); }
    const sync = (event: StorageEvent) => {
      if (event.key !== storageKey && event.key !== null) return;
      setTheme(event.newValue === "dark" || event.newValue === "light" ? event.newValue : "system");
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  useEffect(() => {
    if (!theme) return;
    const system = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && system.matches);
      document.documentElement.classList.toggle("dark", dark);
      document.documentElement.style.colorScheme = dark ? "dark" : "light";
    };
    apply();
    system.addEventListener("change", apply);
    return () => system.removeEventListener("change", apply);
  }, [theme]);

  const changeTheme = (value: string) => {
    const next: Theme = value === "light" || value === "dark" ? value : "system";
    try { localStorage.setItem(storageKey, next); } catch { /* The selection still works for this page. */ }
    setTheme(next);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full border bg-card transition-colors hover:bg-muted" aria-label="Choose color theme">
          <Sun className="h-[18px] w-[18px] dark:hidden" aria-hidden="true" />
          <Moon className="hidden h-[18px] w-[18px] dark:block" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme ?? "system"} onValueChange={changeTheme}>
          <DropdownMenuRadioItem value="light"><Sun className="mr-2 h-4 w-4" aria-hidden="true" />Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark"><Moon className="mr-2 h-4 w-4" aria-hidden="true" />Dark</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system"><Monitor className="mr-2 h-4 w-4" aria-hidden="true" />System</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
