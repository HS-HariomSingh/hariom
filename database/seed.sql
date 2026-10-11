-- =================================================================
-- LOST AND FOUND — COLLEGE DBMS PROJECT
-- Seed Data File: database/seed.sql
-- Users: Admin -> Hariom; Students -> Arth, Shivam only
-- =================================================================

USE lost_and_found;

-- Clear previous data in correct dependency order
DELETE FROM item_claims;
DELETE FROM items;
DELETE FROM admins;
DELETE FROM students;

-- 1. Insert Dummy Students (Arth and Shivam only)
INSERT INTO students (student_id, name, email, password_hash, department, year, roll_number, phone)
VALUES
('STU-ARTH', 'Arth', 'arth@iiitbhopal.ac.in', 'student123', 'Computer Science and Engineering', '3rd Year', '2023CSE015', '+91 9876543210'),
('STU-SHIVAM', 'Shivam', 'shivam@iiitbhopal.ac.in', 'student123', 'Information Technology', '2nd Year', '2024IT042', '+91 9812345678');

-- 2. Insert Dummy Admin (Hariom only)
INSERT INTO admins (admin_id, name, email, password_hash, role)
VALUES
('ADM-HARIOM', 'Hariom', 'hariom@iiitbhopal.ac.in', 'admin123', 'Chief Proctor / Admin');

-- 3. Insert Sample Lost & Found Items
INSERT INTO items (item_id, title, category, description, type, status, location, date_incident, image_url, student_id)
VALUES
(
    'ITEM-001',
    'Blue HP Laptop Charger (65W Type-C)',
    'Electronics',
    'Left on the second floor desk of the Central Library reading room next to Window 4.',
    'LOST',
    'APPROVED',
    'Central Library - 2nd Floor',
    '2026-10-08',
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
    'STU-ARTH'
),
(
    'ITEM-002',
    'College Student ID Card (Roll: 2024IT042)',
    'ID Cards',
    'Found near the Nescafe cafeteria counter during the 1:30 PM lunch break.',
    'FOUND',
    'APPROVED',
    'Campus Cafeteria - Nescafe Counter',
    '2026-10-09',
    'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80',
    'STU-SHIVAM'
),
(
    'ITEM-003',
    'Scientific Calculator Casio fx-991EX Classwiz',
    'Electronics',
    'Black casing with silver buttons, has a small white sticker on the back cover.',
    'LOST',
    'PENDING',
    'Academic Block A - Room 204',
    '2026-10-10',
    'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80',
    'STU-SHIVAM'
),
(
    'ITEM-004',
    'Stainless Steel Milton Thermosteel Water Bottle (1L)',
    'Accessories',
    'Silver with slight dent at the bottom rim, found near Badminton Court.',
    'FOUND',
    'APPROVED',
    'Sports Complex - Badminton Court',
    '2026-10-07',
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80',
    'STU-ARTH'
),
(
    'ITEM-005',
    'Fastrack Black Leather Wallet with Driving License',
    'Accessories',
    'Contains driving license, debit card and campus hostel room key 218.',
    'LOST',
    'CLAIMED',
    'Football Ground Bleachers',
    '2026-10-05',
    'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80',
    'STU-ARTH'
),
(
    'ITEM-006',
    'Database System Concepts Book (Korth & Silberschatz 7th Ed)',
    'Books',
    'Found left on bench outside Computer Lab 3 after DBMS practical exam.',
    'FOUND',
    'APPROVED',
    'Computer Science Department - Lab 3',
    '2026-10-06',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    'STU-SHIVAM'
),
(
    'ITEM-007',
    'Noise ColorFit Pulse 2 Smartwatch (Teal Blue Strap)',
    'Electronics',
    'Found on the washroom basin ledge in Admin Block Ground Floor.',
    'FOUND',
    'PENDING',
    'Admin Block - Ground Floor',
    '2026-10-11',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    'STU-ARTH'
),
(
    'ITEM-008',
    'Grey Skybags Campus Backpack with Spiral Notebooks',
    'Bags',
    'Lost after evening coding club workshop. Contains Data Structures notebook.',
    'LOST',
    'RESOLVED',
    'Auditorium Seminar Hall 1',
    '2026-10-04',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    'STU-SHIVAM'
);

-- 4. Insert Sample Claims
INSERT INTO item_claims (claim_id, item_id, student_id, reason_proof, status, admin_notes)
VALUES
(
    'CLM-001',
    'ITEM-002',
    'STU-SHIVAM',
    'This is my own college ID card that I reported finding and kept in safe custody with Proctor Hariom sir.',
    'APPROVED',
    'Verified with campus database roll records.'
),
(
    'CLM-002',
    'ITEM-004',
    'STU-SHIVAM',
    'The water bottle belongs to me; it has my initials "SK" engraved on the bottom lid and was lost after practice.',
    'PENDING',
    NULL
);
