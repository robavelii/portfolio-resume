import { ResumeData } from "@/types/resume";

export interface PDFGenerationOptions {
  filename?: string;
  template?: string;
  page_size?: string;
  margin?: string;
}

export async function generatePDF(resumeData: ResumeData, options: PDFGenerationOptions = {}) {
  try {
    // Get HTML content from the resume template
    const htmlResponse = await fetch("/api/resume-html", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resumeData, options }),
    });
    
    if (!htmlResponse.ok) {
      throw new Error("Failed to generate resume HTML");
    }
    
    const html = await htmlResponse.text();
    
    // Send HTML to PDF service
    const response = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        html,
        filename: options.filename || "Robel-Fekadu-Resume.pdf",
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to generate PDF");
    }
    
    return response;
  } catch (error) {
    console.error("PDF generation error:", error);
    throw error;
  }
}

export function downloadPDF(pdfBlob: Blob, filename: string) {
  const url = window.URL.createObjectURL(pdfBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}