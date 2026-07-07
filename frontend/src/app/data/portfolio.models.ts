export interface Profile {
  name: string;
  title: string;
  yearsExperience: number;
  location: string;
  tagline: string;
  email: string;
  resumeUrl: string;
  stats: { years: number; projects: number; commits: number; coffees: number };
  social: Record<string, string>;
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  years: number;
  level: number;
  icon: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  location: string;
  summary: string;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  categories: string[];
  technologies: string[];
  github: string;
  demo: string;
  architecture: string;
  challenges: string;
  solutions: string;
  features: string[];
  lessons: string;
  future: string[];
  timeline: string;
  snippet: string;
}
