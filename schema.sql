-- =================================================
-- Tutor SaaS Database Schema
-- =================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- =================================================
-- TENANTS
-- Each tutor center is a tenant
-- =================================================
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subscription_status VARCHAR(50) DEFAULT 'trial',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =================================================
-- USERS
-- Users belong to a tenant
-- =================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'owner',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =================================================
-- CLASSES
-- Represents teaching groups
-- =================================================
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    schedule_day VARCHAR(50),
    schedule_time TIME,
    monthly_fee NUMERIC(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =================================================
-- STUDENTS
-- Students belong to a tenant and optionally a class
-- =================================================
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    parent_name VARCHAR(255),
    parent_phone VARCHAR(20),
    parent_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =================================================
-- ATTENDANCE
-- Tracks student attendance per class session
-- =================================================
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('present','absent')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =================================================
-- PAYMENTS
-- Records tuition payments
-- =================================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    method VARCHAR(50),
    mpesa_reference VARCHAR(100),
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =================================================
-- STUDENT_CLASSES
-- Enforces enrollment relationship
-- =================================================
CREATE TABLE student_classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, class_id)
);


-- =================================================
-- INDEXES
-- Improves performance for multi-tenant queries
-- =================================================
CREATE INDEX idx_users_tenant
ON users(tenant_id);

CREATE INDEX idx_students_tenant
ON students(tenant_id);

CREATE INDEX idx_classes_tenant
ON classes(tenant_id);

CREATE INDEX idx_attendance_tenant
ON attendance(tenant_id);

CREATE INDEX idx_payments_tenant
ON payments(tenant_id);

CREATE INDEX idx_student_classes_student
ON student_classes(student_id);

CREATE INDEX idx_student_classes_class
ON student_classes(class_id);

CREATE INDEX idx_student_classes_tenant
ON student_classes(tenant_id);