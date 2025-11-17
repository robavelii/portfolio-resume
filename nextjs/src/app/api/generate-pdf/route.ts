import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



// Get PDF service URL at runtime
function getPdfServiceUrl() {
  const url = process.env.PDF_SERVICE_URL || "http://pdf-service:8000";
  return url;
}

export async function POST(request: NextRequest) {
  try {
    const { resume_data, filename = "Robel-Fekadu-Resume.pdf" } = await request.json();
    
    if (!resume_data || typeof resume_data !== "object") {
      return NextResponse.json(
        { error: "Resume data is required" },
        { status: 400 }
      );
    }

    // Generate PDF using the PDF service with resume data
    const PDF_SERVICE_URL = getPdfServiceUrl();
    const response = await fetch(`${PDF_SERVICE_URL}/api/resume-pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Request-ID": request.headers.get("x-request-id") || Math.random().toString(36),
      },
      body: JSON.stringify({ 
        resume_data, 
        filename,
        page_size: "A4",
        margin: "0.5in"
      }),
    });

    if (!response.ok) {
      throw new Error(`PDF service responded with ${response.status}`);
    }

    const pdfBuffer = await response.arrayBuffer();

    // Return the PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
        "Cache-Control": "no-store, max-age=0",
      },
      status: 200,
    });
  } catch (error: any) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const versionId = searchParams.get('version');
    
    let resumeData;
    
    if (versionId) {
      // Get specific version
      const version = await prisma.resumeVersion.findUnique({
        where: { id: versionId }
      });
      resumeData = version ? JSON.parse(version.data) : null;
    } else {
      // Get active version or original
      const activeVersion = await prisma.resumeVersion.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      });
      
      if (activeVersion) {
        resumeData = JSON.parse(activeVersion.data);
      } else {
        // Fallback to original file
        const { promises: fs } = await import('fs');
        const path = await import('path');
        const RESUME_PATH = path.join(process.cwd(), "src/data/resume.json");
        const data = await fs.readFile(RESUME_PATH, "utf8");
        resumeData = JSON.parse(data);
      }
    }
    
    if (!resumeData) {
      throw new Error('No resume data found');
    }
    
    // Forward to the POST handler with resume data
    const response = await POST(new NextRequest(
      new URL("/api/generate-pdf", "http://localhost"),
      {
        method: "POST",
        body: JSON.stringify({
          resume_data: resumeData,
          filename: "Robel-Fekadu-Resume.pdf"
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }
    ));
    
    return response;
  } catch (error: any) {
    console.error("PDF generation GET error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}