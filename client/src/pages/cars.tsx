import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import { Layout } from "@/components/layout";
import { CarCard, CarCardSkeleton } from "@/components/car-card";
import { SearchFilters, type CarFilters } from "@/components/search-filters";
import { Car } from "lucide-react";
import type { CarWithDealer } from "@shared/schema";

export default function CarsPage() {
  const search = useSearch();
  const [, navigate] = useLocation();

  const params = new URLSearchParams(search);
  const filters: CarFilters = {
    search: params.get("search") || undefined,
    make: params.get("make") || undefined,
    region: params.get("region") || undefined,
    bodyType: params.get("bodyType") || undefined,
    fuelType: params.get("fuelType") || undefined,
    transmission: params.get("transmission") || undefined,
    minPrice: params.get("minPrice") || undefined,
    maxPrice: params.get("maxPrice") || undefined,
    minYear: params.get("minYear") || undefined,
    maxYear: params.get("maxYear") || undefined,
    sort: params.get("sort") || undefined,
  };

  const queryString = buildQueryString(filters);

  const { data: cars, isLoading } = useQuery<CarWithDealer[]>({
    queryKey: [queryString ? `/api/cars?${queryString}` : "/api/cars"],
  });

  const handleFiltersChange = (newFilters: CarFilters) => {
    const p = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) p.set(key, value);
    });
    navigate(`/cars?${p.toString()}`, { replace: true });
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Browse Cars</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isLoading ? "Loading..." : `${cars?.length ?? 0} cars found`}
          </p>
        </div>

        <div className="space-y-4">
          <SearchFilters filters={filters} onFiltersChange={handleFiltersChange} />

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => (
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
            <div className="text-center py-20">
              <Car className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-semibold mb-1">No cars found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters to find more results.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function buildQueryString(filters: CarFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return params.toString();
}
