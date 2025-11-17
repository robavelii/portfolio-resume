"use client";

import { Button } from "@/components/ui/Button";
import { resumeData } from "@/lib/resume-data";

export function Hero() {
  const { basics } = resumeData;

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
    <section className="py-20 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {basics.name}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8">
          {basics.label}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={handleDownload}>
            Download Resume
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href={`mailto:${basics.email}`}>Contact Me</a>
          </Button>
        </div>
      </div>
    </section>
  );
}