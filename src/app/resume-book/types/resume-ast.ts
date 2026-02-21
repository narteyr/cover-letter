import { z } from "zod";

const BaseNodeSchema = z.object({ id: z.string() });

export const BulletPointSchema = BaseNodeSchema.extend({
  type: z.literal("bullet"),
  text: z.string(),
  metadata: z.object({ impact: z.number().min(0).max(1).optional(), metrics: z.string().optional() }).optional(),
});
export type BulletPoint = z.infer<typeof BulletPointSchema>;

export const ContactSectionSchema = BaseNodeSchema.extend({
  type: z.literal("contact"),
  name: z.string(),
  title: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
});
export type ContactSection = z.infer<typeof ContactSectionSchema>;

export const SummarySectionSchema = BaseNodeSchema.extend({
  type: z.literal("summary"),
  content: z.string(),
});
export type SummarySection = z.infer<typeof SummarySectionSchema>;

export const ExperienceEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  company: z.string(),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  bullets: z.array(BulletPointSchema),
  description: z.string().optional(),
});
export type ExperienceEntry = z.infer<typeof ExperienceEntrySchema>;

export const ExperienceSectionSchema = BaseNodeSchema.extend({
  type: z.literal("experience"),
  entries: z.array(ExperienceEntrySchema),
});
export type ExperienceSection = z.infer<typeof ExperienceSectionSchema>;

export const EducationEntrySchema = z.object({
  id: z.string(),
  degree: z.string(),
  school: z.string(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
  honors: z.string().optional(),
  coursework: z.array(z.string()).optional(),
});
export type EducationEntry = z.infer<typeof EducationEntrySchema>;

export const EducationSectionSchema = BaseNodeSchema.extend({
  type: z.literal("education"),
  entries: z.array(EducationEntrySchema),
});
export type EducationSection = z.infer<typeof EducationSectionSchema>;

export const SkillsSectionSchema = BaseNodeSchema.extend({
  type: z.literal("skills"),
  categories: z.array(z.object({ name: z.string().optional(), skills: z.array(z.string()) })).optional(),
  skills: z.array(z.string()),
});
export type SkillsSection = z.infer<typeof SkillsSectionSchema>;

export const ProjectEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  url: z.string().url().optional(),
  technologies: z.array(z.string()).optional(),
  bullets: z.array(BulletPointSchema).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
export type ProjectEntry = z.infer<typeof ProjectEntrySchema>;

export const ProjectsSectionSchema = BaseNodeSchema.extend({
  type: z.literal("projects"),
  entries: z.array(ProjectEntrySchema),
});
export type ProjectsSection = z.infer<typeof ProjectsSectionSchema>;

export const ResumeSectionSchema = z.discriminatedUnion("type", [
  ContactSectionSchema,
  SummarySectionSchema,
  ExperienceSectionSchema,
  EducationSectionSchema,
  SkillsSectionSchema,
  ProjectsSectionSchema,
]);
export type ResumeSection = z.infer<typeof ResumeSectionSchema>;

export const ResumeDocumentSchema = z.object({
  id: z.string(),
  version: z.number().default(1),
  sections: z.array(ResumeSectionSchema),
  fontFamily: z.string().default("Times New Roman"),
  fontSize: z.string().default("11pt"),
  metadata: z
    .object({
      createdAt: z.string().optional(),
      updatedAt: z.string().optional(),
      tailoredFor: z
        .object({
          jobId: z.string(),
          jobTitle: z.string(),
          company: z.string(),
          description: z.string().optional(),
          skills: z.array(z.string()).optional(),
        })
        .optional(),
    })
    .optional(),
});
export type ResumeDocument = z.infer<typeof ResumeDocumentSchema>;

export const DecorationRangeSchema = z.object({
  id: z.string(),
  suggestionId: z.string(),
  sectionId: z.string(),
  startOffset: z.number(),
  endOffset: z.number(),
  nodeId: z.string().optional(),
});
export type DecorationRange = z.infer<typeof DecorationRangeSchema>;
