from fastapi import APIRouter, Depends, HTTPException
from services.recommend_service import RecommendationEngine
from pydantic import BaseModel
from typing import List, Optional, Dict

router = APIRouter(prefix="/health", tags=["health"])

class DietPlanRequest(BaseModel):
    symptoms: str
    duration: str
    pain_level: int
    existing_conditions: Optional[str] = None
    medications: Optional[str] = None
    lifestyle_data: Optional[str] = None

@router.post("/diet-plan")
def get_personalized_diet_plan(data: DietPlanRequest):
    try:
        recommendations = RecommendationEngine.get_full_recommendation(data.dict())
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

