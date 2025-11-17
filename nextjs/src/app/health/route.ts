import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if PDF service is available
    const pdfServiceUrl = process.env.NEXT_PUBLIC_PDF_SERVICE_URL;
    let pdfServiceStatus = "unknown";
    
    if (pdfServiceUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const healthCheck = await fetch(`${pdfServiceUrl}/health`, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        pdfServiceStatus = healthCheck.ok ? "healthy" : "unhealthy";
      } catch (error) {
        pdfServiceStatus = "unhealthy";
      }
    }

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      services: {
        pdfService: pdfServiceStatus
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      { error: "Health check failed" },
      { status: 500 }
    );
  }
}