"""
Student Portal Router
Demonstrates:
- JOIN queries between students and items / item_claims
- Aggregate counts per student
- INSERT into item_claims
"""
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Student, Item, ItemClaim, ItemStatus, ClaimStatus
from ..schemas import (
    StudentResponse,
    ItemResponse,
    ClaimCreate,
    ClaimResponse,
    StudentDashboardStats
)

router = APIRouter(prefix="/api/students", tags=["Student Portal"])


def get_current_student_id(x_student_id: str = Header(..., description="Student ID passed in request header")) -> str:
    """Helper to retrieve authenticated student ID from request header."""
    if not x_student_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing X-Student-Id authentication header")
    return x_student_id


@router.get("/me", response_model=StudentResponse)
def get_me(student_id: str = Depends(get_current_student_id), db: Session = Depends(get_db)):
    """Retrieve logged-in student profile."""
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    return student


@router.get("/me/stats", response_model=StudentDashboardStats)
def get_student_stats(student_id: str = Depends(get_current_student_id), db: Session = Depends(get_db)):
    """Calculate personal dashboard counters for reports and claims."""
    total_reports = db.query(Item).filter(Item.student_id == student_id).count()
    lost_reports = db.query(Item).filter(Item.student_id == student_id, Item.type == "LOST").count()
    found_reports = db.query(Item).filter(Item.student_id == student_id, Item.type == "FOUND").count()
    resolved_reports = db.query(Item).filter(
        Item.student_id == student_id,
        Item.status.in_([ItemStatus.RESOLVED, ItemStatus.CLAIMED])
    ).count()
    total_claims = db.query(ItemClaim).filter(ItemClaim.student_id == student_id).count()

    return StudentDashboardStats(
        total_reports=total_reports,
        lost_reports=lost_reports,
        found_reports=found_reports,
        resolved_reports=resolved_reports,
        total_claims=total_claims
    )


@router.get("/me/reports", response_model=List[ItemResponse])
def get_my_reports(student_id: str = Depends(get_current_student_id), db: Session = Depends(get_db)):
    """Fetch all lost and found reports submitted by the logged-in student."""
    items = db.query(Item).filter(Item.student_id == student_id).order_by(Item.created_at.desc()).all()
    result = []
    for itm in items:
        resp = ItemResponse.from_orm(itm)
        resp.student_name = itm.student.name if itm.student else None
        result.append(resp)
    return result


@router.get("/me/claims", response_model=List[ClaimResponse])
def get_my_claims(student_id: str = Depends(get_current_student_id), db: Session = Depends(get_db)):
    """Fetch all claims submitted by the logged-in student with joined item details."""
    claims = db.query(ItemClaim).filter(ItemClaim.student_id == student_id).order_by(ItemClaim.created_at.desc()).all()
    result = []
    for clm in claims:
        resp = ClaimResponse.from_orm(clm)
        resp.item_title = clm.item.title if clm.item else None
        resp.student_name = clm.student.name if clm.student else None
        result.append(resp)
    return result


@router.post("/claims", response_model=ClaimResponse, status_code=status.HTTP_201_CREATED)
def submit_claim(payload: ClaimCreate, student_id: str = Depends(get_current_student_id), db: Session = Depends(get_db)):
    """Submit an ownership claim for a found item with proof."""
    item = db.query(Item).filter(Item.item_id == payload.item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")

    if item.type != "FOUND":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Claims can only be filed against FOUND items")

    if item.student_id == student_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot claim an item you reported finding")

    # Check for existing claim
    existing = db.query(ItemClaim).filter(
        ItemClaim.item_id == payload.item_id,
        ItemClaim.student_id == student_id
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You have already submitted a claim for this item")

    new_claim = ItemClaim(
        claim_id=f"CLM-{uuid.uuid4().hex[:8].upper()}",
        item_id=payload.item_id,
        student_id=student_id,
        reason_proof=payload.reason_proof,
        status=ClaimStatus.PENDING
    )
    db.add(new_claim)
    db.commit()
    db.refresh(new_claim)

    resp = ClaimResponse.from_orm(new_claim)
    resp.item_title = item.title
    return resp
