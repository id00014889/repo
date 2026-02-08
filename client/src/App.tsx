import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "@/pages/home";
import CarsPage from "@/pages/cars";
import CarDetailPage from "@/pages/car-detail";
import DealersPage from "@/pages/dealers";
import DealerDetailPage from "@/pages/dealer-detail";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cars" component={CarsPage} />
      <Route path="/cars/:id" component={CarDetailPage} />
      <Route path="/dealers" component={DealersPage} />
      <Route path="/dealers/:slug" component={DealerDetailPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
