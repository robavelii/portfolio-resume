import logging
import hashlib
import redis.asyncio as redis
import os
from typing import Optional

logger = logging.getLogger("pdf-service")

# Redis connection
_redis = None
_CACHE_TTL = int(os.getenv("PDF_CACHE_TTL", 3600))  # 1 hour default

async def get_redis_connection():
    """Get or create Redis connection"""
    global _redis
    if _redis is None:
        redis_url = os.getenv("REDIS_URL", "redis://redis:6379")
        _redis = redis.from_url(redis_url, decode_responses=False)
        logger.info(f"Connected to Redis at {redis_url}")
    return _redis

async def get_cached_pdf(html_content: str) -> Optional[bytes]:
    """
    Get cached PDF from Redis
    
    Args:
        html_content: HTML content to generate cache key from
        
    Returns:
        Cached PDF bytes or None if not found
    """
    try:
        redis = await get_redis_connection()
        cache_key = _generate_cache_key(html_content)
        
        cached_pdf = await redis.get(cache_key)
        if cached_pdf:
            logger.debug(f"Cache hit for key: {cache_key}")
            return cached_pdf
        logger.debug(f"Cache miss for key: {cache_key}")
        return None
    except Exception as e:
        logger.warning(f"Error retrieving from cache: {str(e)}")
        return None

async def cache_pdf(html_content: str, pdf_bytes: bytes) -> bool:
    """
    Cache PDF in Redis
    
    Args:
        html_content: HTML content used to generate the PDF
        pdf_bytes: PDF content to cache
        
    Returns:
        True if caching was successful
    """
    try:
        redis = await get_redis_connection()
        cache_key = _generate_cache_key(html_content)
        
        await redis.setex(cache_key, _CACHE_TTL, pdf_bytes)
        logger.debug(f"Cached PDF with key: {cache_key}, TTL: {_CACHE_TTL}s")
        return True
    except Exception as e:
        logger.warning(f"Error caching PDF: {str(e)}")
        return False

def _generate_cache_key(html_content: str) -> str:
    """Generate cache key from HTML content"""
    # Use SHA-256 hash of the HTML content
    return f"pdf:{hashlib.sha256(html_content.encode()).hexdigest()}"