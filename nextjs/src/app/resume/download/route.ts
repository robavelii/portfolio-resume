import { NextResponse } from "next/server";
import { getResumeHTML } from "@/lib/resume-server";

export async function GET() {
  try {
    const html = await getResumeHTML();
    
    const pdfServiceUrl = process.env.PDF_SERVICE_URL || "http://pdf-service:8000";
    const response = await fetch(`${pdfServiceUrl}/api/pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ html, filename: "Robel-Fekadu-Resume.pdf" }),
    });

    if (!response.ok) {
      throw new Error(`PDF service responded with ${response.status}`);
    }

    const pdfBuffer = await response.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Robel-Fekadu-Resume.pdf"',
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: any) {
    console.error("Resume download error:", error);
    return NextResponse.json(
      { error: "Failed to generate resume" },
      { status: 500 }
    );
  }
}