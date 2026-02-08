import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { DealerCard, DealerCardSkeleton } from "@/components/dealer-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, Users } from "lucide-react";
import { REGIONS } from "@shared/schema";
import { useState, useMemo } from "react";
import type { Dealer } from "@shared/schema";

export default function DealersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");

  const { data: dealers, isLoading } = useQuery<(Dealer & { carCount: number })[]>({
    queryKey: ["/api/dealers"],
  });

  const filtered = useMemo(() => {
    if (!dealers) return [];
    return dealers.filter((d) => {
      const matchesSearch = !searchTerm || d.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = regionFilter === "all" || d.region === regionFilter;
      return matchesSearch && matchesRegion;
    });
  }, [dealers, searchTerm, regionFilter]);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Verified Dealers</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Trusted car dealerships across Uzbekistan
          </p>
        </div>

        <Card className="p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search dealers..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-dealer-search"
              />
            </div>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-dealer-region">
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
        </Card>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <DealerCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((dealer) => (
              <DealerCard key={dealer.id} dealer={dealer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-semibold mb-1">No dealers found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or region filter.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
