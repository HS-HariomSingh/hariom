# Lost and Found — College DBMS Project

A comprehensive College Campus Lost and Found web portal built as a complete Database Management Systems (DBMS) project. The application allows students to report misplaced or discovered items on campus, claim found belongings with proof of ownership, and provides campus proctors/administrators with a verification workflow.

---

## 1. Key Features

- **Role-Based Portals**:
  - **Student Portal**: Report Lost items, Report Found items, browse campus items with real-time filters, track report statuses, and file ownership claims.
  - **Admin Portal**: Approve or reject pending reports, review claimant proofs, mark items as claimed or resolved, and monitor campus metrics.
- **Relational DBMS Implementation**:
  - Full MySQL 8.0 schema with primary keys, foreign keys, unique constraints, ENUM domain limits, cascading deletes, and B-Tree indexes.
  - 10 practical SQL queries demonstrating JOINs, GROUP BY, aggregations, and subqueries.
- **Real-Time Cloud Persistence**:
  - Connected with **Firebase Firestore** for persistent real-time updates and synchronization.
- **RESTful Python FastAPI Backend**:
  - Clean modular architecture (routers, schemas, ORM models) with CORS support and JSON communication.
- **Interactive DBMS Workbench**:
  - Built-in SQL explorer, ER diagram viewer, and live query executor right inside the application.

---

## 2. Technologies Used

- **Frontend**: Semantic HTML5, Tailwind CSS, Vanilla JavaScript, React interactive UI.
- **Backend API**: Python 3.11+, FastAPI, SQLAlchemy ORM, Pydantic, Uvicorn.
- **Databases**:
  - **MySQL 8.0+** (Relational DDL & DML in `database/schema.sql` and `database/seed.sql`)
  - **Firebase Firestore** (Cloud persistence & real-time sync)
- **Authentication**: Role-based credential verification with safe session responses.

---

## 3. Demo Credentials

Only the following dummy accounts are provisioned:

### 1. Campus Administrator
- **Name**: Hariom (Chief Proctor)
- **Email**: `hariom@iiitbhopal.ac.in`
- **Password**: `admin123`

### 2. Registered Students
- **Student 1**: Arth
  - **Email**: `arth@iiitbhopal.ac.in`
  - **Password**: `student123`
  - **Roll**: `2023CSE015` | **Dept**: Computer Science and Engineering (3rd Year)
- **Student 2**: Shivam
  - **Email**: `shivam@iiitbhopal.ac.in`
  - **Password**: `student123`
  - **Roll**: `2024IT042` | **Dept**: Information Technology (2nd Year)

---

## 4. Project Directory Structure

```
├── database/
│   ├── schema.sql         # MySQL DDL table creations, constraints & indexes
│   └── seed.sql           # Sample data for Arth, Shivam, Hariom, items & claims
├── backend/
│   ├── requirements.txt   # Python dependencies (fastapi, sqlalchemy, etc.)
│   └── app/
│       ├── main.py        # FastAPI app entrypoint with CORS
│       ├── database.py    # SQLAlchemy connection engine & session
│       ├── models.py      # ORM models (Student, Admin, Item, ItemClaim)
│       ├── schemas.py     # Pydantic input validation & response models
│       └── routers/
│           ├── auth.py    # Login & Logout endpoints
│           ├── students.py# Student profile, reports, and claims
│           ├── items.py   # Item search, reporting, and management
│           └── admin.py   # Admin metrics, report reviews, claim decisions
├── docs/
│   ├── database.md        # Relational schema dictionary & 10 SQL queries
│   ├── project-report.md  # 19-section academic DBMS report
│   ├── design.md          # Architecture & Mermaid workflow diagrams
│   └── api.md             # REST API specifications
├── src/
│   ├── App.tsx            # Main application UI and portal switcher
│   ├── firebase.ts        # Firebase Firestore real-time initialization
│   ├── components/        # Modals, reports, claims, SQL explorer, dashboards
│   └── types.ts           # TypeScript interfaces matching database models
├── firebase-blueprint.json# Intermediate blueprint specification
├── firestore.rules        # Security rules
└── README.md
```

---

## 5. Setup & Running Instructions

### Step 1: MySQL Database Setup
Open MySQL shell or MySQL Workbench:
```bash
# 1. Login to MySQL
mysql -u root -p

# 2. Execute the schema script
source database/schema.sql;

# 3. Insert initial dummy data (Hariom, Arth, Shivam)
source database/seed.sql;
```

### Step 2: Python FastAPI Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install required packages
pip install -r requirements.txt

# Set your MySQL database connection in .env or environment variable
export DATABASE_URL="mysql+pymysql://root:yourpassword@localhost:3306/lost_and_found"

# Start the FastAPI server on port 8000
uvicorn app.main:app --reload --port 8000
```
API Documentation will be live at: `http://localhost:8000/docs`

### Step 3: Running the Frontend & Web Portal
The web portal runs on Node.js / Vite and connects seamlessly to both Firestore and FastAPI:
```bash
# In the project root:
npm install
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 6. Testing the APIs via cURL

### 1. Student Login (Arth)
```bash
curl -X POST http://localhost:8000/api/auth/student/login \
  -H "Content-Type: application/json" \
  -d '{"email": "arth@iiitbhopal.ac.in", "password": "student123"}'
```

### 2. Admin Login (Hariom)
```bash
curl -X POST http://localhost:8000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email": "hariom@iiitbhopal.ac.in", "password": "admin123"}'
```

### 3. Report a Lost Item
```bash
curl -X POST http://localhost:8000/api/items \
  -H "Content-Type: application/json" \
  -H "X-Student-Id: STU-ARTH" \
  -d '{
    "title": "Black HP Wireless Mouse",
    "category": "Electronics",
    "description": "Left near Computer Lab 2 on desk 14",
    "type": "LOST",
    "location": "Academic Block B",
    "date_incident": "2026-10-11"
  }'
```

### 4. Admin Approve Item
```bash
curl -X PUT http://localhost:8000/api/admin/items/ITEM-003/approve \
  -H "X-Admin-Id: ADM-HARIOM"
```

---

## 7. Submission & Presentation
This repository contains all necessary database DDL/DML, backend services, documentation reports, and frontend applications ready for demonstration and grading in a university DBMS course.
