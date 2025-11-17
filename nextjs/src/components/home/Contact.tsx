"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { resumeData } from "@/lib/resume-data";

export function Contact() {
  const { basics } = resumeData;

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Get In Touch</h2>
        <Card className="p-8 text-center">
          <p className="text-lg mb-6">
            I'm always interested in new opportunities and collaborations.
            Let's connect!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <a href={`mailto:${basics.email}`}>Send Email</a>
            </Button>
            <Button variant="outline" asChild>
              <a href={`tel:${basics.phone}`}>Call Me</a>
            </Button>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            {basics.profiles.map((profile) => (
              <Button key={profile.network} variant="ghost" asChild>
                <a
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profile.network}
                </a>
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}