"use client";

import { useState } from "react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ImageOff, Mars, Sparkles, Venus } from "lucide-react";

interface PokemonSpritesProps {
  name: string;
  sprites: {
    front_default: string | null;
    front_shiny: string | null;
    front_female: string | null;
    front_shiny_female: string | null;
    other?: {
      "official-artwork"?: { front_default: string | null; front_shiny: string | null };
      home?: { front_default: string | null; front_shiny: string | null };
    };
  };
  genderRate: number;
}

export default function PokemonSprites({ name, sprites, genderRate }: PokemonSpritesProps) {
  const [isShiny, setIsShiny] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const [gender, setGender] = useState<"male" | "female">(genderRate === 8 ? "female" : "male");
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const hasGenderDifferences = Boolean(sprites.front_female || sprites.front_shiny_female);
  const female = hasGenderDifferences && gender === "female";
  const official = isShiny ? sprites.other?.["official-artwork"]?.front_shiny : sprites.other?.["official-artwork"]?.front_default;
  const home = isShiny ? sprites.other?.home?.front_shiny : sprites.other?.home?.front_default;
  const small = isShiny
    ? (female ? sprites.front_shiny_female || sprites.front_shiny : sprites.front_shiny)
    : (female ? sprites.front_female || sprites.front_default : sprites.front_default);
  const candidates = female
    ? [{ src: small, pixelated: true }]
    : [
        { src: is3D ? home : official, pixelated: false },
        { src: is3D ? official : home, pixelated: false },
        { src: small, pixelated: true },
      ];
  const image = candidates.find(candidate => candidate.src && !failedImages.includes(candidate.src));
  const isPixelated: boolean = Boolean(image?.pixelated);
  const displayImage = image?.src;
  const shinyAvailable = Boolean(sprites.front_shiny || sprites.other?.["official-artwork"]?.front_shiny || sprites.other?.home?.front_shiny);

  return (
    <div className="device-panel min-w-0 overflow-hidden p-2">
      <div className="battle-stage isolate flex aspect-square max-h-[480px] items-center justify-center">
        <span className="device-label absolute left-4 top-4 z-20 rounded-lg border bg-card/95 px-3 py-2">{isShiny ? "✦ Shiny encounter" : "Wild encounter"}</span>
        {displayImage ? (
          <Image
            src={displayImage}
            alt={`${isShiny ? "Shiny " : ""}${female ? "Female " : ""}${name.replaceAll("-", " ")} ${is3D && !female ? "3D model" : "artwork"}`}
            fill
            sizes="(max-width: 1024px) 92vw, 45vw"
            className={`z-10 object-contain p-8 drop-shadow-[0_16px_8px_rgba(10,30,20,0.16)] sm:p-10 ${isPixelated ? "pixelated" : ""}`}
            priority
            unoptimized={isPixelated}
            onError={() => setFailedImages(previous => previous.includes(displayImage) ? previous : [...previous, displayImage])}
          />
        ) : (
          <div className="dialog-panel relative z-10 mx-5 flex flex-col items-center gap-3 p-6 text-center text-sm text-muted-foreground" role="status"><ImageOff className="h-10 w-10" aria-hidden="true" />Artwork unavailable. There’s still plenty to discover below.</div>
        )}
        {isShiny && <span className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"><Sparkles className="h-3.5 w-3.5" aria-hidden="true" />Shiny</span>}
      </div>
      <div className="flex flex-col items-center gap-3 px-3 py-3">
        <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 [&>div]:min-h-11">
          <div className="flex items-center gap-2.5">
            <Switch id="shiny-toggle" checked={isShiny} onCheckedChange={setIsShiny} disabled={!shinyAvailable} className="border-foreground/30 [&>span]:bg-foreground data-[state=checked]:[&>span]:bg-primary-foreground" />
            <Label htmlFor="shiny-toggle" className="flex min-h-11 cursor-pointer items-center gap-1.5 text-sm font-semibold"><Sparkles className="h-4 w-4" aria-hidden="true" />Shiny</Label>
          </div>
          {sprites.other?.home?.front_default && (
            <div className="flex items-center gap-2.5">
              <Switch id="3d-toggle" checked={is3D} onCheckedChange={setIs3D} disabled={female} className="border-foreground/30 [&>span]:bg-foreground data-[state=checked]:[&>span]:bg-primary-foreground" />
              <Label htmlFor="3d-toggle" className="flex min-h-11 cursor-pointer items-center text-sm font-semibold">3D view</Label>
            </div>
          )}
        </div>
        {hasGenderDifferences && genderRate > 0 && genderRate < 8 && (
          <RadioGroup value={gender} onValueChange={value => setGender(value === "female" ? "female" : "male")} className="flex min-h-11 flex-wrap items-center justify-center gap-5" aria-label="Artwork gender">
            <div className="flex items-center gap-2"><RadioGroupItem value="male" id="sprite-male" /><Label htmlFor="sprite-male" className="flex min-h-11 cursor-pointer items-center gap-1"><Mars className="h-4 w-4" aria-hidden="true" />Male</Label></div>
            <div className="flex items-center gap-2"><RadioGroupItem value="female" id="sprite-female" /><Label htmlFor="sprite-female" className="flex min-h-11 cursor-pointer items-center gap-1"><Venus className="h-4 w-4" aria-hidden="true" />Female</Label></div>
          </RadioGroup>
        )}
      </div>
    </div>
  );
}
