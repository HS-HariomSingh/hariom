"""
Authentication Router
Handles student and admin logins backed by MySQL
Demonstrates SELECT queries with WHERE and UNIQUE constraints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Student, Admin
from ..schemas import StudentLoginRequest, AdminLoginRequest, LoginResponse

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/student/login", response_model=LoginResponse)
def student_login(payload: StudentLoginRequest, db: Session = Depends(get_db)):
    """Authenticate student against MySQL database records."""
    student = db.query(Student).filter(Student.email == payload.email).first()

    if not student:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # In production, use bcrypt verify; for demo comparison:
    if student.password_hash != payload.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    return LoginResponse(
        success=True,
        message="Student logged in successfully",
        user_type="student",
        user={
            "student_id": student.student_id,
            "name": student.name,
            "email": student.email,
            "department": student.department,
            "year": student.year,
            "roll_number": student.roll_number,
            "phone": student.phone
        }
    )


@router.post("/admin/login", response_model=LoginResponse)
def admin_login(payload: AdminLoginRequest, db: Session = Depends(get_db)):
    """Authenticate administrator against MySQL database records."""
    admin = db.query(Admin).filter(Admin.email == payload.email).first()

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid administrator credentials"
        )

    if admin.password_hash != payload.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid administrator credentials"
        )

    return LoginResponse(
        success=True,
        message="Administrator logged in successfully",
        user_type="admin",
        user={
            "admin_id": admin.admin_id,
            "name": admin.name,
            "email": admin.email,
            "role": admin.role
        }
    )


@router.post("/logout")
def logout():
    """Clear session token or client credentials."""
    return {"success": True, "message": "Logged out successfully"}
