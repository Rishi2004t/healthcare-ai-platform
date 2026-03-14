from fastapi import APIRouter, Depends, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from database import get_db
from models.knowledge import Disease, Medicine
from typing import List

router = APIRouter(tags=["Knowledge Base"])

@router.get("/diseases/search")
def search_diseases(q: str = Query(None), db: Session = Depends(get_db)):
    query = db.query(Disease)
    if q:
        query = query.filter(or_(
            Disease.disease_name.ilike(f"%{q}%"),
            Disease.symptoms.ilike(f"%{q}%")
        ))
    return query.all()

@router.get("/medicines/search")
def search_medicines(q: str = Query(None), db: Session = Depends(get_db)):
    query = db.query(Medicine)
    if q:
        query = query.filter(Medicine.name.ilike(f"%{q}%"))
    return query.all()

