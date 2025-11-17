import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResumeSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function ResumeSection({ title, children, className }: ResumeSectionProps) {
  return (
    <section className={cn("mb-6", className)}>
      <h2 className="text-lg font-bold uppercase tracking-wider border-b pb-1 mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}