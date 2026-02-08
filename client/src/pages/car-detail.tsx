import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatPrice, formatMileage } from "@/lib/formatters";
import {
  Calendar, Fuel, Gauge, MapPin, ShieldCheck, Star,
  Phone, MessageCircle, ArrowLeft, Palette, Settings2, Zap, ChevronLeft
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { CarWithDealer } from "@shared/schema";

const inquiryFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(9, "Valid phone number required"),
  message: z.string().optional(),
});

type InquiryForm = z.infer<typeof inquiryFormSchema>;

const fuelLabels: Record<string, string> = {
  petrol: "Petrol", diesel: "Diesel", gas: "Gas (LPG)", electric: "Electric", hybrid: "Hybrid",
};

const transmissionLabels: Record<string, string> = {
  automatic: "Automatic", manual: "Manual",
};

const bodyLabels: Record<string, string> = {
  sedan: "Sedan", suv: "SUV", hatchback: "Hatchback", wagon: "Wagon",
  coupe: "Coupe", minivan: "Minivan", pickup: "Pickup",
};

export default function CarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const { data: car, isLoading } = useQuery<CarWithDealer>({
    queryKey: ["/api/cars", id],
  });

  const form = useForm<InquiryForm>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: { name: "", phone: "", message: "" },
  });

  const inquiryMutation = useMutation({
    mutationFn: async (data: InquiryForm) => {
      await apiRequest("POST", "/api/inquiries", {
        ...data,
        carId: car!.id,
        dealerId: car!.dealerId,
      });
    },
    onSuccess: () => {
      toast({ title: "Inquiry Sent", description: "The dealer will contact you shortly." });
      form.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to send inquiry. Please try again.", variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="w-full aspect-[16/10] rounded-md" />
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-64 rounded-md" />
              <Skeleton className="h-40 rounded-md" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!car) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h2 className="text-xl font-bold mb-2">Car Not Found</h2>
          <p className="text-muted-foreground mb-6">This listing may have been removed.</p>
          <Link href="/cars">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Cars
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const dealer = car.dealer;
  const dealerInitials = dealer?.name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "D";

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <Link href="/cars">
          <Button variant="ghost" className="gap-1.5 mb-4 -ml-2 text-sm" data-testid="button-back-to-cars">
            <ChevronLeft className="w-4 h-4" /> Back to Cars
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="relative overflow-hidden rounded-md">
              <img
                src={car.imageUrl || "/images/car-1.png"}
                alt={`${car.make} ${car.model}`}
                className="w-full aspect-[16/10] object-cover"
              />
              {car.featured && (
                <Badge className="absolute top-3 left-3">Featured</Badge>
              )}
              {car.status === "sold" && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive" className="text-base">Sold</Badge>
                </div>
              )}
            </div>

            {/* Title & Price */}
            <div>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl font-bold" data-testid="text-car-title">
                    {car.year} {car.make} {car.model}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{car.city}, {car.region}</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-primary" data-testid="text-car-price">
                  {formatPrice(car.price)}
                </p>
              </div>
            </div>

            <Separator />

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <SpecItem icon={Calendar} label="Year" value={String(car.year)} />
              <SpecItem icon={Gauge} label="Mileage" value={formatMileage(car.mileage)} />
              <SpecItem icon={Fuel} label="Fuel" value={fuelLabels[car.fuelType]} />
              <SpecItem icon={Settings2} label="Transmission" value={transmissionLabels[car.transmission]} />
              <SpecItem icon={Zap} label="Body" value={bodyLabels[car.bodyType]} />
              <SpecItem icon={Palette} label="Color" value={car.color} />
              {car.engineSize && (
                <SpecItem icon={Settings2} label="Engine" value={`${car.engineSize}L`} />
              )}
            </div>

            {/* Description */}
            {car.description && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap" data-testid="text-car-description">
                    {car.description}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Dealer Card */}
            {dealer && (
              <Card className="p-4">
                <Link href={`/dealers/${dealer.slug}`}>
                  <div className="flex items-center gap-3 cursor-pointer" data-testid="link-car-dealer">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {dealerInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm truncate">{dealer.name}</span>
                        {dealer.verified && <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">{dealer.city}</span>
                        {Number(dealer.rating) > 0 && (
                          <div className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            <span className="text-xs text-muted-foreground">{dealer.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
                <Separator className="my-3" />
                <a href={`tel:${dealer.phone}`}>
                  <Button variant="outline" className="w-full gap-2" data-testid="button-call-dealer">
                    <Phone className="w-4 h-4" />
                    {dealer.phone}
                  </Button>
                </a>
              </Card>
            )}

            {/* Inquiry Form */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Send Inquiry
              </h3>
              <form
                onSubmit={form.handleSubmit((data) => inquiryMutation.mutate(data))}
                className="space-y-3"
                data-testid="form-inquiry"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    {...form.register("name")}
                    data-testid="input-inquiry-name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+998 XX XXX XX XX"
                    {...form.register("phone")}
                    data-testid="input-inquiry-phone"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-xs">Message (optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="I'm interested in this car..."
                    className="resize-none"
                    rows={3}
                    {...form.register("message")}
                    data-testid="input-inquiry-message"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={inquiryMutation.isPending} data-testid="button-send-inquiry">
                  {inquiryMutation.isPending ? "Sending..." : "Send Inquiry"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function SpecItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-card rounded-md border border-card-border">
      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
