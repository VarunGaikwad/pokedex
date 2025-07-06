import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function PokemonDetailLoading() {
  return (
    <div className="container mx-auto p-4 md:p-8 animate-pulse">
      <div className="mb-8 inline-flex items-center gap-2 text-primary">
        <ArrowLeft className="h-4 w-4" />
        <Skeleton className="h-5 w-32" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardContent className="p-4 flex flex-col gap-4 items-center">
              <Skeleton className="w-full aspect-square" />
              <Skeleton className="h-8 w-24" />
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle><Skeleton className="h-7 w-24" /></CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-12 w-64" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
          </div>

          <Card>
            <CardHeader><CardTitle><Skeleton className="h-7 w-32" /></CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {Array.from({length: 6}).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle><Skeleton className="h-7 w-48" /></CardTitle></CardHeader>
            <CardContent>
                <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
