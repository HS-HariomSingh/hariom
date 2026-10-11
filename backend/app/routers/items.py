"""
Items Router
Demonstrates:
- SELECT queries with dynamic WHERE filters (type, category, status, search string)
- ORDER BY date_incident DESC, created_at DESC
- INSERT, UPDATE, and DELETE operations
- Foreign Key association with reporting student
"""
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Header, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from ..database import get_db
from ..models import Item, Student, ItemType, ItemStatus
from ..schemas import ItemCreate, ItemUpdate, ItemResponse

router = APIRouter(prefix="/api/items", tags=["Lost and Found Items"])


@router.get("", response_model=List[ItemResponse])
def get_items(
    type: Optional[str] = Query(None, description="LOST or FOUND"),
    category: Optional[str] = Query(None, description="Category filter"),
    status: Optional[str] = Query(None, description="Status filter"),
    search: Optional[str] = Query(None, description="Search query in title or description or location"),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Retrieve filtered and searched items."""
    query = db.query(Item)

    if type:
        query = query.filter(Item.type == type)
    if category and category != "All":
        query = query.filter(Item.category == category)
    if status and status != "All":
        query = query.filter(Item.status == status)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Item.title.ilike(search_pattern),
                Item.description.ilike(search_pattern),
                Item.location.ilike(search_pattern)
            )
        )

    items = query.order_by(Item.date_incident.desc(), Item.created_at.desc()).limit(limit).all()

    result = []
    for itm in items:
        resp = ItemResponse.from_orm(itm)
        resp.student_name = itm.student.name if itm.student else "Anonymous Student"
        result.append(resp)
    return result


@router.get("/{item_id}", response_model=ItemResponse)
def get_item_by_id(item_id: str, db: Session = Depends(get_db)):
    """Retrieve detailed information for a single item by primary key."""
    item = db.query(Item).filter(Item.item_id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")

    resp = ItemResponse.from_orm(item)
    resp.student_name = item.student.name if item.student else None
    return resp


@router.post("", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
def report_item(
    payload: ItemCreate,
    x_student_id: str = Header(..., description="ID of student filing the report"),
    db: Session = Depends(get_db)
):
    """
    Report a Lost or Found item.
    Enforces:
    - Default status: PENDING
    - Association with student via foreign key
    """
    student = db.query(Student).filter(Student.student_id == x_student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid student reporting ID")

    new_item = Item(
        item_id=f"ITEM-{uuid.uuid4().hex[:8].upper()}",
        title=payload.title,
        category=payload.category,
        description=payload.description,
        type=ItemType[payload.type],
        status=ItemStatus.PENDING,
        location=payload.location,
        date_incident=payload.date_incident,
        image_url=payload.image_url,
        student_id=x_student_id
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    resp = ItemResponse.from_orm(new_item)
    resp.student_name = student.name
    return resp


@router.put("/{item_id}", response_model=ItemResponse)
def update_item(
    item_id: str,
    payload: ItemUpdate,
    x_student_id: Optional[str] = Header(None),
    x_admin_id: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Update report details."""
    item = db.query(Item).filter(Item.item_id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")

    # Access control: either admin or owning student
    if not x_admin_id and (not x_student_id or item.student_id != x_student_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to edit this report")

    if payload.title is not None:
        item.title = payload.title
    if payload.category is not None:
        item.category = payload.category
    if payload.description is not None:
        item.description = payload.description
    if payload.location is not None:
        item.location = payload.location
    if payload.date_incident is not None:
        item.date_incident = payload.date_incident
    if payload.image_url is not None:
        item.image_url = payload.image_url
    if payload.status is not None and x_admin_id:
        item.status = ItemStatus[payload.status]

    db.commit()
    db.refresh(item)

    resp = ItemResponse.from_orm(item)
    resp.student_name = item.student.name if item.student else None
    return resp


@router.delete("/{item_id}")
def delete_item(
    item_id: str,
    x_student_id: Optional[str] = Header(None),
    x_admin_id: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Delete an item report and cascade to its claims."""
    item = db.query(Item).filter(Item.item_id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")

    if not x_admin_id and (not x_student_id or item.student_id != x_student_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this item")

    db.delete(item)
    db.commit()
    return {"success": True, "message": f"Item {item_id} deleted successfully"}
