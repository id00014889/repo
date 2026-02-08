import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, decimal, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const fuelTypeEnum = pgEnum("fuel_type", ["petrol", "diesel", "gas", "electric", "hybrid"]);
export const transmissionEnum = pgEnum("transmission", ["automatic", "manual"]);
export const bodyTypeEnum = pgEnum("body_type", ["sedan", "suv", "hatchback", "wagon", "coupe", "minivan", "pickup"]);
export const carStatusEnum = pgEnum("car_status", ["available", "sold", "reserved"]);

export const dealers = pgTable("dealers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  region: text("region").notNull(),
  logoUrl: text("logo_url"),
  verified: boolean("verified").default(false).notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0"),
  totalSales: integer("total_sales").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cars = pgTable("cars", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dealerId: varchar("dealer_id").notNull().references(() => dealers.id),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  price: integer("price").notNull(),
  mileage: integer("mileage").notNull(),
  fuelType: fuelTypeEnum("fuel_type").notNull(),
  transmission: transmissionEnum("transmission").notNull(),
  bodyType: bodyTypeEnum("body_type").notNull(),
  color: text("color").notNull(),
  engineSize: decimal("engine_size", { precision: 2, scale: 1 }),
  description: text("description"),
  imageUrl: text("image_url"),
  images: text("images").array(),
  status: carStatusEnum("status").default("available").notNull(),
  featured: boolean("featured").default(false).notNull(),
  city: text("city").notNull(),
  region: text("region").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const inquiries = pgTable("inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  carId: varchar("car_id").notNull().references(() => cars.id),
  dealerId: varchar("dealer_id").notNull().references(() => dealers.id),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDealerSchema = createInsertSchema(dealers).omit({ id: true, createdAt: true });
export const insertCarSchema = createInsertSchema(cars).omit({ id: true, createdAt: true });
export const insertInquirySchema = createInsertSchema(inquiries).omit({ id: true, createdAt: true });

export type InsertDealer = z.infer<typeof insertDealerSchema>;
export type InsertCar = z.infer<typeof insertCarSchema>;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;

export type Dealer = typeof dealers.$inferSelect;
export type Car = typeof cars.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;

export type CarWithDealer = Car & { dealer: Dealer };

export const REGIONS = [
  "Toshkent shahri",
  "Toshkent viloyati",
  "Samarqand",
  "Buxoro",
  "Andijon",
  "Farg'ona",
  "Namangan",
  "Qashqadaryo",
  "Surxondaryo",
  "Navoiy",
  "Xorazm",
  "Jizzax",
  "Sirdaryo",
  "Qoraqalpog'iston",
] as const;

export const MAKES = [
  "Chevrolet",
  "Kia",
  "Hyundai",
  "Toyota",
  "Lada",
  "BYD",
  "Chery",
  "Haval",
  "Geely",
] as const;
