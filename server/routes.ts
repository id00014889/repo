import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, type CarQueryOptions } from "./storage";
import { insertInquirySchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/stats", async (_req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get("/api/cars", async (req, res) => {
    try {
      const options: CarQueryOptions = {
        search: req.query.search as string | undefined,
        make: req.query.make as string | undefined,
        region: req.query.region as string | undefined,
        bodyType: req.query.bodyType as string | undefined,
        fuelType: req.query.fuelType as string | undefined,
        transmission: req.query.transmission as string | undefined,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        minYear: req.query.minYear ? Number(req.query.minYear) : undefined,
        maxYear: req.query.maxYear ? Number(req.query.maxYear) : undefined,
        featured: req.query.featured === "true" ? true : undefined,
        sort: req.query.sort as string | undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
      };
      const result = await storage.getCars(options);
      res.json(result);
    } catch (error) {
      console.error("Error fetching cars:", error);
      res.status(500).json({ message: "Failed to fetch cars" });
    }
  });

  app.get("/api/cars/:id", async (req, res) => {
    try {
      const car = await storage.getCarById(req.params.id);
      if (!car) return res.status(404).json({ message: "Car not found" });
      res.json(car);
    } catch (error) {
      console.error("Error fetching car:", error);
      res.status(500).json({ message: "Failed to fetch car" });
    }
  });

  app.get("/api/dealers", async (_req, res) => {
    try {
      const result = await storage.getDealers();
      res.json(result);
    } catch (error) {
      console.error("Error fetching dealers:", error);
      res.status(500).json({ message: "Failed to fetch dealers" });
    }
  });

  app.get("/api/dealers/:slug", async (req, res) => {
    try {
      const dealer = await storage.getDealerBySlug(req.params.slug);
      if (!dealer) return res.status(404).json({ message: "Dealer not found" });
      res.json(dealer);
    } catch (error) {
      console.error("Error fetching dealer:", error);
      res.status(500).json({ message: "Failed to fetch dealer" });
    }
  });

  app.get("/api/dealers/:slug/cars", async (req, res) => {
    try {
      const result = await storage.getCarsByDealerSlug(req.params.slug);
      res.json(result);
    } catch (error) {
      console.error("Error fetching dealer cars:", error);
      res.status(500).json({ message: "Failed to fetch dealer cars" });
    }
  });

  app.post("/api/inquiries", async (req, res) => {
    try {
      const parsed = insertInquirySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid inquiry data", errors: parsed.error.flatten() });
      }
      const inquiry = await storage.createInquiry(parsed.data);
      res.status(201).json(inquiry);
    } catch (error) {
      console.error("Error creating inquiry:", error);
      res.status(500).json({ message: "Failed to create inquiry" });
    }
  });

  return httpServer;
}
