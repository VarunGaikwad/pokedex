"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackToPokedex() {
  const [href, setHref] = useState("/");
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("pokedex:return-url");
      if (!saved) return;
      const url = new URL(saved, window.location.origin);
      if (url.origin === window.location.origin && url.pathname === "/") setHref(`${url.pathname}${url.search}`);
    } catch { /* Direct entry or unavailable storage returns to the full guide. */ }
  }, []);
  return (
    <Link href={href} className="mb-7 inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
      <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to Pokédex
    </Link>
  );
}
