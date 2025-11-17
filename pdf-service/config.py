
"""
Configuration management for the PDF service.
"""

import os
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""
    
    # Application
    app_name: str = "PDF Generation Service"
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    workers: int = int(os.getenv("WORKERS", "2"))
    
    # Redis
    redis_url: str = os.getenv("REDIS_URL", "redis://redis:6379")
    redis_db: int = int(os.getenv("REDIS_DB", "0"))
    redis_password: Optional[str] = os.getenv("REDIS_PASSWORD")
    
    # Cache
    cache_ttl: int = int(os.getenv("CACHE_TTL", "3600"))
    cache_max_size: int = int(os.getenv("CACHE_MAX_SIZE", "1000"))
    
    # PDF Generation
    pdf_font_path: Optional[str] = os.getenv("PDF_FONT_PATH")
    pdf_page_width: float = float(os.getenv("PDF_PAGE_WIDTH", "8.27"))
    pdf_page_height: float = float(os.getenv("PDF_PAGE_HEIGHT", "11.69"))
    
    class Config:
        """Pydantic configuration."""
        env_file = ".env"
        case_sensitive = False
