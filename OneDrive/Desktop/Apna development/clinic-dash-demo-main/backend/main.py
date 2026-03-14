from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import database
from models import user, report, knowledge, consultation, profile, chat
from routes import auth, patient, ai_chat, knowledge as knowledge_route, consultation as consultation_route, admin, reports, health, doctor

# Create database tables
database.Base.metadata.create_all(bind=database.engine)

from sqlalchemy.orm import Session
from database import get_db
from models.user import User, UserRole
from fastapi import Depends

app = FastAPI(title="AI Healthcare Platform API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(patient.router)
app.include_router(ai_chat.router)
app.include_router(knowledge_route.router)
app.include_router(consultation_route.router)
app.include_router(admin.router)
app.include_router(reports.router)
app.include_router(health.router)
app.include_router(doctor.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Healthcare Platform API"}

@app.get("/doctors")
def get_all_doctors(db: Session = Depends(get_db)):
    doctors = db.query(User).filter(User.role == UserRole.DOCTOR).all()
    return doctors
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
