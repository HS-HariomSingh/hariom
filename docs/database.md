# Database Documentation — Lost and Found DBMS Project

## 1. Database Overview
- **Database Engine**: MySQL 8.0+
- **Database Name**: `lost_and_found`
- **Character Set**: `utf8mb4`
- **Collation**: `utf8mb4_unicode_ci`

The database manages college campus lost and found records, student user accounts, administrative authority profiles, and ownership verification claims.

---

## 2. Relational Schema & Tables

### 2.1 Table: `students`
Stores registered college student profiles.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `student_id` | VARCHAR(36) | PRIMARY KEY, NOT NULL | Unique student identifier (e.g. STU-ARTH) |
| `name` | VARCHAR(100) | NOT NULL | Full student name |
| `email` | VARCHAR(120) | UNIQUE, NOT NULL | College official email |
| `password_hash` | VARCHAR(255) | NOT NULL | Authentication password |
| `department` | VARCHAR(80) | NOT NULL | Branch / Department |
| `year` | VARCHAR(20) | NOT NULL | Academic year (e.g. 3rd Year) |
| `roll_number` | VARCHAR(30) | UNIQUE, NOT NULL | Campus roll or enrollment number |
| `phone` | VARCHAR(20) | NULL | Contact mobile number |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation time |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last updated time |

### 2.2 Table: `admins`
Stores proctor / campus administrator accounts.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `admin_id` | VARCHAR(36) | PRIMARY KEY, NOT NULL | Admin identifier (e.g. ADM-HARIOM) |
| `name` | VARCHAR(100) | NOT NULL | Administrator name (Hariom) |
| `email` | VARCHAR(120) | UNIQUE, NOT NULL | Admin email (`hariom@iiitbhopal.ac.in`) |
| `password_hash` | VARCHAR(255) | NOT NULL | Password |
| `role` | VARCHAR(50) | DEFAULT 'Campus Officer' | Authority title |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

### 2.3 Table: `items`
Stores reports of Lost and Found items submitted across campus.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `item_id` | VARCHAR(36) | PRIMARY KEY, NOT NULL | Item ID (e.g. ITEM-001) |
| `title` | VARCHAR(150) | NOT NULL | Short title of the item |
| `category` | ENUM | NOT NULL, DEFAULT 'Other' | 'Electronics', 'Documents', 'Books', 'Accessories', 'ID Cards', 'Bags', 'Clothing', 'Other' |
| `description` | TEXT | NOT NULL | Detailed description of the item |
| `type` | ENUM | NOT NULL | 'LOST' or 'FOUND' |
| `status` | ENUM | NOT NULL, DEFAULT 'PENDING' | 'PENDING', 'APPROVED', 'REJECTED', 'CLAIMED', 'RESOLVED' |
| `location` | VARCHAR(150) | NOT NULL | Campus location where item was lost/found |
| `date_incident` | DATE | NOT NULL | Date when the item was lost or found |
| `image_url` | VARCHAR(500) | NULL | Optional reference image URL |
| `student_id` | VARCHAR(36) | FOREIGN KEY -> students(student_id) | Reporting student ID |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Report creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

### 2.4 Table: `item_claims`
Stores ownership claims filed by students for items found on campus.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `claim_id` | VARCHAR(36) | PRIMARY KEY, NOT NULL | Claim identifier (e.g. CLM-001) |
| `item_id` | VARCHAR(36) | FOREIGN KEY -> items(item_id) | Referenced found item |
| `student_id` | VARCHAR(36) | FOREIGN KEY -> students(student_id) | Claimant student |
| `reason_proof` | TEXT | NOT NULL | Identifying features and proof of ownership |
| `status` | ENUM | NOT NULL, DEFAULT 'PENDING' | 'PENDING', 'APPROVED', 'REJECTED' |
| `admin_notes` | TEXT | NULL | Administrative remarks upon review |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Submission timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Review timestamp |

---

## 3. Entity Relationships & Cardinality

1. **`students` 1 ─── N `items`**:
   - One student can submit zero, one, or multiple Lost and Found reports.
   - Enforced by `FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE`.
2. **`students` 1 ─── N `item_claims`**:
   - One student can submit multiple claims for different found items.
   - Enforced by `FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE`.
3. **`items` 1 ─── N `item_claims`**:
   - A single found item can receive multiple claims from prospective owners.
   - Enforced by `FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE`.

---

## 4. Key DBMS Concepts Demonstrated

- **Primary Keys**: Ensure row uniqueness across all entity collections (`student_id`, `admin_id`, `item_id`, `claim_id`).
- **Foreign Keys with Referential Integrity**: Cascading updates and deletes prevent orphaned claims or orphaned items.
- **Candidate / Unique Keys**: `email` and `roll_number` prevent duplicate registrations.
- **Data Integrity Constraints**: `NOT NULL` prevents unpopulated fields, and `CHECK` / `ENUM` enforce domain integrity.
- **Indexes**: Fast B-Tree lookups on `type`, `status`, `category`, `date_incident`, and foreign keys.

---

## 5. Sample SQL Queries Demonstrating DBMS Concepts

### Query 1: Display all lost items
```sql
SELECT item_id, title, category, location, date_incident, status
FROM items
WHERE type = 'LOST'
ORDER BY date_incident DESC;
```

### Query 2: Display all found items
```sql
SELECT item_id, title, category, location, date_incident, status
FROM items
WHERE type = 'FOUND'
ORDER BY date_incident DESC;
```

### Query 3: Display items reported by a particular student (e.g., Arth)
```sql
SELECT item_id, title, type, category, status, created_at
FROM items
WHERE student_id = 'STU-ARTH'
ORDER BY created_at DESC;
```

### Query 4: Count lost items
```sql
SELECT COUNT(*) AS total_lost_items
FROM items
WHERE type = 'LOST';
```

### Query 5: Count found items
```sql
SELECT COUNT(*) AS total_found_items
FROM items
WHERE type = 'FOUND';
```

### Query 6: Find pending reports requiring admin approval
```sql
SELECT item_id, title, type, location, student_id, created_at
FROM items
WHERE status = 'PENDING'
ORDER BY created_at ASC;
```

### Query 7: JOIN students and items
```sql
SELECT
    i.item_id,
    i.title,
    i.type,
    i.category,
    i.status,
    s.name AS reporter_name,
    s.email AS reporter_email,
    s.department
FROM items i
INNER JOIN students s ON i.student_id = s.student_id
ORDER BY i.created_at DESC;
```

### Query 8: JOIN items and claims with student details
```sql
SELECT
    c.claim_id,
    i.title AS item_title,
    i.location AS found_at,
    s.name AS claimant_name,
    s.roll_number,
    c.reason_proof,
    c.status AS claim_status
FROM item_claims c
INNER JOIN items i ON c.item_id = i.item_id
INNER JOIN students s ON c.student_id = s.student_id
ORDER BY c.created_at DESC;
```

### Query 9: Aggregate count of reports submitted by each student (GROUP BY)
```sql
SELECT
    s.student_id,
    s.name,
    s.department,
    COUNT(i.item_id) AS total_reports,
    SUM(CASE WHEN i.type = 'LOST' THEN 1 ELSE 0 END) AS lost_count,
    SUM(CASE WHEN i.type = 'FOUND' THEN 1 ELSE 0 END) AS found_count
FROM students s
LEFT JOIN items i ON s.student_id = i.student_id
GROUP BY s.student_id, s.name, s.department
ORDER BY total_reports DESC;
```

### Query 10: Find all approved items grouped by category
```sql
SELECT
    category,
    type,
    COUNT(*) AS total_items
FROM items
WHERE status = 'APPROVED'
GROUP BY category, type
ORDER BY category ASC, type ASC;
```
