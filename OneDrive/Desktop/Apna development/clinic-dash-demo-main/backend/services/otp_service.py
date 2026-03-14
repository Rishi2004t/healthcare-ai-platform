import random
import string
from typing import Dict
import time

# In-memory storage for OTPs (In production, use Redis)
otp_storage: Dict[str, Dict] = {}

class OTPService:
    @staticmethod
    def generate_otp(identifier: str, length: int = 6, expiry_minutes: int = 5) -> str:
        otp = ''.join(random.choices(string.digits, k=length))
        otp_storage[identifier] = {
            "otp": otp,
            "expiry": time.time() + (expiry_minutes * 60)
        }
        return otp

    @staticmethod
    def verify_otp(identifier: str, otp: str) -> bool:
        if identifier not in otp_storage:
            return False
        
        stored_data = otp_storage[identifier]
        if time.time() > stored_data["expiry"]:
            del otp_storage[identifier]
            return False
            
        if stored_data["otp"] == otp:
            del otp_storage[identifier]
            return True
        return False
