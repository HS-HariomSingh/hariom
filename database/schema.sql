-- =================================================================
-- LOST AND FOUND — COLLEGE DBMS PROJECT
-- Target Database: MySQL 8.0+
-- File: database/schema.sql
-- =================================================================

-- 1. Create and Select Database
CREATE DATABASE IF NOT EXISTS lost_and_found
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE lost_and_found;

-- Disable foreign key checks during schema re-creation if needed
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Drop existing tables if re-initializing
DROP TABLE IF EXISTS item_claims;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS students;

SET FOREIGN_KEY_CHECKS = 1;

-- =================================================================
-- 3. Table: students
-- Represents registered students on campus
-- =================================================================
CREATE TABLE students (
    student_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    department VARCHAR(80) NOT NULL,
    year VARCHAR(20) NOT NULL,
    roll_number VARCHAR(30) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_students PRIMARY KEY (student_id),
    CONSTRAINT uq_students_email UNIQUE (email),
    CONSTRAINT uq_students_roll UNIQUE (roll_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =================================================================
-- 4. Table: admins
-- Represents campus lost and found authority administrators
-- =================================================================
CREATE TABLE admins (
    admin_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Campus Officer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_admins PRIMARY KEY (admin_id),
    CONSTRAINT uq_admins_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =================================================================
-- 5. Table: items
-- Represents reported Lost and Found items on campus
-- =================================================================
CREATE TABLE items (
    item_id VARCHAR(36) NOT NULL,
    title VARCHAR(150) NOT NULL,
    category ENUM(
        'Electronics',
        'Documents',
        'Books',
        'Accessories',
        'ID Cards',
        'Bags',
        'Clothing',
        'Other'
    ) NOT NULL DEFAULT 'Other',
    description TEXT NOT NULL,
    type ENUM('LOST', 'FOUND') NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CLAIMED', 'RESOLVED') NOT NULL DEFAULT 'PENDING',
    location VARCHAR(150) NOT NULL,
    date_incident DATE NOT NULL,
    image_url VARCHAR(500) DEFAULT NULL,
    student_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_items PRIMARY KEY (item_id),
    CONSTRAINT fk_items_student FOREIGN KEY (student_id)
        REFERENCES students(student_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =================================================================
-- 6. Table: item_claims
-- Represents claims filed by students for items found on campus
-- =================================================================
CREATE TABLE item_claims (
    claim_id VARCHAR(36) NOT NULL,
    item_id VARCHAR(36) NOT NULL,
    student_id VARCHAR(36) NOT NULL,
    reason_proof TEXT NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    admin_notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_item_claims PRIMARY KEY (claim_id),
    CONSTRAINT fk_claims_item FOREIGN KEY (item_id)
        REFERENCES items(item_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_claims_student FOREIGN KEY (student_id)
        REFERENCES students(student_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =================================================================
-- 7. Indexes for Query Performance & DBMS Demonstration
-- =================================================================
CREATE INDEX idx_items_type ON items(type);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_student ON items(student_id);
CREATE INDEX idx_items_date ON items(date_incident);
CREATE INDEX idx_claims_status ON item_claims(status);
CREATE INDEX idx_claims_item ON item_claims(item_id);
CREATE INDEX idx_claims_student ON item_claims(student_id);

-- Done
