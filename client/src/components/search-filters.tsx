import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { MAKES, REGIONS } from "@shared/schema";
import { useState } from "react";

export interface CarFilters {
  search?: string;
  make?: string;
  region?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  minPrice?: string;
  maxPrice?: string;
  minYear?: string;
  maxYear?: string;
  sort?: string;
}

interface SearchFiltersProps {
  filters: CarFilters;
  onFiltersChange: (filters: CarFilters) => void;
  compact?: boolean;
}

const bodyTypes = [
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "hatchback", label: "Hatchback" },
  { value: "wagon", label: "Wagon" },
  { value: "coupe", label: "Coupe" },
  { value: "minivan", label: "Minivan" },
  { value: "pickup", label: "Pickup" },
];

const fuelTypes = [
  { value: "petrol", label: "Petrol" },
  { value: "diesel", label: "Diesel" },
  { value: "gas", label: "Gas (LPG)" },
  { value: "electric", label: "Electric" },
  { value: "hybrid", label: "Hybrid" },
];

export function SearchFilters({ filters, onFiltersChange, compact = false }: SearchFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof CarFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value === "all" ? undefined : value });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some((v) => v && v !== "");

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by make, model..."
            className="pl-9"
            value={filters.search || ""}
            onChange={(e) => updateFilter("search", e.target.value)}
            data-testid="input-search"
          />
        </div>
        <Button
          variant={showAdvanced ? "secondary" : "outline"}
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="gap-2"
          data-testid="button-toggle-filters"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {!compact && <span className="hidden sm:inline">Filters</span>}
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} className="gap-1.5 text-destructive" data-testid="button-clear-filters">
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        )}
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2 border-t">
          <div className="space-y-1.5">
            <Label className="text-xs">Make</Label>
            <Select value={filters.make || "all"} onValueChange={(v) => updateFilter("make", v)}>
              <SelectTrigger data-testid="select-make">
                <SelectValue placeholder="All Makes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Makes</SelectItem>
                {MAKES.map((make) => (
                  <SelectItem key={make} value={make}>{make}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Region</Label>
            <Select value={filters.region || "all"} onValueChange={(v) => updateFilter("region", v)}>
              <SelectTrigger data-testid="select-region">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {REGIONS.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Body Type</Label>
            <Select value={filters.bodyType || "all"} onValueChange={(v) => updateFilter("bodyType", v)}>
              <SelectTrigger data-testid="select-body-type">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {bodyTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Fuel</Label>
            <Select value={filters.fuelType || "all"} onValueChange={(v) => updateFilter("fuelType", v)}>
              <SelectTrigger data-testid="select-fuel-type">
                <SelectValue placeholder="All Fuel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fuel Types</SelectItem>
                {fuelTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Transmission</Label>
            <Select value={filters.transmission || "all"} onValueChange={(v) => updateFilter("transmission", v)}>
              <SelectTrigger data-testid="select-transmission">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="automatic">Automatic</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Min Price (USD)</Label>
            <Input
              type="number"
              placeholder="0"
              value={filters.minPrice || ""}
              onChange={(e) => updateFilter("minPrice", e.target.value)}
              data-testid="input-min-price"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Max Price (USD)</Label>
            <Input
              type="number"
              placeholder="Any"
              value={filters.maxPrice || ""}
              onChange={(e) => updateFilter("maxPrice", e.target.value)}
              data-testid="input-max-price"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Sort By</Label>
            <Select value={filters.sort || "newest"} onValueChange={(v) => updateFilter("sort", v)}>
              <SelectTrigger data-testid="select-sort">
                <SelectValue placeholder="Newest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="year_desc">Year: Newest</SelectItem>
                <SelectItem value="mileage_asc">Mileage: Lowest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </Card>
  );
}

export function HeroSearch({ onSearch }: { onSearch: (filters: CarFilters) => void }) {
  const [make, setMake] = useState("");
  const [region, setRegion] = useState("");

  const handleSearch = () => {
    onSearch({
      make: make || undefined,
      region: region || undefined,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl">
      <Select value={make || "all"} onValueChange={(v) => setMake(v === "all" ? "" : v)}>
        <SelectTrigger className="bg-background/90 backdrop-blur border-white/20 text-foreground" data-testid="select-hero-make">
          <SelectValue placeholder="All Makes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Makes</SelectItem>
          {MAKES.map((m) => (
            <SelectItem key={m} value={m}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={region || "all"} onValueChange={(v) => setRegion(v === "all" ? "" : v)}>
        <SelectTrigger className="bg-background/90 backdrop-blur border-white/20 text-foreground" data-testid="select-hero-region">
          <SelectValue placeholder="All Regions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Regions</SelectItem>
          {REGIONS.map((r) => (
            <SelectItem key={r} value={r}>{r}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={handleSearch} className="gap-2" data-testid="button-hero-search">
        <Search className="w-4 h-4" />
        Search
      </Button>
    </div>
  );
}
