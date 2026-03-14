from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session
from database import get_db
from models.consultation import Consultation, ConsultationStatus
from models.user import User, UserRole
from utils.security import get_current_user
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/consultation", tags=["consultation"])

class ConsultationRequest(BaseModel):
    doctor_name: str
    patient_name: str
    age: int
    symptoms: str
    duration: str
    medical_report_path: Optional[str] = None

@router.post("/request", status_code=status.HTTP_201_CREATED)
def request_consultation(request_data: ConsultationRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.PATIENT:
        raise HTTPException(status_code=403, detail="Only patients can request consultations")
    
    new_request = Consultation(
        patient_id=current_user.id,
        patient_name=request_data.patient_name,
        age=request_data.age,
        symptoms=request_data.symptoms,
        duration=request_data.duration,
        medical_report_path=request_data.medical_report_path,
        notes=f"Assigned to: {request_data.doctor_name}",
        status=ConsultationStatus.PENDING
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request

class ConsultationResponse(BaseModel):
    consultation_id: int
    advice: str

@router.get("/my-requests")
def get_my_consultations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role == UserRole.PATIENT:
        return db.query(Consultation).filter(Consultation.patient_id == current_user.id).all()
    elif current_user.role == UserRole.DOCTOR:
        # Show assigned or unassigned pending requests
        return db.query(Consultation).filter(or_(Consultation.doctor_id == current_user.id, Consultation.status == ConsultationStatus.PENDING)).all()
    return []

@router.post("/respond")
def respond_to_consultation(response_data: ConsultationResponse, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.DOCTOR:
        raise HTTPException(status_code=403, detail="Only doctors can provide advice")
    
    consultation = db.query(Consultation).filter(Consultation.id == response_data.consultation_id).first()
    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")
    
    consultation.doctor_id = current_user.id
    consultation.doctor_advice = response_data.advice
    consultation.status = ConsultationStatus.COMPLETED
    
    db.commit()
    db.refresh(consultation)
    return consultation
