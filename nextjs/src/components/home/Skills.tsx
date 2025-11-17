"use client";

import { Card } from "@/components/ui/Card";
import { resumeData } from "@/lib/resume-data";

export function Skills() {
  const { skills } = resumeData;

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Technical Skills</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skillCategory) => (
            <Card key={skillCategory.name} className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold mb-4 text-primary text-lg">{skillCategory.name}</h3>
              <div className="flex flex-wrap gap-2">
                {skillCategory.keywords.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}