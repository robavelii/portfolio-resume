import { NextRequest, NextResponse } from "next/server";
import { getResumeHTML } from "@/lib/resume-server";



// Get PDF service URL at runtime
function getPdfServiceUrl() {
  const url = process.env.PDF_SERVICE_URL || "http://pdf-service:8000";
  return url;
}

export async function POST(request: NextRequest) {
  try {
    // Get the HTML content
    const { html, filename = "Robel-Fekadu-Resume.pdf" } = await request.json();
    
    if (!html || typeof html !== "string") {
      return NextResponse.json(
        { error: "HTML content is required" },
        { status: 400 }
      );
    }
    
    if (html.length > 500000) { // 500KB limit
      return NextResponse.json(
        { error: "HTML content is too large" },
        { status: 413 }
      );
    }

    // Generate PDF using the PDF service
    const PDF_SERVICE_URL = getPdfServiceUrl();
    const response = await fetch(`${PDF_SERVICE_URL}/api/pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Request-ID": request.headers.get("x-request-id") || Math.random().toString(36),
      },
      body: JSON.stringify({ html, filename }),
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

export async function GET() {
  try {
    // Get resume HTML
    const html = await getResumeHTML();
    
    // Forward to the POST handler with the HTML
    const response = await POST(new NextRequest(
      new URL("/api/generate-pdf", "http://localhost"),
      {
        method: "POST",
        body: JSON.stringify({
          html,
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