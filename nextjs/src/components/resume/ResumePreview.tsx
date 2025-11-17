"use client";

import { useEffect, useState } from "react";
import { ResumeTemplate } from "./ResumeTemplate";
import { resumeData } from "@/lib/resume-data";
import { Button } from "@/components/ui/Button";

export function ResumePreview() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      const response = await fetch('/resume/download');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Robel-Fekadu-Resume.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="relative">
      <div className="mb-6 flex justify-center">
        <Button onClick={handleDownload} size="lg">
          Download PDF
        </Button>
      </div>
      <div 
        id="resume-preview"
        className="bg-white p-6 md:p-8 print:p-0 shadow-lg rounded-lg"
        dangerouslySetInnerHTML={{ 
          __html: ResumeTemplate(resumeData) 
        }} 
      />
    </div>
  );
}