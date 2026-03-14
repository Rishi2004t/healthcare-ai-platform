from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.user import User, UserRole
from models.report import Report
from models.consultation import Consultation, ConsultationStatus
from utils.security import get_current_user
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/doctor", tags=["doctor"])

def verify_doctor(user: User = Depends(get_current_user)):
    if user.role != UserRole.DOCTOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Only doctors can access this dashboard."
        )
    return user

class ConsultationResponse(BaseModel):
    consultation_id: int
    advice: str

@router.get("/patients")
def list_patients(db: Session = Depends(get_db), doctor: User = Depends(verify_doctor)):
    # For a demo/platform, we list all users with PATIENT role
    # In a real system, this might be filtered by assigned patients
    patients = db.query(User).filter(User.role == UserRole.PATIENT).all()
    return patients

@router.get("/reports")
def view_all_reports(db: Session = Depends(get_db), doctor: User = Depends(verify_doctor)):
    reports = db.query(Report).all()
    return reports

@router.post("/respond")
def respond_to_patient(response_data: ConsultationResponse, db: Session = Depends(get_db), doctor: User = Depends(verify_doctor)):
    consultation = db.query(Consultation).filter(Consultation.id == response_data.consultation_id).first()
    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation request not found")
        
    consultation.doctor_id = doctor.id
    consultation.doctor_advice = response_data.advice
    consultation.status = ConsultationStatus.COMPLETED
    
    db.commit()
    db.refresh(consultation)
    return {"message": "Response sent successfully", "consultation_id": consultation.id}

