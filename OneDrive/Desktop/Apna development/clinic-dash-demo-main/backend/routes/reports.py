from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.report import Report
from models.user import User
from utils.security import get_current_user
from services.pdf_service import PDFService
from pydantic import BaseModel
from typing import Optional, List
import datetime
import os

router = APIRouter(prefix="/reports", tags=["reports"])

class ReportCreate(BaseModel):
    symptoms: str
    duration: str
    pain_level: int
    existing_conditions: Optional[str] = None
    medications: Optional[str] = None
    lifestyle_data: Optional[str] = None

@router.post("/create", status_code=status.HTTP_201_CREATED)
def create_medical_report(report_data: ReportCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    file_path = f"storage/reports/report_{current_user.id}_{os.urandom(4).hex()}.pdf"
    
    # Generate PDF
    pdf_data = {
        "patient_name": current_user.full_name,
        "date": datetime.datetime.utcnow().strftime("%Y-%m-%d"),
        **report_data.dict()
    }
    PDFService.generate_report_pdf(pdf_data, file_path)
    
    # Save to DB
    new_report = Report(
        patient_id=current_user.id,
        file_path=file_path,
        **report_data.dict()
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    return {"message": "Report created and PDF generated", "report_id": new_report.id, "file_path": file_path}

@router.get("/my-reports")
def get_my_reports(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    reports = db.query(Report).filter(Report.patient_id == current_user.id).all()
    return reports

