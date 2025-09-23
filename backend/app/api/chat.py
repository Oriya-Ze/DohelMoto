from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import ChatMessage, User, Product, Category
from app.schemas import ChatMessageCreate, ChatMessageResponse
from app.auth import get_current_active_user
from app.services.ai_service import ai_service
from app.config import settings
from uuid import UUID
import json
import asyncio
from openai import OpenAI, APIError

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
    
    print(f"Received message: {message_data.message}")
    print(f"User: {current_user.email}")
    
    # Save user message to database
    user_message = ChatMessage(
        user_id=current_user.id,
        message=message_data.message,
        is_from_ai=False,
        session_id=message_data.session_id
    )
    db.add(user_message)
    db.commit()
    
    # Get AI response with proper error handling
    try:
        print(f"Getting AI response for message: {message_data.message}")
        
        # Check if we have OpenAI API key
        if not settings.openai_api_key:
            # Return a fallback response instead of raising an exception
            ai_response = "I'm sorry, but the AI service is not available at the moment. Please try again later or contact support."
            print("No OpenAI API key - using fallback response")
        else:
            # Create OpenAI client
            client = OpenAI(api_key=settings.openai_api_key)
            
            # Make API call
            response = await asyncio.to_thread(
                client.chat.completions.create,
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": message_data.message}]
            )
            
            ai_response = response.choices[0].message.content
            print(f"AI response: {ai_response}")
        
    except APIError as e:
        # Print real OpenAI error
        print(f"OpenAI API Error: {e.response.status if hasattr(e, 'response') else 'Unknown'}")
        print(f"Error data: {e.response.data if hasattr(e, 'response') and hasattr(e.response, 'data') else e.message}")
        
        req_id = e.response.headers.get("x-request-id") if hasattr(e, 'response') and hasattr(e.response, 'headers') else None
        
        raise HTTPException(
            status_code=502,
            detail={
                "ok": False,
                "error": e.response.data.error.message if hasattr(e, 'response') and hasattr(e.response, 'data') and hasattr(e.response.data, 'error') else str(e),
                "requestId": req_id
            }
        )
    except Exception as e:
        # Print real error
        print(f"Unexpected error: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "ok": False,
                "error": str(e),
                "requestId": None
            }
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
    
    print(f"Returning AI message: {ai_message.message}")
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

