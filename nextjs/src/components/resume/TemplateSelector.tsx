"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const templates = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean layout with subtle accents",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional professional format",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple, focused on content",
  },
];

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

export function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select Template</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={cn(
              "border rounded-lg p-4 cursor-pointer transition-all",
              selectedTemplate === template.id
                ? "border-primary bg-primary/5"
                : "border-muted hover:border-primary/50"
            )}
            onClick={() => onSelectTemplate(template.id)}
          >
            <h4 className="font-medium mb-1">{template.name}</h4>
            <p className="text-sm text-muted-foreground">{template.description}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => console.log("Preview template")}>
          Preview
        </Button>
      </div>
    </div>
  );
}