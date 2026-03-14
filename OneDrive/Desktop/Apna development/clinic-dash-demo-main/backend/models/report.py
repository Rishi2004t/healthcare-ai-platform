from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"))
    symptoms = Column(Text)
    duration = Column(String)
    pain_level = Column(Integer)
    existing_conditions = Column(Text, nullable=True)
    medications = Column(Text, nullable=True)
    lifestyle_data = Column(Text, nullable=True)
    file_path = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    patient = relationship("User", foreign_keys=[patient_id])

