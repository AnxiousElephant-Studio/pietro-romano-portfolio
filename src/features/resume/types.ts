export type ResumeExperience = {
  company: string;
  role: string;
  period: string;
  location: string;
  highlights: string[];
};

export type ResumeEducation = { institution: string; degree: string; period: string };

export type ResumeSkillGroup = { name: string; items: string[] };

export type ResumeContent = {
  headline: string;
  location: string;
  headings: {
    contact: string;
    summary: string;
    experience: string;
    education: string;
    skills: string;
    certifications: string;
  };
  summary: string[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skillGroups: ResumeSkillGroup[];
  certifications: string[];
};
