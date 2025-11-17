import { ResumePreview } from "@/components/resume/ResumePreview";
import { getResumeData } from "@/lib/resume-data";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default async function ResumePage() {
  const resumeData = await getResumeData();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Resume</h1>
          <p className="text-muted-foreground mt-2">
            View my professional experience, skills, and education
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/resume/editor">Edit Resume</Link>
          </Button>
          <Button asChild>
            <Link href="/api/generate-pdf">Download PDF</Link>
          </Button>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden bg-white shadow-md">
        <ResumePreview data={resumeData} />
      </div>
    </div>
  );
}