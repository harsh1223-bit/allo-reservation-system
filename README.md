# 🚀 Allo Reservation System

A production-style backend reservation system built using **Next.js**, **TypeScript**, **Prisma ORM**, **PostgreSQL**, and **Supabase**.

This project simulates a real-world inventory reservation workflow with transaction-safe stock handling, warehouse inventory tracking, and reservation expiration management.

---

# ✨ Features

## 📦 Inventory Management
- Manage products across multiple warehouses
- Track:
  - Total units
  - Reserved units
  - Available units

---

## 🏭 Warehouse Tracking
- Multiple warehouses supported
- Inventory distributed warehouse-wise

---

## 🔒 Reservation System
- Create inventory reservations safely
- Prevent overselling using database transactions
- Reservation expiration support

---

## ⏳ Expiration Handling
- Automatically release expired reservations
- Restore stock back into available inventory

---

## ⚡ Concurrency Safe
Uses Prisma transactions to avoid:
- Race conditions
- Double booking
- Overselling inventory

---

# 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| :contentReference[oaicite:0]{index=0} | Backend API framework |
| TypeScript | Type safety |
| Prisma ORM | Database ORM |
| PostgreSQL | Database |
| :contentReference[oaicite:1]{index=1} | Hosted PostgreSQL |
| REST APIs | API architecture |

---

# 📁 Project Structure

```bash
src/
 ├── app/
 │    └── api/
 │         ├── products/
 │         ├── warehouses/
 │         └── reservations/
 │
 ├── lib/
 │    └── prisma.ts
 │
prisma/
 ├── schema.prisma
 └── seed.ts
```

---

# 📡 API Endpoints

## 📦 Get Products

```http
GET /api/products
```

Returns:
- products
- warehouse inventory
- available stock

---

## 🏭 Get Warehouses

```http
GET /api/warehouses
```

Returns all warehouses.

---

## 🛒 Create Reservation

```http
POST /api/reservations
```

### Request Body

```json
{
  "productId": "PRODUCT_ID",
  "warehouseId": "WAREHOUSE_ID",
  "quantity": 1
}
```

### Features
- Validates stock
- Prevents overselling
- Uses Prisma transaction

---

## ⏳ Release Expired Reservations

```http
POST /api/reservations/release-expired
```

### Features
- Finds expired reservations
- Releases reserved inventory
- Marks reservations as EXPIRED

---

# 🧠 Database Design

## Tables

### Product
Stores product information.

### Warehouse
Stores warehouse details.

### Inventory
Tracks stock availability per warehouse.

### Reservation
Tracks active and expired reservations.

---

# 🔐 Concurrency Handling

Reservations are created inside database transactions:

```ts
await prisma.$transaction(...)
```

This ensures:
- atomic operations
- consistency
- no race conditions

---

# ⚙️ Local Setup

## 1️⃣ Clone Repository

```bash
git clone YOUR_GITHUB_REPO_URL
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Configure Environment Variables

Create `.env`

```env
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_url
```

---

## 4️⃣ Push Prisma Schema

```bash
npx prisma db push
```

---

## 5️⃣ Generate Prisma Client

```bash
npx prisma generate
```

---

## 6️⃣ Seed Database

```bash
npm run seed
```

---

## 7️⃣ Run Development Server

```bash
npm run dev
```

---

# 🧪 Test APIs

Use:
- Thunder Client
- Postman
- Browser

---

# 📌 Example Workflow

## Create Reservation
1. Fetch products
2. Select warehouse
3. Reserve quantity

---

## Expire Reservation
1. Wait for expiration
2. Call release endpoint
3. Inventory restores automatically

---

# 📈 Future Improvements

- Background cron jobs
- Authentication
- Admin dashboard
- Reservation confirmation flow
- WebSocket real-time inventory updates
- Docker deployment

---

# 👨‍💻 Author

Harsh Sharma

Backend Developer | Java & TypeScript Enthusiast

---

# ⭐ Project Highlights

✅ Transaction-safe reservations  
✅ Warehouse-level inventory tracking  
✅ Prisma + PostgreSQL architecture  
✅ Real-world backend design patterns  
✅ Expiration and inventory recovery flow  
✅ Production-style REST API structure  

---

# 📜 License

This project is for educational and assessment purposes.