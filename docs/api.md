# API Documentation — Campus Lost and Found

All APIs accept and return JSON payloads (`application/json`).
Base URL in local development: `http://localhost:8000`

---

## 1. Authentication APIs

### 1.1 Student Login
- **Method**: `POST`
- **Endpoint**: `/api/auth/student/login`
- **Purpose**: Authenticates a student using campus email and password.
- **Request Body**:
  ```json
  {
    "email": "arth@iiitbhopal.ac.in",
    "password": "student123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Student logged in successfully",
    "user_type": "student",
    "user": {
      "student_id": "STU-ARTH",
      "name": "Arth",
      "email": "arth@iiitbhopal.ac.in",
      "department": "Computer Science and Engineering",
      "year": "3rd Year",
      "roll_number": "2023CSE015",
      "phone": "+91 9876543210"
    }
  }
  ```
- **Errors**:
  - `401 Unauthorized`: Invalid email or password.
  - `422 Unprocessable Entity`: Malformed JSON or invalid email format.

### 1.2 Admin Login
- **Method**: `POST`
- **Endpoint**: `/api/auth/admin/login`
- **Purpose**: Authenticates administrative personnel.
- **Request Body**:
  ```json
  {
    "email": "hariom@iiitbhopal.ac.in",
    "password": "admin123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Administrator logged in successfully",
    "user_type": "admin",
    "user": {
      "admin_id": "ADM-HARIOM",
      "name": "Hariom",
      "email": "hariom@iiitbhopal.ac.in",
      "role": "Chief Proctor / Admin"
    }
  }
  ```
- **Errors**:
  - `401 Unauthorized`: Invalid administrator credentials.

---

## 2. Items APIs

### 2.1 Get Items
- **Method**: `GET`
- **Endpoint**: `/api/items`
- **Query Parameters**:
  - `type`: `LOST` | `FOUND` (Optional)
  - `category`: Category name (Optional)
  - `status`: `PENDING` | `APPROVED` | `CLAIMED` | `RESOLVED` (Optional)
  - `search`: Keyword string matching title/description/location (Optional)
- **Success Response (200 OK)**:
  ```json
  [
    {
      "item_id": "ITEM-001",
      "title": "Blue HP Laptop Charger (65W Type-C)",
      "category": "Electronics",
      "description": "Left on 2nd floor Central Library reading desk.",
      "type": "LOST",
      "status": "APPROVED",
      "location": "Central Library - 2nd Floor",
      "date_incident": "2026-10-08",
      "image_url": "https://images.unsplash.com/...",
      "student_id": "STU-ARTH",
      "student_name": "Arth"
    }
  ]
  ```

### 2.2 Get Item by ID
- **Method**: `GET`
- **Endpoint**: `/api/items/{item_id}`
- **Success Response (200 OK)**: Single Item object.
- **Errors**: `404 Not Found` if item ID does not exist.

### 2.3 Report an Item
- **Method**: `POST`
- **Endpoint**: `/api/items`
- **Headers**: `X-Student-Id: <student_id>`
- **Request Body**:
  ```json
  {
    "title": "Scientific Calculator Casio fx-991EX",
    "category": "Electronics",
    "description": "Silver keyboard with white back sticker.",
    "type": "LOST",
    "location": "Academic Block A - Room 204",
    "date_incident": "2026-10-10",
    "image_url": null
  }
  ```
- **Success Response (201 Created)**: Created Item object with `status: "PENDING"`.

### 2.4 Update Item
- **Method**: `PUT`
- **Endpoint**: `/api/items/{item_id}`
- **Headers**: `X-Student-Id: <student_id>` or `X-Admin-Id: <admin_id>`

### 2.5 Delete Item
- **Method**: `DELETE`
- **Endpoint**: `/api/items/{item_id}`
- **Headers**: `X-Admin-Id: <admin_id>` or `X-Student-Id: <owner_id>`

---

## 3. Student Portal APIs

### 3.1 Get Profile & Stats
- **Method**: `GET`
- **Endpoint**: `/api/students/me` & `/api/students/me/stats`
- **Headers**: `X-Student-Id: <student_id>`

### 3.2 Get My Reports
- **Method**: `GET`
- **Endpoint**: `/api/students/me/reports`
- **Headers**: `X-Student-Id: <student_id>`

### 3.3 Submit a Claim
- **Method**: `POST`
- **Endpoint**: `/api/students/claims`
- **Headers**: `X-Student-Id: <student_id>`
- **Request Body**:
  ```json
  {
    "item_id": "ITEM-004",
    "reason_proof": "The bottle has my initials SK engraved under the lid."
  }
  ```
- **Success Response (201 Created)**: Created ItemClaim object with `status: "PENDING"`.

---

## 4. Admin Management APIs

### 4.1 Admin Dashboard Metrics
- **Method**: `GET`
- **Endpoint**: `/api/admin/dashboard`
- **Headers**: `X-Admin-Id: <admin_id>`
- **Success Response (200 OK)**:
  ```json
  {
    "total_students": 2,
    "total_items": 8,
    "lost_items": 4,
    "found_items": 4,
    "pending_reports": 2,
    "resolved_items": 2,
    "pending_claims": 1
  }
  ```

### 4.2 Approve / Reject / Resolve Item
- **Method**: `PUT`
- **Endpoints**:
  - `/api/admin/items/{item_id}/approve`
  - `/api/admin/items/{item_id}/reject`
  - `/api/admin/items/{item_id}/resolve`
- **Headers**: `X-Admin-Id: <admin_id>`

### 4.3 Approve / Reject Claim
- **Method**: `PUT`
- **Endpoints**:
  - `/api/admin/claims/{claim_id}/approve` (also marks referenced item as `CLAIMED`)
  - `/api/admin/claims/{claim_id}/reject`
- **Headers**: `X-Admin-Id: <admin_id>`

### 4.4 List Students Directory
- **Method**: `GET`
- **Endpoint**: `/api/admin/students`
- **Headers**: `X-Admin-Id: <admin_id>`
