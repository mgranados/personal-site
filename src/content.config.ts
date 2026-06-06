import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro:schema';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// Reject non-navigational URL schemes (javascript:, data:, …) — these get
// rendered into <a href> and structured data, so restrict to http(s) only.
const httpUrl = z
  .string()
  .url()
  .refine((u) => /^https?:\/\//i.test(u), { message: 'Must be an http(s) URL' });

// Preview images become <img src>; allow only root-relative paths or https
// (no other schemes, and no http to avoid mixed-content warnings).
const imageSrc = z.string().refine((u) => u.startsWith('/') || /^https:\/\//i.test(u), {
  message: 'Must be a root-relative path (/…) or an https URL',
});

// Side projects & small utilities. Edit src/content/projects.yaml to add one.
const projects = defineCollection({
  loader: file('./src/content/projects.yaml'),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    url: httpUrl.optional(),
    repo: httpUrl.optional(),
    image: imageSrc.optional(), // root-relative preview, e.g. /projects/foo.png
    imageAlt: z.string().optional(),
    year: z.number().int(),
    status: z.enum(['live', 'wip', 'archived']).default('live'),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    // Richer detail — surfaced in the JSON/Markdown feeds for agents & people.
    features: z.array(z.string()).default([]), // what you can do with it
    forPeople: z.string().optional(), // the utility a human gets
    forAgents: z.string().optional(), // how an AI agent can use / apply it
    // schema.org SoftwareApplication hints (improve structured-data richness).
    category: z.string().optional(), // applicationCategory, e.g. 'TravelApplication'
    free: z.boolean().default(true), // adds a free Offer to the structured data
  }),
});

export const collections = { writing, projects };
