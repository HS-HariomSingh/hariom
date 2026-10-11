"""
SQLAlchemy ORM Models representing DBMS relational schema for Lost and Found
Demonstrates:
- Primary Keys & Foreign Keys
- One-to-Many Relationships (students 1-N items, students 1-N claims, items 1-N claims)
- Cascading Deletes
- Enum constraints
- Unique constraints
"""
import enum
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Text,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    UniqueConstraint
)
from sqlalchemy.orm import relationship
from .database import Base


class ItemType(str, enum.Enum):
    LOST = "LOST"
    FOUND = "FOUND"


class ItemStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    CLAIMED = "CLAIMED"
    RESOLVED = "RESOLVED"


class ClaimStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class ItemCategory(str, enum.Enum):
    Electronics = "Electronics"
    Documents = "Documents"
    Books = "Books"
    Accessories = "Accessories"
    ID_Cards = "ID Cards"
    Bags = "Bags"
    Clothing = "Clothing"
    Other = "Other"


class Student(Base):
    __tablename__ = "students"

    student_id = Column(String(36), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    department = Column(String(80), nullable=False)
    year = Column(String(20), nullable=False)
    roll_number = Column(String(30), unique=True, nullable=False)
    phone = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 1-to-N relationships
    items = relationship("Item", back_populates="student", cascade="all, delete-orphan")
    claims = relationship("ItemClaim", back_populates="student", cascade="all, delete-orphan")


class Admin(Base):
    __tablename__ = "admins"

    admin_id = Column(String(36), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="Campus Officer")
    created_at = Column(DateTime, default=datetime.utcnow)


class Item(Base):
    __tablename__ = "items"

    item_id = Column(String(36), primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    category = Column(Enum(ItemCategory, values_callable=lambda x: [e.value for e in x]), nullable=False, default=ItemCategory.Other)
    description = Column(Text, nullable=False)
    type = Column(Enum(ItemType), nullable=False, index=True)
    status = Column(Enum(ItemStatus), nullable=False, default=ItemStatus.PENDING, index=True)
    location = Column(String(150), nullable=False)
    date_incident = Column(Date, nullable=False)
    image_url = Column(String(500), nullable=True)
    student_id = Column(String(36), ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="items")
    claims = relationship("ItemClaim", back_populates="item", cascade="all, delete-orphan")


class ItemClaim(Base):
    __tablename__ = "item_claims"

    claim_id = Column(String(36), primary_key=True, index=True)
    item_id = Column(String(36), ForeignKey("items.item_id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(String(36), ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False, index=True)
    reason_proof = Column(Text, nullable=False)
    status = Column(Enum(ClaimStatus), nullable=False, default=ClaimStatus.PENDING, index=True)
    admin_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    item = relationship("Item", back_populates="claims")
    student = relationship("Student", back_populates="claims")
