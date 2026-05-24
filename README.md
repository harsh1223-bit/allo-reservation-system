# 🚀 Allo Reservation System

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge\&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge\&logo=prisma\&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge\&logo=supabase\&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge\&logo=postgresql\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge\&logo=tailwind-css\&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge\&logo=vercel\&logoColor=white)

### ⚡ Multi-Warehouse Inventory Reservation System

Production-style reservation flow with concurrency-safe inventory handling, reservation expiry, and real-time stock visibility.

Built with a strong focus on transactional consistency, scalable reservation workflows, and production-oriented system design.

</div>

A production-style multi-warehouse inventory reservation system built with Next.js, Prisma, Supabase, and TypeScript.

Live Demo: [https://allo-reservation-system-five.vercel.app/](https://allo-reservation-system-five.vercel.app/)

GitHub Repository: [https://github.com/harsh1223-bit/allo-reservation-system](https://github.com/harsh1223-bit/allo-reservation-system)

---

# Overview

This project simulates a real-world inventory reservation flow used in high-concurrency ecommerce systems.

When a customer proceeds to checkout, inventory is temporarily reserved for a limited duration instead of being permanently deducted immediately. This prevents overselling during payment processing while also avoiding inventory lockups caused by abandoned carts.

The system supports:

* Multi-warehouse inventory
* Inventory reservations
* Reservation expiry handling
* Reservation confirmation flow
* Reservation cancellation/release flow
* Quantity-based reservations
* Concurrency-safe inventory updates
* Live reservation countdowns

---

# Tech Stack

## Frontend

* Next.js 16 (App Router)
* React
* TypeScript
* Tailwind CSS

## Backend

* Next.js Route Handlers
* Prisma ORM
* Supabase PostgreSQL

## Deployment

* Vercel
* Supabase

---

# Features

## Product Inventory Dashboard

* Displays products across multiple warehouses
* Shows:

  * Total units
  * Reserved units
  * Available units
* Quantity selector for reservations
* Real-time UI updates

## Reservation Flow

Users can:

* Reserve inventory
* Select reservation quantity
* Complete payment simulation
* Cancel checkout
* View reservation details
* Track live reservation expiry countdown

## Reservation Expiry Handling

Pending reservations automatically expire after a fixed duration.

Expired reservations:

* Are marked as `RELEASED`
* Restore reserved inventory back to available stock

---

# Database Design

## Product

Represents inventory items.

## Warehouse

Represents physical inventory locations.

## Inventory

Stores stock information per product per warehouse.

Tracks:

* totalUnits
* reservedUnits

Available inventory is calculated as:

```txt
availableUnits = totalUnits - reservedUnits
```

## Reservation

Tracks temporary inventory holds.

Statuses:

* PENDING
* CONFIRMED
* RELEASED

Includes:

* quantity
* expiry time
* warehouse reference
* product reference

---

# API Endpoints

## GET /api/products

Returns products with warehouse inventory information.

---

## GET /api/warehouses

Returns all warehouses.

---

## POST /api/reservations

Creates an inventory reservation.

Returns:

* `201` on success
* `409` when stock is insufficient

---

## POST /api/reservations/:id/confirm

Confirms reservation after payment success simulation.

Returns:

* `200` on success
* `410` if reservation already expired

---

## POST /api/reservations/:id/release

Releases reservation early when payment fails or checkout is cancelled.

---

## POST /api/reservations/release-expired

Automatically releases expired reservations.

---

# Concurrency Handling

Concurrency correctness was the primary focus of this project.

The reservation flow uses Prisma database transactions to ensure inventory consistency.

When a reservation request is made:

1. Inventory row is fetched
2. Available units are calculated
3. Reservation is rejected if stock is insufficient
4. Reserved units are incremented atomically
5. Reservation record is created inside the same transaction

This guarantees that if two requests attempt to reserve the final available unit simultaneously, only one succeeds while the other receives a `409 Conflict` response.

---

# Reservation Expiry Strategy

Reservations contain an `expiresAt` timestamp.

Expired reservations are released through a dedicated API endpoint:

```txt
/api/reservations/release-expired
```

The endpoint:

* Finds expired pending reservations
* Restores reserved inventory
* Marks reservations as RELEASED

In production, this endpoint can be triggered using:

* Vercel Cron Jobs
* Background workers
* Scheduled serverless invocations

For this implementation, the release mechanism is implemented and production-ready for scheduled execution.

---

# UI/UX Features

* Responsive inventory dashboard
* Modern gradient-based UI
* Quantity selectors
* Loading states
* Inline error handling
* Expiry countdown timer
* Reservation status indicators
* Disabled states for invalid actions

---

# Environment Variables

Create a `.env` file:

```env
DATABASE_URL="YOUR_SUPABASE_POOLED_URL"
DIRECT_URL="YOUR_SUPABASE_DIRECT_URL"
```

---

# Local Development Setup

## Install dependencies

```bash
npm install
```

## Generate Prisma client

```bash
npx prisma generate
```

## Push database schema

```bash
npx prisma db push
```

## Seed database

```bash
npx prisma db seed
```

## Start development server

```bash
npm run dev
```

---

# Production Deployment

## Frontend Hosting

* Vercel

## Database Hosting

* Supabase PostgreSQL

Deployment includes:

* Production environment variables
* Prisma client generation during build
* Hosted production database

---

# Tradeoffs & Design Decisions

## What Was Prioritized

* Correct inventory reservation behavior
* Concurrency safety
* Clean reservation lifecycle
* Simplicity and maintainability
* Production-style UX

## What Could Be Improved Further

Given more time, the following improvements could be added:

* Redis-based distributed locking
* Idempotency-Key support
* WebSocket live inventory updates
* Authentication & user accounts
* Reservation analytics dashboard
* Automated Vercel Cron configuration
* Inventory audit logs
* Rate limiting

---

# Key Learning Outcomes

This project focused heavily on:

* Designing race-condition-safe reservation systems
* Managing temporary inventory holds
* Transactional consistency using Prisma
* Full-stack Next.js architecture
* Production deployment workflows

---

# Author

Harsh Sharma

GitHub:
[https://github.com/harsh1223-bit](https://github.com/harsh1223-bit)

---

# Live Demo

[https://allo-reservation-system-five.vercel.app/](https://allo-reservation-system-five.vercel.app/)
