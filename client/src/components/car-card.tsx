import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fuel, Gauge, Calendar, MapPin, ShieldCheck } from "lucide-react";
import { formatPrice, formatMileage } from "@/lib/formatters";
import type { CarWithDealer } from "@shared/schema";

interface CarCardProps {
  car: CarWithDealer;
}

const fuelLabels: Record<string, string> = {
  petrol: "Petrol",
  diesel: "Diesel",
  gas: "Gas (LPG)",
  electric: "Electric",
  hybrid: "Hybrid",
};

const transmissionLabels: Record<string, string> = {
  automatic: "Automatic",
  manual: "Manual",
};

export function CarCard({ car }: CarCardProps) {
  return (
    <Link href={`/cars/${car.id}`}>
      <Card className="overflow-visible group cursor-pointer hover-elevate active-elevate-2 transition-all duration-200" data-testid={`card-car-${car.id}`}>
        <div className="relative overflow-hidden rounded-t-md">
          <img
            src={car.imageUrl || "/images/car-1.png"}
            alt={`${car.make} ${car.model}`}
            className="w-full aspect-[16/10] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
          {car.featured && (
            <Badge className="absolute top-2 left-2" variant="default">
              Featured
            </Badge>
          )}
          {car.status === "sold" && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm">Sold</Badge>
            </div>
          )}
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="min-w-0">
              <h3 className="font-semibold text-sm truncate" data-testid={`text-car-title-${car.id}`}>
                {car.make} {car.model}
              </h3>
              <div className="flex items-center gap-1 mt-0.5">
                {car.dealer?.verified && (
                  <ShieldCheck className="w-3 h-3 text-primary flex-shrink-0" />
                )}
                <span className="text-xs text-muted-foreground truncate" data-testid={`text-dealer-name-${car.id}`}>
                  {car.dealer?.name}
                </span>
              </div>
            </div>
            <p className="font-bold text-primary text-sm whitespace-nowrap" data-testid={`text-car-price-${car.id}`}>
              {formatPrice(car.price)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span>{car.year}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Gauge className="w-3 h-3 flex-shrink-0" />
              <span>{formatMileage(car.mileage)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Fuel className="w-3 h-3 flex-shrink-0" />
              <span>{fuelLabels[car.fuelType] || car.fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{car.city}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="secondary" className="text-[10px]">{transmissionLabels[car.transmission]}</Badge>
            <Badge variant="secondary" className="text-[10px]">{car.bodyType}</Badge>
            {car.engineSize && (
              <Badge variant="secondary" className="text-[10px]">{car.engineSize}L</Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function CarCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="w-full aspect-[16/10] bg-muted animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
          </div>
          <div className="h-4 bg-muted rounded w-20 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-3 bg-muted rounded w-16 animate-pulse" />
          ))}
        </div>
        <div className="flex gap-1.5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-5 bg-muted rounded w-16 animate-pulse" />
          ))}
        </div>
      </div>
    </Card>
  );
}
