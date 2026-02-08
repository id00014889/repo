import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, ShieldCheck, Star, Car } from "lucide-react";
import type { Dealer } from "@shared/schema";

interface DealerCardProps {
  dealer: Dealer & { carCount?: number };
}

export function DealerCard({ dealer }: DealerCardProps) {
  const initials = dealer.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link href={`/dealers/${dealer.slug}`}>
      <Card className="p-4 cursor-pointer hover-elevate active-elevate-2 transition-all duration-200" data-testid={`card-dealer-${dealer.slug}`}>
        <div className="flex items-start gap-3">
          <Avatar className="w-12 h-12 flex-shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-semibold text-sm truncate" data-testid={`text-dealer-name-${dealer.slug}`}>
                {dealer.name}
              </h3>
              {dealer.verified && (
                <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{dealer.city}</span>
              </div>
              {Number(dealer.rating) > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  <span>{dealer.rating}</span>
                </div>
              )}
              {dealer.carCount !== undefined && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Car className="w-3 h-3" />
                  <span>{dealer.carCount} cars</span>
                </div>
              )}
            </div>

            {dealer.description && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{dealer.description}</p>
            )}
          </div>

          {dealer.verified && (
            <Badge variant="secondary" className="flex-shrink-0 text-[10px]">Verified</Badge>
          )}
        </div>
      </Card>
    </Link>
  );
}

export function DealerCardSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-muted animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
          <div className="h-3 bg-muted rounded w-1/3 animate-pulse" />
          <div className="h-3 bg-muted rounded w-full animate-pulse" />
        </div>
      </div>
    </Card>
  );
}
