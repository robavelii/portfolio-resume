import logging
import asyncio
from concurrent.futures import ThreadPoolExecutor
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration
from typing import Optional
import tempfile
import os

logger = logging.getLogger("pdf-service")

# Thread pool for CPU-bound operations
_executor = ThreadPoolExecutor(max_workers=4)

async def generate_pdf_from_html(
    html_content: str,
    page_size: str = "A4",
    margin: str = "0.5in",
    font_config: Optional[FontConfiguration] = None
) -> bytes:
    """
    Generate a PDF from HTML content using WeasyPrint with preserved styling
    
    Args:
        html_content: HTML content to convert to PDF
        page_size: Page size (A4, Letter, etc.)
        margin: Page margin
        font_config: Font configuration for custom fonts
        
    Returns:
        PDF content as bytes
    """
    try:
        logger.debug("Starting PDF generation")
        
        # Run the CPU-bound operation in a thread pool
        loop = asyncio.get_running_loop()
        pdf_bytes = await loop.run_in_executor(
            _executor,
            _generate_pdf_sync,
            html_content
        )
        
        logger.debug(f"Generated PDF of size {len(pdf_bytes)} bytes")
        return pdf_bytes
        
    except Exception as e:
        logger.exception(f"Error generating PDF: {str(e)}")
        raise

def _generate_pdf_sync(html_content: str) -> bytes:
    """
    Synchronous PDF generation function to run in thread pool
    Convert HTML to PDF using WeasyPrint with preserved styling - matches reference implementation
    """
    try:
        # Create temporary file to match reference implementation approach
        import tempfile
        with tempfile.NamedTemporaryFile(mode='w', suffix='.html', delete=False) as temp_file:
            temp_file.write(html_content)
            temp_file.flush()
            
            # Convert HTML file to PDF with embedded CSS (like reference)
            html_doc = HTML(temp_file.name)
            pdf_bytes = html_doc.write_pdf()
            
            # Clean up temp file
            os.unlink(temp_file.name)
        
        logger.debug(f"Successfully generated PDF of {len(pdf_bytes)} bytes")
        return pdf_bytes
        
    except Exception as e:
        logger.exception(f"Error in synchronous PDF generation: {str(e)}")
        raise