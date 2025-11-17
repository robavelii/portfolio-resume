"use client";

import { Card } from "@/components/ui/Card";
import { resumeData } from "@/lib/resume-data";

export function About() {
  const { summary, basics } = resumeData;

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">About Me</h2>
        <Card className="p-8">
          <p className="text-lg leading-relaxed mb-6">{summary}</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <p className="text-muted-foreground">{basics.email}</p>
              <p className="text-muted-foreground">{basics.phone}</p>
              <p className="text-muted-foreground">{basics.location}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Connect</h3>
              {basics.profiles.map((profile) => (
                <a
                  key={profile.network}
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-primary hover:underline"
                >
                  {profile.network}
                </a>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}