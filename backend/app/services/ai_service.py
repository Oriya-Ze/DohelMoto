import openai
from openai import OpenAI, APIError
from typing import List, Dict, Any
from app.config import settings
from app.models import Product, Category
from sqlalchemy.orm import Session
import os

class AIService:
    def __init__(self):
        print(f"Initializing AI Service...")
        print(f"OpenAI API Key from settings: {settings.openai_api_key[:10]}..." if settings.openai_api_key else "No API key found!")
        
        if not settings.openai_api_key:
            print("WARNING: No OpenAI API key found! Chat will use fallback responses.")
            self.client = None
        else:
            try:
                self.client = OpenAI(api_key=settings.openai_api_key)
                print("OpenAI client initialized successfully!")
            except Exception as e:
                print(f"Failed to initialize OpenAI client: {e}")
                self.client = None
    
    async def get_product_recommendations(
        self, 
        user_message: str, 
        products: List[Product], 
        categories: List[Category]
    ) -> str:
        """Get AI-powered product recommendations based on user message"""
        
        if not self.client:
            print("No OpenAI client available, using fallback response")
            return self._get_fallback_response(user_message)
        
        try:
            print(f"Making OpenAI API call with message: {user_message[:50]}...")
            
            # Simple system prompt
            system_prompt = """You are a specialized tractor and off-road vehicle parts expert for DohelMoto. 
            Help customers find the right parts for their tractors and off-road vehicles. 
            Be knowledgeable about agricultural and construction equipment. 
            Keep responses helpful and professional."""
            
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=300,
                temperature=0.7
            )
            
            ai_response = response.choices[0].message.content
            print(f"OpenAI response: {ai_response[:100]}...")
            return ai_response
            
        except APIError as e:
            print(f"OpenAI API Error: {e}")
            return self._get_fallback_response(user_message)
        except Exception as e:
            print(f"AI service error: {e}")
            return self._get_fallback_response(user_message)
    
    def _get_fallback_response(self, user_message: str) -> str:
        """Get fallback response based on user message"""
        if any(word in user_message.lower() for word in ['tire', 'tires', 'wheel', 'wheels']):
            return "I can help you find the right tires for your tractor. We have heavy-duty agricultural tires in various sizes. What type of terrain will you be working on?"
        elif any(word in user_message.lower() for word in ['engine', 'motor', 'filter', 'oil']):
            return "For engine parts, we have filters, oil systems, and engine components. What specific engine model are you working with?"
        elif any(word in user_message.lower() for word in ['hydraulic', 'pump', 'cylinder']):
            return "Our hydraulic systems include pumps, cylinders, and hoses. What hydraulic application do you need parts for?"
        else:
            return "I can help you find tractor and off-road vehicle parts. What specific part or system are you looking for?"
    
    async def get_general_chat_response(self, user_message: str) -> str:
        """Get general chat response for non-product related queries"""
        
        if not self.client:
            print("No OpenAI client available for general chat, using fallback response")
            return self._get_fallback_response(user_message)
        
        try:
            print(f"Making OpenAI API call for general chat with message: {user_message[:50]}...")
            
            system_prompt = """You are a helpful customer service assistant for DohelMoto, specializing in tractor and off-road vehicle parts.
            Be friendly, professional, and knowledgeable about agricultural and construction equipment."""
            
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=200,
                temperature=0.7
            )
            
            ai_response = response.choices[0].message.content
            print(f"OpenAI general chat response: {ai_response[:100]}...")
            return ai_response
            
        except APIError as e:
            print(f"OpenAI API Error: {e}")
            return self._get_fallback_response(user_message)
        except Exception as e:
            print(f"AI service error: {e}")
            return self._get_fallback_response(user_message)

# Global AI service instance
ai_service = AIService()

