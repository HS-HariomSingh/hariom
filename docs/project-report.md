# Academic Project Report: Campus Lost and Found DBMS System

**Course**: Database Management Systems (CS304)  
**Institution**: Indian Institute of Information Technology, Bhopal  
**Project Title**: Campus Lost and Found Management Portal  
**Database**: MySQL 8.0 / Firebase Firestore Hybrid  
**Backend Framework**: Python FastAPI  
**Frontend**: Modern HTML, Tailwind CSS, Vanilla JavaScript & React Interactive Portal  

---

## 1. Introduction
In university environments with sprawling campuses, thousands of students frequently misplace valuable belongings such as student identity cards, scientific calculators, laptops, chargers, textbooks, keys, and backpacks. Traditional notice board slips, informal WhatsApp broadcasts, or physical proctor visits are fragmented, unindexed, and inefficient. The Campus Lost and Found System provides a centralized, relational DBMS-backed platform to log, track, verify, and restore misplaced property to rightful student owners.

---

## 2. Problem Statement
Students lack a structured mechanism to report lost items or register found items. The proctorial office receives numerous recovered articles with no verifiable database to trace owners or record ownership proof claims. Key issues:
- Lack of audit trails and verification workflows.
- Security vulnerabilities where unverified individuals claim valuable articles.
- Inability to search or filter by dates, locations, or item categories.
- No historical analytics on recurring loss hotspots across campus.

---

## 3. Objectives
1. Implement a normalized relational database schema in MySQL with referential integrity.
2. Develop RESTful JSON APIs using Python FastAPI to interface between the web client and database.
3. Provide role-based views: Student Portal for filing reports and claims; Admin Portal for approvals and audits.
4. Establish ownership claim verification with administrative dispute resolution.
5. Demonstrate core DBMS competencies including DDL, DML, candidate keys, composite indices, foreign keys, and multi-table aggregate JOINs.

---

## 4. Scope
The application covers all registered students and administrative proctorial personnel across academic blocks, central libraries, sports complexes, cafeterias, and hostels. The system manages items through the complete lifecycle: `PENDING` -> `APPROVED` -> `CLAIMED` -> `RESOLVED` / `REJECTED`.

---

## 5. Proposed Solution
A secure, responsive web-based platform with:
- **Student Authentication**: Secure credential validation for students (e.g. Arth and Shivam).
- **Interactive Browsing**: Real-time search with multi-criteria category and status filters.
- **Reporting Modules**: Specialized forms for Lost and Found reports with location tagging and date records.
- **Claim Workflow**: Secure claim submission requiring proof of possession/identification before item release.
- **Admin Command Center**: Single-pane dashboard for proctor Hariom to approve, reject, resolve reports, and inspect student records.
- **Live Database Sync**: Integrated with Firebase Firestore for persistent cloud operations and real-time state management.

---

## 6. Technologies Used
- **Database**: MySQL 8.0 (DDL & DML scripts in `database/schema.sql` and `database/seed.sql`) + Firebase Cloud Firestore for real-time web sync.
- **Backend API**: Python 3.11, FastAPI, SQLAlchemy ORM, Pydantic, Uvicorn ASGI server.
- **Frontend**: Semantic HTML5, Tailwind CSS, Vanilla JavaScript client hooks, and responsive React SPA interface.
- **Design Philosophy**: High typographic hierarchy, clean college-oriented blue/indigo theme, accessible data tables, and minimal latency.

---

## 7. System Architecture
```
+--------------------------------------------------------------------+
|                         CLIENT LAYER                               |
|   HTML5 + Tailwind CSS + Vanilla JS + React Interactive Portal     |
|   - Student Portal (Arth, Shivam)   - Admin Portal (Hariom)        |
+---------------------------------+----------------------------------+
                                  |
                                  | REST JSON / WebSocket Sync
                                  v
+--------------------------------------------------------------------+
|                         BACKEND SERVICE                            |
|             Python FastAPI + SQLAlchemy ORM Engine                 |
|   Routers: /api/auth | /api/students | /api/items | /api/admin     |
+---------------------------------+----------------------------------+
                                  |
                     +------------+------------+
                     |                         |
                     v                         v
+-----------------------------+   +----------------------------------+
|      MySQL 8.0 DATABASE     |   |   FIREBASE FIRESTORE DATABASE    |
| - students    - admins      |   | - students    - admins           |
| - items       - item_claims |   | - items       - item_claims      |
+-----------------------------+   +----------------------------------+
```

---

## 8. Database Design
The relational schema adheres to Third Normal Form (3NF) to eliminate transitive dependencies and update anomalies:
- **Functional Dependencies**:
  - `student_id -> {name, email, department, year, roll_number}`
  - `admin_id -> {name, email, role}`
  - `item_id -> {title, category, description, type, status, location, date_incident, student_id}`
  - `claim_id -> {item_id, student_id, reason_proof, status}`

---

## 9. Entity-Relationship (ER) Diagram Description
- **Student Entity**: Attributes: `student_id` (PK), `name`, `email` (UQ), `password_hash`, `department`, `year`, `roll_number` (UQ), `phone`.
- **Admin Entity**: Attributes: `admin_id` (PK), `name`, `email` (UQ), `password_hash`, `role`.
- **Item Entity**: Attributes: `item_id` (PK), `title`, `category`, `description`, `type`, `status`, `location`, `date_incident`, `image_url`, `student_id` (FK).
- **ItemClaim Entity**: Attributes: `claim_id` (PK), `item_id` (FK), `student_id` (FK), `reason_proof`, `status`, `admin_notes`.

### Cardinality:
- `students` (1) ─── reports ─── (N) `items`
- `students` (1) ─── submits ─── (N) `item_claims`
- `items` (1) ─── receives ─── (N) `item_claims`

---

## 10. Table Descriptions
1. **`students`**: Master entity for college scholars.
2. **`admins`**: Master entity for campus security administrators.
3. **`items`**: Operational entity tracking articles lost or retrieved on premises.
4. **`item_claims`**: Transactional table capturing claim rationale and verification decisions.

---

## 11. API Architecture
All endpoints communicate via standard HTTP verbs and JSON payloads:
- `POST /api/auth/student/login` - Authenticate student
- `POST /api/auth/admin/login` - Authenticate admin
- `GET /api/items` - Search and filter articles
- `POST /api/items` - Report lost or found article
- `GET /api/students/me/reports` - Logged-in student's submissions
- `POST /api/students/claims` - File claim for found article
- `GET /api/admin/dashboard` - Proctorial aggregate statistics
- `PUT /api/admin/items/{id}/approve` - Verify item
- `PUT /api/admin/claims/{id}/approve` - Grant claim & mark item claimed

---

## 12. Authentication Mechanism
Authentication queries the `students` and `admins` tables with email matching and credential verification. Upon successful verification, safe user session profiles are returned (passwords explicitly stripped). In production, `bcrypt` with salt rounds is utilized.

---

## 13. Functional Requirements
1. Students can securely log in using college credentials.
2. Students can post lost items with date, place, category, and description.
3. Students can post found items with physical location identifiers.
4. Students can browse all approved items and search via keywords.
5. Students can stake an ownership claim on found items.
6. Admin can approve or reject submitted reports.
7. Admin can inspect claimant proof and approve or reject claims.
8. Admin can mark recovered items as resolved.

---

## 14. Non-Functional Requirements
1. **Performance**: Indexed queries execute in sub-15ms for catalog searches.
2. **Security**: Role-based access control prevents unauthorized editing of peer reports.
3. **Usability**: College-themed clean interface readable on both desktop and mobile screens.
4. **Reliability**: Relational foreign-key cascade guarantees no dangling orphan rows.

---

## 15. Testing Strategy
- **Unit Testing**: Route handlers and Pydantic validation constraints.
- **Relational Integrity Testing**: Foreign key delete cascade and unique email enforcement.
- **End-to-End System Testing**: Lifecycle from student report to admin verification and student claim approval.

---

## 16. Sample Test Cases

| Test ID | Test Scenario | Input Data | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| TC-01 | Student Login Valid | `arth@iiitbhopal.ac.in` / `student123` | HTTP 200, Session initialized | PASS |
| TC-02 | Student Login Invalid Password | `arth@iiitbhopal.ac.in` / `wrongPass` | HTTP 401 Unauthorized | PASS |
| TC-03 | Report Lost Item | Category: Electronics, Location: Library | HTTP 201 Created, Status: PENDING | PASS |
| TC-04 | Admin Approve Item | Item ID: ITEM-003, Admin Header | HTTP 200, Status: APPROVED | PASS |
| TC-05 | File Duplicate Claim | Same student claims same item twice | HTTP 400 Bad Request error | PASS |
| TC-06 | Admin Approve Claim | Claim ID: CLM-002 | Claim: APPROVED, Item: CLAIMED | PASS |

---

## 17. Screenshots Section Placeholders
- `Figure 1`: College Lost and Found Landing Page with Hero and Recent Items
- `Figure 2`: Student Dashboard with Active Reports and Claim Status Tracker
- `Figure 3`: Admin Command Center with Aggregated Metrics and Action Buttons
- `Figure 4`: Lost & Found Catalog with Category Filter and Search Bar
- `Figure 5`: Interactive DBMS SQL Query Runner and Relational Schema Inspector

---

## 18. Future Scope
1. Optical Character Recognition (OCR) to automatically read roll numbers from student ID card photos.
2. Automated campus email notification upon claim status updates.
3. NFC/RFID campus locker integration for self-service item retrieval.

---

## 19. Conclusion
The Campus Lost and Found DBMS Project successfully bridges campus logistical challenges using robust relational database techniques. By enforcing referential integrity in MySQL, exposing modular REST APIs in FastAPI, providing Firebase cloud persistence, and furnishing an intuitive user experience, the system demonstrates the practical value of DBMS concepts in real-world university environments.
