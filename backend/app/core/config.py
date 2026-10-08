import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "CLIMA-SHIELD Climate Impact Intelligence"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000"
    ]
    
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://climashield:climashield_dev_secret@localhost:5432/climashield_db"
    )
    
    JWT_SECRET: str = os.getenv("JWT_SECRET", "climashield_secret_key_demo_mode_only")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    
    AI_API_KEY: str = os.getenv("AI_API_KEY", "")
    
    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
