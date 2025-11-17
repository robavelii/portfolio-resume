"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

function getResumeHTML(data?: any) {
  if (!data) return "<p>No data to preview</p>";
  
  try {
    const resume = typeof data === 'string' ? JSON.parse(data) : data;
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
            .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .section h2 { color: #333; border-bottom: 1px solid #ccc; }
            .work-item { margin-bottom: 15px; }
            .skills { display: flex; flex-wrap: wrap; gap: 10px; }
            .skill-tag { background: #f0f0f0; padding: 4px 8px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${resume.basics?.name || 'Name'}</h1>
            <p>${resume.basics?.label || 'Title'}</p>
            <p>${resume.basics?.email || ''} | ${resume.basics?.phone || ''}</p>
          </div>
          
          <div class="section">
            <h2>Summary</h2>
            <p>${resume.summary || ''}</p>
          </div>
          
          <div class="section">
            <h2>Experience</h2>
            ${resume.work?.map((job: any) => `
              <div class="work-item">
                <h3>${job.position} at ${job.name}</h3>
                <p><em>${job.startDate} - ${job.endDate}</em></p>
                <ul>
                  ${job.highlights?.map((highlight: string) => `<li>${highlight}</li>`).join('') || ''}
                </ul>
              </div>
            `).join('') || ''}
          </div>
          
          <div class="section">
            <h2>Skills</h2>
            ${resume.skills?.map((skillGroup: any) => `
              <div>
                <h4>${skillGroup.name}</h4>
                <div class="skills">
                  ${skillGroup.keywords?.map((skill: string) => `<span class="skill-tag">${skill}</span>`).join('') || ''}
                </div>
              </div>
            `).join('') || ''}
          </div>
        </body>
      </html>
    `;
  } catch (error) {
    return "<p>Invalid JSON format</p>";
  }
}

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const [resumeData, setResumeData] = useState("");
  const [loading, setLoading] = useState(false);
  const [versions, setVersions] = useState([]);
  const [comment, setComment] = useState("");
  const [zoom, setZoom] = useState(0.6);
  
  const getResumeHTML = () => {
    try {
      const data = JSON.parse(resumeData);
      const basics = data.basics || {};
      const summary = data.summary || '';
      const work = data.work || [];
      const skills = data.skills || [];
      const education = data.education || [];
      
      // Generate skills HTML
      const skillsHTML = skills.map((skillGroup: any) => {
        const name = skillGroup.name || '';
        const keywords = skillGroup.keywords || [];
        return name && keywords.length ? `
          <div class="skill-category">
            <h4>${name}:</h4>
            <p>${keywords.join(', ')}</p>
          </div>
        ` : '';
      }).join('');
      
      // Generate work HTML
      const workHTML = work.map((job: any) => {
        const highlightsHTML = job.highlights?.map((highlight: string) => `<li>${highlight}</li>`).join('') || '';
        return `
          <div class="job-entry">
            <div class="job-header">
              <h3>${job.name || ''}</h3>
              <span class="date">${job.startDate || ''} – ${job.endDate || ''}</span>
            </div>
            <p class="job-title">${job.position || ''}</p>
            <ul>${highlightsHTML}</ul>
          </div>
        `;
      }).join('');
      
      // Generate profiles HTML
      const profilesHTML = basics.profiles?.map((profile: any) => 
        `<a href="${profile.url || ''}">${profile.network || ''}</a>`
      ).join(' | ') || '';
      
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; font-size: 11px; line-height: 1.4; color: #333; margin: 0; padding: 12px 20px; background: white; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 15px; }
              .header h1 { font-size: 18px; font-weight: bold; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 1px; }
              .header p { font-size: 12px; margin: 2px 0; }
              .contact-info { font-size: 10px; }
              .contact-info a { color: #0077b5; text-decoration: none; }
              h2 { font-size: 13px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin: 12px 0 6px 0; }
              .job-entry { margin-bottom: 6px; }
              .job-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
              .job-header h3 { font-size: 13px; font-weight: bold; margin: 0; }
              .job-header .date { font-size: 10px; color: #666; white-space: nowrap; }
              .job-title { font-size: 10px; font-style: italic; color: #444; margin: 0 0 4px 0; }
              ul { padding-left: 15px; margin: 0; }
              li { margin-bottom: 3px; font-size: 10px; }
              .skills-list { display: flex; flex-wrap: wrap; gap: 8px; font-size: 10px; }
              .skill-category { flex-basis: 48%; }
              .skill-category h4 { font-size: 10px; font-weight: bold; margin: 0 0 2px 0; }
              .skill-category p { margin: 0; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${basics.name || 'NAME'}</h1>
              <p>${basics.label || 'TITLE'}</p>
              <div class="contact-info">
                ${basics.location || ''} | ${basics.phone || ''} | ${basics.email || ''} ${profilesHTML ? '| ' + profilesHTML : ''}
              </div>
            </div>
            
            <h2>PROFESSIONAL SUMMARY</h2>
            <p style="font-size: 10px; margin: 0 0 5px 0;">${summary}</p>
            
            <h2>TECHNICAL EXPERTISE</h2>
            <div class="skills-list">${skillsHTML}</div>
            
            <h2>PROFESSIONAL EXPERIENCE</h2>
            ${workHTML}
          </body>
        </html>
      `;
    } catch (error) {
      return "<p style='color: red;'>Invalid JSON format</p>";
    }
  };

  useEffect(() => {
    if (session) {
      loadResume();
      loadVersions();
    }
  }, [session]);

  const loadResume = async () => {
    try {
      const response = await fetch("/api/resume");
      const data = await response.json();
      setResumeData(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Failed to load resume:", error);
    }
  };

  const loadVersions = async () => {
    try {
      const response = await fetch("/api/resume/versions");
      const data = await response.json();
      setVersions(data);
    } catch (error) {
      console.error("Failed to load versions:", error);
    }
  };

  const saveResume = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          data: JSON.parse(resumeData),
          comment: comment || `Updated at ${new Date().toLocaleString()}`
        }),
      });
      
      if (response.ok) {
        alert("Resume saved successfully!");
        setComment("");
        loadVersions();
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      alert("Error saving resume");
    } finally {
      setLoading(false);
    }
  };

  const revertToVersion = async (versionId: string) => {
    try {
      const response = await fetch("/api/resume/versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId }),
      });
      
      if (response.ok) {
        alert("Reverted to selected version!");
        loadResume();
        loadVersions();
      }
    } catch (error) {
      alert("Error reverting version");
    }
  };

  const restoreOriginal = async () => {
    try {
      const response = await fetch("/api/resume/original");
      const originalData = await response.json();
      setResumeData(JSON.stringify(originalData, null, 2));
      alert("Original data restored to editor (not saved yet)");
    } catch (error) {
      alert("Error loading original data");
    }
  };

  const downloadVersionPDF = async (versionId?: string) => {
    const url = versionId ? `/api/generate-pdf?version=${versionId}` : '/api/generate-pdf';
    window.open(url, '_blank');
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
          <Button onClick={() => signIn('google', { callbackUrl: '/admin' })}>Sign in with Google</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Resume Editor</h1>
        <div className="flex gap-2">
          <span className="text-sm text-gray-600">Welcome, {session.user?.name}</span>
          <Button variant="outline" onClick={() => signOut()}>Sign Out</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">JSON Editor</h2>
              <textarea
                value={resumeData}
                onChange={(e) => setResumeData(e.target.value)}
                className="w-full h-80 p-4 border rounded-lg font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                placeholder="Resume JSON data..."
              />
              <div className="mt-4 space-y-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Version comment (optional)"
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={saveResume} 
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? "Saving..." : "Save Resume"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={restoreOriginal}
                    className="flex-1"
                  >
                    Restore Original
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Preview</h2>
                <div className="flex gap-2 items-center">
                  <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.3, zoom - 0.1))}>-</Button>
                  <span className="text-sm px-2">{Math.round(zoom * 100)}%</span>
                  <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}>+</Button>
                </div>
              </div>
              <div className="border rounded-lg bg-gray-100 dark:bg-gray-900 p-4 h-96 overflow-auto border-gray-300 dark:border-gray-600">
                <div 
                  className="bg-white shadow-lg mx-auto" 
                  style={{ 
                    width: `${210 * zoom}mm`, 
                    height: `${297 * zoom}mm`,
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top center'
                  }}
                >
                  <iframe
                    srcDoc={getResumeHTML()}
                    className="w-full h-full border-0"
                    title="Resume Preview"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Version History</h2>
            <Button variant="outline" size="sm" onClick={() => downloadVersionPDF()}>
              PDF (Active)
            </Button>
          </div>
          <div className="space-y-2 max-h-96 overflow-auto">
            {versions.map((version: any) => (
              <div key={version.id} className={`p-3 border rounded-lg ${
                version.isActive 
                  ? 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700' 
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
              }`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-sm">Version {new Date(version.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {new Date(version.createdAt).toLocaleString()}
                    </p>
                    {version.comment && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {version.comment}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {!version.isActive && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => revertToVersion(version.id)}
                        className="text-xs"
                      >
                        Revert
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadVersionPDF(version.id)}
                      className="text-xs"
                    >
                      PDF
                    </Button>
                  </div>
                  {version.isActive && (
                    <span className="text-xs bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 px-2 py-1 rounded">
                      Active
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}