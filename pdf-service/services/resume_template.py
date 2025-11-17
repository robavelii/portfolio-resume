"""
Resume template generator for dynamic PDF creation
"""
from typing import Dict, Any, List

def generate_resume_html(resume_data: Dict[str, Any]) -> str:
    """Generate HTML from resume data"""
    
    basics = resume_data.get('basics', {})
    summary = resume_data.get('summary', '')
    work = resume_data.get('work', [])
    skills = resume_data.get('skills', [])
    education = resume_data.get('education', [])
    
    # Generate skills HTML
    skills_html = ""
    for skill_group in skills:
        name = skill_group.get('name', '')
        keywords = skill_group.get('keywords', [])
        if name and keywords:
            skills_html += f"""
            <div class="skill-category">
                <h4>{name}:</h4>
                <p>{', '.join(keywords)}</p>
            </div>
            """
    
    # Generate work experience HTML
    work_html = ""
    for job in work:
        highlights_html = ""
        for highlight in job.get('highlights', []):
            highlights_html += f"<li>{highlight}</li>"
        
        work_html += f"""
        <div class="job-entry">
            <div class="job-header">
                <h3>{job.get('name', '')}</h3>
                <span class="date">{job.get('startDate', '')} – {job.get('endDate', '')}</span>
            </div>
            <p class="job-title">{job.get('position', '')}</p>
            <ul>{highlights_html}</ul>
        </div>
        """
    
    # Generate education HTML
    education_html = ""
    for edu in education:
        courses_html = ""
        for course in edu.get('courses', []):
            courses_html += f"<li>{course}</li>"
        
        education_html += f"""
        <div class="education-entry">
            <div class="education-header">
                <h3>{edu.get('institution', '')}</h3>
                <span class="date">{edu.get('startDate', '')} – {edu.get('endDate', '')}</span>
            </div>
            <p class="job-title">{edu.get('studyType', '')}</p>
            {f'<ul>{courses_html}</ul>' if courses_html else ''}
        </div>
        """
    
    # Generate profiles HTML
    profiles_html = ""
    for profile in basics.get('profiles', []):
        profiles_html += f'<a href="{profile.get("url", "")}">{profile.get("network", "")}</a> | '
    
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{basics.get('name', 'Resume')}</title>
        <style>
            @page {{
                size: A4;
                margin: 0.5in;
            }}
            
            body {{
                font-family: Arial, sans-serif;
                font-size: 11px;
                line-height: 1.4;
                color: #333;
                margin: 0;
                padding: 12px 20px;
                background: white;
            }}
            
            .resume-container {{
                max-width: 100%;
                margin: 0 auto;
            }}
            
            .header {{
                text-align: center;
                border-bottom: 2px solid #333;
                padding-bottom: 10px;
                margin-bottom: 15px;
            }}
            
            .header h1 {{
                font-size: 18px;
                font-weight: bold;
                margin: 0 0 5px 0;
                text-transform: uppercase;
                letter-spacing: 1px;
            }}
            
            .header p {{
                font-size: 12px;
                margin: 2px 0;
                font-weight: normal;
            }}
            
            .contact-info {{
                font-size: 10px;
                word-wrap: break-word;
            }}
            
            .contact-info a {{
                color: #0077b5;
                text-decoration: none;
            }}
            
            h2 {{
                font-size: 13px;
                font-weight: bold;
                text-transform: uppercase;
                border-bottom: 1px solid #ccc;
                padding-bottom: 3px;
                margin-top: 12px;
                margin-bottom: 6px;
            }}
            
            .job-entry, .education-entry {{
                margin-bottom: 6px;
            }}
            
            .job-header, .education-header {{
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                margin-bottom: 2px;
            }}
            
            .job-header h3, .education-header h3 {{
                font-size: 13px;
                font-weight: bold;
                margin: 0;
            }}
            
            .job-header .date, .education-header .date {{
                font-size: 10px;
                color: #666;
                white-space: nowrap;
            }}
            
            .job-title {{
                font-size: 10px;
                font-style: italic;
                color: #444;
                margin: 0 0 4px 0;
            }}
            
            ul {{
                padding-left: 15px;
                margin: 0;
            }}
            
            li {{
                margin-bottom: 3px;
                font-size: 10px;
            }}
            
            .skills-list {{
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                font-size: 10px;
            }}
            
            .skill-category {{
                flex-basis: 48%;
            }}
            
            .skill-category h4 {{
                font-size: 10px;
                font-weight: bold;
                margin: 0 0 2px 0;
                border: none;
                padding: 0;
                text-transform: none;
            }}
            
            .skill-category p {{
                margin: 0;
            }}
            
            @media print {{
                body {{
                    margin: 0;
                    padding: 0;
                }}
                .resume-container {{
                    margin: 0;
                    padding: 12px 20px 30px;
                    border: none;
                    box-shadow: none;
                    max-width: 100%;
                }}
                .job-entry, .education-entry {{
                    page-break-inside: avoid;
                }}
                h2 {{
                    page-break-after: avoid;
                }}
            }}
        </style>
    </head>
    <body>
        <div class="resume-container">
            <div class="header">
                <h1>{basics.get('name', 'NAME')}</h1>
                <p>{basics.get('label', 'TITLE')}</p>
                <div class="contact-info">
                    {basics.get('location', '')} | {basics.get('phone', '')} | {basics.get('email', '')} | {profiles_html.rstrip(' | ')}
                </div>
            </div>

            <h2>PROFESSIONAL SUMMARY</h2>
            <p style="font-size: 10px; margin: 0 0 5px 0;">
                {summary}
            </p>

            <h2>TECHNICAL EXPERTISE</h2>
            <div class="skills-list">
                {skills_html}
            </div>

            <h2>PROFESSIONAL EXPERIENCE</h2>
            {work_html}

            {f'<h2>EDUCATION</h2>{education_html}' if education_html else ''}
        </div>
    </body>
    </html>
    """