from sqlalchemy import Column, Integer, String, Text
from database import Base

class Disease(Base):
    __tablename__ = "diseases"

    id = Column(Integer, primary_key=True, index=True)
    disease_name = Column(String, unique=True, index=True)
    description = Column(Text)
    symptoms = Column(Text)
    recommended_medicines = Column(Text)
    severity_level = Column(String) # e.g., Low, Medium, High

class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text)
    dosage = Column(String)
    side_effects = Column(Text)

