from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from ai.chatbot import chatbot
from models.chat import ChatMessage
from models.user import User
from utils.security import get_current_user
from pydantic import BaseModel
from typing import List, Dict

router = APIRouter(prefix="/ai", tags=["AI Chatbot"])

class ChatRequest(BaseModel):
    user_id: int
    message: str

@router.post("/chat")
async def chat_with_ai(request: ChatRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        # Save user message
        user_msg = ChatMessage(user_id=current_user.id, sender="user", message=request.message)
        db.add(user_msg)
        
        # Get AI response
        response_text = await chatbot.get_response(current_user.id, request.message)
        
        # Save bot response
        bot_msg = ChatMessage(user_id=current_user.id, sender="bot", message=response_text)
        db.add(bot_msg)
        
        db.commit()
        return {"response": response_text}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
def get_chat_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    messages = db.query(ChatMessage).filter(ChatMessage.user_id == current_user.id).order_by(ChatMessage.created_at.asc()).all()
    return messages
