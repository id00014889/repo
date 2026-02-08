import { Link, useLocation } from "wouter";
import { Car, Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useState } from "react";

export function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/cars", label: "Cars" },
    { href: "/dealers", label: "Dealers" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary">
              <Car className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold leading-tight" data-testid="text-brand-name">AvtoUz</span>
              <span className="text-[10px] text-muted-foreground leading-none hidden sm:block">Marketplace</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={location === link.href ? "secondary" : "ghost"}
                  className="text-sm"
                  data-testid={`link-nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href="tel:+998712345678" className="hidden sm:flex">
              <Button variant="outline" className="gap-2 text-sm" data-testid="link-phone">
                <Phone className="w-3.5 h-3.5" />
                +998 71 234 56 78
              </Button>
            </a>
            <ThemeToggle />
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={location === link.href ? "secondary" : "ghost"}
                  className="w-full justify-start text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            <a href="tel:+998712345678" className="sm:hidden">
              <Button variant="outline" className="w-full gap-2 text-sm">
                <Phone className="w-3.5 h-3.5" />
                +998 71 234 56 78
              </Button>
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary">
                <Car className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold">AvtoUz</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The leading car marketplace in Uzbekistan. Buy and sell cars from verified dealers nationwide.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link href="/cars" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Browse Cars</Link>
              <Link href="/dealers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Find Dealers</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Popular Makes</h4>
            <div className="flex flex-col gap-2">
              <Link href="/cars?make=Chevrolet" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Chevrolet</Link>
              <Link href="/cars?make=Kia" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Kia</Link>
              <Link href="/cars?make=Hyundai" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Hyundai</Link>
              <Link href="/cars?make=Toyota" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Toyota</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Contact</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>Tashkent, Uzbekistan</span>
              <a href="tel:+998712345678" className="hover:text-foreground transition-colors">+998 71 234 56 78</a>
              <a href="mailto:info@avtoux.uz" className="hover:text-foreground transition-colors">info@avtoux.uz</a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} AvtoUz. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
