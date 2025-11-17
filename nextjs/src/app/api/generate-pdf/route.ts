import { NextRequest, NextResponse } from "next/server";
import { getResumeHTML } from "@/lib/resume-server";
import axios from "axios";
import { RateLimiterMemory } from "rate-limiter-flexible";

// Configure rate limiting
const limiter = new RateLimiterMemory({
  points: 5, // 5 requests
  duration: 60, // per 60 seconds
});

// Validate environment variables
const PDF_SERVICE_URL = process.env.NEXT_PUBLIC_PDF_SERVICE_URL;
if (!PDF_SERVICE_URL) {
  throw new Error("PDF service URL is not configured");
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.ip || request.headers.get("x-real-ip") || "unknown";
    
    // Apply rate limiting
    try {
      await limiter.consume(ip);
    } catch (rateLimiterRes) {
      return NextResponse.json(
        { error: "Too many requests, please try again later." },
        { status: 429 }
      );
    }

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
    const response = await axios.post(
      `${PDF_SERVICE_URL}/api/pdf`,
      { html, filename },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Request-ID": request.headers.get("x-request-id") || crypto.randomUUID(),
        },
        responseType: "arraybuffer",
        timeout: 30000, // 30 seconds timeout
      }
    );

    // Return the PDF
    return new NextResponse(response.data, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
        "Cache-Control": "no-store, max-age=0",
      },
      status: 200,
    });
  } catch (error: any) {
    console.error("PDF generation error:", error);
    
    if (error.response?.status === 429) {
      return NextResponse.json(
        { error: "Too many requests to PDF service. Please try again later." },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { 
        error: "Failed to generate PDF",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
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