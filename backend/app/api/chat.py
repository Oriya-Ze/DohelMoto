from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import ChatMessage, User, Product, Category
from app.schemas import ChatMessageCreate, ChatMessageResponse
from app.auth import get_current_active_user
from app.services.ai_service import ai_service
from uuid import UUID
import json
import asyncio

router = APIRouter(prefix="/chat", tags=["chat"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[UUID, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: UUID):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: UUID):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def send_to_user(self, message: str, user_id: UUID):
        if user_id in self.active_connections:
            websocket = self.active_connections[user_id]
            await self.send_personal_message(message, websocket)

manager = ConnectionManager()

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: UUID):
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Handle the message (you can add validation here)
            # For now, just echo back
            await manager.send_personal_message(f"Echo: {data}", websocket)
            
    except WebSocketDisconnect:
        manager.disconnect(user_id)

@router.post("", response_model=ChatMessageResponse)
@router.post("/", response_model=ChatMessageResponse)
async def send_message(
    message_data: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Send a message and get AI response"""
    
    # Save user message to database
    user_message = ChatMessage(
        user_id=current_user.id,
        message=message_data.message,
        is_from_ai=False,
        session_id=message_data.session_id
    )
    db.add(user_message)
    db.commit()
    
    # Get products and categories for AI context
    products = db.query(Product).filter(Product.is_active == True).limit(20).all()
    categories = db.query(Category).filter(Category.is_active == True).all()
    
    # Get AI response
    ai_response = await ai_service.get_product_recommendations(
        message_data.message, products, categories
    )
    
    # Save AI response to database
    ai_message = ChatMessage(
        user_id=current_user.id,
        message=ai_response,
        is_from_ai=True,
        session_id=message_data.session_id
    )
    db.add(ai_message)
    db.commit()
    db.refresh(ai_message)
    
    return ai_message

@router.get("/history/{session_id}", response_model=List[ChatMessageResponse])
async def get_chat_history(
    session_id: str,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get chat history for a session"""
    messages = db.query(ChatMessage).filter(
        ChatMessage.user_id == current_user.id,
        ChatMessage.session_id == session_id
    ).offset(skip).limit(limit).all()
    
    return messages

@router.get("/sessions", response_model=List[str])
async def get_chat_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get list of chat sessions for current user"""
    sessions = db.query(ChatMessage.session_id).filter(
        ChatMessage.user_id == current_user.id,
        ChatMessage.session_id.isnot(None)
    ).distinct().all()
    
    return [session[0] for session in sessions]

@router.delete("/session/{session_id}")
async def delete_chat_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete a chat session"""
    db.query(ChatMessage).filter(
        ChatMessage.user_id == current_user.id,
        ChatMessage.session_id == session_id
    ).delete()
    db.commit()
    
    return {"message": "Chat session deleted"}

