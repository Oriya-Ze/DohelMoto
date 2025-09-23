from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List
from app.database import get_db
from app.models import Order, OrderItem, CartItem, User, Product
from app.schemas import OrderCreate, OrderResponse, PaymentIntentCreate, PaymentIntentResponse
from app.auth import get_current_active_user
from app.services.stripe_service import stripe_service
from uuid import UUID
from decimal import Decimal

router = APIRouter(prefix="/orders", tags=["orders"])

@router.get("/", response_model=List[OrderResponse])
async def get_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get user's orders"""
    orders = db.query(Order).filter(Order.user_id == current_user.id).all()
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get specific order"""
    order = db.query(Order).filter(
        and_(Order.id == order_id, Order.user_id == current_user.id)
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return order

@router.post("/", response_model=OrderResponse)
async def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create order from cart items"""
    
    # Get cart items
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    # Calculate total amount
    total_amount = Decimal('0')
    order_items_data = []
    
    for cart_item in cart_items:
        # Check stock availability
        if cart_item.product.stock_quantity < cart_item.quantity:
            raise HTTPException(
                status_code=400, 
                detail=f"Not enough stock for {cart_item.product.name}"
            )
        
        # Calculate item total
        price = cart_item.product.discount_price or cart_item.product.price
        item_total = price * cart_item.quantity
        total_amount += item_total
        
        order_items_data.append({
            'product_id': cart_item.product_id,
            'quantity': cart_item.quantity,
            'price': price
        })
    
    # Create order
    order = Order(
        user_id=current_user.id,
        total_amount=total_amount,
        status="pending",
        payment_method=order_data.payment_method,
        payment_status="pending",
        shipping_address=order_data.shipping_address,
        billing_address=order_data.billing_address
    )
    
    db.add(order)
    db.commit()
    db.refresh(order)
    
    # Create order items
    for item_data in order_items_data:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item_data['product_id'],
            quantity=item_data['quantity'],
            price=item_data['price']
        )
        db.add(order_item)
        
        # Update product stock
        product = db.query(Product).filter(Product.id == item_data['product_id']).first()
        product.stock_quantity -= item_data['quantity']
    
    # Clear cart
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    
    db.commit()
    db.refresh(order)
    
    return order

@router.post("/{order_id}/payment-intent", response_model=PaymentIntentResponse)
async def create_payment_intent(
    order_id: UUID,
    payment_data: PaymentIntentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create payment intent for order"""
    
    # Verify order belongs to user
    order = db.query(Order).filter(
        and_(Order.id == order_id, Order.user_id == current_user.id)
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.status != "pending":
        raise HTTPException(status_code=400, detail="Order is not pending")
    
    # Create payment intent
    metadata = {
        "order_id": str(order.id),
        "user_id": str(current_user.id)
    }
    
    payment_intent = await stripe_service.create_payment_intent(
        amount=payment_data.amount,
        currency=payment_data.currency,
        metadata=metadata
    )
    
    return PaymentIntentResponse(
        client_secret=payment_intent["client_secret"],
        payment_intent_id=payment_intent["payment_intent_id"]
    )

@router.post("/{order_id}/confirm-payment")
async def confirm_payment(
    order_id: UUID,
    payment_intent_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Confirm payment and update order status"""
    
    # Verify order belongs to user
    order = db.query(Order).filter(
        and_(Order.id == order_id, Order.user_id == current_user.id)
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Verify payment intent
    payment_intent = await stripe_service.retrieve_payment_intent(payment_intent_id)
    
    if payment_intent["status"] != "succeeded":
        raise HTTPException(status_code=400, detail="Payment not successful")
    
    # Update order status
    order.status = "confirmed"
    order.payment_status = "paid"
    
    db.commit()
    
    return {"message": "Payment confirmed", "order_status": "confirmed"}

@router.post("/{order_id}/cancel")
async def cancel_order(
    order_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Cancel an order"""
    
    # Verify order belongs to user
    order = db.query(Order).filter(
        and_(Order.id == order_id, Order.user_id == current_user.id)
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.status not in ["pending", "confirmed"]:
        raise HTTPException(status_code=400, detail="Order cannot be cancelled")
    
    # Restore stock
    for order_item in order.order_items:
        if order_item.product:
            order_item.product.stock_quantity += order_item.quantity
    
    # Update order status
    order.status = "cancelled"
    
    db.commit()
    
    return {"message": "Order cancelled"}

