from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List
from app.database import get_db
from app.models import CartItem, Product, User
from app.schemas import CartItemCreate, CartItemResponse, CartItemUpdate
from app.auth import get_current_active_user
from uuid import UUID

router = APIRouter(prefix="/cart", tags=["cart"])

@router.get("/", response_model=List[CartItemResponse])
async def get_cart_items(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get user's cart items"""
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    return cart_items

@router.post("/", response_model=CartItemResponse)
async def add_to_cart(
    cart_item: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Add item to cart"""
    # Check if product exists and is available
    product = db.query(Product).filter(
        and_(Product.id == cart_item.product_id, Product.is_active == True)
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product.stock_quantity < cart_item.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock available")
    
    # Check if item already exists in cart
    existing_item = db.query(CartItem).filter(
        and_(
            CartItem.user_id == current_user.id,
            CartItem.product_id == cart_item.product_id
        )
    ).first()
    
    if existing_item:
        # Update quantity
        existing_item.quantity += cart_item.quantity
        if existing_item.quantity > product.stock_quantity:
            raise HTTPException(status_code=400, detail="Not enough stock available")
        db.commit()
        db.refresh(existing_item)
        return existing_item
    else:
        # Create new cart item
        db_cart_item = CartItem(
            user_id=current_user.id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity
        )
        db.add(db_cart_item)
        db.commit()
        db.refresh(db_cart_item)
        return db_cart_item

@router.put("/{cart_item_id}", response_model=CartItemResponse)
async def update_cart_item(
    cart_item_id: UUID,
    cart_item_update: CartItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update cart item quantity"""
    cart_item = db.query(CartItem).filter(
        and_(
            CartItem.id == cart_item_id,
            CartItem.user_id == current_user.id
        )
    ).first()
    
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    # Check stock availability
    if cart_item_update.quantity > cart_item.product.stock_quantity:
        raise HTTPException(status_code=400, detail="Not enough stock available")
    
    cart_item.quantity = cart_item_update.quantity
    db.commit()
    db.refresh(cart_item)
    return cart_item

@router.delete("/{cart_item_id}")
async def remove_from_cart(
    cart_item_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Remove item from cart"""
    cart_item = db.query(CartItem).filter(
        and_(
            CartItem.id == cart_item_id,
            CartItem.user_id == current_user.id
        )
    ).first()
    
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    db.delete(cart_item)
    db.commit()
    
    return {"message": "Item removed from cart"}

@router.delete("/")
async def clear_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Clear all items from cart"""
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()
    
    return {"message": "Cart cleared"}

@router.get("/count")
async def get_cart_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get total number of items in cart"""
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    total_count = sum(item.quantity for item in cart_items)
    
    return {"count": total_count}

