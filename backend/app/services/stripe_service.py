import stripe
from typing import Optional, Dict, Any
from app.config import settings
from fastapi import HTTPException
from decimal import Decimal

# Initialize Stripe
stripe.api_key = settings.stripe_secret_key

class StripeService:
    def __init__(self):
        self.stripe = stripe
    
    async def create_payment_intent(
        self, 
        amount: Decimal, 
        currency: str = "usd",
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Create a payment intent for checkout"""
        try:
            # Convert Decimal to cents for Stripe
            amount_cents = int(amount * 100)
            
            intent = self.stripe.PaymentIntent.create(
                amount=amount_cents,
                currency=currency,
                metadata=metadata or {},
                automatic_payment_methods={
                    'enabled': True,
                },
            )
            
            return {
                "client_secret": intent.client_secret,
                "payment_intent_id": intent.id,
                "amount": amount,
                "currency": currency
            }
            
        except stripe.error.StripeError as e:
            print(f"Stripe error: {e}")
            raise HTTPException(status_code=400, detail=f"Payment processing error: {str(e)}")
        except Exception as e:
            print(f"Payment intent creation error: {e}")
            raise HTTPException(status_code=500, detail="Failed to create payment intent")
    
    async def retrieve_payment_intent(self, payment_intent_id: str) -> Dict[str, Any]:
        """Retrieve payment intent details"""
        try:
            intent = self.stripe.PaymentIntent.retrieve(payment_intent_id)
            return {
                "id": intent.id,
                "status": intent.status,
                "amount": intent.amount,
                "currency": intent.currency,
                "metadata": intent.metadata
            }
        except stripe.error.StripeError as e:
            print(f"Stripe retrieve error: {e}")
            raise HTTPException(status_code=400, detail=f"Failed to retrieve payment: {str(e)}")
    
    async def create_refund(self, payment_intent_id: str, amount: Optional[Decimal] = None) -> Dict[str, Any]:
        """Create a refund for a payment"""
        try:
            refund_data = {
                "payment_intent": payment_intent_id
            }
            
            if amount:
                refund_data["amount"] = int(amount * 100)  # Convert to cents
            
            refund = self.stripe.Refund.create(**refund_data)
            
            return {
                "id": refund.id,
                "status": refund.status,
                "amount": refund.amount,
                "reason": refund.reason
            }
            
        except stripe.error.StripeError as e:
            print(f"Stripe refund error: {e}")
            raise HTTPException(status_code=400, detail=f"Refund failed: {str(e)}")
    
    async def create_customer(self, email: str, name: Optional[str] = None) -> Dict[str, Any]:
        """Create a Stripe customer"""
        try:
            customer_data = {
                "email": email,
            }
            
            if name:
                customer_data["name"] = name
            
            customer = self.stripe.Customer.create(**customer_data)
            
            return {
                "id": customer.id,
                "email": customer.email,
                "name": customer.name
            }
            
        except stripe.error.StripeError as e:
            print(f"Stripe customer creation error: {e}")
            raise HTTPException(status_code=400, detail=f"Customer creation failed: {str(e)}")
    
    async def get_payment_methods(self, customer_id: str) -> list[Dict[str, Any]]:
        """Get customer's payment methods"""
        try:
            payment_methods = self.stripe.PaymentMethod.list(
                customer=customer_id,
                type="card"
            )
            
            return [{
                "id": pm.id,
                "type": pm.type,
                "card": pm.card,
                "billing_details": pm.billing_details
            } for pm in payment_methods.data]
            
        except stripe.error.StripeError as e:
            print(f"Stripe payment methods error: {e}")
            raise HTTPException(status_code=400, detail=f"Failed to retrieve payment methods: {str(e)}")

# Global Stripe service instance
stripe_service = StripeService()

