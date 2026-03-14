from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.user import User, UserRole
from models.report import Report
from models.consultation import Consultation
from utils.security import get_current_user, get_password_hash
from pydantic import BaseModel, EmailStr
from typing import List

router = APIRouter(prefix="/admin", tags=["Admin Management"])

def verify_admin(user: User = Depends(get_current_user)):
    if user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Admin privileges required."
        )
    return user

class DoctorCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

@router.get("/users")
def list_users(db: Session = Depends(get_db), admin: User = Depends(verify_admin)):
    return db.query(User).all()

@router.post("/add-doctor", status_code=status.HTTP_201_CREATED)
def add_doctor(doctor_data: DoctorCreate, db: Session = Depends(get_db), admin: User = Depends(verify_admin)):
    # Check if user exists
    if db.query(User).filter(User.email == doctor_data.email).first():
        raise HTTPException(status_code=400, detail="User with this email already exists")
    
    new_doctor = User(
        email=doctor_data.email,
        password_hash=get_password_hash(doctor_data.password),
        full_name=doctor_data.full_name,
        role=UserRole.DOCTOR,
        is_verified=True
    )
    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)
    return {"message": "Doctor account created successfully", "doctor_id": new_doctor.id}

@router.get("/reports")
def get_platform_reports(db: Session = Depends(get_db), admin: User = Depends(verify_admin)):
    return {
        "stats": {
            "total_users": db.query(User).count(),
            "total_patients": db.query(User).filter(User.role == UserRole.PATIENT).count(),
            "total_doctors": db.query(User).filter(User.role == UserRole.DOCTOR).count(),
            "total_reports": db.query(Report).count(),
            "total_consultations": db.query(Consultation).count()
        },
        "system_health": "excellent"
    }

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), admin: User = Depends(verify_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}
