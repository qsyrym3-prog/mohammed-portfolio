import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const bilingual = z.object({ ar: z.string(), en: z.string() });

// Each project = one folder in src/content/projects/ with an index.md and an images/ folder.
// See HOW-TO-ADD-WORK.md
const projects = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      title: bilingual,
      client: bilingual,
      category: z.enum(['products', 'restaurants', 'events']),
      sports: z.boolean().default(false),
      type: z.enum(['photo', 'video', 'photo-video']),
      description: bilingual,
      cover: image(),
      youtube: z.string().default(''),
      vimeo: z.string().default(''),
      videoPoster: image().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects };
