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

## Technology Stack

Backend
- Node.js
- Express.js

Database
- PostgreSQL

Authentication
- JSON Web Tokens (JWT)
- bcrypt password hashing

Development Tools
- REST Client for API testing
- Git for version control

---

## Backend Structure

```bash
backend/
└── src
    ├── app.js
    ├── config
    │   └── db.js
    ├── middleware
    │   ├── authMiddleware.js
    │   └── errorMiddleware.js
    ├── modules
    │   ├── auth
    │   │   ├── auth.controller.js
    │   │   ├── auth.routes.js
    │   │   └── auth.service.js
    │   ├── classes
    │   │   ├── class.controller.js
    │   │   ├── class.routes.js
    │   │   └── class.service.js
    │   ├── payments
    │   │   ├── payment.controller.js
    │   │   ├── payment.routes.js
    │   │   └── payment.service.js
    │   └── students
    │       ├── student.controller.js
    │       ├── student.routes.js
    │       └── student.service.js
    ├── server.js
    └── utils
```

---

### Multi-Tenant Architecture

The platform is designed as a **multi-tenant SaaS system**.

Each user is a **tenant**.

All core data tables include `tenant_id`

This ensures:

- strict data isolation between tenants
- secure tenant-aware queries
- scalable SaaS architecture

Example query pattern:
```sql
SELECT * FROM students
WHERE tenant_id = $1
```

The tenant ID is extracted from the JWT during authentication.

---

## Database Schema

Core tables:
- tenants
- users
- students

Relationships:
```sql
tenants
│
├── users
└── students
```

Future modules will add:
- classes
- attendance
- payments

---

## Authentication

The system uses **JWT-based authentication**.

Endpoints:

`POST /api/auth/register`
Create a new user.

`POST /api/auth/login`
Authenticate a user and return a JWT token.

Protected routes require `Authorization: Bearer TOKEN`

The token contains:
- userId
- tenantId

This allows the backend to enforce tenant isolation automatically.

---

## Students API

The Students module provides a complete CRUD API.

Endpoints:

`POST /api/students`
Create a student.

`GET /api/students`
Retrieve all students for the current tenant.

`GET /api/students/`
Retrieve a specific student.

`PUT /api/students/`
Update a student.

`DELETE /api/students/`
Delete a student.

All student queries are tenant-aware to prevent cross-tenant data access.

---

## Current Features

>✔ PostgreSQL database schema  
>✔ Multi-tenant architecture  
>✔ Express backend API  
>✔ Modular feature-based project structure  
>✔ User registration  
>✔ User login  
>✔ JWT authentication  
>✔ Protected routes middleware  
>✔ Students CRUD API  

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

>✔ Login endpoint  
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