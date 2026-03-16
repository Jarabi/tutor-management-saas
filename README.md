# Tutor SaaS Platform

A multi-tenant SaaS platform for private tutors and tuition centers to manage students, classes, attendance, and payments.

The system is designed to replace paper-based workflows used by many tutoring centers with a simple web-based management dashboard.

---

## Problem

Many tutoring centers still manage operations using:

- paper registers
- physical student files
- handwritten attendance logs
- manual payment tracking

This leads to:

- lost records
- difficult reporting
- inefficient administration

This platform digitizes those workflows.

### Why this project exists:

This project was inspired by tutoring centers that still rely on paper-based administration. The goal is to digitize student records, attendance, and payment tracking through a simple SaaS platform.

---

## Solution

Tutor SaaS provides:

- student management
- class scheduling
- attendance tracking
- payment tracking
- parent contact records

Each tutoring center operates in its own isolated tenant environment.

---

## Architecture

```
Client (React)
    ↓
REST API (Node + Express)
    ↓
Service Layer
    ↓
PostgreSQL Database
```

Request flow:

```
Client request
    ↓
Express middleware
    ↓
Route handler
    ↓
Controller
    ↓
Database query
    ↓
Response
```

---

## Database Schema

The platform uses a multi-tenant architecture where every record belongs to a tenant.

Core tables:

>- tenants
>- users
>- students
>- classes
>- attendance
>- payments

Key relationships:

```
tenants
   │
   └── users

tenants
   │
   ├── students
   ├── classes
   ├── attendance
   └── payments
```

Each table contains a `tenant_id` to enforce multi-tenant isolation. This ensures:
>- data isolation
>- scalable SaaS architecture
>- secure tenant separation

---

## Backend Structure

```bash
backend
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   └── authController.js
│   ├── middleware
│   │   └── authMiddleware.js
│   ├── package.json
│   ├── package-lock.json
│   ├── routes
│   │   └── authRoutes.js
│   └── server.js
```

---

## Current Features

>✔ PostgreSQL database schema implemented  
>✔ Backend server running  
>✔ Express router architecture  
>✔ Database connection pooling  
>✔ User registration endpoint  
>✔ Secure password hashing (bcrypt)  
>✔ JWT authentication  
>✔ Transaction-safe account creation  

---

## API Endpoints

### Register Account

`POST /api/auth/register`

Request:

```json
{
    "tenantName": "Jarabi Tutoring",
    "name": "Alex",
    "email": "alex@email.com",
    "password": "123456"
}
```

Response:

```
{
  "message": "Account created",
  "token": "JWT_TOKEN"
}
```
---

## Local Development

Clone repository
```bash
git clone <repo>
```

Install dependencies

```bash
npm install
```

Create `.env`

```
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=tutor_saas
DB_USER=your_user
DB_PASSWORD=your_password

JWT_SECRET=your_secret
```

Run development server

```bash
npm run dev
```

Server runs at http://localhost:5000

---

## Development Roadmap

Phase 1 (Current):

>✔ Database schema  
>✔ Backend server  
>✔ User registration  
>✔ JWT authentication

Phase 2:

> Login endpoint  
>✔ JWT authentication middleware  
>✔ Student CRUD API  

Phase 3:

> Class scheduling  
> Attendance tracking  
> Payment recording  

Phase 4:

> React dashboard  
> Analytics  
> Subscription billing  

---

## Project Goal

Build a scalable SaaS product that can be used by tutoring centers and private tutors to manage their operations efficiently.