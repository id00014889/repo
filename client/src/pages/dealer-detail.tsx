import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { CarCard, CarCardSkeleton } from "@/components/car-card";
import {
  MapPin, ShieldCheck, Star, Phone, ChevronLeft, Car
} from "lucide-react";
import type { Dealer, CarWithDealer } from "@shared/schema";

export default function DealerDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: dealer, isLoading: loadingDealer } = useQuery<Dealer & { carCount: number }>({
    queryKey: ["/api/dealers", slug],
  });

  const { data: cars, isLoading: loadingCars } = useQuery<CarWithDealer[]>({
    queryKey: ["/api/dealers", slug, "cars"],
    enabled: !!dealer,
  });

  if (loadingDealer) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-6">
          <Skeleton className="h-8 w-32 mb-6" />
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!dealer) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h2 className="text-xl font-bold mb-2">Dealer Not Found</h2>
          <p className="text-muted-foreground mb-6">This dealer page is not available.</p>
          <Link href="/dealers">
            <Button variant="outline" className="gap-2">
              <ChevronLeft className="w-4 h-4" /> Back to Dealers
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const initials = dealer.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <Link href="/dealers">
          <Button variant="ghost" className="gap-1.5 mb-4 -ml-2 text-sm" data-testid="button-back-to-dealers">
            <ChevronLeft className="w-4 h-4" /> Back to Dealers
          </Button>
        </Link>

        {/* Dealer Info */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Avatar className="w-16 h-16 flex-shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold" data-testid="text-dealer-name">{dealer.name}</h1>
                {dealer.verified && (
                  <Badge className="gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{dealer.address}, {dealer.city}</span>
                </div>
                {Number(dealer.rating) > 0 && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                    <span>{dealer.rating} rating</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Car className="w-3.5 h-3.5" />
                  <span>{dealer.carCount ?? 0} cars</span>
                </div>
              </div>

              {dealer.description && (
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{dealer.description}</p>
              )}

              <Separator className="my-4" />

              <a href={`tel:${dealer.phone}`}>
                <Button variant="outline" className="gap-2" data-testid="button-dealer-call">
                  <Phone className="w-4 h-4" />
                  {dealer.phone}
                </Button>
              </a>
            </div>
          </div>
        </Card>

        {/* Dealer's Cars */}
        <div>
          <h2 className="text-xl font-bold mb-4">
            Cars from {dealer.name}
          </h2>

          {loadingCars ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <CarCardSkeleton key={i} />
              ))}
            </div>
          ) : cars && cars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Car className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">No cars listed yet</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
