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

Frontend:
- React (Vite)

Backend:
- Node.js
- Express

Database:
- PostgreSQL

Authentication:
- JWT

---

## Database Schema

Core tables:

- tenants
- users
- students
- classes
- attendance
- payments

Each table contains a `tenant_id` to enforce multi-tenant isolation.

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

✔ PostgreSQL database schema implemented  
✔ Backend server running  
✔ Express router architecture  
✔ Database connection pooling  
✔ User registration endpoint  
✔ Secure password hashing (bcrypt)  
✔ JWT authentication  
✔ Transaction-safe account creation  

---

## API Endpoints

### Register Account

`POST /api/auth/register`

Example request:

```json
{
    "tenantName": "Jarabi Tutoring",
    "name": "Alex",
    "email": "alex@email.com",
    "password": "123456"
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

## Roadmap

Next development milestones:

- Login endpoint
- JWT authentication middleware
- Student management API
- Class management API
- Attendance tracking
- Payment tracking
- Frontend dashboard

---

## Project Goal

Build a scalable SaaS product that can be used by tutoring centers and private tutors to manage their operations efficiently.