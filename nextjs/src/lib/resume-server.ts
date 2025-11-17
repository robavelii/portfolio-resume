import { ResumeData } from "@/types/resume";
import fs from "fs";
import path from "path";

// Path to the resume JSON file
const RESUME_PATH = path.join(process.cwd(), "src/data/resume.json");

// Get resume data (for server-side)
export async function getResumeDataServer(): Promise<ResumeData> {
  try {
    const data = await fs.promises.readFile(RESUME_PATH, "utf8");
    return JSON.parse(data) as ResumeData;
  } catch (error) {
    console.error("Error reading resume data:", error);
    throw new Error("Failed to load resume data");
  }
}

// Get resume HTML (for PDF generation)
export async function getResumeHTML(): Promise<string> {
  // Return the complete HTML template as-is
  const templatePath = path.join(process.cwd(), "public/resume-template.html");
  const template = await fs.promises.readFile(templatePath, "utf8");
  return template;
}