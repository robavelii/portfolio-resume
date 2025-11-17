import re
import logging
import os
from typing import Optional

logger = logging.getLogger("pdf-service")

def sanitize_html(html_content: str) -> str:
    """
    Minimal HTML sanitization for PDF generation - preserve structure and styling
    
    Args:
        html_content: Raw HTML content to sanitize
        
    Returns:
        Sanitized HTML content
    """
    try:
        # For PDF generation, we need to preserve the HTML structure completely
        # Only remove the most dangerous script-related content
        sanitized = html_content
        
        # Remove script tags and their content
        sanitized = re.sub(r'<script\b[^<]*(?:(?!</script>)<[^<]*)*</script>', '', sanitized, flags=re.I | re.DOTALL)
        
        # Remove javascript: URLs
        sanitized = re.sub(r'javascript:[^"\'>\s]*', '#', sanitized, flags=re.I)
        
        # Remove event handlers (onclick, onload, etc.)
        sanitized = re.sub(r'\son\w+\s*=\s*["\'][^"\']*["\']', '', sanitized, flags=re.I)
        
        return sanitized
        
    except Exception as e:
        logger.warning(f"Error sanitizing HTML: {str(e)}")
        # Return original content if sanitization fails - better for PDF generation
        return html_content

def validate_filename(filename: str) -> str:
    """
    Validate and sanitize filename
    
    Args:
        filename: Filename to validate
        
    Returns:
        Sanitized filename
    """
    # Remove path traversal attempts
    filename = os.path.basename(filename)
    
    # Remove special characters except periods, underscores, and hyphens
    filename = re.sub(r'[^\w\-_\.]', '', filename)
    
    # Ensure it ends with .pdf
    if not filename.lower().endswith('.pdf'):
        filename += '.pdf'
    
    # Limit filename length
    if len(filename) > 255:
        name, ext = os.path.splitext(filename)
        filename = name[:255-len(ext)] + ext
    
    return filename