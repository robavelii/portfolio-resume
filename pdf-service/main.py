from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel, Field, validator
from contextlib import asynccontextmanager
from services.pdf_generator import generate_pdf_from_html
from services.cache import get_cached_pdf, cache_pdf
from utils.security import sanitize_html
import logging
import time
import os
import uuid

# Configure logging
log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(
    level=getattr(logging, log_level, logging.INFO),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("pdf-service")

# Pydantic models
class PDFRequest(BaseModel):
    html: str = Field(..., min_length=10, max_length=500000)
    filename: str = Field("document.pdf", max_length=255)
    page_size: str = Field("A4", pattern="^(A3|A4|A5|Letter|Legal)$")
    margin: str = Field("0.5in", pattern="^\\d+(\\.\\d+)?(in|mm|cm|px)$")
    
    @validator("filename")
    def validate_filename(cls, v):
        # Remove any path traversal attempts
        return os.path.basename(v)

    @validator("html")
    def validate_html(cls, v):
        # Basic validation to prevent extremely large payloads
        if len(v) > 500000:  # 500KB
            raise ValueError("HTML content too large")
        return v

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    logger.info("Starting PDF service...")
    # Initialize any resources here
    
    yield
    
    logger.info("Shutting down PDF service...")
    # Cleanup resources here

# Create FastAPI app
app = FastAPI(
    title="PDF Generation Service",
    description="A microservice for generating PDFs from HTML using WeasyPrint",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://web:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

# Configure trusted hosts
allowed_hosts = os.getenv("ALLOWED_HOSTS", "localhost,pdf-service,127.0.0.1").split(",")
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=allowed_hosts
)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "service": "pdf-generation",
        "version": "1.0.0"
    }

@app.post("/api/pdf")
async def generate_pdf(request: PDFRequest, req: Request):
    """
    Generate a PDF from HTML content
    
    Args:
        request: PDFRequest containing HTML content and options
        req: FastAPI Request object for client info
        
    Returns:
        StreamingResponse with PDF content
    """
    try:
        start_time = time.time()
        request_id = str(uuid.uuid4())
        
        # Log request details (without HTML content)
        logger.info(
            f"PDF generation request [ID: {request_id}] - "
            f"Filename: {request.filename}, "
            f"Page size: {request.page_size}, "
            f"Client: {req.client.host if req.client else 'unknown'}"
        )
        
        # For PDF generation, skip sanitization to preserve HTML structure
        sanitized_html = request.html
        
        # Check cache first
        cached_pdf = await get_cached_pdf(sanitized_html)
        if cached_pdf:
            logger.info(f"PDF retrieved from cache [ID: {request_id}]")
            generation_time = time.time() - start_time
            logger.info(f"PDF generation completed in {generation_time:.2f}s [ID: {request_id}]")
            
            return StreamingResponse(
                content=iter([cached_pdf]),
                media_type="application/pdf",
                headers={
                    "Content-Disposition": f'attachment; filename="{request.filename}"',
                    "X-Request-ID": request_id,
                    "X-Cache": "HIT"
                }
            )
        
        # Generate PDF
        pdf_bytes = await generate_pdf_from_html(
            sanitized_html,
            page_size=request.page_size,
            margin=request.margin
        )
        
        # Cache the PDF
        await cache_pdf(sanitized_html, pdf_bytes)
        
        generation_time = time.time() - start_time
        logger.info(f"PDF generated and cached in {generation_time:.2f}s [ID: {request_id}]")
        
        return StreamingResponse(
            content=iter([pdf_bytes]),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{request.filename}"',
                "X-Request-ID": request_id,
                "X-Cache": "MISS"
            }
        )
        
    except HTTPException as he:
        logger.error(f"HTTP error generating PDF: {he.detail}")
        raise
    except ValueError as ve:
        logger.error(f"Validation error: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.exception(f"Unexpected error generating PDF: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while generating the PDF"
        )

@app.exception_handler(429)
async def rate_limit_handler(request: Request, exc: HTTPException):
    """Custom handler for rate limit exceeded errors"""
    return JSONResponse(
        status_code=429,
        content={
            "error": "Rate limit exceeded",
            "detail": "Too many requests. Please try again later.",
            "retry_after": 60
        }
    )

@app.exception_handler(413)
async def payload_too_large_handler(request: Request, exc: HTTPException):
    """Custom handler for payload too large errors"""
    return JSONResponse(
        status_code=413,
        content={
            "error": "Payload too large",
            "detail": "The HTML content exceeds the maximum allowed size of 500KB"
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        workers=int(os.getenv("UVICORN_WORKERS", 2)),
        log_level=os.getenv("LOG_LEVEL", "info").lower()
    )