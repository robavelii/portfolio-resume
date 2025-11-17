import { ResumeData } from "@/types/resume";
import resumeJson from "@/data/resume.json";

// Client-side resume data
export const resumeData: ResumeData = resumeJson as ResumeData;

// Server-side functions
export async function getResumeData(): Promise<ResumeData> {
  return resumeJson as ResumeData;
}