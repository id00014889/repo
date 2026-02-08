import { eq, desc, asc, ilike, and, gte, lte, sql, count } from "drizzle-orm";
import { db } from "./db";
import {
  dealers, cars, inquiries,
  type Dealer, type Car, type InsertDealer, type InsertCar, type InsertInquiry,
  type CarWithDealer, type Inquiry,
} from "@shared/schema";

export interface CarQueryOptions {
  search?: string;
  make?: string;
  region?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  featured?: boolean;
  dealerId?: string;
  status?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}

export interface IStorage {
  getDealers(): Promise<(Dealer & { carCount: number })[]>;
  getDealerBySlug(slug: string): Promise<(Dealer & { carCount: number }) | undefined>;
  getDealerById(id: string): Promise<Dealer | undefined>;
  createDealer(dealer: InsertDealer): Promise<Dealer>;

  getCars(options?: CarQueryOptions): Promise<CarWithDealer[]>;
  getCarById(id: string): Promise<CarWithDealer | undefined>;
  getCarsByDealerSlug(slug: string): Promise<CarWithDealer[]>;
  createCar(car: InsertCar): Promise<Car>;

  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;

  getStats(): Promise<{ totalCars: number; totalDealers: number; totalRegions: number }>;
}

export class DatabaseStorage implements IStorage {
  async getDealers(): Promise<(Dealer & { carCount: number })[]> {
    const result = await db
      .select({
        dealer: dealers,
        carCount: count(cars.id),
      })
      .from(dealers)
      .leftJoin(cars, eq(dealers.id, cars.dealerId))
      .groupBy(dealers.id)
      .orderBy(desc(dealers.verified), dealers.name);

    return result.map((r) => ({ ...r.dealer, carCount: Number(r.carCount) }));
  }

  async getDealerBySlug(slug: string): Promise<(Dealer & { carCount: number }) | undefined> {
    const result = await db
      .select({
        dealer: dealers,
        carCount: count(cars.id),
      })
      .from(dealers)
      .leftJoin(cars, eq(dealers.id, cars.dealerId))
      .where(eq(dealers.slug, slug))
      .groupBy(dealers.id);

    if (result.length === 0) return undefined;
    return { ...result[0].dealer, carCount: Number(result[0].carCount) };
  }

  async getDealerById(id: string): Promise<Dealer | undefined> {
    const result = await db.select().from(dealers).where(eq(dealers.id, id));
    return result[0];
  }

  async createDealer(dealer: InsertDealer): Promise<Dealer> {
    const result = await db.insert(dealers).values(dealer).returning();
    return result[0];
  }

  async getCars(options: CarQueryOptions = {}): Promise<CarWithDealer[]> {
    const conditions = [];

    if (options.search) {
      conditions.push(
        sql`(${cars.make} ILIKE ${`%${options.search}%`} OR ${cars.model} ILIKE ${`%${options.search}%`})`
      );
    }
    if (options.make) conditions.push(eq(cars.make, options.make));
    if (options.region) conditions.push(eq(cars.region, options.region));
    if (options.bodyType) conditions.push(eq(cars.bodyType, options.bodyType as any));
    if (options.fuelType) conditions.push(eq(cars.fuelType, options.fuelType as any));
    if (options.transmission) conditions.push(eq(cars.transmission, options.transmission as any));
    if (options.minPrice) conditions.push(gte(cars.price, options.minPrice));
    if (options.maxPrice) conditions.push(lte(cars.price, options.maxPrice));
    if (options.minYear) conditions.push(gte(cars.year, options.minYear));
    if (options.maxYear) conditions.push(lte(cars.year, options.maxYear));
    if (options.featured) conditions.push(eq(cars.featured, true));
    if (options.dealerId) conditions.push(eq(cars.dealerId, options.dealerId));
    if (options.status) conditions.push(eq(cars.status, options.status as any));

    let orderBy;
    switch (options.sort) {
      case "price_asc": orderBy = asc(cars.price); break;
      case "price_desc": orderBy = desc(cars.price); break;
      case "year_desc": orderBy = desc(cars.year); break;
      case "mileage_asc": orderBy = asc(cars.mileage); break;
      default: orderBy = desc(cars.createdAt);
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const limit = options.limit || 50;

    const result = await db
      .select()
      .from(cars)
      .leftJoin(dealers, eq(cars.dealerId, dealers.id))
      .where(where)
      .orderBy(orderBy)
      .limit(limit);

    return result.map((r) => ({
      ...r.cars,
      dealer: r.dealers!,
    }));
  }

  async getCarById(id: string): Promise<CarWithDealer | undefined> {
    const result = await db
      .select()
      .from(cars)
      .leftJoin(dealers, eq(cars.dealerId, dealers.id))
      .where(eq(cars.id, id));

    if (result.length === 0) return undefined;
    return {
      ...result[0].cars,
      dealer: result[0].dealers!,
    };
  }

  async getCarsByDealerSlug(slug: string): Promise<CarWithDealer[]> {
    const dealer = await db.select().from(dealers).where(eq(dealers.slug, slug));
    if (dealer.length === 0) return [];

    return this.getCars({ dealerId: dealer[0].id });
  }

  async createCar(car: InsertCar): Promise<Car> {
    const result = await db.insert(cars).values(car).returning();
    return result[0];
  }

  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const result = await db.insert(inquiries).values(inquiry).returning();
    return result[0];
  }

  async getStats(): Promise<{ totalCars: number; totalDealers: number; totalRegions: number }> {
    const [carCount] = await db.select({ count: count() }).from(cars).where(eq(cars.status, "available"));
    const [dealerCount] = await db.select({ count: count() }).from(dealers).where(eq(dealers.verified, true));
    const regionResult = await db.selectDistinct({ region: dealers.region }).from(dealers);

    return {
      totalCars: Number(carCount.count),
      totalDealers: Number(dealerCount.count),
      totalRegions: regionResult.length,
    };
  }
}

export const storage = new DatabaseStorage();
