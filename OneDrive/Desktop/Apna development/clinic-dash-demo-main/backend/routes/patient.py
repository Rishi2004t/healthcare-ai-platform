from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.report import Report
from models.user import User
from models.profile import PatientProfile
from utils.security import get_current_user
from services.pdf_service import PDFService
from pydantic import BaseModel
from typing import Optional
import os

router = APIRouter(prefix="/patient", tags=["patient"])

class ProfileBase(BaseModel):
    name: str
    age: int
    gender: str
    height: float
    weight: float
    blood_group: str
    medical_history: Optional[str] = None
    allergies: Optional[str] = None
    lifestyle: Optional[str] = None
    symptoms: Optional[str] = None
    existing_diseases: Optional[str] = None
    medications: Optional[str] = None
    emergency_contact: Optional[str] = None
    address: Optional[str] = None

class ProfileCreate(ProfileBase):
    pass

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    blood_group: Optional[str] = None
    medical_history: Optional[str] = None
    allergies: Optional[str] = None
    lifestyle: Optional[str] = None
    symptoms: Optional[str] = None
    existing_diseases: Optional[str] = None
    medications: Optional[str] = None
    emergency_contact: Optional[str] = None
    address: Optional[str] = None

@router.post("/profile", status_code=status.HTTP_201_CREATED)
def create_profile(profile_data: ProfileCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing_profile = db.query(PatientProfile).filter(PatientProfile.user_id == current_user.id).first()
    if existing_profile:
        raise HTTPException(status_code=400, detail="Profile already exists. Use PUT to update.")
    
    new_profile = PatientProfile(**profile_data.dict(), user_id=current_user.id)
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return new_profile

@router.get("/profile")
def get_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = db.query(PatientProfile).filter(PatientProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/profile")
def update_profile(profile_data: ProfileUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = db.query(PatientProfile).filter(PatientProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    update_data = profile_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(profile, key, value)
    
    db.commit()
    db.refresh(profile)
    return profile
class ReportRequest(BaseModel):
    title: str
    description: str

@router.get("/reports/{patient_id}")
def get_reports(patient_id: int, db: Session = Depends(get_db)):
    reports = db.query(Report).filter(Report.patient_id == patient_id).all()
    return reports

@router.post("/reports/{patient_id}/generate")
def generate_report(patient_id: int, report_data: ReportRequest, db: Session = Depends(get_db)):
    patient = db.query(User).filter(User.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
        
    file_path = f"storage/reports/report_{patient_id}_{os.urandom(4).hex()}.pdf"
    
    # In real app, doctor_id would come from auth context
    doctor_id = 1 
    
    report_pdf_data = {
        "title": report_data.title,
        "description": report_data.description,
        "patient_name": patient.full_name,
        "doctor_name": "Dr. Smith", 
        "date": "2024-03-07"
    }
    
    PDFService.generate_report_pdf(report_pdf_data, file_path)
    
    new_report = Report(
        patient_id=patient_id,
        doctor_id=doctor_id,
        title=report_data.title,
        description=report_data.description,
        file_path=file_path
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    return {"message": "Report generated", "report_id": new_report.id, "file_path": file_path}
