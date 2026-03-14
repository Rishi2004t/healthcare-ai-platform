from sqlalchemy import Column, Integer, String, Boolean, Enum, DateTime
from sqlalchemy.orm import relationship
from database import Base
import enum
import datetime

class UserRole(str, enum.Enum):
    PATIENT = "patient"
    DOCTOR = "doctor"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    password_hash = Column(String)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    role = Column(Enum(UserRole), default=UserRole.PATIENT)
    phone_number = Column(String, unique=True, index=True, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("PatientProfile", back_populates="user", uselist=False)
    chat_history = relationship("ChatMessage", back_populates="user")
    
    # Profile Fields
    address = Column(String, nullable=True)
    blood_group = Column(String, nullable=True)
    medical_history = Column(String, nullable=True) # Summary or JSON string
    date_of_birth = Column(String, nullable=True)
