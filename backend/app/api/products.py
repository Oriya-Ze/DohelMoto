from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
from app.database import get_db
from app.models import Product, Category, Review
from app.schemas import ProductResponse, ProductCreate, ProductUpdate, CategoryResponse
from app.auth import get_current_active_user, get_current_user
from app.models import User
from uuid import UUID

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=List[ProductResponse])
async def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category_id: Optional[UUID] = None,
    search: Optional[str] = None,
    featured_only: bool = False,
    db: Session = Depends(get_db)
):
    """Get products with optional filtering"""
    query = db.query(Product).filter(Product.is_active == True)
    
    # Apply filters
    if category_id:
        query = query.filter(Product.category_id == category_id)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_term),
                Product.description.ilike(search_term)
            )
        )
    
    if featured_only:
        query = query.filter(Product.is_featured == True)
    
    # Apply pagination
    products = query.offset(skip).limit(limit).all()
    return products

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: UUID, db: Session = Depends(get_db)):
    """Get a specific product by ID"""
    product = db.query(Product).filter(
        and_(Product.id == product_id, Product.is_active == True)
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return product

@router.get("/categories/", response_model=List[CategoryResponse])
async def get_categories(db: Session = Depends(get_db)):
    """Get all active categories"""
    categories = db.query(Category).filter(Category.is_active == True).all()
    return categories

@router.get("/category/{category_id}", response_model=List[ProductResponse])
async def get_products_by_category(
    category_id: UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get products by category"""
    products = db.query(Product).filter(
        and_(
            Product.category_id == category_id,
            Product.is_active == True
        )
    ).offset(skip).limit(limit).all()
    
    return products

@router.get("/search/", response_model=List[ProductResponse])
async def search_products(
    q: str = Query(..., min_length=1),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Search products by name or description"""
    search_term = f"%{q}%"
    products = db.query(Product).filter(
        and_(
            or_(
                Product.name.ilike(search_term),
                Product.description.ilike(search_term)
            ),
            Product.is_active == True
        )
    ).offset(skip).limit(limit).all()
    
    return products

@router.get("/featured/", response_model=List[ProductResponse])
async def get_featured_products(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Get featured products"""
    products = db.query(Product).filter(
        and_(
            Product.is_featured == True,
            Product.is_active == True
        )
    ).limit(limit).all()
    
    return products

# Admin endpoints (require authentication)
@router.post("/", response_model=ProductResponse)
async def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new product (admin only)"""
    # In a real app, you'd check if user is admin
    db_product = Product(**product_data.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: UUID,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a product (admin only)"""
    # In a real app, you'd check if user is admin
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)
    
    db.commit()
    db.refresh(product)
    return product

@router.delete("/{product_id}")
async def delete_product(
    product_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a product (admin only)"""
    # In a real app, you'd check if user is admin
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Soft delete by setting is_active to False
    product.is_active = False
    db.commit()
    
    return {"message": "Product deleted successfully"}

