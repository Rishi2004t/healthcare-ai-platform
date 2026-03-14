from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

class PatientProfile(Base):
    __tablename__ = "patient_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    name = Column(String)
    age = Column(Integer)
    gender = Column(String)
    height = Column(Float)
    weight = Column(Float)
    blood_group = Column(String)
    medical_history = Column(Text, nullable=True)
    allergies = Column(Text, nullable=True)
    lifestyle = Column(Text, nullable=True)
    symptoms = Column(Text, nullable=True)
    existing_diseases = Column(Text, nullable=True)
    medications = Column(Text, nullable=True)
    emergency_contact = Column(String, nullable=True)
    address = Column(Text, nullable=True)

    user = relationship("User", back_populates="profile")

