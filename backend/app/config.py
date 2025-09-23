from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://ecommerce_user:ecommerce_password@database:5432/ecommerce_db"
    
    # Security
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Google OAuth
    google_client_id: Optional[str] = None
    google_client_secret: Optional[str] = None
    
    # AWS S3
    aws_access_key_id: Optional[str] = None
    aws_secret_access_key: Optional[str] = None
    aws_bucket_name: Optional[str] = None
    aws_region: str = "us-east-1"
    
    # OpenAI
    openai_api_key: Optional[str] = None
    
    # Stripe
    stripe_secret_key: Optional[str] = None
    stripe_publishable_key: Optional[str] = None
    
    # CORS
    allowed_origins: list[str] = [
        "http://localhost:3000",
        "http://frontend:80",
        "http://localhost:8080"
    ]
    
    # Redis
    redis_url: str = "redis://redis:6379"
    
    class Config:
        env_file = ".env"


settings = Settings()

