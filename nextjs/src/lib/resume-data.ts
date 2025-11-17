import { ResumeData } from "@/types/resume";
import resumeJson from "@/data/resume.json";

// Client-side resume data
export const resumeData: ResumeData = resumeJson as ResumeData;

// Server-side functions
export async function getResumeData(): Promise<ResumeData> {
  return resumeJson as ResumeData;
}

// Get resume HTML (for PDF generation)
export async function getResumeHTML(): Promise<string> {
  const resumeData = await getResumeData();
  
  // Render the template
  const templatePath = path.join(process.cwd(), "public/resume-template.html");
  let template = await fs.promises.readFile(templatePath, "utf8");
  
  // Replace placeholders with actual data
  template = template.replace("{{NAME}}", resumeData.basics.name.toUpperCase());
  template = template.replace("{{LABEL}}", resumeData.basics.label);
  template = template.replace("{{CONTACT}}", 
    `${resumeData.basics.location} | ${resumeData.basics.phone} | ${resumeData.basics.email} | ${resumeData.basics.profiles.map(p => `<a href="${p.url}">${p.network}</a>`).join(' | ')}`
  );
  template = template.replace("{{SUMMARY}}", resumeData.summary);
  
  // Skills section
  const skillsHtml = resumeData.skills.map(skill => `
    <div class="skill-category">
      <h4>${skill.name}:</h4>
      <p>${skill.keywords.join(', ')}</p>
    </div>
  `).join('');
  template = template.replace("{{SKILLS}}", skillsHtml);
  
  // Work experience
  const workHtml = resumeData.work.map(job => `
    <div class="job-entry">
      <div class="job-header">
        <h3>${job.name}</h3>
        <span class="date">${job.startDate}${job.endDate ? ' – ' + job.endDate : ''}</span>
      </div>
      <p class="job-title">${job.position}</p>
      <ul>
        ${job.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
      </ul>
    </div>
  `).join('');
  template = template.replace("{{WORK_EXPERIENCE}}", workHtml);
  
  // Education
  const education = resumeData.education[0];
  template = template.replace("{{EDUCATION_INSTITUTION}}", education.institution);
  template = template.replace("{{EDUCATION_DATES}}", `${education.startDate} – ${education.endDate}`);
  template = template.replace("{{EDUCATION_DEGREE}}", education.studyType);
  template = template.replace("{{EDUCATION_COURSEWORK}}", education.courses.join(', '));
  
  return template;
}