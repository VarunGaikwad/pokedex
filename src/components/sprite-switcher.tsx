"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ARTWORK_STYLES, spriteUrl, type ArtworkStyle } from "@/lib/pokemon-discovery";

interface ArtworkControlsProps {
  artwork: ArtworkStyle;
  shiny: boolean;
  onArtworkChange: (artwork: ArtworkStyle) => void;
  onShinyChange: (shiny: boolean) => void;
}

export function ArtworkControls({ artwork, shiny, onArtworkChange, onShinyChange }: ArtworkControlsProps) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="min-w-40 flex-1 space-y-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Artwork style</span>
        <Select value={artwork} onValueChange={(value) => onArtworkChange(value as ArtworkStyle)}>
          <SelectTrigger aria-label="Artwork style" className="bg-background"><SelectValue /></SelectTrigger>
          <SelectContent>{ARTWORK_STYLES.map((style) => <SelectItem key={style} value={style}>{style}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <label className="flex h-10 cursor-pointer items-center gap-2 text-sm font-medium">
        <Sparkles className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        Shiny
        <Switch checked={shiny} onCheckedChange={onShinyChange} aria-label="Show shiny Pokémon" />
      </label>
      {artwork === "Dream World" && shiny && <p className="w-full text-xs text-muted-foreground">Dream World has no shiny artwork; showing the standard illustration.</p>}
    </div>
  );
}

interface SpriteSwitcherProps {
  sprites: {
    front_default: string | null;
    front_shiny: string | null;
    other: { "official-artwork": { front_default: string; front_shiny: string } };
  };
  name: string;
}

export function SpriteSwitcher({ sprites, name }: SpriteSwitcherProps) {
  const [artwork, setArtwork] = useState<ArtworkStyle>("Official Artwork");
  const [shiny, setShiny] = useState(false);
  const [failed, setFailed] = useState<string[]>([]);
  const id = Number(sprites.front_default?.match(/\/(\d+)\.png$/)?.[1]);
  const selected = id ? spriteUrl(id, artwork, shiny) : shiny ? sprites.front_shiny : sprites.other["official-artwork"].front_default;
  const url = [selected, sprites.other["official-artwork"].front_default, sprites.front_default].find((candidate) => candidate && !failed.includes(candidate));
  return (
    <div className="flex flex-col items-center gap-4">
      <ArtworkControls artwork={artwork} shiny={shiny} onArtworkChange={setArtwork} onShinyChange={setShiny} />
      <div className="relative flex h-56 w-56 items-center justify-center rounded-2xl bg-muted/50">
        {url ? <Image key={url} src={url} alt={`${name} — ${shiny ? "shiny " : ""}${artwork}`} fill sizes="224px" unoptimized={url.endsWith(".svg") || url.endsWith(".gif")} className="object-contain p-4" onError={() => setFailed((previous) => [...previous, url])} /> : <p className="text-sm text-muted-foreground">Artwork unavailable</p>}
      </div>
    </div>
  );
}
