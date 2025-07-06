import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-4">
      <AlertTriangle className="h-24 w-24 text-destructive mb-4" />
      <h2 className="text-4xl font-bold mb-2 font-headline">Pokémon Not Found</h2>
      <p className="text-muted-foreground mb-6">Oops! We couldn't find the Pokémon you were looking for.</p>
      <Button asChild>
        <Link href="/">Return to Pokédex</Link>
      </Button>
    </div>
  )
}
