import openai
from typing import List, Dict, Any
from app.config import settings
from app.models import Product, Category
from sqlalchemy.orm import Session

# Initialize OpenAI client
openai.api_key = settings.openai_api_key

class AIService:
    def __init__(self):
        self.client = openai.OpenAI(api_key=settings.openai_api_key)
    
    async def get_product_recommendations(
        self, 
        user_message: str, 
        products: List[Product], 
        categories: List[Category]
    ) -> str:
        """Get AI-powered product recommendations based on user message"""
        
        # Create product context
        product_context = []
        for product in products[:20]:  # Limit to top 20 products for context
            product_info = f"""
            Product: {product.name}
            Description: {product.description or 'No description'}
            Price: ${product.price}
            Category: {product.category.name if product.category else 'Uncategorized'}
            Rating: {product.rating}/5 ({product.review_count} reviews)
            In Stock: {product.stock_quantity > 0}
            """
            product_context.append(product_info)
        
        # Create category context
        category_context = "\n".join([f"- {cat.name}: {cat.description or 'No description'}" 
                                    for cat in categories])
        
        system_prompt = f"""
        You are a helpful shopping assistant for an e-commerce store. 
        
        Available Categories:
        {category_context}
        
        Available Products:
        {chr(10).join(product_context)}
        
        Your task is to:
        1. Understand what the customer is looking for
        2. Recommend specific products from the available inventory
        3. Provide helpful information about products
        4. Be friendly and professional
        5. If no products match their request, suggest similar alternatives
        6. Keep responses concise but informative
        7. Always mention product names and prices when recommending
        
        Respond in a conversational, helpful tone.
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=300,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"AI service error: {e}")
            return "I apologize, but I'm having trouble processing your request right now. Please try again later or browse our products directly."
    
    async def get_general_chat_response(self, user_message: str) -> str:
        """Get general chat response for non-product related queries"""
        
        system_prompt = """
        You are a helpful customer service assistant for an e-commerce store.
        
        You can help with:
        - General questions about shopping
        - Order inquiries
        - Return and refund policies
        - Shipping information
        - Account-related questions
        - Product recommendations (ask for more details)
        
        Be friendly, helpful, and professional. If you can't help with something specific,
        direct them to contact customer service or browse the store.
        
        Keep responses concise and helpful.
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=200,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"AI service error: {e}")
            return "I apologize, but I'm having trouble processing your request right now. Please try again later."

# Global AI service instance
ai_service = AIService()

