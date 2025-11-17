import { NextResponse } from "next/server";
import { getResumeHTML } from "@/lib/resume-server";

export async function GET() {
  try {
    const html = await getResumeHTML();
    
    // Try to use PDF service first
    try {
      // Use appropriate URL based on environment
      const pdfServiceUrl = process.env.NODE_ENV === 'production' 
        ? process.env.PDF_SERVICE_URL || 'http://pdf-service:8000'
        : 'http://127.0.0.1:8000';
      
      const response = await fetch(`${pdfServiceUrl}/api/pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html,
          filename: 'Robel-Fekadu-Resume.pdf'
        })
      });
      
      if (response.ok) {
        const pdfBuffer = await response.arrayBuffer();
        return new NextResponse(pdfBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="Robel-Fekadu-Resume.pdf"',
          },
        });
      }
    } catch (pdfServiceError) {
      console.log('PDF service error:', pdfServiceError);
    }

    // Fallback: return HTML version
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': 'attachment; filename="Robel-Fekadu-Resume.html"',
      },
    });
  } catch (error) {
    console.error('Resume download error:', error);
    return NextResponse.json(
      { error: 'Failed to generate resume' },
      { status: 500 }
    );
  }
}