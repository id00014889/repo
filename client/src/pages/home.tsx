import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CarCard, CarCardSkeleton } from "@/components/car-card";
import { HeroSearch, type CarFilters } from "@/components/search-filters";
import { Layout } from "@/components/layout";
import { ShieldCheck, Car, Users, TrendingUp, ArrowRight, ChevronRight } from "lucide-react";
import type { CarWithDealer } from "@shared/schema";
import { Link } from "wouter";

export default function Home() {
  const [, navigate] = useLocation();

  const { data: featuredCars, isLoading: loadingFeatured } = useQuery<CarWithDealer[]>({
    queryKey: ["/api/cars?featured=true&limit=6"],
  });

  const { data: latestCars, isLoading: loadingLatest } = useQuery<CarWithDealer[]>({
    queryKey: ["/api/cars?limit=6&sort=newest"],
  });

  const { data: stats } = useQuery<{ totalCars: number; totalDealers: number; totalRegions: number }>({
    queryKey: ["/api/stats"],
  });

  const handleHeroSearch = (filters: CarFilters) => {
    const params = new URLSearchParams();
    if (filters.make) params.set("make", filters.make);
    if (filters.region) params.set("region", filters.region);
    navigate(`/cars?${params.toString()}`);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/hero-bg.png"
            alt="Tashkent cityscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-28 lg:py-36">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20 backdrop-blur">
              Uzbekistan's #1 Car Marketplace
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Find Your Perfect Car
            </h1>
            <p className="text-base sm:text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
              Browse thousands of verified cars from trusted dealers across all regions of Uzbekistan.
            </p>

            <HeroSearch onSearch={handleHeroSearch} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 mx-auto mb-2">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xl sm:text-2xl font-bold" data-testid="text-stat-cars">
                {stats?.totalCars ?? "..."}
              </p>
              <p className="text-xs text-muted-foreground">Cars Listed</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 mx-auto mb-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xl sm:text-2xl font-bold" data-testid="text-stat-dealers">
                {stats?.totalDealers ?? "..."}
              </p>
              <p className="text-xs text-muted-foreground">Verified Dealers</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 mx-auto mb-2">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xl sm:text-2xl font-bold" data-testid="text-stat-regions">
                {stats?.totalRegions ?? "..."}
              </p>
              <p className="text-xs text-muted-foreground">Regions Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h2 className="text-xl font-bold">Featured Cars</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Hand-picked premium listings</p>
          </div>
          <Link href="/cars?featured=true">
            <Button variant="ghost" className="gap-1.5 text-sm" data-testid="link-view-all-featured">
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loadingFeatured
            ? [...Array(6)].map((_, i) => <CarCardSkeleton key={i} />)
            : featuredCars?.map((car) => <CarCard key={car.id} car={car} />)}
          {!loadingFeatured && (!featuredCars || featuredCars.length === 0) && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <Car className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No featured cars yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Latest Listings */}
      <section className="bg-card border-y">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div>
              <h2 className="text-xl font-bold">Latest Listings</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Recently added cars</p>
            </div>
            <Link href="/cars">
              <Button variant="ghost" className="gap-1.5 text-sm" data-testid="link-view-all-latest">
                Browse All <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loadingLatest
              ? [...Array(6)].map((_, i) => <CarCardSkeleton key={i} />)
              : latestCars?.map((car) => <CarCard key={car.id} car={car} />)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center max-w-lg mx-auto">
          <TrendingUp className="w-10 h-10 mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-bold mb-2">Are You a Dealer?</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Join Uzbekistan's largest car marketplace and reach thousands of buyers every day.
          </p>
          <Link href="/dealers">
            <Button className="gap-2" data-testid="button-dealer-cta">
              View Dealers <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
