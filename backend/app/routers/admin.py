"""
Admin Portal Router
Demonstrates:
- Aggregate functions (COUNT, GROUP BY)
- UPDATE queries for approval status transitions
- State integrity (approving claim sets claim to APPROVED and item to CLAIMED)
- Administrative access verification
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Admin, Student, Item, ItemClaim, ItemStatus, ClaimStatus
from ..schemas import (
    AdminDashboardStats,
    ItemResponse,
    ClaimResponse,
    StudentResponse
)

router = APIRouter(prefix="/api/admin", tags=["Admin Portal"])


def verify_admin(x_admin_id: str = Header(..., description="Admin ID passed in request header"), db: Session = Depends(get_db)):
    """Enforces admin access verification from database."""
    admin = db.query(Admin).filter(Admin.admin_id == x_admin_id).first()
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized: Admin access required"
        )
    return admin


@router.get("/dashboard", response_model=AdminDashboardStats)
def get_admin_dashboard(admin: Admin = Depends(verify_admin), db: Session = Depends(get_db)):
    """
    Computes aggregate metrics across MySQL tables:
    - COUNT(*) on students, items, claims with WHERE conditions
    """
    total_students = db.query(Student).count()
    total_items = db.query(Item).count()
    lost_items = db.query(Item).filter(Item.type == "LOST").count()
    found_items = db.query(Item).filter(Item.type == "FOUND").count()
    pending_reports = db.query(Item).filter(Item.status == ItemStatus.PENDING).count()
    resolved_items = db.query(Item).filter(
        Item.status.in_([ItemStatus.RESOLVED, ItemStatus.CLAIMED])
    ).count()
    pending_claims = db.query(ItemClaim).filter(ItemClaim.status == ClaimStatus.PENDING).count()

    return AdminDashboardStats(
        total_students=total_students,
        total_items=total_items,
        lost_items=lost_items,
        found_items=found_items,
        pending_reports=pending_reports,
        resolved_items=resolved_items,
        pending_claims=pending_claims
    )


@router.get("/items", response_model=List[ItemResponse])
def get_all_items_admin(admin: Admin = Depends(verify_admin), db: Session = Depends(get_db)):
    """Fetch all reports for review with student info."""
    items = db.query(Item).order_by(Item.created_at.desc()).all()
    result = []
    for itm in items:
        resp = ItemResponse.from_orm(itm)
        resp.student_name = itm.student.name if itm.student else None
        result.append(resp)
    return result


@router.put("/items/{item_id}/approve", response_model=ItemResponse)
def approve_item(item_id: str, admin: Admin = Depends(verify_admin), db: Session = Depends(get_db)):
    """Approve a pending report to be displayed publicly."""
    item = db.query(Item).filter(Item.item_id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")

    item.status = ItemStatus.APPROVED
    db.commit()
    db.refresh(item)

    resp = ItemResponse.from_orm(item)
    resp.student_name = item.student.name if item.student else None
    return resp


@router.put("/items/{item_id}/reject", response_model=ItemResponse)
def reject_item(item_id: str, admin: Admin = Depends(verify_admin), db: Session = Depends(get_db)):
    """Reject an inappropriate or incomplete report."""
    item = db.query(Item).filter(Item.item_id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")

    item.status = ItemStatus.REJECTED
    db.commit()
    db.refresh(item)

    resp = ItemResponse.from_orm(item)
    resp.student_name = item.student.name if item.student else None
    return resp


@router.put("/items/{item_id}/resolve", response_model=ItemResponse)
def resolve_item(item_id: str, admin: Admin = Depends(verify_admin), db: Session = Depends(get_db)):
    """Mark an item report as resolved (returned or reunited)."""
    item = db.query(Item).filter(Item.item_id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")

    item.status = ItemStatus.RESOLVED
    db.commit()
    db.refresh(item)

    resp = ItemResponse.from_orm(item)
    resp.student_name = item.student.name if item.student else None
    return resp


@router.delete("/items/{item_id}")
def delete_item_admin(item_id: str, admin: Admin = Depends(verify_admin), db: Session = Depends(get_db)):
    """Admin hard delete for spam or inappropriate reports."""
    item = db.query(Item).filter(Item.item_id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")

    db.delete(item)
    db.commit()
    return {"success": True, "message": f"Item {item_id} deleted by Admin"}


@router.get("/claims", response_model=List[ClaimResponse])
def get_all_claims(admin: Admin = Depends(verify_admin), db: Session = Depends(get_db)):
    """Retrieve all claims with joined item and claimant student data."""
    claims = db.query(ItemClaim).order_by(ItemClaim.created_at.desc()).all()
    result = []
    for clm in claims:
        resp = ClaimResponse.from_orm(clm)
        resp.item_title = clm.item.title if clm.item else None
        resp.student_name = clm.student.name if clm.student else None
        result.append(resp)
    return result


@router.put("/claims/{claim_id}/approve", response_model=ClaimResponse)
def approve_claim(claim_id: str, admin: Admin = Depends(verify_admin), db: Session = Depends(get_db)):
    """
    Approve ownership claim.
    Demonstrates multi-table transaction:
    - Sets claim status = APPROVED
    - Sets corresponding item status = CLAIMED
    """
    claim = db.query(ItemClaim).filter(ItemClaim.claim_id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found")

    claim.status = ClaimStatus.APPROVED
    claim.admin_notes = f"Verified and approved by admin {admin.name}."

    # Synchronize item status
    if claim.item:
        claim.item.status = ItemStatus.CLAIMED

    db.commit()
    db.refresh(claim)

    resp = ClaimResponse.from_orm(claim)
    resp.item_title = claim.item.title if claim.item else None
    resp.student_name = claim.student.name if claim.student else None
    return resp


@router.put("/claims/{claim_id}/reject", response_model=ClaimResponse)
def reject_claim(claim_id: str, admin: Admin = Depends(verify_admin), db: Session = Depends(get_db)):
    """Reject an invalid ownership claim."""
    claim = db.query(ItemClaim).filter(ItemClaim.claim_id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found")

    claim.status = ClaimStatus.REJECTED
    claim.admin_notes = f"Proof was insufficient. Rejected by {admin.name}."
    db.commit()
    db.refresh(claim)

    resp = ClaimResponse.from_orm(claim)
    resp.item_title = claim.item.title if claim.item else None
    resp.student_name = claim.student.name if claim.student else None
    return resp


@router.get("/students", response_model=List[StudentResponse])
def get_all_students(admin: Admin = Depends(verify_admin), db: Session = Depends(get_db)):
    """Display registered student directory for admin verification."""
    students = db.query(Student).order_by(Student.name.asc()).all()
    return students
