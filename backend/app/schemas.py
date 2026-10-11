"""
Pydantic Schemas for Request Validation and Safe API Serialization
Lost and Found College DBMS Project
"""
from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


# ---------------- Auth Schemas ----------------
class StudentLoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=4)


class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=4)


class StudentResponse(BaseModel):
    student_id: str
    name: str
    email: str
    department: str
    year: str
    roll_number: str
    phone: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AdminResponse(BaseModel):
    admin_id: str
    name: str
    email: str
    role: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    success: bool
    message: str
    user_type: str  # "student" | "admin"
    user: dict


# ---------------- Item Schemas ----------------
class ItemCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    category: str
    description: str = Field(..., min_length=5)
    type: str = Field(..., pattern="^(LOST|FOUND)$")
    location: str = Field(..., min_length=2, max_length=150)
    date_incident: date
    image_url: Optional[str] = None


class ItemUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    date_incident: Optional[date] = None
    image_url: Optional[str] = None
    status: Optional[str] = None


class ItemResponse(BaseModel):
    item_id: str
    title: str
    category: str
    description: str
    type: str
    status: str
    location: str
    date_incident: date
    image_url: Optional[str] = None
    student_id: str
    student_name: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ---------------- Claim Schemas ----------------
class ClaimCreate(BaseModel):
    item_id: str
    reason_proof: str = Field(..., min_length=10)


class ClaimResponse(BaseModel):
    claim_id: str
    item_id: str
    student_id: str
    reason_proof: str
    status: str
    admin_notes: Optional[str] = None
    item_title: Optional[str] = None
    student_name: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ---------------- Dashboard & Stats Schemas ----------------
class StudentDashboardStats(BaseModel):
    total_reports: int
    lost_reports: int
    found_reports: int
    resolved_reports: int
    total_claims: int


class AdminDashboardStats(BaseModel):
    total_students: int
    total_items: int
    lost_items: int
    found_items: int
    pending_reports: int
    resolved_items: int
    pending_claims: int
