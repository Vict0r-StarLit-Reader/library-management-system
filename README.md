# Library Management System - Backend API

A NestJS backend service for a library management system using **Prisma ORM** and **PostgreSQL**.

---

## Features & Architecture

* **Database & ORM**: PostgreSQL managed via Prisma ORM.
* **Role-Based Users**: User entity supporting `PATRON` and `LIBRARIAN` roles via a Prisma enum.
* **Catalog Management**: Normalized relational schema managing `Genre` and `Book` entities.

---

## Setup & Installation

### 1. Prerequisites
* Node.js (v18+)
* PostgreSQL instance (local or hosted via Neon/Supabase)

### 2. Environment Configuration
Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://neondb_owner:npg_8qJNm1XkWVFA@ep-super-pond-a8vj5t8e-pooler.eastus2.azure.neon.tech/neondb?sslmode=require"

### 3. Install Dependencies
```bash
npm install ts-node -D
```
## Database Operations

### 1. Run Migrations
Apply Prisma migrations to update your PostgreSQL database schema:

```bash
npx prisma migrate dev --name init
```
### 2. Seed Database
Populate the database with initial genres and books (inserts 4 genres and 16 books):

```bash
npx prisma db seed
```

## Schema Decisions

### Why `Book` References `Genre` via Foreign Key (`genreId`)

In designing the database schema, **`Book` references `Genre` using a `genreId` foreign key rather than embedding genre details directly inside the book record.**

* **Data Normalization & Integrity**: Normalizing `Genre` into its own table ensures a single source of truth for every category. Updating a genre name (e.g., changing "Sci-Fi" to "Science Fiction") requires updating only one row in the `Genre` table instead of performing cascading updates across thousands of `Book` records.
* **Query & Index Performance**: Numeric foreign key lookups and relational joins in PostgreSQL are fast and indexed efficiently, maintaining consistent performance as the catalog scales.
* **Aggregation & Filtering**: Having a dedicated `Genre` entity allows simple queries to count, list, or filter books by category without duplicate string parameters across the application.