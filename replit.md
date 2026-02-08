# AvtoUz - Car Marketplace for Uzbekistan

## Overview
National car marketplace platform for Uzbekistan with verified dealers. Users can browse car listings, filter by various criteria, view dealer profiles, and send inquiries to dealers.

## Tech Stack
- **Frontend**: React (Vite) + TypeScript, TailwindCSS, shadcn/ui components
- **Backend**: Node.js + Express (TypeScript)
- **Database**: PostgreSQL (Replit PostgreSQL) with Drizzle ORM
- **State Management**: TanStack React Query

## Project Structure
```
client/src/
  pages/          - Route pages (home, cars, car-detail, dealers, dealer-detail)
  components/     - Reusable components (layout, car-card, dealer-card, search-filters, theme)
  lib/            - Utilities (queryClient, formatters)
  hooks/          - Custom hooks

server/
  index.ts        - Express server entry
  routes.ts       - API route handlers
  storage.ts      - Database storage interface (IStorage + DatabaseStorage)
  db.ts           - Drizzle database connection
  seed.ts         - Seed data for initial load

shared/
  schema.ts       - Drizzle schema definitions, types, constants
```

## Data Models
- **Dealers**: Verified car dealerships with ratings, locations
- **Cars**: Vehicle listings with specs (make, model, year, price, fuel, transmission, body type)
- **Inquiries**: Contact form submissions from potential buyers

## API Routes
- `GET /api/stats` - Platform statistics
- `GET /api/cars` - List cars with filters (search, make, region, bodyType, fuelType, transmission, price range, sort)
- `GET /api/cars/:id` - Single car details with dealer
- `GET /api/dealers` - List dealers with car counts
- `GET /api/dealers/:slug` - Dealer details
- `GET /api/dealers/:slug/cars` - Cars from specific dealer
- `POST /api/inquiries` - Submit buyer inquiry

## Features
- Hero section with quick search
- Advanced car search with filters
- Car detail pages with dealer contact
- Dealer profiles with car listings
- Inquiry form for contacting dealers
- Dark/light theme support
- Responsive design

## Recent Changes
- 2026-02-08: Initial MVP build with full frontend, backend, and database seeding
