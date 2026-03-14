from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.user import User, UserRole
from utils.security import get_password_hash, verify_password, create_access_token, get_current_user
from services.otp_service import OTPService
from services.email_service import EmailService
from pydantic import BaseModel, EmailStr
from typing import Optional

router = APIRouter(prefix="/auth", tags=["auth"])

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone_number: Optional[str] = None
    role: Optional[UserRole] = UserRole.PATIENT

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class OTPVerify(BaseModel):
    email: EmailStr
    otp: str

@router.post("/signup")
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        password_hash=hashed_pwd,
        full_name=user_data.full_name,
        phone_number=user_data.phone_number if user_data.phone_number and user_data.phone_number.strip() else None,
        role=user_data.role,
        is_verified=True # Auto-verify for demo purposes
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Generate OTP for email verification (Bypassed for streamlined flow)
    # otp = OTPService.generate_otp(user_data.email)
    # EmailService.send_email(user_data.email, "Your OTP", f"Your OTP for verification is {otp}")
    
    return {"message": "User created successfully. You can now log in."}

@router.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Please verify your email before logging in")
        
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/verify-otp")
def verify_otp_endpoint(data: OTPVerify, db: Session = Depends(get_db)):
    if OTPService.verify_otp(data.email, data.otp):
        user = db.query(User).filter(User.email == data.email).first()
        if user:
            user.is_verified = True
            db.commit()
        return {"message": "Email verified successfully"}
    raise HTTPException(status_code=400, detail="Invalid or expired OTP")

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role
    }
