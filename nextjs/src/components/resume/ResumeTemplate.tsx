import { ResumeData } from "@/types/resume";

export function ResumeTemplate(data: ResumeData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.basics.name} - Resume</title>
        <style>
            body {
                font-family: 'Calibri', 'Arial', 'Helvetica', sans-serif;
                line-height: 1.3;
                color: #333;
                background-color: #fff;
                margin: 0;
                padding: 0;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .resume-container {
                max-width: 800px;
                margin: 0 auto;
                padding: 15px 25px;
                border: 1px solid #ddd;
            }
            
            .header {
                text-align: center;
                margin-bottom: 15px;
                border-bottom: 2px solid #333;
                padding-bottom: 8px;
            }
            
            .header h1 {
                font-size: 18px;
                font-weight: bold;
                margin: 0 0 3px 0;
                letter-spacing: 1px;
            }
            
            .header p {
                font-size: 12px;
                margin: 0 0 5px 0;
                font-style: italic;
            }
            
            .contact-info {
                font-size: 10px;
                margin: 0;
            }
            
            .contact-info a {
                color: #333;
                text-decoration: none;
            }
            
            h2 {
                font-size: 12px;
                font-weight: bold;
                margin: 12px 0 5px 0;
                text-transform: uppercase;
                border-bottom: 1px solid #333;
                padding-bottom: 2px;
            }
            
            .skills-list {
                margin-bottom: 10px;
            }
            
            .skill-category {
                margin-bottom: 3px;
                font-size: 10px;
            }
            
            .skill-category h4 {
                display: inline;
                font-weight: bold;
                margin: 0;
                font-size: 10px;
            }
            
            .skill-category p {
                display: inline;
                margin: 0;
                font-size: 10px;
            }
            
            .job-entry {
                margin-bottom: 10px;
            }
            
            .job-header {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                margin-bottom: 2px;
            }
            
            .job-header h3 {
                font-size: 11px;
                font-weight: bold;
                margin: 0;
            }
            
            .date {
                font-size: 10px;
                font-style: italic;
            }
            
            .job-title {
                font-size: 10px;
                font-style: italic;
                margin: 0 0 3px 0;
            }
            
            ul {
                margin: 0;
                padding-left: 15px;
            }
            
            li {
                font-size: 10px;
                margin-bottom: 2px;
            }
            
            .education-entry {
                margin-bottom: 10px;
            }
            
            .education-header {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                margin-bottom: 2px;
            }
            
            .education-header h3 {
                font-size: 11px;
                font-weight: bold;
                margin: 0;
            }
            
            @media print {
                body {
                    margin: 0;
                    padding: 0;
                }
                .resume-container {
                    margin: 0;
                    padding: 12px 20px 30px;
                    border: none;
                    box-shadow: none;
                    max-width: 100%;
                }
                .job-entry, .education-entry {
                    page-break-inside: avoid;
                }
                h2 {
                    page-break-after: avoid;
                }
            }
        </style>
    </head>
    <body>
        <div class="resume-container">
            <!-- Header -->
            <div class="header">
                <h1>${data.basics.name.toUpperCase()}</h1>
                <p>${data.basics.label}</p>
                <div class="contact-info">
                    ${data.basics.location} | ${data.basics.phone} | ${data.basics.email} | 
                    ${data.basics.profiles.map(profile => 
                      `<a href="${profile.url}" target="_blank">${profile.network}</a>`
                    ).join(' | ')}
                </div>
            </div>

            <!-- Professional Summary -->
            <h2>PROFESSIONAL SUMMARY</h2>
            <p style="font-size: 10px; margin: 0 0 5px 0;">
                ${data.summary}
            </p>

            <!-- Technical Expertise -->
            <h2>TECHNICAL EXPERTISE</h2>
            <div class="skills-list">
                ${data.skills.map(skill => `
                    <div class="skill-category">
                        <h4>${skill.name}:</h4>
                        <p>${skill.keywords.join(', ')}</p>
                    </div>
                `).join('')}
            </div>

            <!-- Professional Experience -->
            <h2>PROFESSIONAL EXPERIENCE</h2>
            ${data.work.map(job => `
                <div class="job-entry">
                    <div class="job-header">
                        <h3>${job.name}</h3>
                        <span class="date">${job.startDate} ${job.endDate ? '– ' + job.endDate : ''}</span>
                    </div>
                    <p class="job-title">${job.position}</p>
                    <ul>
                        ${job.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}

            <!-- Education -->
            <h2>EDUCATION</h2>
            ${data.education && data.education.length > 0 ? `
            <div class="education-entry">
                <div class="education-header">
                    <h3>${data.education[0]?.institution || ''}</h3>
                    <span class="date">${data.education[0]?.startDate || ''} – ${data.education[0]?.endDate || ''}</span>
                </div>
                <p class="job-title">${data.education[0]?.studyType || ''}</p>
                <p style="font-size: 10px; margin: 0;"><strong>Relevant Coursework:</strong> ${data.education[0]?.courses?.join(', ') || ''}</p>
            </div>
            ` : ''}
        </div>
    </body>
    </html>
  `;
}