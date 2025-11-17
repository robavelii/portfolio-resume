export interface Basics {
  name: string;
  label: string;
  email: string;
  phone: string;
  location: string;
  profiles: {
    network: string;
    url: string;
  }[];
}

export interface Work {
  name: string;
  position: string;
  startDate: string;
  endDate?: string;
  highlights: string[];
}

export interface Skill {
  name: string;
  keywords: string[];
}

export interface Education {
  institution: string;
  studyType: string;
  startDate: string;
  endDate: string;
  courses: string[];
}

export interface ResumeData {
  basics: Basics;
  summary: string;
  work: Work[];
  skills: Skill[];
  education: Education[];
}