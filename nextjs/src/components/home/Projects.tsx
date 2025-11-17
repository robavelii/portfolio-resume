"use client";

import { Card } from "@/components/ui/Card";
import { resumeData } from "@/lib/resume-data";

export function Projects() {
  const { work } = resumeData;

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Professional Experience</h2>
        <div className="space-y-6">
          {work.map((job, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground">{job.position}</h3>
                  <p className="text-primary font-medium text-lg">{job.name}</p>
                </div>
                <span className="text-muted-foreground text-sm md:text-base mt-2 md:mt-0 md:ml-4 whitespace-nowrap">
                  {job.startDate} - {job.endDate}
                </span>
              </div>
              <ul className="space-y-3">
                {job.highlights.map((highlight, idx) => (
                  <li key={idx} className="text-muted-foreground leading-relaxed flex items-start">
                    <span className="text-primary mr-2 mt-1 flex-shrink-0">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}